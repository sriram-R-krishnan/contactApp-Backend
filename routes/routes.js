const express = require('express')
const { getAllContacts, getSingleContact, createContact, deleteContact, updateContact } = require('../controllers/controller')
const router = express.Router()

router.route('/allcontacts').get(getAllContacts).post(createContact)
router.route('/allcontacts/:id').get(getSingleContact).delete( deleteContact ).put( updateContact )


module.exports = router