var axios = require('axios')
var express = require('express')
var router = express.Router()
var createError = require("http-errors")
const { getToken } = require('../jwt')
const Meeting = require('../mongo/Meeting')
const { create } = require('../mongo/User')

//create API_HEADER
const getHeader = () => {
    return {
        headers: {
            authorization: "Bearer " + process.env.DAILY_CO_API_KEY
        }
    }
}

// create a meeting
router.post("/", (req, res, next) => {
    if (!req.body.title)
        return next(createError(400, "Please provide title"))
    let title = req.body.title

    if (!req.headers.authorization)
        return next(createError(403, "Authorization header missing"))

    let token = getToken(req)
    if (token == null)
        return next(createError(403, "Invalid auth token"))


    let _data = {}
    let _config = getHeader()
    axios.default.post("https://api.daily.co/v1/rooms", _data, _config)
        .then(_res => {
            console.log(_res)
            let room = _res.data
            let room_name = room.name
            Meeting.create({
                title, creator: token._id, room_name
            }, (err, data) => {
                if (err) {
                    return next(err)
                } else {
                    res.json(data)
                }
            })
        })
        .catch(err => {
            return next(err)
        })
})

router.delete("/:meetingId", (req, res, next) => {
    let meetingId = req.params.meetingId

    if (!req.headers.authorization)
        return next(createError(403, "Authorization header missing"))

    let token = getToken(req)
    if (token == null)
        return next(createError(403, "Invalid auth token"))

    Meeting.findById(meetingId, (err, data) => {
        if (err)
            return next(err)

        if (!data)
            return next(createError(404, "Meeting not found"))

        if (data.creator != token._id)
            return next(createError(403, "You are not the creator of this meeting"))

        data.deleteOne((err, data) => {
            if (err)
                return next(err)

            res.json({ message: "Record deleted!" })
        })
    })

})

router.get("/:meetingId", (req, res, next) => {
    let meetingId = req.params.meetingId
    Meeting.findById(meetingId, (err, data) => {
        if (err)
            return next(err)

        if (!data)
            return next(createError(404, "Meeting not found"))

        let _config = getHeader()
        axios.default.get("https://api.daily.co/v1/rooms/" + data.room_name, _config)
            .then(_res => {
                res.json({ ...data._doc, room: _res.data })
            })
            .catch(err => {
                return next(err)
            })
        // res.json(data)
    })
})

router.get("/", (req, res, next) => {
    Meeting.find({}, (err, data) => {
        if (err)
            return next(err)

        if (!data || data.length == 0)
            return next(createError(404, "Meeting not found"))

        res.json(data)
    })
})



module.exports = router