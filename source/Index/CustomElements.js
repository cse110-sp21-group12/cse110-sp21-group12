class CalendarSquare extends HTMLElement {
    constructor() {
        super();
        this.classList.add('day');
    }
}
window.customElements.define('day-item', CalendarSquare);

class MonthHeader extends HTMLDivElement {
    constructor() {
        super();
        this.id = 'month_header';
    }
}
window.customElements.define('month-header', MonthHeader, { extends: 'div' });
