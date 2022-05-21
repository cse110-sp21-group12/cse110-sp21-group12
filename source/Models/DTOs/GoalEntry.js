/**
 * Represents a goal entry object.
 */
export class GoalEntry {
    constructor(goalName, completed) {
        this.goalName = goalName;
        this.done = completed;
    }

    getGoalName() {
        return this.goalName;
    }

    setGoalName(goalName) {
        this.goalName = goalName;
    }

    getDoneStatus() {
        return this.done;
    }

    setDoneStatus(doneStatus) {
        this.done = doneStatus;
    }
}
