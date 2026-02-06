let timeState = getTimeOfDay();

function updateTimeState() {
  timeState = getTimeOfDay();
}

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

// get TOD
var timeToSleep = 10000;
var timeToWakeUp = 250;


function getTimeOfDay() {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return {
      timeOfDay: "GOOD MORNING, ",
      timeToSleep: 12000,
      timeToWakeUp: 250
    };
  } else if (currentHour >= 12 && currentHour < 17) {
    return {
      timeOfDay: "GOOD AFTERNOON, ",
      timeToSleep: 15000,
      timeToWakeUp: 120
    };
  } else if (currentHour >= 17 && currentHour < 21) {
    return {
      timeOfDay: "GOOD EVENING, ",
      timeToSleep: 10000,
      timeToWakeUp: 180
    };
  } else {
    return {
      timeOfDay: "GOOD NIGHT, ",
      timeToSleep: 8000,
      timeToWakeUp: 350
    };
  }
}



// Blinky blinky
document.addEventListener("DOMContentLoaded", () => {
    const idle = document.querySelector(".her.idle");
    const blink = document.querySelector(".her.blink");
    const speakblink = document.querySelector(".her.speakblink");
    const heranim = document.querySelector(".heranim");
    const speaky = document.querySelector(".speaky");
    var isSleeping = false;

    idle.style.opacity = "0";
    if (!idle || !blink || !heranim) return;

    function blinkOnce() {
        idle.style.opacity = "0";
        if (heranim.matches(":hover")) {
            speakblink.style.opacity = "1"
        }
        blink.style.opacity = "1";
        // Speech bubble stuff
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

    let blinkTimer = null;
    const DOZE_DELAY = 7500;
    let dozeTimer = null;

    function scheduleBlink() {
      const delay = Math.random() * 4000 + 2500;
    
      blinkTimer = setTimeout(() => {
        if (isSleeping) return;
        blinkOnce();
        scheduleBlink();
      }, delay);
    }

    function scheduleDoze() {
      updateTimeState();
      clearTimeout(dozeTimer);
    
      dozeTimer = setTimeout(goToSleep, timeState.timeToSleep);
    }
    
    function cancelDoze() {
      clearTimeout(dozeTimer);
      dozeTimer = null;
    }
    
    function stopBlinking() {
      clearTimeout(blinkTimer);
      blinkTimer = null;
    }

    // Her behaviour
      function goToSleep() {
        if(isSleeping) return;

        isSleeping = true;
        stopBlinking();
        cancelDoze()
      
        idle.style.opacity = "0";
        blink.style.opacity = "1";

        setTimeout(() => { 
          speaky.classList.remove("hidden");
          setSpeech("Zzz...");
        },timeState.timeToSleep);
      }
      
      function wakeUp() {
        if (!isSleeping) return;
        
        isSleeping = false;

        blink.style.opacity = "1";
        setTimeout(() => {
          idle.style.opacity = "1";
          blink.style.opacity = "0";
        }, timeState.timeToWakeUp);

        cancelDoze();
        scheduleBlink();
      }

      function getRandomGreet(arr) {
        const i = Math.floor(Math.random() * arr.length);
        return arr[i];
      }

      function setSpeech(text) {
        if (!speaky) return;
      
        speaky.classList.add("hidden");
      
        setTimeout(() => {
          speaky.textContent = text;
          speaky.classList.remove("hidden");
        }, 250);
      }

      blink.addEventListener("animationend", (event) => {
        if (event.animationName === "dropShadow") {
          wakeUp()
          setSpeech("Hm?");
        }
      });
      
      heranim.addEventListener("mouseenter", () => {
        cancelDoze();
        wakeUp();

        const greet = ["Hello.", "Hey.", "Hey!", "What's up?", "Hm."];
        const randomGreet = getRandomGreet(greet);
        setSpeech(randomGreet);
      });
      
      heranim.addEventListener("mouseleave", () => {
        setSpeech("...");

        setTimeout(() => {
          speaky.classList.add("hidden");
        }, 5000);

        scheduleDoze();

      });

      scheduleBlink();
});

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
      document.getElementById('news').innerHTML = timeState.timeOfDay + "OUR BELOVED VIEWERS. " + text.trim().toUpperCase();
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
