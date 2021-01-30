class UserDetails {
    constructor(id, name, email, userId, startingDayTime, endingDayTime, lunchStartTime, lunchEndTime,
        createdAt) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.userId = userId;
            this.startingDayTime = startingDayTime;
            this.endingDayTime = endingDayTime;
            this.lunchStartTime = lunchStartTime;            
            this.lunchEndTime = lunchEndTime;            
            this.createdAt = createdAt;            
    }
}

module.exports = UserDetails;