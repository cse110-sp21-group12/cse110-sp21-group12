import { GoalModel } from './GoalModel.js';

/**
 * Represents a month object.
 */
export class DayModel extends GoalModel {
    constructor() {
        super();
        this.photos = [];
        this.notes = '';
    }
}
