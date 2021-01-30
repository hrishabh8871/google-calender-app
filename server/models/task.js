class Task {
    constructor(id, taskName, taskSubject, userId, status, completedAt, pickedAt,
        createdAt, createdBy, meetingLink, isEvent, pickedUptime, eventId  ) {
            this.id = id;
            this.taskName = taskName;
            this.taskSubject = taskSubject;
            this.userId = userId;
            this.status = status;
            this.completedAt = completedAt;            
            this.pickedAt = pickedAt;            
            this.createdAt = createdAt;
            this.createdBy = createdBy;
            this.meetingLink = meetingLink;
            this.isEvent = isEvent;
            this.pickedUptime = pickedUptime;
            this.eventId = eventId;
    }
}

module.exports = Task;