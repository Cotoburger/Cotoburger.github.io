/* SaveBot — панель состояния. Загружает JSON-снимок status.json и рисует его. */
(function () {
  "use strict";

  var DATA_URL = "status.json";
  var AUTO_CHECK_MS = 15 * 1000;         // каждые 15 секунд проверяем, не пора ли обновить
  var STALE_MS = 5 * 60 * 1000;          // обновляем, если данные старше 5 минут
  var lastDataAt = 0;                    // время последнего успешного получения данных

  var $ = function (id) { return document.getElementById(id); };

  // ─────────────────────────── форматирование ───────────────────────────
  function bytes(n) {
    n = Number(n) || 0;
    if (n >= 1073741824) return (n / 1073741824).toFixed(1) + " ГБ";
    if (n >= 1048576) return (n / 1048576).toFixed(1) + " МБ";
    if (n >= 1024) return Math.round(n / 1024) + " КБ";
    return n + " Б";
  }

  function bytesWhole(n) {
    n = Number(n) || 0;
    if (n >= 1073741824) return Math.round(n / 1073741824) + " ГБ";
    if (n >= 1048576) return Math.round(n / 1048576) + " МБ";
    if (n >= 1024) return Math.round(n / 1024) + " КБ";
    return n + " Б";
  }

  function pct(used, total) {
    if (!total) return 0;
    return Math.max(0, Math.min(100, (used / total) * 100));
  }

  function pctText(used, total) {
    if (!total) return "—";
    return pct(used, total).toFixed(0) + "%";
  }

  function barClass(p) {
    if (p >= 90) return "bad";
    if (p >= 70) return "warn";
    return "good";
  }

  function whenText(ts) {
    if (!ts) return "—";
    var d = new Date(ts * 1000);
    var now = new Date();
    var diff = Math.floor((now - d) / 1000);
    if (diff < 60) return "только что";
    if (diff < 3600) return Math.floor(diff / 60) + " мин назад";
    if (diff < 86400) return Math.floor(diff / 3600) + " ч назад";
    return d.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  }

  function plural(n, one, few, many) {
    n = Math.abs(n) % 100;
    var n1 = n % 10;
    if (n > 10 && n < 20) return many;
    if (n1 > 1 && n1 < 5) return few;
    if (n1 === 1) return one;
    return many;
  }

  // ─────────────────────────── отрисовка ───────────────────────────
  function setBar(id, p) {
    var el = $(id);
    if (!el) return;
    el.style.width = Math.max(0, Math.min(100, p)) + "%";
    el.className = barClass(p);
  }

  function render(d) {
    // шапка
    $("host").textContent = (d.host || "") + " · " + (d.os || "");
    $("genAt").textContent = "снимок от " + (d.generated_at_local || "").replace("T", " ").replace(/[+-]\d\d:\d\d$/, "");

    // герой: кольцо памяти
    var memPct = pct(d.mem.used, d.mem.total);
    $("ring").style.setProperty("--pct", memPct.toFixed(1));
    $("ringVal").textContent = memPct.toFixed(0) + "%";

    // состояние бота
    var savebot = null;
    for (var i = 0; i < d.services.length; i++) {
      if (d.services[i].name === "savebot") savebot = d.services[i];
    }
    var st = $("botState");
    if (savebot && savebot.active) {
      st.className = "hero-state ok";
      st.querySelector("span").textContent = "Бот работает";
    } else {
      st.className = "hero-state bad";
      st.querySelector("span").textContent = "Бот не запущен";
    }
    $("heroSub").textContent = (d.cores || 1) + " ядро · load " +
      (d.load || []).map(function (v) { return v.toFixed(2); }).join(" / ");

    $("srvUptime").textContent = d.uptime_text || "—";
    $("botUptime").textContent = savebot ? savebot.uptime_text : "—";
    var upd = $("updated");
    upd.textContent = whenText(d.generated_at);
    upd.dataset.ts = d.generated_at || "";

    // ОЗУ
    $("memVal").textContent = bytesWhole(d.mem.used) + " / " + bytesWhole(d.mem.total);
    $("memSub").textContent = "свободно " + bytesWhole(d.mem.available) + " · " + pctText(d.mem.used, d.mem.total);
    setBar("memBar", memPct);

    // Swap
    var swapPct = pct(d.swap.used, d.swap.total);
    $("swapVal").textContent = d.swap.total ? bytesWhole(d.swap.used) + " / " + bytesWhole(d.swap.total) : "нет";
    $("swapSub").textContent = d.swap.total ? pctText(d.swap.used, d.swap.total) : "своп не подключён";
    setBar("swapBar", swapPct);

    // Диск
    var diskPct = pct(d.disk.used, d.disk.total);
    $("diskVal").textContent = bytes(d.disk.used) + " / " + bytes(d.disk.total);
    $("diskSub").textContent = "свободно " + bytes(d.disk.free) + " · " + pctText(d.disk.used, d.disk.total);
    setBar("diskBar", diskPct);

    // CPU
    var cpu = (d.cpu_percent === null || d.cpu_percent === undefined) ? 0 : d.cpu_percent;
    $("cpuVal").textContent = cpu.toFixed(0) + "%";
    $("cpuSub").textContent = (d.cores || 1) + " " + plural(d.cores, "ядро", "ядра", "ядер") +
      " · load " + (d.load || []).map(function (v) { return v.toFixed(2); }).join(" / ");
    setBar("cpuBar", cpu);

    // сервисы
    var svcHtml = "";
    for (var j = 0; j < d.services.length; j++) {
      var s = d.services[j];
      svcHtml += '<div class="svc">'
        + '<div class="svc-txt">'
        + '<div class="svc-name">' + esc(s.name) + '</div>'
        + '<div class="svc-sub">' + (s.active ? "работает " + esc(s.uptime_text) + " · pid " + s.pid : "не запущен") + '</div>'
        + '</div>'
        + '<span class="badge ' + (s.active ? "on" : "off") + '">' + (s.active ? "активен" : "остановлен") + '</span>'
        + '</div>';
    }
    $("services").innerHTML = svcHtml;

    // процесс бота
    $("botRss").textContent = bytes(d.bot.rss);
    $("botProcSub").textContent = "swap " + bytes(d.bot.swap) +
      " · потоков " + d.bot.threads + " · пик " + bytes(d.bot.peak);

    // хранилище: полный объём на диске — база + кэш медиа
    var cacheTotal = (d.db.cache_tl || 0) + (d.db.cache_biz || 0);
    $("dbSize").textContent = bytes((d.db.size || 0) + cacheTotal);
    $("dbSub").textContent = "база " + bytes(d.db.size) +
      " · кэш " + bytes(cacheTotal) +
      " · сообщений " + d.db.messages +
      " · " + d.db.users + " " + plural(d.db.users, "пользователь", "пользователя", "пользователей");

    // пользователи — формат как в команде «пользователи»
    var users = d.db.users_list || [];
    var ownerId = d.owner_id || 0;
    var uHtml = "";
    for (var k = 0; k < users.length; k++) {
      var u = users[k];
      var cls, who;
      if (ownerId && u.id === ownerId) {
        cls = "own"; who = "владелец";
      } else if (u.approval === "rejected") {
        cls = "rej"; who = "отклонён";
      } else if (u.enabled) {
        cls = "on"; who = "работает";
      } else if (u.approval === "approved") {
        cls = "rej"; who = "не работает";
      } else {
        cls = "off"; who = "решения нет";
      }
      var label = esc(u.name || "") + (u.username ? " @" + esc(u.username) : "");
      var mem = (u.size || u.size === 0) ? " · " + bytesWhole(u.size) : "";
      uHtml += '<div class="user">'
        + '<span class="user-dot ' + cls + '"></span>'
        + '<div class="user-txt">'
        + '<div class="user-name">' + label + '</div>'
        + '<div class="user-meta">' + who + mem + ' · <span class="user-id">' + u.id + '</span></div>'
        + '</div></div>';
    }
    if (!users.length) {
      uHtml = '<div class="user"><div class="user-txt"><div class="user-name">Пока никого</div></div></div>';
    }
    $("users").innerHTML = uHtml;
  }

  function esc(s) {
    return String(s === null || s === undefined ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ─────────────────────────── загрузка ───────────────────────────
  function toast(msg, isErr) {
    var t = $("toast");
    t.textContent = msg;
    t.className = "toast show" + (isErr ? " err" : "");
    clearTimeout(t._tm);
    t._tm = setTimeout(function () { t.className = "toast"; }, 3200);
  }

  function load(showErr) {
    var btn = $("refresh");
    btn.classList.add("loading");
    btn.disabled = true;

    // cache-buster: снимок обновляется workflow'ом, не даём кэшу браузера мешать
    var url = DATA_URL + "?t=" + Date.now();
    fetch(url, { cache: "no-store" })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (d) {
        render(d);
        lastDataAt = Date.now();
        if (showErr) toast("Данные обновлены");
      })
      .catch(function (e) {
        if (showErr) toast("Не удалось загрузить: " + e.message, true);
      })
      .then(function () {
        btn.classList.remove("loading");
        btn.disabled = false;
      });
  }

  // ─────────────────────────── старт ───────────────────────────
  document.addEventListener("DOMContentLoaded", function () {
    load(false);
    setInterval(function () {
      if (lastDataAt && Date.now() - lastDataAt >= STALE_MS) load(false);
    }, AUTO_CHECK_MS);
    $("refresh").addEventListener("click", function () { load(true); });

    // обновляем «N минут назад», не перезапрашивая сервер
    setInterval(function () {
      var el = $("updated");
      if (el && el.dataset.ts) el.textContent = whenText(Number(el.dataset.ts));
    }, 30000);
  });
})();
