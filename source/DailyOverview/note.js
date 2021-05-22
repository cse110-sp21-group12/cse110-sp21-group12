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
                .note-content{
                    overflow: auto;
                }
                #container{
                    padding: 1vw;
                    margin: 1vw;
                    width: 33vw;
                    height: 50vh;
                }
                .note{
                    word-break: break-all;
                    max-width: 10vw;
                    max-height: 70vh;
                }
            </style>
            <article class="note">
                <div id="container">
                    <p class="note-content" contenteditable="true">insert text</p>
                </div>
            </article>
            `;

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    /**
     * when getting the entry, return just the text for now
     */
    get entry() {
        let entryObj = {
            content: this.shadowRoot.querySelector('.note-content').innerText,
        };
        return entryObj;
    }

    set entry(entry) {
        // set the text of the entry
        this.shadowRoot.querySelector('.note-content').innerText =
            entry.content;
    }
}

customElements.define('note-box', noteBox);
