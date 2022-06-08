//
//
// Consts and helper functions
//
//

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

function monthNumber(month) {
    if (month > 8) {
        return '' + (month + 1);
    } else {
        return '0' + (month + 1);
    }
}

const month_OV_link = '../MonthlyOverview/MonthlyOverview.html';
const year_OV_link = '../YearlyOverview/YearlyOverview.html';

//
//
// Calendar Elements
//
//

/**
 * One day on the calendar. Programmatically assigned a number, or left blank for padding.
 */
class CalendarSquare extends HTMLElement {
    constructor() {
        super();
        this.setAttribute('class', 'day');
    }
}
window.customElements.define('day-item', CalendarSquare);

/**
 * The big title above the calendar with the name of the month
 */
class MonthHeader extends HTMLElement {
    constructor() {
        super();
        this.setAttribute('id', 'month_header');
    }
}
window.customElements.define('month-header', MonthHeader);

//
//
// Content Elements
//
//

// Hierarchy (copied during i7 refactor from Calendar.js):
//
//  -year wrapper
//      -year nav
//          -collapse button
//          -year link
//      -months div
//          -month link
//          -month link
//          -month link
//          -...
//  -year wrapper
//      -...
//  -year wrapper
//      -...
//  -...

/**
 * A Month Link links to a monthly overview page. It is a child of a Months Div.
 */
class MonthLink extends HTMLAnchorElement {
    constructor() {
        super();
    }
}
window.customElements.define('month-link', MonthLink, { extends: 'a' });

/**
 * Months Div contains 12 month links. It is a child of Year Wrapper. It is shown or hidden by its nephew Coll Button.
 */
class MonthsDiv extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        //make the stylesheet apply to this element's children
        let style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', 'IndexStyles.css');
        this.shadowRoot.append(style);

        this.setAttribute('id', this.parentElement.id.substring(5) + '_months');

        //add twelve month children
        for (let m = 0; m < 12; m++) {
            let month_child = document.createElement('a');
            month_child.setAttribute('is', 'month-link');
            let month_name_lc = months[m].toLowerCase();
            month_child.setAttribute('class', 'monthlink ' + month_name_lc);
            let yr = this.id.substring(0, 4);
            month_child.setAttribute('id', yr + '_' + month_name_lc);
            month_child.setAttribute(
                'href',
                month_OV_link + '#' + monthNumber(m) + '/' + yr
            );
            month_child.innerText = months[m];
            this.setAttribute('class', 'collapsible_child');
            this.shadowRoot.append(month_child);
        }
    }
}
window.customElements.define('months-div', MonthsDiv);

/**
 * Year Link is a link to a yearly overview. It is a child of Year Wrapper.
 */
class YearLink extends HTMLAnchorElement {
    constructor() {
        super();
        //get year from grandparent
        let yr = this.parentElement.parentElement.id.substring(5);
        //populate attributes
        this.setAttribute('id', 'year_' + yr + '_link');
        this.setAttribute('class', 'yearlink');
        this.setAttribute('href', year_OV_link + '#' + yr);
        //this.setAttribute('innerText', yr + ' Yearly Overview');
        this.innerText = yr + ' Yearly Overview';
    }
}
window.customElements.define('year-link', YearLink, { extends: 'a' });

/**
 * Coll Button is a child of Year Nav. Coll Button collapses its uncle Months Div (they have the same year)
 */
class CollButton extends HTMLButtonElement {
    constructor() {
        super();
        //set attributes
        this.innerText = '';
        this.setAttribute('class', 'coll_yr_button');
        this.setAttribute(
            'id',
            this.parentElement.parentElement.id.substring(5) + '_button'
        );
        //add triangle icon
        let dropdownIcon = document.createElement('img');
        dropdownIcon.src = '../Images/dropdown-icon.svg';
        dropdownIcon.alt = 'dropdown';
        this.appendChild(dropdownIcon);
    }
}
window.customElements.define('coll-button', CollButton, { extends: 'button' });

/**
 * YearNav contains a Coll Button and a Year Link. It is a child of Year Wrapper.
 */
class YearNav extends HTMLDivElement {
    constructor() {
        super();
        //attributes
        this.setAttribute('class', 'year collapsible horiz');
        this.setAttribute('id', this.parentElement.id.substring(5) + '_nav');
    }
}
window.customElements.define('year-nav', YearNav, { extends: 'div' });

/**
 * Year Wrapper: top-level element. Contains a Year Nav and a Months Div.
 */
class YearWrapper extends HTMLElement {
    constructor() {
        super();
    }
}
window.customElements.define('year-wrapper', YearWrapper);
