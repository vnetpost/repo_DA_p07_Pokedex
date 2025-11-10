// pokemon.js
export class Pokemon {
    id;                                         // Number           "id"
    name;                                       // String           "name"
    types = [];                                 // Array            "types[].type.name"
    picUrl;                                     // String           "other.official-artwork.front_default"
    bgColorName;                                // String           species.color.name ("green", ...)
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

    constructor({ _id, _name, _types, _picUrl, _bgColorName } = {}) {
        this.id = _id;
        this.name = _name;
        this.types = _types;
        this.picUrl = _picUrl;
        this.bgColorName = _bgColorName;

        this.bgColorHex = Pokemon.COLORMAP[this.bgColorName] || '#FFFFFF';

        Pokemon.POKEMONS.push(this);

        this.renderThumb();
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
        // 1) Get Pokemon Dic
        const pokeDic = await this.getData({ endpoint: 'pokemon', pId });
        // 2) Get Species just to find his BG-Farbe
        const pokeBgColor = (await this.getData({ endpoint: 'pokemon-species', pId })).color.name || 'white';

        const pokeInst = new Pokemon({
            _id: pokeDic.id,
            _name: pokeDic.name,
            _types: pokeDic.types.map(t => t.type.name),
            _picUrl: pokeDic.sprites.other["official-artwork"].front_default || pokeDic.sprites.front_default,
            _bgColorName: pokeBgColor,
        });
    }

    static initPokedex(limit = 30) {
        let id = this.LASTLOADED + 1;
        for (id; id <= (limit + this.LASTLOADED); id++) {
            Pokemon.fromId(id);
        }
        this.LASTLOADED += limit;

        Pokemon.POKEMONS.forEach(poke => {
            document.getElementById(`idCard${poke.id}`).addEventListener("click", () => {

            });
        });

        console.log(this.LASTLOADED);
    }

    static openDlg() {
        const ref_idDlg = document.getElementById("idDlg");
        ref_idDlg.showModal();
    }

    static closeDlg() {
        const ref_idDlg = document.getElementById("idDlg");
        ref_idDlg.close();
    }

    renderThumb() {
        const ref_idPokedexContainer = document.getElementById('idPokedexContainer');
        const Name = this.name[0].toUpperCase() + this.name.slice(1);

        ref_idPokedexContainer.innerHTML += /*html*/`
            <article id="idCard${this.id}" class="cCards" style="background:${this.bgColorHex}">
                <h3>#${this.id}</h3>
                <h2>${Name}</h2>
                <div id="idCardThumbs${this.id}" class="cCardThumbs">
                    <div id="idCardTypesContainer${this.id}" class="cCardTypes">
                        <!-- <p>poison</p> -->
                    </div>
                    <img src="${this.picUrl}" alt="${this.name}" loading="lazy">
                </div>
            </article>
            `;

        this.types.forEach(type => {
            const Type = type[0].toUpperCase() + type.slice(1);
            document.getElementById(`idCardTypesContainer${this.id}`).innerHTML += `<p>${Type}</p>`;
        });
    }


    renderDlg() {

        `
        <dialog id="idDlg">
                <h3>#${this.id}</h3>
                <h2>${Name}</h2>
                <div id="idCardThumbs${this.id}" class="cCardThumbs">
                    <div id="idCardTypesContainer${this.id}" class="cCardTypes">
                        <p>${Type}</p>
                        <p>${Type}</p>
                    </div>
                    <img src="${this.picUrl}" alt="${this.name}" loading="lazy">
                </div>
                <div class="cAbout">
                    <p>Species<span>Charizard</span></p>
                    <p>Height<span>170cm</span></p>
                    <p>Weight<span>90.5kg</span></p>
                    <p>Abilities<span>Blaze,Solar-Power</span></p>
                </div>
                <div class="cMoveBtns">
                    <button id="idDlgBtnPrev" type="button">
                        <img src="./assets/images/icons/arrow-left.svg" alt="Arrow Left Icon">
                    </button>
                    <button id="idDlgBtnNext" type="button">
                        <img src="./assets/images/icons/arrow-right.svg" alt="Arrow Right Icon">
                    </button>
                </div>

            </dialog>
        `
    }
}
