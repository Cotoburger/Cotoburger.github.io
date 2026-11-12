#!/usr/bin/env python3
"""Сборщик снимка состояния сервера для статической панели.

Запускается на сервере (по SSH из GitHub Actions) и печатает JSON в stdout.
Ничего не меняет: только читает /proc, systemd и базу бота.

    python3 status_snapshot.py [--base /root/SaveBot]
"""
import argparse
import json
import os
import shutil
import sqlite3
import subprocess
import sys
import time
from datetime import datetime, timezone, timedelta
from pathlib import Path

TZ = timezone(timedelta(hours=12))          # Asia/Kamchatka


# ────────────────────────────── утилиты ──────────────────────────────
def read_meminfo() -> dict:
    """Ключевые поля /proc/meminfo (в байтах)."""
    out = {}
    try:
        with open("/proc/meminfo", "r", encoding="utf-8", errors="ignore") as f:
            for line in f:
                key, _, rest = line.partition(":")
                parts = rest.split()
                if parts:
                    try:
                        out[key] = int(parts[0]) * 1024
                    except ValueError:
                        pass
    except OSError:
        pass
    return out


def cpu_times() -> tuple[int, int] | None:
    """(busy, total) в тиках из /proc/stat."""
    try:
        with open("/proc/stat", "r", encoding="utf-8", errors="ignore") as f:
            for line in f:
                if line.startswith("cpu "):
                    v = [int(x) for x in line.split()[1:]]
                    if len(v) < 4:
                        return None
                    idle = v[3] + (v[4] if len(v) > 4 else 0)
                    return sum(v) - idle, sum(v)
    except (OSError, ValueError):
        pass
    return None


def cpu_percent() -> float | None:
    """Загрузка CPU в % за короткий интервал."""
    a = cpu_times()
    if not a:
        return None
    time.sleep(0.25)
    b = cpu_times()
    if not b:
        return None
    d_busy, d_total = b[0] - a[0], b[1] - a[1]
    if d_total <= 0:
        return None
    return max(0.0, min(100.0, 100.0 * d_busy / d_total))


def proc_status(pid: int) -> dict:
    """VmRSS / VmSwap / VmHWM / Threads процесса."""
    out = {"rss": 0, "swap": 0, "peak": 0, "threads": 0}
    try:
        with open(f"/proc/{pid}/status", "r", encoding="utf-8", errors="ignore") as f:
            for line in f:
                if line.startswith("VmRSS:"):
                    out["rss"] = int(line.split()[1]) * 1024
                elif line.startswith("VmSwap:"):
                    out["swap"] = int(line.split()[1]) * 1024
                elif line.startswith("VmHWM:"):
                    out["peak"] = int(line.split()[1]) * 1024
                elif line.startswith("Threads:"):
                    out["threads"] = int(line.split()[1])
    except (OSError, ValueError, IndexError):
        pass
    return out


def owner_id(base: Path) -> int:
    """ID владельца: из .env (BOT_OWNER_ID) или config.ini (owner_tag)."""
    try:
        for line in (base / ".env").read_text(encoding="utf-8").splitlines():
            if line.startswith("BOT_OWNER_ID="):
                v = line.split("=", 1)[1].strip()
                if v.isdigit():
                    return int(v)
    except (OSError, AttributeError):
        pass
    try:
        import configparser
        cp = configparser.ConfigParser()
        cp.read(base / "config.ini", encoding="utf-8")
        v = cp.get("business", "owner_tag", fallback="").strip()
        if v.isdigit():
            return int(v)
    except Exception:
        pass
    return 0


def systemd_show(unit: str, prop: str) -> str:
    try:
        r = subprocess.run(["systemctl", "show", unit, f"-p{prop}", "--value"],
                           capture_output=True, text=True, timeout=10)
        return (r.stdout or "").strip()
    except (OSError, subprocess.SubprocessError):
        return ""


def service_uptime(unit: str) -> float:
    """Сколько секунд сервис работает (по ActiveEnterTimestamp)."""
    ts = systemd_show(unit, "ActiveEnterTimestamp")
    if not ts or ts.startswith("n/a"):
        return 0.0
    for fmt in ("%a %Y-%m-%d %H:%M:%S %Z", "%a %Y-%m-%d %H:%M:%S"):
        try:
            when = datetime.strptime(ts, fmt).replace(tzinfo=timezone.utc)
            return max(0.0, time.time() - when.timestamp())
        except ValueError:
            continue
    return 0.0


def dir_size(path: Path) -> int:
    """Размер каталога в байтах."""
    total = 0
    if not path.exists():
        return 0
    for root, _dirs, files in os.walk(path):
        for fn in files:
            try:
                total += os.path.getsize(os.path.join(root, fn))
            except OSError:
                pass
    return total


