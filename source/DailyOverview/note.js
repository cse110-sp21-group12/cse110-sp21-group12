// <note-box> custom web component
class noteBox extends HTMLElement {
    constructor() {
        super();

        const template = document.createElement('template');

        template.innerHTML = `
            <style>
                * {
                    font-size: 2vh;
                    color: black;
                }
                .noteContent{
                    overflow: auto;
                    resize: none;
                    width: 30vw;
                    height: 70vh;
                    border-style: none; 
                }
                .note{
                    //word-break: break-all;
                }
            </style>
            <div id="note">
                <textarea class="noteContent">insert text</textarea>
            </div>

            `;

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    /**
     * when getting the entry, return just the text for now
     */
    get entry() {
        let entryObj = {
            content: this.shadowRoot.querySelector('.noteContent').innerText,
        };
        return entryObj;
    }

    set entry(entry) {
        // set the text of the entry
        this.shadowRoot.querySelector('.noteContent').innerText =
            entry.content;
    }
}

customElements.define('note-box', noteBox);
