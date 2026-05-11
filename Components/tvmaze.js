const BASE = "https://api.tvmaze.com";
const PLACEHOLDER = "https://placehold.co/210x295/111118/7a7a90?text=No+Image";

export const searchShows = async (query) => {
  const data = await fetch(`${BASE}/search/shows?q=${encodeURIComponent(query)}`).then(r => r.json());
  return data.map(({ show }) => ({
    id: show.id,
    name: show.name,
    year: show.premiered ? show.premiered.slice(0, 4) : null,
    status: show.status,
    image: show.image?.medium ?? PLACEHOLDER
  }));
};

export const getShowData = async (id) => {
  const data = await fetch(`${BASE}/shows/${id}`).then(r => r.json());
  return {
    name: data.name,
    rating: data.rating?.average ?? null,
    image: data.image?.medium ?? PLACEHOLDER,
    backdrop: data.image?.original ?? null,
    year: data.premiered ? data.premiered.slice(0, 4) : null,
    status: data.status
  };
};

export const getEpisodeList = async (id) => {
  const episodes = await fetch(`${BASE}/shows/${id}/episodes`).then(r => r.json());
  const list = episodes.map(ep => ({
    number: ep.number,
    season: ep.season,
    name: ep.name,
    rating: ep.rating?.average
  }));
  return Object.groupBy(list, ep => ep.season);
};