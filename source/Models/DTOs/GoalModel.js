/**
 * Represents a goal object.
 */
export class GoalModel {
    constructor() {
        this.goals = {};
    }

    getObj() {
        return this;
    }

    getGoals() {
        return this.goals;
    }

    addGoal(goalEntry) {
        this.goals.append(goalEntry);
        return true;
    }
}
