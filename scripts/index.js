
// Bio stuff handling
document.addEventListener("DOMContentLoaded", () => {
    const textContainer = document.querySelector(".text-subtitle");
    const headers = document.querySelectorAll(".bios");
    const bios = document.querySelectorAll(".bio");
    var closedW = "15vw";
    var openW = "45vw";

    headers.forEach(header => {
      header.addEventListener("click", () => {
        header.classList.remove("hopen")

        var isMobileViewport = window.matchMedia("only screen and (max-width: 767px)").matches;
        var isBigScreen = window.matchMedia("only screen and (min-width: 1921px)").matches;
        
        if (isMobileViewport) {
          closedW = "200vw";
          openW = "200vw";
        } // if (isBigScreen) { 
         // closedW = "15vw";
         // openW = "45vw"; {
        else {
          closedW = "15vw";
          openW = "45vw";
        };



        const bio = header.nextElementSibling;
        if (!bio || !bio.classList.contains("bio")) return;
  
        const isOpening = !bio.classList.contains("open");
  
        // close all bios
        bios.forEach(b => b.classList.remove("open"));
        headers.forEach(h => h.classList.remove("hopen"));
        
        // open clicked bio
        if (isOpening) { bio.classList.add("open"); header.classList.add("hopen")}
  
        // resize container
        if (!isOpening) {
          setTimeout(() => {
            textContainer.style.maxWidth = closedW;
            textContainer.style.transition = "0.1s ease-in";
          }, 200);
        } else {
          textContainer.style.maxWidth = openW;
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

// get TOD
function getTimeOfDay() {
  const currentHour = new Date().getHours();
  let timeOfDay;

  if (currentHour >= 5 && currentHour < 12) {
    timeOfDay = "GOOD MORNING, ";
  } else if (currentHour >= 12 && currentHour < 17) {
    timeOfDay = "GOOD AFTERNOON, ";
  } else if (currentHour >= 17 && currentHour < 21) {
    timeOfDay = "GOOD EVENING,";
  } else {
    timeOfDay = "GOOD NIGHT, ";
  }

  return timeOfDay;
}

// Breaking news:
async function loadBreakingNews() {
  try {
    const res = await fetch('../data/news.txt', { cache: 'no-store' });
    const text = await res.text();
    const empty = "THERE ARE NO BREAKING NEWS AT THIS TIME"
    // var timeOD = 
    


    if (!text) {
      document.getElementById('news').innerHTML = empty.trim();
    } else {
      document.getElementById('news').innerHTML = getTimeOfDay() + "OUR BELOVED VIEWERS. " + text.trim().toUpperCase();
    }
    
  } catch (err) {
    console.log('UNABLE TO FETCH NEWS')
  }
}

loadBreakingNews();

// Weather stuff:
async function loadWeather() {
  try {
    const res = await fetch('https://wttr.in/?format=%l|%t|%f|%C|%c|%p', {
      cache: 'no-store'
    });

    const text = (await res.text()).trim();
    const empty = "NO WEATHER INFORMATION COULD BE FOUND"

    const [area, temp, feels, condition, emoji, precip] = text.split('|');

    let output = `${area.toUpperCase()} - T:${temp} / F:${feels} | ${emoji} ${condition.toUpperCase()}`;

    if (precip && precip !== '0mm') {
      output += ` | PRECIPITATION: ${precip}`;
    }

    if (!text) {
      document.getElementById('weather').textContent = empty;
    } else {
      document.getElementById('weather').textContent = output;
    }

  } catch (err) {
    console.error('Weather fetch failed:', err);
    document.getElementById('weather').textContent = empty;
  }
}

loadWeather();
setInterval(loadWeather, 10 * 60 * 1000);
