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
         * - adding bullet and hitting cancel still adds it
         */

        template.innerHTML = `
            <style>
                .bullet{
                    word-break: break-all;
                    max-width: 100%;
                    font-size: 2.3vh;
                }
                .child{
                    padding-left: 2vw;
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
                    background-color: #f1f1f1;
                    min-width: 9vh;
                    z-index: 1;
                    transform: translateY(-0.1vh);
                }
                .dropdown p {
                    color: black;
                    font-size: 1.7vh;
                    padding: 0.5vh 0 0.5vh 0.5vh;
                    display: block;
                    margin: 0;
                    background-color: #ecc7c7;
                }
                .dropdown p:hover {
                    background-color: #cecece;
                    cursor: pointer
                }
                .dropdownContainer:hover .dropdown {
                    display: block;
                }
<<<<<<< HEAD
                .dropdownButton {
                    font-size: 1.5vh;
                    width: 2vh;
                    height: 2vh;
                    transform: translateY(-0.1vh);
                    padding: 0;
                    background-color: #ecc7c7;
                    border: none;
                    border-radius: 0.5vh;
=======
                #features {
                    width: 100%;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    padding: 12px 16px;
>>>>>>> 56724452291c36b210ce488afbcb4e15ff5e1747
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
                                <p id="add">Add</p>
                                <p id="done">Mark Done</p>
                                <select id="features"> 
                                    <option id="normal" value="normal">Normal</option> 
                                    <option id="important" value="important">Important</option>
                                    <option id="workRelated" value="workRelated">School/Coursework</option>
                                    <option id="household" value="household">Household/Chores</option>
                                    <option id="personal" value="personal">Personal/Well-being</option>
                                    <option id="other" value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div class="child"></div>
                        </li>
                    </ul>
                </div>
            </article>
        `;

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
            console.log('adding a new bullet');
            let newEntry = prompt('Add Bullet', '');
            let newChild = document.createElement('bullet-entry');
            let newJson = JSON.parse(this.getAttribute('bulletJson'));
            let newIndex = JSON.parse(this.getAttribute('index'));
            let childJson = {
                text: newEntry,
                features: 'normal',
                done: false,
                childList: [],
                time: null,
            };
            let childLength = newJson.childList.length;

            // if user cancels
            if (newEntry == null) {
                return;
            }

            // set bullet content of new child
            newChild.shadowRoot.querySelector(
                '.bullet-content'
            ).innerText = newEntry;

            // set new child's new bulletJson and index object
            newChild.setAttribute('bulletJson', JSON.stringify(childJson));
            if (childLength > 0) {
                newIndex.push(childLength);
                newChild.index = newIndex;
                newChild.setAttribute('index', JSON.stringify(newIndex));
            } else {
                newIndex.push(0);
                newChild.index = newIndex;
                newChild.setAttribute('index', JSON.stringify(newIndex));
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
                console.log('debug shit');
                console.log(newJson);
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
        console.log(this.shadowRoot.getElementById(entry.features));
        this.shadowRoot
            .getElementById(entry.features)
            .setAttribute('selected', 'true');

        switch (entry.features) {
            case 'normal':
                this.shadowRoot.querySelector('ul').style.listStyleImage =
                    'none';
                break;
            case 'important': // star icon
                this.shadowRoot.querySelector('ul').style.listStyleImage =
                    // required to use double quotes below due to inner single quotes
                    // eslint-disable-next-line quotes
                    "url('./images/Star.svg')";
                break;
            case 'workRelated': // pencil
                this.shadowRoot.querySelector('ul').style.listStyleImage =
                    // required to use double quotes below due to inner single quotes
                    // eslint-disable-next-line quotes
                    "url('./images/Pencil.svg')";
                break;
            case 'household': // house
                this.shadowRoot.querySelector('ul').style.listStyleImage =
                    // required to use double quotes below due to inner single quotes
                    // eslint-disable-next-line quotes
                    "url('./images/House.svg')";
                break;
            case 'personal': // heart
                this.shadowRoot.querySelector('ul').style.listStyleImage =
                    // required to use double quotes below due to inner single quotes
                    // eslint-disable-next-line quotes
                    "url('./images/Heart.svg')";
                break;
            case 'other': // square
                this.shadowRoot.querySelector('ul').style.listStyleType =
                    'square';
                break;
        }
    }

    set index(index) {
        console.log('entry index: ' + index);
        console.log('entry index length: ' + index.length);
        if (index.length > 2) {
            this.shadowRoot.querySelector('#add').remove();
        }
    }

    set child(child) {
        // set nested bullets of entries
        this.shadowRoot.querySelector('.child').appendChild(child);
    }
}

customElements.define('bullet-entry', BulletEntry);
