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


router.post("/professionals/patient-invite-status", async (req, res)=>{
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
        res.render("professionals/patient-invite-status", {flash:"Thank you. A text has been sent containing a link to receive information and support from Parkinson's UK"})
    } catch(e){
        console.log(e)
        res.render("professionals/patient-invite-status", {flash:"There was a problem sending the invite. Please go back and check the phone number"})
    }
})


router.post("/professionals/loved-one-invite-status", async (req, res)=>{
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
        res.render("professionals/loved-one-invite-status", {flash:"Thank you. A text has been sent containing a link to receive information and support from Parkinson's UK"})
    } catch(e){
        console.log(e)
        res.render("professionals/loved-one-invite-status", {flash:"There was a problem sending the invite. Please go back and check the phone number"})
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

// Branching
router.post('/professionals/invitee', function (req, res) {
    // Get the answer from session data
    // The name between the quotes is the same as the 'name' attribute on the input elements
    // However in JavaScript we can't use hyphens in variable names
  
    let pwp = req.session.data['invitee']
  
    if (pwp === 'false') {
      res.redirect('/professionals/loved-one-consent')
    } else {
      res.redirect('/professionals/patient-consent')
    }
  })

  


module.exports = router
