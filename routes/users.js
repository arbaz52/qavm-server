const { json } = require('express')
var express = require('express')
var router = express.Router()
var createError = require("http-errors")
var jwt = require("jsonwebtoken")
const { getToken } = require('../jwt')
var User = require("./../mongo/User")

//creates a new user, provide username.
router.post("/", (req, res, next) => {
    if (!req.body.username) {
        return next(createError(400, "Please provide username"))
    } else {
        let username = req.body.username
        User.create({
            username
        }, (err, data) => {
            if (err) {
                return next(err)
            } else {
                // create jsonwebtoken and send it
                let user = {
                    _id: data._id,
                    username: username
                }
                let token = jwt.sign(user,
                    process.env.JWT_SECRET_KEY, {
                    expiresIn: "7d"
                })
                res.json({
                    user, token
                })
            }
        })
    }
})


router.put("/callerId", (req, res, next) => {
    if (!req.body.callerId)
        return next(createError(400, "Please provide callerId"))
    let callerId = req.body.callerId

    if (!req.headers.authorization)
        return next(createError(403, "Authorization header missing"))

    let token = getToken(req)
    if (token == null) 
        return next(createError(403, "Invalid auth token"))
    

    User.findByIdAndUpdate(token._id, {
        callerId
    }, (err, data) => {
        if(err)
            return next(err)
        
        res.json({...data._doc, callerId})
    })
    

})

router.get("/callerId/:callerId", (req, res, next) => {
    let callerId = req.params.callerId
    User.find({ callerId }, (err, data) => {
        if (err) {
            return next(err)
        } else {
            if (data.length <= 0) {
                return next(createError(404))
            } else {
                res.json(data[0])
            }
        }
    })
})

// returns list of all users
router.get("/", (req, res, next) => {
    User.find({}, (err, data) => {
        if (err) {
            return next(err)
        } else {
            res.json(data)
        }
    })
})

module.exports = router