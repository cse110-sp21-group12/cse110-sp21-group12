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
//const year_OV_link = '../YearlyOverview/YearlyOverview.html';

//
//
// Actual code
//
//

class CalendarSquare extends HTMLElement {
    constructor() {
        super();
        this.setAttribute('class', 'day');
    }
}
window.customElements.define('day-item', CalendarSquare);

class MonthHeader extends HTMLDivElement {
    constructor() {
        super();
        this.setAttribute('id', 'month_header');
    }
}
window.customElements.define('month-header', MonthHeader, { extends: 'div' });

class MonthLink extends HTMLAnchorElement {
    constructor() {
        super();
    }
}
window.customElements.define('month-link', MonthLink, { extends: 'a' });

class MonthsDiv extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
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

//class YearLink

class CollButton extends HTMLButtonElement {
    constructor() {
        super();

        this.innerText = '>';
        this.setAttribute('class', 'coll_button');
    }
}
window.customElements.define('coll-button', CollButton, { extends: 'button' });

//class YearNav

class YearWraper extends HTMLElement {
    constructor() {
        super();
    }
}
window.customElements.define('year-wrapper', YearWraper);
