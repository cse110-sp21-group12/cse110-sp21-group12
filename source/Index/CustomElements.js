class CalendarSquare extends HTMLElement {
    constructor() {
        super();
    }
}
window.customElements.define('day-item', CalendarSquare, { extends: 'li' });

class MonthLabel extends HTMLParagraphElement {
    constructor() {
        super();
        this.id = 'month_label';
    }
}
window.customElements.define('month-label', MonthLabel, { extends: 'p' });

class MonthHeader extends HTMLDivElement {
    constructor() {
        super();
        this.id = 'month_header';
    }
}
window.customElements.define('month-header', MonthHeader, { extends: 'div' });
