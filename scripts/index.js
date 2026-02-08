let timeState = getTimeOfDay();
setInterval(() => timeState = getTimeOfDay(), 60_000);

// Bio stuff handling
document.addEventListener("DOMContentLoaded", () => {
  biosInit();
  blinkInit();
  startTime();
});

document.addEventListener("visibilitychange", () => {
  document.body.classList.toggle("paused", document.hidden);
});

function biosInit() {

  const textContainer = document.querySelector(".text-subtitle");
  const headers = document.querySelectorAll(".bios");
  const bios = document.querySelectorAll(".bio");

  headers.forEach(header => {
    header.addEventListener("click", () => {
      header.classList.remove("hopen")

      let isMobileViewport = window.innerWidth <= 767;
      
      if (isMobileViewport) {
        closedW = "200vw";
        openW = "200vw";
      } else {
        // closedW = "15vw";
        // openW = "45vw";
        openW = g_openW
        closedW = g_closedW
      };



      const bio = header.nextElementSibling;
      if (!bio || !bio.classList.contains("bio")) return;

      const isOpening = !bio.classList.contains("open");

      // close all bios
      bios.forEach(b => b.classList.remove("open"));
      headers.forEach(h => h.classList.remove("hopen"));
      
      // open clicked bio
      if (isOpening) { bio.classList.add("open"); header.classList.add("hopen")};
      

      // resize container
      if (!isOpening) {
        setTimeout(() => {
          textContainer.style.maxWidth = closedW;
          textContainer.style.transition = "0.1s ease-in";
        }, 150);
      } else {
          textContainer.style.maxWidth = openW;
          textContainer.style.transition = "0.1s ease-in";
      }
    });
  });
}

// get TOD
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

// Clock
function startTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  h = checkTime(hours);
  m = checkTime(minutes);

  const shortTimeZone = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' })
  .formatToParts(now)
  .find(part => part.type === 'timeZoneName')
  .value;

  setTimeout(startTime, 1000);

  function checkTime(i) {
  if (i < 10) {i = "0" + i};
  return i;
  }

  document.getElementById('clock').innerText = shortTimeZone + " " + h + ":" + m
}

// Blinky blinky
function blinkInit() {
  const idle = document.querySelector(".her.body.idle");
  const blink = document.querySelector(".her.face.blink");
  const speakblink = document.querySelector(".her.face.speakblink");
  const heranim = document.querySelector(".heranim");
  const speaky = document.querySelector(".speaky");
  var isSleeping = false;
  if (!idle || !blink || !heranim) return;

  function blinkOnce() {

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
  const HIDE_DELAY = 5000;
  let dozeTimer = null;
  let hideTimer = null;

  function scheduleBlink() {
    const delay = Math.random() * 4000 + 2500;
  
    blinkTimer = setTimeout(() => {
      if (isSleeping) return;
      blinkOnce();
      scheduleBlink();
    }, delay);
  }

  function scheduleDoze() {
    clearTimeout(dozeTimer);
    clearTimeout(hideTimer);
  
    dozeTimer = setTimeout(goToSleep, timeState.timeToSleep);
  }
  
  function cancelDoze() {
    clearTimeout(dozeTimer);
    clearTimeout(hideTimer);
    dozeTimer = null;
    hideTimer = null;
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
      if (isSleeping) return;
      if (event.animationName === "dropShadow") {
        wakeUp()
        let tod = timeState.timeOfDay.toLowerCase().trim().replace("good", "Good").replaceAll(",", "!")

        const greet = [tod, "Hm?", "Huh?", "Hello."];
        const randomGreet = getRandomGreet(greet);
        setSpeech(randomGreet);

      }
    });
    
    heranim.addEventListener("mouseenter", () => {
      cancelDoze();
      wakeUp();

      const greet = ["Hey.", "Hey!", "What's up?", "Hm.", "Oh?", "Thank you."];
      const randomGreet = getRandomGreet(greet);
      setSpeech(randomGreet);
    });
    
    heranim.addEventListener("mouseleave", () => {
      setSpeech("...");

      setTimeout(() => {
        speaky.classList.add("hidden");
      }, HIDE_DELAY);

      scheduleDoze();

    });

    scheduleBlink();
}

// Breaking news:
async function loadBreakingNews() {
  
  try {
    
    const res = await fetch('../data/news.txt', { cache: 'reload' });
    const text = await res.text();
    const empty = "THERE ARE NO BREAKING NEWS AT THIS TIME"
    const newsEl = document.getElementById('news');
    // var timeOD = 

    if (!text) {
      newsEl.textContent= empty.trim();
    } else {
      newsEl.textContent = timeState.timeOfDay + "OUR BELOVED VIEWERS. " + text.trim().toUpperCase();
    }
    
  } catch (err) {
    console.log('UNABLE TO FETCH NEWS')
    console.log(err)
  }
}

// Weather stuff:
async function loadWeather() {
  try {
    const res = await fetch('https://wttr.in/?format=%l|%t|%f|%C|%c|%p', {
      cache: 'no-store'
    });

    const weatherEl = document.getElementById('weather');
    const text = (await res.text()).trim();
    const empty = "NO WEATHER INFORMATION COULD BE FOUND"

    const [area, temp, feels, condition, emoji, precip] = text.split('|');

    let output = `${area.toUpperCase()} - T:${temp} / F:${feels} | ${emoji} ${condition.toUpperCase()}`;

    if (precip && precip !== '0mm') {
      output += ` | PRECIPITATION: ${precip}`;
    }

    if (!text) {
      weatherEl.textContent = empty;
    } else {
      weatherEl.textContent = output;
    }

  } catch (err) {
    console.error('Weather fetch failed:', err);
    weatherEl.textContent = empty;
  }
}

requestIdleCallback(() => {
  loadBreakingNews();
  loadWeather();
});

if ('requestIdleCallback' in window) {
  requestIdleCallback(loadBreakingNews);
} else {
  setTimeout(loadBreakingNews, 0);
}
