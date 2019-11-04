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


router.post("/professionals/index3", async (req, res)=>{
    try{
        if(req.body['carer-phone']){
            await client.messages.create({
                from: "Parkinsons",
                to: phone(req.body['carer-phone'], "GB"),
                body: messageTemplates.carer
            })
        }
        await client.messages.create({
            from: "Parkinsons",
            to: phone(req.body.phone, "GB"),
            body: messageTemplates.patient
        })
        res.render("professionals/index3", {flash:"Thank you. A text has been sent containing a link to receive information and support from Parkinson's UK"})
    } catch(e){
        console.log(e)
        res.render("professionals/index3", {flash:"There was a problem sending the invite. Please go back and check the phone number"})
    }
})


router.post("/social-referral", async (req, res)=>{
    try{
        await client.messages.create({
            from: "Parkinsons",
            to: phone(req.body.phone, "GB"),
            body: messageTemplates.socialReferral
        })
        res.render("social-referral/index", {flash:"The referral was made successfully."})
    } catch(e){
        console.log(e)
        res.render("social-referral/index", {flash:"There was a problem sending the referral. Please go back and check the phone number"})
    }
})

module.exports = router
