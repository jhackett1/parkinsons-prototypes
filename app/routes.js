const express = require('express')
const router = express.Router()

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

module.exports = router
