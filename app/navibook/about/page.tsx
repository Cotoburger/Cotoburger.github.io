import Link from "next/link";

export default function AboutPage() {
    return (<>
        <div className="container">

            <section>
                <h2>1. Turn On/Off</h2>
                <p>To turn the laptop on or off, you can press the red button on the device's body. If you want to do
                    this without closing the screen, press the blue button in the top left corner of the keyboard.</p>
            </section>
            <section>
                <h2>2. Basic UI</h2>
                <p>
                    The lists in NaviBook, which you can encounter in the main menu, settings, etc., are structured as
                    follows: the left and right pixels are used to display the position from 1-3 to 4-6,
                    respectively.</p>
            </section>

        </div>
    </>);
}