def db_snapshot(base: Path) -> dict:
    """Счётчики и размеры базы бота."""
    out = {"messages": 0, "users": 0, "size": 0, "cache_tl": 0, "cache_biz": 0,
           "users_list": []}
    size = 0
    for suffix in ("", "-wal", "-shm"):
        try:
            size += os.path.getsize(base / f"messages.db{suffix}")
        except OSError:
            pass
    out["size"] = size

    db_path = base / "messages.db"
    if not db_path.exists():
        return out
    try:
        conn = sqlite3.connect(f"file:{db_path}?mode=ro", uri=True, timeout=5)
        conn.row_factory = sqlite3.Row
        out["messages"] = conn.execute(
            "SELECT COUNT(*) FROM messages").fetchone()[0]
        out["users"] = conn.execute(
            "SELECT COUNT(*) FROM users").fetchone()[0]

        # личный (Telethon) кэш
        tl = 0
        for r in conn.execute(
                "SELECT path FROM messages WHERE path IS NOT NULL"):
            try:
                tl += os.path.getsize(r["path"])
            except OSError:
                pass
        out["cache_tl"] = tl

        # бизнес-кэш
        biz = 0
        for r in conn.execute(
                "SELECT path FROM biz_msg WHERE path IS NOT NULL"):
            try:
                biz += os.path.getsize(r["path"])
            except OSError:
                pass
        out["cache_biz"] = biz

        # пользователи бота — как в команде «пользователи»
        rows = conn.execute(
            "SELECT c.user_id, c.username, c.name, c.enabled, c.chat_id, "
            "a.status AS approval "
            "FROM biz_conn c "
            "JOIN (SELECT user_id, MAX(rowid) AS mr FROM biz_conn GROUP BY user_id) l "
            "  ON c.user_id = l.user_id AND c.rowid = l.mr "
            "LEFT JOIN biz_approval a ON a.user_id = c.user_id "
            "ORDER BY c.enabled DESC, c.user_id").fetchall()
        for r in rows:
            out["users_list"].append({
                "id": r["user_id"],
                "name": r["name"] or "",
                "username": r["username"] or "",
                "enabled": bool(r["enabled"]),
                "approval": r["approval"] or "",
            })
        conn.close()
    except sqlite3.Error:
        pass
    return out


def fmt_uptime(seconds: float) -> str:
    s = int(max(0, seconds))
    d, rem = divmod(s, 86400)
    h, rem = divmod(rem, 3600)
    m = rem // 60
    parts = []
    if d:
        parts.append(f"{d} д")
    if h:
        parts.append(f"{h} ч")
    if m or not parts:
        parts.append(f"{m} мин")
    return " ".join(parts)


# ────────────────────────────── сборка ──────────────────────────────
def build(base: Path) -> dict:
    mem = read_meminfo()
    mem_total = mem.get("MemTotal", 0)
    mem_avail = mem.get("MemAvailable", 0)
    mem_used = max(0, mem_total - mem_avail)
    swap_total = mem.get("SwapTotal", 0)
    swap_used = max(0, swap_total - mem.get("SwapFree", 0))

    try:
        du = shutil.disk_usage("/")
        disk_total, disk_used, disk_free = du.total, du.used, du.free
    except OSError:
        disk_total = disk_used = disk_free = 0

    try:
        load = list(os.getloadavg())
    except (OSError, AttributeError):
        load = []
    cores = os.cpu_count() or 1

    try:
        sys_uptime = float(open("/proc/uptime").read().split()[0])
    except (OSError, ValueError, IndexError):
        sys_uptime = 0.0

    units = ["savebot.service", "pineapplecat-bot.service",
             "pineapplecat-opencode.service"]
    services = []
    for u in units:
        active = systemd_show(u, "ActiveState")
        pid = 0
        try:
            pid = int(systemd_show(u, "MainPID") or 0)
        except ValueError:
            pass
        up = service_uptime(u) if active == "active" else 0.0
        services.append({
            "name": u.replace(".service", ""),
            "active": active == "active",
            "state": active or "unknown",
            "pid": pid,
            "uptime": up,
            "uptime_text": fmt_uptime(up),
        })

    # память процесса бота
    bot_pid = 0
    for s in services:
        if s["name"] == "savebot" and s["active"]:
            bot_pid = s["pid"]
            break
    pstat = proc_status(bot_pid) if bot_pid else {
        "rss": 0, "swap": 0, "peak": 0, "threads": 0}

    db = db_snapshot(base)

    now = time.time()
    return {
        "generated_at": now,
        "generated_at_local": datetime.fromtimestamp(now, TZ)
                            .replace(microsecond=0).isoformat(),
        "host": os.uname().nodename,
        "os": _os_name(),
        "kernel": os.uname().release,
        "uptime": sys_uptime,
        "uptime_text": fmt_uptime(sys_uptime),
        "load": load,
        "cores": cores,
        "cpu_percent": cpu_percent(),
        "mem": {"total": mem_total, "used": mem_used, "available": mem_avail},
        "swap": {"total": swap_total, "used": swap_used},
        "disk": {"total": disk_total, "used": disk_used, "free": disk_free},
        "bot": {
            "pid": bot_pid,
            "rss": pstat["rss"],
            "swap": pstat["swap"],
            "threads": pstat["threads"],
            "peak": pstat["peak"],
        },
        "services": services,
        "db": db,
        "owner_id": owner_id(base),
    }


def _os_name() -> str:
    try:
        with open("/etc/os-release", "r", encoding="utf-8") as f:
            for line in f:
                if line.startswith("PRETTY_NAME="):
                    return line.split("=", 1)[1].strip().strip('"')
    except OSError:
        pass
    return "Linux"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="/root/SaveBot")
    args = ap.parse_args()
    snap = build(Path(args.base))
    json.dump(snap, sys.stdout, ensure_ascii=False)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
