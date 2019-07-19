const express = require('express')
const router = express.Router()
const phone  = require('phone');
const twilio = require("twilio")
const messageTemplates = require("./views/sms")
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
                body: messageTemplates.patient
            })
            .then(message => res.render("professionals/index", {flash:"The invite was sent successfully."}))
            .catch(e => res.render("professionals/index", {flash:"There was a problem sending the invite. Please check any phone numbers."}))
    }
})

module.exports = router
