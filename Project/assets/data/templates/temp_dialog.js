
export function templateDialog() {
    const Name = this.name[0].toUpperCase() + this.name.slice(1);

    return /*html*/`       
            <dialog id="idDlg" style="background:${this.bgColorHex}">
                <div class="cDlgHeader">
                    <h3>#${this.id}</h3>
                    <button id="idDlgCloseBtn" class="cDlgCloseBtns">
                        <img src="./assets/images/icons/close.svg" alt="Close BTN Icon">
                    </button>
                </div>
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
                            <td>: ${this.species}</td>
                        </tr>
                        <tr>
                            <th>Height</th>
                            <td>: ${this.height}cm</td>
                        </tr>
                        <tr>
                            <th>Weight</th>
                            <td>: ${this.weight}kg</td>
                        </tr>
                        <tr>
                            <th>Abilities</th>
                            <td>: ${this.abilities.join(', ')}</td>
                        </tr>
                    </table>
                </div>

                <div class="cDlgMoveBtns">
                    <button id="idDlgBtnPrev" type="button">
                        <img src="./assets/images/icons/arrow-left.svg" alt="Arrow Left Icon">
                    </button>
                    <span id="idDlgIndex">${this.id}</span>
                    <button id="idDlgBtnNext" type="button">
                        <img src="./assets/images/icons/arrow-right.svg" alt="Arrow Right Icon">
                    </button>
                </div>

            </dialog>
            `;
}