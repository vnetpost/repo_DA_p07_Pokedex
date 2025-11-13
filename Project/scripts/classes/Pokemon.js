import { templateCard } from "../../assets/data/templates/temp_card.js";
import { tempDlgTableUpdate, templateDialog } from "../../assets/data/templates/temp_dialog.js";
import { templateDlgSpinner } from "../../assets/data/templates/temp_dlgSpinner.js";

export class Pokemon {
    // #region Attributes
    id;                                         // Number           endpoint: 'pokemon' -> {id}
    name;                                       // String           endpoint: 'pokemon' -> {name}
    types = [];                                 // Array            endpoint: 'pokemon' -> {types[].type.name}
    species;                                    // String           endpoint: 'pokemon' -> {species.name}
    height;                                     // Number           endpoint: 'pokemon' -> {height}
    weight;                                     // Number           endpoint: 'pokemon' -> {weight}
    abilities = []                              // Array            endpoint: 'pokemon' -> {abilities[].ability.name}
    picUrl;                                     // String           endpoint: 'pokemon' -> {sprites.other["official-artwork"].front_default
    //                                                                                      || _pokemonDic.sprites.front_default}


    bgColorName;                                // String           endpoint: 'pokemon-species' -> {color.name}
    bgColorHex;                                 // String           "#B2DFDB"

    static POKEMONS = [];                       // Array            [Pokmon, Pokmon, ...]
    static SEARCHBUCKET = [];                   // Array            [Pokmon, Pokmon, ...]
    static SEARCHMODUS;                         // Booolean
    static LASTLOADED = 0;                      // Number           0, 30, 60, ...
    static COLORMAP = {
        green: '#B2DFDB',
        blue: '#81D4FA',
        red: '#EF9A9A',
        yellow: '#FFF59D',
        pink: '#F8BBD0',
        purple: '#CE93D8',
        brown: '#BCAAA4',
        gray: '#E0E0E0',
        black: '#424242',
        white: '#FAFAFA'
    };

    static TYPECOLOR = {
        normal: "#A8A77A",
        fire: "#EE8130",
        water: "#6390F0",
        electric: "#F7D02C",
        grass: "#7AC74C",
        ice: "#96D9D6",
        fighting: "#C22E28",
        poison: "#A33EA1",
        ground: "#E2BF65",
        flying: "#A98FF3",
        psychic: "#F95587",
        bug: "#A6B91A",
        rock: "#B6A136",
        ghost: "#735797",
        dragon: "#6F35FC",
        dark: "#705746",
        steel: "#B7B7CE",
        fairy: "#D685AD"
    };

    static CURRENTDLGID;                          // Number           Current Instance-Dialog's ID

    // #endregion Attributes

    constructor({ _pokemonDic, _pokemonBgColor } = {}) {
        this.id = _pokemonDic.id;
        this.name = _pokemonDic.name;
        this.types = _pokemonDic.types.map(t => t.type.name);
        this.species = _pokemonDic.species.name;
        this.height = _pokemonDic.height;
        this.weight = _pokemonDic.weight;
        this.abilities = _pokemonDic.abilities.map(a => a.ability.name);
        this.picUrl = _pokemonDic.sprites.other["official-artwork"].front_default
            || _pokemonDic.sprites.front_default;

        this.bgColorName = _pokemonBgColor;
        this.bgColorHex = Pokemon.COLORMAP[this.bgColorName] || '#FFFFFF';

        Pokemon.POKEMONS.push(this);
        this.renderCard();
    }

    // #region Static-Methods
    static async getData({ url, endpoint, pId, limit = 40 } = {}) {
        let targetUrl;
        const base = 'https://pokeapi.co/api/v2';

        if (url) {
            targetUrl = url;
        } else {
            if (!endpoint) targetUrl = `${base}/`;
            if (endpoint && !pId) targetUrl = `${base}/${endpoint}/?limit=${limit}`;
            if (endpoint && pId != null) targetUrl = `${base}/${endpoint}/${pId}/`;
        }

        const response = await fetch(targetUrl);
        if (!response.ok) throw new Error(`Response-status: ${response.status}`);
        return await response.json();
    }

