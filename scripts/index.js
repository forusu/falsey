let timeState = getTimeOfDay();
setInterval(() => timeState = getTimeOfDay(), 60_000);
let bgAudio = document.querySelector("audio")

// Bio stuff handling
document.addEventListener("DOMContentLoaded", () => {
  biosInit();
  blinkInit();
  startTime();
  bgAudio.volume = 0.5;
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
  const body = document.querySelector(".her.body");
  const idle = document.querySelector(".her.body.idle");
  const idlef = document.querySelector(".her.face.idlef");
  const speakbody = document.querySelector(".her.body.speak");
  const blink = document.querySelector(".her.face.blink");
  const speakblink = document.querySelector(".her.face.speakblink");
  const speakhappy = document.querySelector(".her.face.speakhappy");
  const happy = document.querySelector(".her.face.happy");
  const speak = document.querySelector(".her.face.speak");
  const heranim = document.querySelector(".heranim");
  const speaky = document.querySelector(".speaky");

  let isSpeaking = false;
  let isDozing = false;
  let isSleeping = false;
  let isBlinking = false;

  if (!idle || !blink || !heranim) return;

  function hideAllFaces() {
    blink.style.opacity = "0";
    speak.style.opacity = "0";
    happy.style.opacity = "0";
    idlef.style.opacity = "0";
    speakblink.style.opacity = "0";
    speakhappy.style.opacity = "0";
  }
  
  function showFace(face) {
    hideAllFaces();
    face.style.opacity = "1";
  }

  function blinkOnce() {
    if (isSleeping || isBlinking) return;
  
    isBlinking = true;
    
    if (isSpeaking) {
      showFace(speakblink);
    } 

    if (isDozing) {
      showFace(blink)
    }

    setTimeout(() => {
      hideAllFaces();
      isBlinking = false;
    }, 120);
  }

  let speechHideTimer = null;
  let blinkTimer = null;
  let idleTimer = null;
  const IDLE_DELAY = 8000;
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

    isDozing = true;
    dozeTimer = setTimeout(goToSleep, timeState.timeToSleep);
  }
  
  function cancelDoze() {
    clearTimeout(dozeTimer);
    clearTimeout(hideTimer);

    isDozing = false;
    dozeTimer = null;
    hideTimer = null;
  }
  
  function stopBlinking() {
    clearTimeout(blinkTimer);
    blinkTimer = null;
  }

  function openMouth(cheery = false) {
    speak.style.opacity = cheery ? "0" : "1";
    speakhappy.style.opacity = cheery ? "1" : "0";
  }
  
  function closeMouth() {
    speak.style.opacity = "0";
    speakhappy.style.opacity = "0";
  }

  // Her behaviour
  function goToSleep() {
    if (isSleeping) return;
    isSleeping = true;
    isDozing = false;
  
    stopBlinking();
    cancelDoze();
  
    showFace(blink);
    blink.classList.add("sleep");
    speakblink.classList.add("sleep");
    speaky.classList.add("hidden");
  
    const sleepPhrases = [
      { text: "Zzz...", weight: 5 },
      { text: "mmh... zzz...", weight: 2 },
      { text: "ZzZ...", weight: 5 },
      { text: "zz.. zz..", weight: 2 },
      { text: "radioactive...", weight: 2 },
      { text: "fronto...genesis..", weight: 2 },
      { text: "class 7...", weight: 2 },
      { text: "she didn't...", weight: 1 },
      { text: "didn't.. deserve... it...", weight: 1 },
      { text: "she was.. innocent..", weight: 1 }
    ];
  
    function getWeightedPhrase() {
      const total = sleepPhrases.reduce((sum, p) => sum + p.weight, 0);
      let r = Math.random() * total;
      for (let p of sleepPhrases) {
        if (r < p.weight) return p.text;
        r -= p.weight;
      }
      return sleepPhrases[0].text;
    }
  
    function sleepTalk() {
      if (!isSleeping) return;
      const phrase = getWeightedPhrase();
      setSpeech(phrase, { autoClose: true, cheery: false });
      setTimeout(sleepTalk, HIDE_DELAY + Math.random() * 4000);
    }
  
    setTimeout(sleepTalk, timeState.timeToSleep);
  
    let startTime = null;
    function animateSleep(timestamp) {
      if (!isSleeping) return;
  
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const cycle = Math.sin((elapsed / 1500) * Math.PI);
  
      blink.style.opacity = cycle > 0 ? "1" : "0";
      speakblink.style.opacity = cycle > 0 ? "0" : "1";
  
      requestAnimationFrame(animateSleep);
    }
  
    requestAnimationFrame(animateSleep);
  }

    function wakeUp() {
      if (!isSleeping) return;
      speakblink.classList.remove("sleep");
      blink.classList.remove("sleep");
      isDozing = false;
      isSleeping = false;
      const greet = ["Huh...", "Ah!", "Where am I...", "I had a weird dream..", ".. What"];
      const randomGreet = getRandomGreet(greet);

      showFace(blink)
      setTimeout(() => {
        hideAllFaces()
        setTimeout(() => {
          showFace(blink)
        }, timeState.timeToWakeUp/2);
        hideAllFaces()
        setSpeech(randomGreet);
      }, timeState.timeToWakeUp);
      

      cancelDoze();
      scheduleBlink();
    }

    function getRandomGreet(arr) {
      const i = Math.floor(Math.random() * arr.length);
      return arr[i];
    }

    function setSpeech(text, options = {}) {
      const { autoClose = true, cheery = false } = options;

      clearTimeout(speechHideTimer);
      speaky.textContent = text;
      speaky.classList.remove("hidden");

      if (!isSleeping) {
        if (cheery) openMouth(true);
        else openMouth(false);
      }

      isSpeaking = true;

      if (autoClose) {
        speechHideTimer = setTimeout(() => {
          speaky.classList.add("hidden");
          isSpeaking = false;
          if (!isSleeping && !isBlinking) hideAllFaces();
          if (!isSleeping) closeMouth();
        }, HIDE_DELAY);
      }
    }

    body.addEventListener("animationend", (event) => {
      if (isSleeping) return;
      if (event.animationName === "dropShadow") {
        wakeUp()
        let tod = timeState.timeOfDay.toLowerCase().trim().replace("good", "Good").replaceAll(",", "!")

        const greet = [tod, "Hm?", "Huh?", "Hello."];
        const randomGreet = getRandomGreet(greet);
        setSpeech(randomGreet, { cheery: randomGreet === tod, autoClose: true });

        hasIntroed = true;
        bgAudio.muted = false;
        scheduleIdleAttention();
      }
    });
  

    function scheduleIdleAttention() {
      clearTimeout(idleTimer);
    
      idleTimer = setTimeout(() => {
        if (!hasIntroed || isSleeping || isDozing) return;
    
        const idleGreet = ["I'm over here.","Over here...","What's the matter?","Can I help you?","I'm here."];
    
        setSpeech(getRandomGreet(idleGreet));
    
        scheduleIdleAttention();
    
      }, IDLE_DELAY);
    }

    heranim.addEventListener("mouseenter", () => {
      
      speakbody.style.opacity = "1";
      clearTimeout(idleTimer);

      cancelDoze();
      wakeUp();

      const greet = ["Hey.", "Hey!", "What's up?", "Hm.", "Oh?", "Thank you."];
      const randomGreet = getRandomGreet(greet);

      showFace(speak);
      setSpeech(randomGreet, { cheery: randomGreet === "Hey!"});
      setTimeout(() => {
        showFace(idlef);
      }, 2500);
    });
    
    heranim.addEventListener("mouseleave", () => {

      speakbody.style.opacity = "0"
      setSpeech("...", { autoClose: true });
      hideAllFaces()

      clearTimeout(speechHideTimer);
      scheduleIdleAttention();

      speechHideTimer = setTimeout(() => {
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
