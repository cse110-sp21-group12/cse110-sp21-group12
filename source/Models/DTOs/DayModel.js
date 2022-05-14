import { GoalObj } from 'GoalModel.js';

/**
 * Represents a month object.
 */
export class DateObj extends GoalObj {
    constructor(dateStr) {
        super();
        this.bullets = [];
        this.dateStr = dateStr;
        this.photos = [];
        this.notes = '';
    }

    getBullets() {
        return this.bullets;
    }

    getDate() {
        return this.date;
    }

    setDate(dateStr) {
        this.date = dateStr;
    }
}
