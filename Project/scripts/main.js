import { Pokemon } from "./classes/Pokemon.js";

// First Time Load
Pokemon.initPokedex(40);

// Load more Pokemon
document.getElementById("idBtnLoadMore").addEventListener("click", () => {
    Pokemon.initPokedex(20);
});

document.getElementById("idSearchGo").addEventListener("click", () => {
    const query = document.getElementById("idSearchInput").value;
    if (query.length < 3) return;

    Pokemon.applySearch(query);
});

document.getElementById("idSearchClear").addEventListener("click", () => {
    document.getElementById("idSearchInput").value = "";
});