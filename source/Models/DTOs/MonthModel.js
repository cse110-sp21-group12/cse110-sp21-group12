import { GoalModel } from './GoalModel.js';

/**
 * Represents a month object.
 */
export class MonthModel extends GoalModel {
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
