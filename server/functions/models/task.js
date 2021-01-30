class Task {
    constructor(id, taskName, taskSubject, userId, status, completedAt, pickedAt,
        createdAt, createdBy ) {
            this.id = id;
            this.taskName = taskName;
            this.taskSubject = taskSubject;
            this.userId = userId;
            this.status = status;
            this.completedAt = completedAt;            
            this.pickedAt = pickedAt;            
            this.createdAt = createdAt;
            this.createdBy = createdBy;
    }
}

module.exports = Task;