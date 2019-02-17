const express = require('express')
const router = express.Router()
const passport = require('passport')
require('../../config/passport')(passport)

const PaymentsController = require('../../controllers/payments.controller')

router.get('/', passport.authenticate('jwt', { session: false }), PaymentsController.getPayments)
router.post('/', passport.authenticate('jwt', { session: false }), PaymentsController.createPayment)
router.put('/', passport.authenticate('jwt', { session: false }), PaymentsController.updatePayment)
router.delete('/:id', passport.authenticate('jwt', { session: false }), PaymentsController.removePayment)

module.exports = router;
