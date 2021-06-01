// <goals-entry> custom web component
class GoalsEntry extends HTMLElement {
    constructor() {
        super();
        const template = document.createElement('template');

        template.innerHTML = `
            <style>
                .bullet-content{
                    flex-basis: 5;
                }
                #container{
                    /* flex container for the image */
                    display:flex;
                    flex-direction: row;
                    align-items: center;
                    display: block;
                    /* what should this width be?, inherit from the todo list? */
                }
                #egg{
                    width: 2vw;
                }
                .bullet{
                    width: inhert; /* I don't think this works */
                    word-break: break-all;
                    max-width: 100%;
                }
                .child{
                    padding-left: 2vw;
                }
                .bullet-container{
                    display: inline-block; !important
                }
                ul {
                    // list-style-image: url('../Images/DinoEgg.svg');
                }
                li > span {
                    position: relative;
                    left: -5px;
                }
                ul{
                    padding: 10px 18px;
                    margin: 0;
                }

            </style>
            <article class="bullet">
                <div id="container">
                        <ul>
                        <li><span class="bullet-content">Setting text</span></li>
                        </ul>
                    <button id="edit">Edit</button>
                    <button id="delete">Delete</button>
                    <button id="done">Mark Done</button>
                    <div class="child"></div>
                </div>
            </article>
            `;

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // edit goal through a prompt
        this.shadowRoot.querySelector('#edit').addEventListener('click', () => {
            let newJson = JSON.parse(this.getAttribute('goalJson'));
            let editedEntry = prompt(
                'Edit Bullet',
                this.shadowRoot.querySelector('.bullet-content').innerText
            );
            if (editedEntry != null && editedEntry != '') {
                this.shadowRoot.querySelector('.bullet-content').innerText =
                    editedEntry;
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
