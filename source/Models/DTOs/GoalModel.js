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

    addGoal(firebaseUUID, goalEntry) {
        this.goals.push({ [firebaseUUID]: goalEntry });
        return true;
    }
}
