const firebase = require('./db');

module.exports = {
    saveData: function(req, callback) {        
        let userName = req.userName;
        firebase.database().ref('users/' + userName).set({
            name: req.userName,
            email: req.email
        }).then(res => {
            console.log("res ------->", res)
        }).catch((err) => {
            console.log(err)
        });
        callback(null, ({ "status:" : 200, "message" : "Data inserted" }))
    }
}