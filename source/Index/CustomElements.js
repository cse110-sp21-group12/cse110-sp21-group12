class CalendarSquare extends HTMLUListElement {
    constructor() {
        super();
    }
}
window.customElements.define('day-item', CalendarSquare);

class MonthLabel extends HTMLDivElement {
    constructor() {
        super();
        this.classList.add('month_label');
    }
}
window.customElements.define('month-label', MonthLabel);
