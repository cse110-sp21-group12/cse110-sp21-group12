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

//class MonthsDiv

//class YearLink

class CollButton extends HTMLButtonElement {
    constructor() {
        super();

        this.innerText = '>';
        this.setAttribute('class', 'coll_button');
    }
}
window.customElements.define('coll-button', CollButton, { extends: 'button ' });

//class YearNav

class YearWraper extends HTMLElement {
    constructor() {
        super();
    }
}
window.customElements.define('year_wrapper', YearWraper);
