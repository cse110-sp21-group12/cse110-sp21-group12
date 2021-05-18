// <bullet-entry> custom web component
class BulletEntry extends HTMLElement {
    constructor() {
        super();

        const template = document.createElement('template');
        /**
         * TODO:
         * - add some sort of "mark as done"
         * - add a display area for dates?
         */

        template.innerHTML = `
            <style>
                .bullet-content{

                }
            </style>
            <article class="bullet">
                <p class="bullet-content">Setting text</p>
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
            content: this.shadowRoot.querySelector('.bullet-content').innerText,
        };
        return entryObj;
    }

    set entry(entry) {
        // set the text of the entry
        this.shadowRoot.querySelector('.bullet-content').innerText =
            entry.symb + entry.text;

        // add padding if its a "nested" bullet
        this.shadowRoot.querySelector('.bullet-content').style.paddingLeft =
            entry.indent * 4 + 'vh';

        // see if it's marked as done
        if (entry.done === true) {
            this.shadowRoot.querySelector(
                '.bullet-content'
            ).style.textDecoration = 'line-through';
        }
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
