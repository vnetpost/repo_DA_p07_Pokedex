import { Pokemon } from "./classes/Pokemon.js";

// console.log(await Pokemon.getData({ endpoint: "pokemon", pId: 1 }));
// console.log((await Pokemon.getData({ endpoint: "pokemon-species", pId: 1 })).color.name);

// First Time Load
Pokemon.initPokedex(50);

// Load more Pokemon
document.getElementById("idBtnLoadMore").addEventListener("click", () => {
    Pokemon.initPokedex(50);
});

