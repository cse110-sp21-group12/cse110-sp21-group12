/**
 * Represents a goal object.
 */
export class GoalObj {
    constructor() {
        this.goals = [];
    }

    getObj() {
        return this;
    }

    getGoals() {
        return this.goals;
    }

    addGoal(goalObj) {
        this.goals.append(goalObj);
        return true;
    }
}
