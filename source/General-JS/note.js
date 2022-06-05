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
                    overflow-y: scroll;
                    resize: none;
                    width: 100%;
                    height: 15vh;
                    padding: none;
                    border-style: none; 
                    font-family: 'Montserrat', Montserrat;
                }
                .note{
                    //word-break: break-all;
                }
            </style>
            <div id="note">
                <textarea class="noteContent" placeholder="insert text"></textarea>
            </div>

            `;

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.shadowRoot
            .querySelector('.noteContent')
            .addEventListener('input', updateValue);

        function updateValue(e) {
            this.innerHTML = e.target.value;
        }
    }

    /**
     * when getting the entry, return just the text for now
     */
    get entry() {
        let entryObj = {
            content: this.shadowRoot.querySelector('.noteContent').innerHTML,
        };
        return entryObj;
    }

    set entry(str) {
        // set the text of the entry
        this.shadowRoot.querySelector('.noteContent').innerHTML = str;
    }
}

customElements.define('note-box', noteBox);
