// <goals-entry> custom web component
class GoalsEntry extends HTMLElement {
    constructor() {
        super();
        const template = document.createElement('template');

        template.innerHTML = `
            <style>
                .bullet {
                    word-break: break-all;
                    max-width: 100%;
                    font-size: 2.3vh;
                }
                .bullet-container{
                    display: inline-block; !important
                }
                li > span {
                    position: relative;
                    left: -5px;
                }
                ul {
                    padding: 0px 0px 0px 15px;
                    margin: 0;
                }
                li {
                    padding: 5px;
                }
                .dropdownContainer {
                    position: relative;
                    display: inline-block;
                }
                .clicked {
                    background-color: #858585;
                }
                .dropdown {
                    display: none;
                    position: absolute;
                    background-color: #e4e4e4;
                    min-width: 10vh;
                    z-index: 1;
                    transform: translateY(-0.1vh);
                }
                .dropdown p {
                    color: black;
                    font-size: 1.7vh;
                    padding: 0.5vh 0 0.5vh 0.5vh;
                    display: block;
                    margin: 0;
                    background-color: #e4e4e4;
                }
                .dropdown p:hover {
                    background-color: #cecece;
                    cursor: pointer
                }
                .dropdownContainer:hover .dropdown {
                    display: block;
                }
                .dropdownButton {
                    font-size: 1.5vh;
                    width: 2vh;
                    height: 2vh;
                    transform: translateY(-0.1vh);
                    padding: 0;
                    background-color: #e4e4e4;
                    border: none;
                    border-radius: 0.5vh;
                }
            </style>
            <article class="bullet">
            <div id="container">
                <ul>
                    <li>
                        <span class="bullet-content">Setting text</span>
                    <div class="dropdownContainer">
                        <button class="dropdownButton">v</button>
                        <div class="dropdown">
                            <p id="edit">Edit</p>
                            <p id="delete">Delete</p>
                            <p id="done">Toggle Done</p>
                        </div>
                    </div>
                    </li>
                </ul>
            </div>
            </article>
            `;

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // edit goal through a prompt
        this.shadowRoot.querySelector('#edit').addEventListener('click', () => {
            let newJson = JSON.parse(this.getAttribute('goalJson'));
            if (newJson === null || newJson === undefined) {
                newJson = {};
            }

            let editedEntry = prompt(
                'Edit Bullet',
                this.shadowRoot.querySelector('.bullet-content').innerText
            );
            if (editedEntry != null && editedEntry != '') {
                this.shadowRoot.querySelector(
                    '.bullet-content'
                ).innerText = editedEntry;
                newJson.text = editedEntry;
                this.setAttribute('goalJson', JSON.stringify(newJson));
            }
            this.dispatchEvent(this.edited);
        });

        // mark bullet as done
        this.shadowRoot.querySelector('#done').addEventListener('click', () => {
            this.dispatchEvent(this.done);
        });

        // delete goal
        this.shadowRoot
            .querySelector('#delete')
            .addEventListener('click', () => {
                this.dispatchEvent(this.deleted);
            });

        // new event to see when goal is deleted
        this.deleted = new CustomEvent('deleted', {
            bubbles: true,
            composed: true,
        });

        // new event to see when goal is edited
        this.edited = new CustomEvent('edited', {
            bubbles: true,
            composed: true,
        });

        // new event to mark event as done
        this.done = new CustomEvent('done', {
            bubbles: true,
            composed: true,
        });
    }

    /**
     * when getting the entry, return just the text for now
     */
    get entry() {
        let entryObj = {
            content: this.shadowRoot.querySelector('.bullet-content').innerText,
        };
        return entryObj;
    }

    set entry(entry) {
        // set the text of the entry
        this.shadowRoot.querySelector('.bullet-content').innerText = entry.text;

        // see if it's marked as done
        if (entry.done == true) {
            this.shadowRoot.querySelector(
                '.bullet-content'
            ).style.textDecoration = 'line-through';
        }
    }
}

customElements.define('goals-entry', GoalsEntry);
