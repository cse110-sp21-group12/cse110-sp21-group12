import { GoalModel } from './GoalModel.js';

/**
 * Represents a year object.
 */
export class YearModel extends GoalModel {
    constructor(yearStr) {
        super();
        this.year = yearStr;
    }

    getYear() {
        return this.year;
    }

    setYear(yearStr) {
        this.year = yearStr;
    }
}
