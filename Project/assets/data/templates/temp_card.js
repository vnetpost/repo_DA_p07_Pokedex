
export function templateCard() {
    const Name = this.name[0].toUpperCase() + this.name.slice(1);
    return /*html*/`
                <h4>#${this.id}</h4>
                <h3>${Name}</h3>
                <div class="cCardThumbs">
                    <img src="${this.picUrl}" alt="${this.name}" loading="lazy">
                    <div id="idCardTypesContainer${this.id}" class="cCardTypes">
                        <!-- <img id="idCard9TypeIcon1" src="" alt="Type Icon 1"> -->
                        <!-- <img id="idCard9TypeIcon2" src="" alt="Type Icon 2"> -->
                    </div>
                </div>
            `;
}