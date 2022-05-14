import { GoalObj } from 'GoalModel.js';

/**
 * Represents a year object.
 */
export class YearObj extends GoalObj {
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
