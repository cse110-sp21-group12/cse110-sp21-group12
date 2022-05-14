import { GoalObj } from 'GoalModel.js';

/**
 * Represents a month object.
 */
export class MonthObj extends GoalObj {
    constructor(monthStr) {
        super();
        this.month = monthStr;
    }

    getMonth() {
        return this.month;
    }

    setMonth(monthStr) {
        this.month = monthStr;
    }
}
