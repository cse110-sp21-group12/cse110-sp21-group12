// <bullet-entry> custom web component
class BulletEntry extends HTMLElement {
    constructor() {
        super();

        const template = document.createElement('template');
        /**
         * TODO:
         * - add some sort of "mark as done"
         * - add a display area for dates?
         * - add max depth for child bullet
         */

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
                    <button id="add">Add</button>
                    <div class="child"></div>
                </div>
            </article>
            `;

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // console.log(this.getAttribute("editFunc"))
        // this.shadowRoot.querySelector('#edit').addEventListener('click', this.getAttribute("editFunc"));
        this.shadowRoot.querySelector('#edit').addEventListener('click', () => {
            let editedEntry = prompt(
                'Edit Bullet',
                this.shadowRoot.querySelector('.bullet-content').innerText
            );
            if (editedEntry != null && editedEntry != '') {
                this.shadowRoot.querySelector(
                    '.bullet-content'
                ).innerText = editedEntry;
            }
        });
        // console.log(this.getRootNode().host.localNode);
        this.shadowRoot
            .querySelector('#delete')
            .addEventListener('click', () => {
                this.parentNode.removeChild(this);
            });
        let newJson;
        this.shadowRoot.querySelector('#add').addEventListener('click', () => {
            let newEntry = prompt('Add Bullet', '');
            let newChild = document.createElement('bullet-entry');
            newChild.shadowRoot.querySelector(
                '.bullet-content'
            ).innerText = newEntry;
            this.shadowRoot.querySelector('.child').appendChild(newChild);
            let childJson = {
                text: newEntry, 
                symb: "•", 
                done: false, 
                childList: [], 
                time: null
            }
            newChild.setAttribute("bulletJson", childJson);
            newJson = JSON.parse(this.getAttribute("bulletJson"));
            newJson.childList.push(childJson);
            this.setAttribute("bulletJson", newJson);
        });
        this.changed = new CustomEvent("changed", {
            detail: {
                json: newJson
            },
            bubbles: true,
            composed: true,
          });
    }

    connectedCallback() {
        this.shadowRoot.addEventListener("changed", function (e) {
            console.log('got event');
            console.log(e);
        });

        console.log(this.shadowRoot.querySelector('.bullet-content').innerText)
        // this.dispatch(new CustomEvent('request-service'));
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
        if (entry.done === true) {
            this.shadowRoot.querySelector(
                '.bullet-content'
            ).style.textDecoration = 'line-through';
        }
        this.dispatchEvent(this.changed);
        console.log(this.changed);
    }

    set child(child) {
        // set nested bullets of entries
        console.log(child);
        this.shadowRoot.querySelector('.child').appendChild(child);
    }

    // get back updated bullet json
    get json() {
        return this.json;
    }
}

customElements.define('bullet-entry', BulletEntry);

/**
 * JSON Format:
 * {
 *    done: true/false,
 *    text: " ",
 *    indent: number (how many "tabs" or how nested is it")
 *    type: number (is it a star? circle?),
 *    time: (date object), for reminders only, could be null or somth
 * }
 */
