const { raw } = require("express")
let jwt = require("jsonwebtoken")
let getToken = (req) => {
    if (req.headers.authorization) {
        let rawToken = req.headers.authorization
        try {
            if (rawToken.includes("Bearer"))
                rawToken = rawToken.substr(6).trim()
            return jwt.verify(rawToken, process.env.JWT_SECRET_KEY)
        } catch (err) {
            return null
        }
    } else {
        return null
    }
}

module.exports.getToken = getToken