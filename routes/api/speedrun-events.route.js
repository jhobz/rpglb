const express = require('express')
const router = express.Router()
const passport = require('passport')
require('../../config/passport')(passport)

const SpeedrunEventController = require('../../controllers/speedrun-events.controller')

router.get('/', passport.authenticate('jwt', { session: false }), SpeedrunEventController.getSpeedrunEvents)
router.post('/', passport.authenticate('jwt', { session: false }), SpeedrunEventController.createSpeedrunEvent)
router.put('/', passport.authenticate('jwt', { session: false }), SpeedrunEventController.updateSpeedrunEvent)
router.delete('/:id', passport.authenticate('jwt', { session: false }), SpeedrunEventController.removeSpeedrunEvent)
router.get('/:id/:prop', SpeedrunEventController.getSpeedrunEvent)
router.get('/active', SpeedrunEventController.getActiveSpeedrunEvent)

module.exports = router;
