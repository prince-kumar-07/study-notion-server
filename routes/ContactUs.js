const express = require("express")
const router = express.Router()

const {
  createContact,
  getAllContacts,
  getOpenContacts,
  getClosedContacts,
  updateContactStatus,
  replyContact
} = require("../controller/ContactUs")

const {auth, isAdmin} = require("../middleware/auth")

router.post("/createContact", createContact)
router.get("/getAllContacts", auth, isAdmin, getAllContacts)
router.get("/getOpenContacts", auth, isAdmin, getOpenContacts)
router.get("/getClosedContacts", auth, isAdmin, getClosedContacts)
router.put("/updateContactStatus", auth, isAdmin, updateContactStatus)
router.post("/replyContact", auth, isAdmin, replyContact)

module.exports = router


