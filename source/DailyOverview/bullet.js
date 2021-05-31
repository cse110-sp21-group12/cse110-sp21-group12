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
                    <button id="done">Mark Done</button>

                    <select name="add" id="features"> 
                         <option id="normal" value="normal">Normal</option> 
                         <option id="important" value="important">Important</option>
                         <option id="workRelated" value="workRelated">School/Coursework</option>
                         <option id="household" value="household">Household/Chores</option>
                         <option id="personal" value="personal">Personal/Well-being</option>
                         <option id="other" value="other">Other</option>
                    </select>
                    <div class="child"></div>
                </div>
            </article>
        `;

        // <select name="add" id="features">
        //                 <option value="">Category</option>
        //                 <option value="important">Important</option>
        //                 <option value="workRelated">School/Coursework</option>
        //                 <option value="household">Household/Chores</option>
        //                 <option value="personal">Personal/Well-being</option>
        //                 <option value="other">Other</option>
        //             </select>
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // edit bullet through a prompt
        this.shadowRoot.querySelector('#edit').addEventListener('click', () => {
            let newJson = JSON.parse(this.getAttribute('bulletJson'));
            let editedEntry = prompt(
                'Edit Bullet',
                this.shadowRoot.querySelector('.bullet-content').innerText
            );
            if (editedEntry != null && editedEntry != '') {
                this.shadowRoot.querySelector(
                    '.bullet-content'
                ).innerText = editedEntry;
                newJson.text = editedEntry;
                this.setAttribute('bulletJson', JSON.stringify(newJson));
            }
            this.dispatchEvent(this.edited);
        });

        // delete bullet
        this.shadowRoot
            .querySelector('#delete')
            .addEventListener('click', () => {
                this.dispatchEvent(this.deleted);
            });

        // add child bullet
        this.shadowRoot.querySelector('#add').addEventListener('click', () => {
            let newEntry = prompt('Add Bullet', '');
            let newChild = document.createElement('bullet-entry');
            let newJson = JSON.parse(this.getAttribute('bulletJson'));
            let newIndex = JSON.parse(this.getAttribute('index'));
            let childJson = {
                text: newEntry,
                features: "normal",
                done: false,
                childList: [],
                time: null,
            };
            let childLength = newJson.childList.length;

            // set bullet content of new child
            newChild.shadowRoot.querySelector(
                '.bullet-content'
            ).innerText = newEntry;

            // set new child's new bulletJson and index object
            newChild.setAttribute('bulletJson', JSON.stringify(childJson));
            if (childLength > 0) {
                newChild.setAttribute(
                    'index',
                    JSON.stringify(newIndex[newIndex.length - 1]++)
                );
            } else {
                newChild.setAttribute(
                    'index',
                    JSON.stringify(newIndex.push(0))
                );
            }

            // append new child to page
            this.shadowRoot.querySelector('.child').appendChild(newChild);

            // update bulletJson of parent bullet
            newJson.childList.push(childJson);
            this.setAttribute('bulletJson', JSON.stringify(newJson));

            // changed this bullet
            this.dispatchEvent(this.added);
        });

        // mark bullet as done
        this.shadowRoot.querySelector('#done').addEventListener('click', () => {
            this.dispatchEvent(this.done);
        });

        // mark bullet category
        this.shadowRoot
            .querySelector('#features')
            .addEventListener('change', () => {
                let newJson = JSON.parse(this.getAttribute('bulletJson'));
                let selectElement = this.shadowRoot.querySelector('#features');
                let output = selectElement.value;
                console.log('debug shit')
                console.log(newJson)
                newJson.features = output;
                this.setAttribute('bulletJson', JSON.stringify(newJson));
                this.dispatchEvent(this.features);
            });

        // new event to see when bullet child is added
        this.added = new CustomEvent('added', {
            bubbles: true,
            composed: true,
        });

        // new event to see when bullet is deleted
        this.deleted = new CustomEvent('deleted', {
            bubbles: true,
            composed: true,
        });

        // new event to see when bullet is edited
        this.edited = new CustomEvent('edited', {
            bubbles: true,
            composed: true,
        });

        // new event to mark event as done
        this.done = new CustomEvent('done', {
            bubbles: true,
            composed: true,
        });

        // new event to see what category it is
        this.features = new CustomEvent('features', {
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
            console.log('testing');
        }

        console.log('features');
        console.log(entry.features);
        console.log(this.shadowRoot.getElementById(entry.features))
        this.shadowRoot.getElementById(entry.features).setAttribute('selected', 'true');

        if (entry.features == 'normal') {
            this.shadowRoot.querySelector('ul').style.listStyleImage = "none";
            console.log('changing bullet image');
        } else if (entry.features == 'important') {
            this.shadowRoot.querySelector('ul').style.listStyleImage =
                "url('../Images/FallIcon.svg')";
            console.log('changing bullet image');
        } else if (entry.features == 'workRelated') {
            this.shadowRoot.querySelector('ul').style.listStyleImage =
                "url('../Images/DinoEgg.svg')";
            console.log('changing bullet image');
        } else if (entry.features == 'household') {
            this.shadowRoot.querySelector('ul').style.listStyleImage =
                "url('../Images/Logo.svg')";
            console.log('changing bullet image');
        } else if (entry.features == 'personal') {
            this.shadowRoot.querySelector('ul').style.listStyleImage =
                "url('../Images/DinoEgg.svg')";
            console.log('changing bullet image');
        } else if (entry.features == 'other') {
            this.shadowRoot.querySelector('ul').style.listStyleImage =
                "url('../Images/DinoEgg.svg')";
            console.log('changing bullet image');
        }
    }

    set child(child) {
        // set nested bullets of entries
        this.shadowRoot.querySelector('.child').appendChild(child);
    }
}

customElements.define('bullet-entry', BulletEntry);
