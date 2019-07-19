const express = require('express')
const router = express.Router()
const phone  = require('phone');
const twilio = require("twilio")
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)

// Add your routes here - above the module.exports line

router.post("/v1/medicine-reminders", (req, res)=>{
    if(req.session.data.reminders){
        let reminders = req.session.data.reminders
        reminders.push(req.body)
    } else {
        req.session.data.reminders = [{
            ...req.body
        }]
    }
    res.redirect("/v1/medicine-reminders/index")
})

router.post("/professionals", (req, res)=>{
    if(req.body.phone){

        client.messages
            .create({
                from: "Parkinsons",
                to: phone(req.body.phone, "GB"),
                body: 'Parkinsons UK is a charity for people living with Parkinsons and their loved ones.\n\nWe can give you personalised support and advice, and help you connect with other people in your position.\n\nStart your journey with us now: example.com'
            })
            .then(message => {
                res.redirect("/professionals")
            })
            .catch(e=>console.log(e))
    }
})

module.exports = router
