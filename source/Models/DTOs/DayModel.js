import { GoalModel } from './GoalModel.js';

/**
 * Represents a month object.
 */
export class DayModel extends GoalModel {
    constructor(dayStr) {
        super();
        this.bullets = [];
        this.dayStr = dayStr;
        this.photos = [];
        this.notes = '';
    }

    getBullets() {
        return this.bullets;
    }

    getDate() {
        return this.dayStr;
    }

    setDate(dayStr) {
        this.dayStr = dayStr;
    }
}
