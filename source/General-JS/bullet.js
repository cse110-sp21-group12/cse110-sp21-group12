// <bullet-entry> custom web component
class BulletEntry extends HTMLElement {
    constructor() {
        super();

        const template = document.createElement('template');

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
                    background-color: #e4e4e4;
                    min-width: 11vh;
                    z-index: 1;
                    transform: translateY(-0.1vh);
                }
                .dropdown p {
                    color: black;
                    font-size: 1.7vh;
                    padding: 0.5vh 0.5vh 0.5vh 0.5vh;
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
                #features {
                    width: 100%;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    padding: 0.5vh;
                    background-color: #e4e4e4;
                    font-family: 'Courier', monospace;
                    font-weight: bold;
                    font-size: 1.3vh;
                }
                img {
                    width: 100%;
                }
                .row {
                    display: flex;
                    flex-direction: row;
                }

            </style>
            <article class="bullet">
                <div id="container">
                    <ul>
                        <li>
                            <span class="bullet-content">Setting text</span>
                        <div class="dropdownContainer">
                            <button id="dropdownHover" class="dropdownButton">v</button>
                            <div class="dropdown">
                                <div class="row">
                                    <p id="edit"><img src="../DailyOverview/Images/Edit.svg" alt="Edit"></p>
                                    <p id="delete"><img src="../DailyOverview/Images/Delete.svg" alt="Delete"></p>
                                    <p id="add"><img src="../DailyOverview/Images/Add.svg" alt="Add"></p>
                                    <p id="done"><img src="../DailyOverview/Images/Done.svg" alt="Done"></p>
                                </div>
                                <div class="featuresContainer">
                                    <select id="features"> 
                                        <option id="normal" value="normal">Normal</option> 
                                        <option id="important" value="important">Important</option>
                                        <option id="workRelated" value="workRelated">School</option>
                                        <option id="household" value="household">Household</option>
                                        <option id="personal" value="personal">Personal</option>
                                        <option id="event" value="event">Event</option>
                                        <option id="other" value="other">Other</option>
                                    </select>
                                </div>
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
            let childLength = newJson.childList ? newJson.childList.length : 0;

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
            if (!('childList' in newJson)) {
                newJson.childList = [];
            }

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
        }

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
                    "url('./../DailyOverview/Images/Star.svg')";
                break;
            case 'workRelated': // pencil
                this.shadowRoot.querySelector('ul').style.listStyleImage =
                    // required to use double quotes below due to inner single quotes
                    // eslint-disable-next-line quotes
                    "url('./../DailyOverview/Images/Pencil.svg')";
                break;
            case 'household': // house
                this.shadowRoot.querySelector('ul').style.listStyleImage =
                    // required to use double quotes below due to inner single quotes
                    // eslint-disable-next-line quotes
                    "url('./../DailyOverview/Images/House.svg')";
                break;
            case 'personal': // heart
                this.shadowRoot.querySelector('ul').style.listStyleImage =
                    // required to use double quotes below due to inner single quotes
                    // eslint-disable-next-line quotes
                    "url('./../DailyOverview/Images/Heart.svg')";
                break;
            case 'event': // heart
                this.shadowRoot.querySelector('ul').style.listStyleImage =
                    // required to use double quotes below due to inner single quotes
                    // eslint-disable-next-line quotes
                    "url('./../DailyOverview/Images/Event.svg')";
                break;
            case 'other': // square
                this.shadowRoot.querySelector('ul').style.listStyleType =
                    'square';
                break;
        }
    }

    set index(index) {
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
