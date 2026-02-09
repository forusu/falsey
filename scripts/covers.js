const coversList = document.getElementById("coversList");
const coverBox = document.getElementById("coverBox");
const COVER_BASE = "../data/covers/";

const coverCache = {};

async function loadIndex() {
  const res = await fetch("../data/covers/index.json", { cache: "no-store" });
  const index = await res.json();
  buildMenu(index);
}

function buildMenu(index) {
  const ul = document.createElement("ul");

  for (const artist in index) {
    const artistLi = document.createElement("li");

    const artistBtn = document.createElement("button");
    artistBtn.className = "artist";
    artistBtn.textContent = artist;

    const songsUl = document.createElement("ul");
    songsUl.hidden = true;

    // SONGS
    index[artist].forEach(song => {
      const songLi = document.createElement("li");

      const songBtn = document.createElement("button");
      songBtn.className = "song";
      songBtn.textContent = song.title;

      songBtn.addEventListener("click", () => {
        setActiveSong(songBtn);
        loadCover(song.file);
      });

      songLi.appendChild(songBtn);
      songsUl.appendChild(songLi);
    });

    // ARTIST CLICK
    artistBtn.addEventListener("click", () => {
      toggleArtist(songsUl);
      document
      .querySelectorAll(".artist.artactive")
      .forEach(b => b.classList.remove("artactive"));
      artistBtn.classList.add("artactive")
    });

    artistLi.appendChild(artistBtn);
    artistLi.appendChild(songsUl);
    ul.appendChild(artistLi);
  }

  coversList.appendChild(ul);
}

function setActiveSong(btn) {
  document
    .querySelectorAll(".song.active")
    .forEach(b => b.classList.remove("active"));

  btn.classList.add("active");
}

function toggleArtist(targetUl) {
  document
    .querySelectorAll(".covers-list ul ul")
    .forEach(ul => {
      if (ul !== targetUl) ul.hidden = true;
    });

  targetUl.hidden = !targetUl.hidden;
}

async function loadCover(path) {
    coverBox.textContent = "Loading…";
  
    if (!coverCache[path]) {
      const res = await fetch(COVER_BASE + path, { cache: "no-store" });
  
      if (!res.ok) {
        coverBox.textContent = "Failed to load cover.";
        return;
      }
  
      coverCache[path] = await res.text();
    }
  
    coverBox.textContent = coverCache[path];
  }

loadIndex();