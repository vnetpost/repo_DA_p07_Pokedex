// pokemon.js
export class Pokemon {
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

    static CURRENTDLG;                          // Number           Instance's ID of current Instance-Dialog

    // constructor({ _id, _name, _types, _species, _height, _weight, _abilities, _picUrl, _bgColorName } = {}) {}
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

    static async getData({ url, endpoint, pId, limit = 20 } = {}) {
        let targetUrl;

        if (url) {
            targetUrl = url;
        } else {
            const base = 'https://pokeapi.co/api/v2';
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

    static async initPokedex(limit = 30) {
        const start = this.LASTLOADED + 1;
        const end = this.LASTLOADED + limit;
        for (let id = start; id <= end; id++) await Pokemon.fromId(id);
        this.LASTLOADED += limit;
        this.EventsManagement();
    }

    static openDlg() {
        const ref_idDlg = document.getElementById("idDlg");
        ref_idDlg.style.display = "flex";
        ref_idDlg.showModal();
    }

    static closeDlg() {
        const ref_idDlg = document.getElementById("idDlg");
        ref_idDlg.style.display = "none";
        ref_idDlg.close();
        ref_idDlg.remove();
    }

    static EventsManagement() {

        // Click on Card
        Pokemon.POKEMONS.forEach(pokemon => {
            document.getElementById(`idCard${pokemon.id}`).addEventListener("click", () => {
                pokemon.renderDlg();
                Pokemon.openDlg();
            });
        });
    }

    renderCard() {
        const Name = this.name[0].toUpperCase() + this.name.slice(1);

        const art = document.createElement("article");
        art.id = `idCard${this.id}`;
        art.className = "cCards";
        art.style.background = this.bgColorHex;
        art.innerHTML += /*html*/`
                <h3>#${this.id}</h3>
                <h2>${Name}</h2>
                <div class="cCardThumbs">
                    <div id="idCardTypesContainer${this.id}" class="cCardTypes">
                        <!-- <p>...</p> -->
                    </div>
                    <img src="${this.picUrl}" alt="${this.name}" loading="lazy">
                </div>
            `;

        document.getElementById('idPokedexContainer').appendChild(art);

        // Types in Card
        this.types.forEach(type => {
            const Type = type[0].toUpperCase() + type.slice(1);
            document.getElementById(`idCardTypesContainer${this.id}`).innerHTML += `<p>${Type}</p>`;
        });
    }


    renderDlg() {
        Pokemon.CURRENTDLG = this.id;

        const ref_idDlgContainer = document.getElementById("idDlgContainer");
        const Name = this.name[0].toUpperCase() + this.name.slice(1);


        ref_idDlgContainer.innerHTML = /*html*/`       
            <dialog id="idDlg" style="background:${this.bgColorHex}">
                <button id="idDlgCloseBtn" class="cDlgCloseBtns">
                    <img src="./assets/images/icons/close.svg" alt="Close BTN Icon">
                </button>
                <h3>#${this.id}</h3>
                <h2>${Name}</h2>

                <div class="cDlgThumbs">
                    <div id="idDlgTypesContainer${this.id}" class="cDlgTypes">
                        <!--  -->
                    </div>
                    <img src="${this.picUrl}" alt="${this.name}" loading="lazy">
                </div>

                <div class="cDlgAbout">
                    <table>
                        <tr>
                            <th>Species</th>
                            <td>${this.species}</td>
                        </tr>
                        <tr>
                            <th>Height</th>
                            <td>${this.height}cm</td>
                        </tr>
                        <tr>
                            <th>Weight</th>
                            <td>${this.weight}kg</td>
                        </tr>
                        <tr>
                            <th>Abilities</th>
                            <td>${this.abilities.join(', ')}</td>
                        </tr>
                    </table>
                </div>

                <div class="cDlgMoveBtns">
                    <button id="idDlgBtnPrev" type="button">
                        <img src="./assets/images/icons/arrow-left.svg" alt="Arrow Left Icon">
                    </button>
                    <span>${this.id}</span>
                    <button id="idDlgBtnNext" type="button">
                        <img src="./assets/images/icons/arrow-right.svg" alt="Arrow Right Icon">
                    </button>
                </div>

            </dialog>
        `;

        // Types in Dialog
        this.types.forEach(type => {
            const Type = type[0].toUpperCase() + type.slice(1);
            document.getElementById(`idDlgTypesContainer${this.id}`).innerHTML += `<p>${Type}</p>`;
        });

        // Close-BTN
        document.getElementById("idDlgCloseBtn")
            .addEventListener('click', () => Pokemon.closeDlg());

        // Click on Backdrop
        const ref_idDlg = document.getElementById("idDlg");
        ref_idDlg.addEventListener("click", (e) => {
            if (e.target == ref_idDlg) Pokemon.closeDlg();
        });

        // Click on Move-BTNs
        const ref_idDlgBtnPrev = document.getElementById("idDlgBtnPrev");
        const ref_idDlgBtnNext = document.getElementById("idDlgBtnNext");

        ref_idDlgBtnPrev.addEventListener("click", () => {
            const prevId = Pokemon.CURRENTDLG - 1;
            if (prevId >= 1) Pokemon.updateDlg(prevId);
            if (prevId < 1) {
                prevId = Pokemon.POKEMONS.length;
                Pokemon.updateDlg(prevId);
            }
        });


        ref_idDlgBtnNext.addEventListener("click", () => {
            const nextId = Pokemon.CURRENTDLG + 1;
            if (nextId <= Pokemon.POKEMONS.length) Pokemon.updateDlg(nextId);
            if (nextId > Pokemon.POKEMONS.length) {
                nextId = 1;
                Pokemon.updateDlg(nextId);
            }
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
        const table = refDlg.querySelector("table");
        table.innerHTML = `
            <tr><th>Species</th><td>${pokemon.species}</td></tr>
            <tr><th>Height</th><td>${pokemon.height * 10} cm</td></tr>
            <tr><th>Weight</th><td>${(pokemon.weight / 10).toFixed(1)} kg</td></tr>
            <tr><th>Abilities</th><td>${pokemon.abilities.join(', ')}</td></tr>
        `;

        const spanNumber = document.querySelector("span");
        spanNumber.textContent = pokemon.id;

        // Update Current-Dialog
        Pokemon.CURRENTDLG = pokemon.id;
    }
}
