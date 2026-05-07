export const createEpisodeHTML = (ep) => {
  const r = ep.rating !== null ? Math.round(ep.rating) : 0;
  return `<div class="episode rating-${r}" title="EP ${ep.number} · ${ep.name ?? ''} · ⭐ ${ep.rating ?? 'N/A'}">${ep.number}</div>`;
};

export const createSeasonHTML = (data, number) => {
  const delay = (number - 1) * 40;
  return `
    <article class="season" style="animation-delay:${delay}ms">
      <div class="season-header">T${number}</div>
      ${data.map(createEpisodeHTML).join("")}
    </article>`;
};

export const createAutocompleteItemHTML = ({ id, name, image, year, status }) => `
  <li class="autocomplete-item" data-id="${id}">
    <img src="${image}" alt="${name}" />
    <div>
      <div class="autocomplete-item-name">${name}</div>
      <div class="autocomplete-item-meta">${[year, status].filter(Boolean).join(" · ")}</div>
    </div>
  </li>`;