    static async fromId(pId) {
        // 1) Get Pokemon-Dic
        const pokemonDic = await this.getData({ endpoint: 'pokemon', pId });
        // 2) Get pokemon-species just to find Pokemon-BG-Farbe
        const pokemonBgColor = (await this.getData({ endpoint: 'pokemon-species', pId })).color.name;

        new Pokemon({ _pokemonDic: pokemonDic, _pokemonBgColor: pokemonBgColor });
    }

    static async initPokedex(limit = 40) {
        this.showLoadingSpinner();
        const start = this.LASTLOADED + 1;
        const end = this.LASTLOADED + limit;
        for (let id = start; id <= end; id++) await Pokemon.fromId(id);
        this.LASTLOADED += limit;
        this.EventsManagement();
        this.removeLoadingSpinner();
    }

    static openDlg() {
        document.body.style.overflow = "hidden";
        const ref_idDlg = document.getElementById("idDlg");
        ref_idDlg.style.display = "flex";
        ref_idDlg.showModal();
    }

    static closeDlg() {
        document.body.style.overflow = "";
        const ref_idDlg = document.getElementById("idDlg");
        ref_idDlg.style.display = "none";
        ref_idDlg.close();
        ref_idDlg.remove();
    }

    static EventsManagement() {
        // Click on Card (Add to all)
        Pokemon.POKEMONS.forEach(pokemon => {
            document.getElementById(`idCard${pokemon.id}`).addEventListener("click", () => {
                pokemon.renderDlg();
                Pokemon.openDlg();
            });
        });
    }

    static updateDlg(pId) {
        const pokemon = Pokemon.POKEMONS.find(p => p.id === pId);
        const refDlg = document.getElementById("idDlg");
        // Ueberschrift
        refDlg.querySelector("h3").textContent = `#${pokemon.id}`;
        refDlg.querySelector("h2").textContent = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
        // Bild
        refDlg.querySelector(".cDlgThumbs img").src = pokemon.picUrl;
        // Farbe aendern
        refDlg.style.background = pokemon.bgColorHex;
        // Typen ersetzen
        const typesContainer = refDlg.querySelector(".cDlgTypes");
        typesContainer.innerHTML = "";
        pokemon.types.forEach(t => {
            const Type = t[0].toUpperCase() + t.slice(1);
            typesContainer.innerHTML += `<p>${Type}</p>`;
        });
        // Tabelle ersetzen
        refDlg.querySelector("table").innerHTML = tempDlgTableUpdate(pokemon);
        // Id zwischen Arrows-Icons ersetzen
        document.getElementById("idDlgIndex").textContent = pokemon.id;
        // Update Current-Dialog
        Pokemon.CURRENTDLGID = pokemon.id;
    }

    static showLoadingSpinner() {
        document.body.style.overflow = "hidden";
        document.getElementById("idDlgContainer").innerHTML = templateDlgSpinner();
        document.getElementById("idDlgLoadingSpinner").showModal();
    }

    static removeLoadingSpinner() {
        document.body.style.overflow = "";
        const ref_idDlgLoadingSpinner = document.getElementById("idDlgLoadingSpinner");
        ref_idDlgLoadingSpinner.close();
        ref_idDlgLoadingSpinner.remove();
    }

    static applySearch(query) {
        const q = query.trim().toLowerCase();
        Pokemon.POKEMONS.forEach(poke => {
            if (poke.name.toLowerCase().includes(q) || poke.id.toString().includes(q)) {
                Pokemon.SEARCHBUCKET.push(poke);
                Pokemon.SEARCHMODUS = true;
            } else {
                const card = document.getElementById(`idCard${poke.id}`);
                if (card) card.style.display = "none";
            }
        });
    }

    // #endregion Static-Methods

