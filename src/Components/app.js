import { searchShows, getShowData, getEpisodeList } from "./tvmaze.js";
import { createSeasonHTML, createAutocompleteItemHTML } from "./render.js";

const DEFAULT_ID = "2993";

const $input        = document.getElementById("search-input");
const $clearBtn     = document.getElementById("clear-btn");
const $dropdown     = document.getElementById("autocomplete-dropdown");
const $heroBackdrop = document.getElementById("hero-backdrop");
const $heroLabel    = document.getElementById("hero-label");
const $heroTitle    = document.getElementById("hero-title");
const $heroRating   = document.getElementById("hero-rating");
const $poster       = document.getElementById("poster");
const $episodes     = document.getElementById("episodes");

let debounceTimer = null;

const loadShow = async (id) => {
  closeDropdown();
  $heroLabel.textContent = "Cargando…";
  $heroTitle.textContent = "";
  $heroRating.innerHTML = "";
  $episodes.innerHTML = "";
  $poster.src = "";

  const [show, seasons] = await Promise.all([getShowData(id), getEpisodeList(id)]);

  const backdropImg = $heroBackdrop.querySelector(".backdrop-img") ?? document.createElement("img");
  backdropImg.classList.add("backdrop-img");
  if (show.backdrop) {
    backdropImg.src = show.backdrop;
    $heroBackdrop.prepend(backdropImg);
  }

  $poster.src = show.image;
  $poster.alt = show.name;
  $heroLabel.textContent = [show.year, show.status].filter(Boolean).join(" · ");
  $heroTitle.textContent = show.name;
  $heroRating.innerHTML = show.rating
    ? `<span class="star">★</span> ${show.rating} <span style="color:var(--text-dim)">/ 10</span>`
    : `<span style="color:var(--text-dim)">Sin rating</span>`;

  const list = Object.values(seasons).map((season, i) => createSeasonHTML(season, i + 1));
  $episodes.setHTMLUnsafe(list.join(""));
};

const openDropdown = (items) => {
  if (!items.length) {
    $dropdown.setHTMLUnsafe(`<li class="autocomplete-searching">Sin resultados</li>`);
  } else {
    $dropdown.setHTMLUnsafe(items.map(createAutocompleteItemHTML).join(""));
    $dropdown.querySelectorAll(".autocomplete-item").forEach(el => {
      el.addEventListener("click", () => {
        $input.value = el.querySelector(".autocomplete-item-name").textContent;
        $clearBtn.classList.remove("hidden");
        loadShow(el.dataset.id);
      });
    });
  }
  $dropdown.classList.remove("hidden");
};

const closeDropdown = () => $dropdown.classList.add("hidden");

const handleInput = () => {
  const q = $input.value.trim();
  $clearBtn.classList.toggle("hidden", !q);
  clearTimeout(debounceTimer);
  if (!q) { closeDropdown(); return; }
  $dropdown.setHTMLUnsafe(`<li class="autocomplete-searching">Buscando…</li>`);
  $dropdown.classList.remove("hidden");
  debounceTimer = setTimeout(async () => {
    const results = await searchShows(q);
    openDropdown(results.slice(0, 7));
  }, 320);
};

$input.addEventListener("input", handleInput);
$input.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDropdown(); });
$clearBtn.addEventListener("click", () => {
  $input.value = "";
  $clearBtn.classList.add("hidden");
  closeDropdown();
  $input.focus();
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-wrapper")) closeDropdown();
});

loadShow(DEFAULT_ID);