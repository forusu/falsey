
// Bio stuff handling
document.addEventListener("DOMContentLoaded", () => {
    const textContainer = document.querySelector(".text-subtitle");
    const headers = document.querySelectorAll(".bios");
    const bios = document.querySelectorAll(".bio");

    headers.forEach(header => {
        header.addEventListener("click", () => {
            const bio = header.nextElementSibling;
            if (!bio || !bio.classList.contains("bio")) return;

            const isOpening = !bio.classList.contains("open");

            bios.forEach(b => b.classList.remove("open"));

            if (isOpening) bio.classList.add("open");

            // Container resize logic
            if (!isOpening) {
                setTimeout(() => {
                    textContainer.style.maxWidth = "20%";
                    textContainer.style.transition = "0.1s ease-in";
                }, 200);
            } else {
                textContainer.style.maxWidth = "60%";
                textContainer.style.transition = "0.1s ease-in";
            }
        });
    });
});

// Blinky blinky
document.addEventListener("DOMContentLoaded", () => {
    const idle = document.querySelector(".her.idle");
    const blink = document.querySelector(".her.blink");
    const speakblink = document.querySelector(".her.speakblink");
    const heranim = document.querySelector(".heranim");

    if (!idle || !blink || !heranim) return;

    function blinkOnce() {

        idle.style.opacity = "0";
        if (heranim.matches(":hover")) {
            speakblink.style.opacity = "1"
        }
        blink.style.opacity = "1";

        setTimeout(() => {

            if (heranim.matches(":hover")) {
                idle.style.opacity = "1";
                blink.style.opacity = "0";
                speakblink.style.opacity = "0"
            } else {

                speakblink.style.opacity = "0";
                blink.style.opacity = "0";
                idle.style.opacity = "1";

            }

        }, 120);
    }

    function scheduleBlink() {
        const delay = Math.random() * 4000 + 2500; // 2.5–6.5s
        setTimeout(() => {
            blinkOnce();
            scheduleBlink();
        }, delay);
    }

    scheduleBlink();
});

// Timed backgrounds