    // #region Methods
    renderCard() {
        const art = document.createElement("article");
        art.id = `idCard${this.id}`;
        art.className = "cCards";
        // art.style.background = this.bgColorHex;
        art.style.background = Pokemon.TYPECOLOR[this.types[0]];
        const bound_templateCard = templateCard.bind(this);
        art.innerHTML += bound_templateCard();

        document.getElementById('idPokedexContainer').appendChild(art);

        // Types in Card
        this.types.forEach((type, idx) => {
            // const Type = type[0].toUpperCase() + type.slice(1);
            const src = `./assets/images/icons/types/${type}.svg`;
            document.getElementById(`idCardTypesContainer${this.id}`)
                .innerHTML += /*html*/`
                    <img id="idCard${this.id}TypeIcon${idx}" src="${src}" alt="Type Icon ${idx}" style="background: ${Pokemon.TYPECOLOR[type]}">
                `;
        });

    }

    renderDlg() {
        Pokemon.CURRENTDLGID = this.id;
        const bound_templateDialog = templateDialog.bind(this);
        document.getElementById("idDlgContainer").innerHTML = bound_templateDialog();

        // Put Types in Dialog
        this.types.forEach(type => {
            const Type = type[0].toUpperCase() + type.slice(1);
            document.getElementById(`idDlgTypesContainer${this.id}`).innerHTML += `<p>${Type}</p>`;
        });

        // ########## Events:
        this.dlgEvents();
    }

    dlgEvents() {
        // Close-BTN
        document.getElementById("idDlgCloseBtn")
            .addEventListener('click', () => Pokemon.closeDlg());

        // Click on Backdrop
        const ref_idDlg = document.getElementById("idDlg");
        ref_idDlg.addEventListener("click", (e) => {
            if (e.target == ref_idDlg) Pokemon.closeDlg();
        });

        // ESC 
        ref_idDlg.addEventListener("keydown", (e) => {
            if (e.key == "Escape") Pokemon.closeDlg();
        });

        // Click on Move-BTNs
        const ref_idDlgBtnPrev = document.getElementById("idDlgBtnPrev");
        const ref_idDlgBtnNext = document.getElementById("idDlgBtnNext");

        ref_idDlgBtnPrev.addEventListener("click", () => {
            if (!Pokemon.SEARCHMODUS) {
                let prevId = Pokemon.CURRENTDLGID - 1;
                if (prevId < 1) prevId = Pokemon.POKEMONS.length;
                Pokemon.updateDlg(prevId);
            } else {    // Pokemon.SEARCHMODUS = true
                if (Pokemon.SEARCHBUCKET.length === 1) return;
                let idxInBucket;
                Pokemon.SEARCHBUCKET.forEach((pokemon, index) => {
                    if (pokemon.id === Pokemon.CURRENTDLGID) idxInBucket = index;
                });
                let prevIdx = idxInBucket - 1;
                if (prevIdx < 0) prevIdx = Pokemon.SEARCHBUCKET.length - 1;
                Pokemon.updateDlg(Pokemon.SEARCHBUCKET[prevIdx].id);
            }
        });


        ref_idDlgBtnNext.addEventListener("click", () => {
            if (!Pokemon.SEARCHMODUS) {
                let nextId = Pokemon.CURRENTDLGID + 1;
                if (nextId > Pokemon.POKEMONS.length) nextId = 1;
                Pokemon.updateDlg(nextId);
            } else {    // Pokemon.SEARCHMODUS = true
                if (Pokemon.SEARCHBUCKET.length === 1) return;
                let idxInBucket;
                Pokemon.SEARCHBUCKET.forEach((pokemon, index) => {
                    if (pokemon.id === Pokemon.CURRENTDLGID) idxInBucket = index;
                });
                let prevIdx = idxInBucket + 1;
                if (prevIdx >= Pokemon.SEARCHBUCKET.length) prevIdx = 0;
                Pokemon.updateDlg(Pokemon.SEARCHBUCKET[prevIdx].id);
            }
        });
    }
    // #endregion Methods

}
