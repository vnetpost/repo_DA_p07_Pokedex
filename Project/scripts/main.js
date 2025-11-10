import { Pokemon } from "./classes/Pokemon.js";

// console.log(await Pokemon.getData({ endpoint: "pokemon", pId: 1 }));
// console.log((await Pokemon.getData({ endpoint: "pokemon-species", pId: 1 })).color.name);

// Pokemon.fromId(1000);
Pokemon.initPokedex(30);

document.getElementById("idBtnLoadNext").addEventListener("click", () => {
    Pokemon.initPokedex(30);
});

function openDlg(){
    const ref_idDlg = document.getElementById("idDlg");
    ref_idDlg.showModal();
}

// openDlg();