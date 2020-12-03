const Router = require('express').Router
const controllers = require('./file.controller')
const router = Router()

router
    .route('/')
    .get(controllers.handleGetFile)
    .post(controllers.handleUploadFile)

router
    .route('/:uuid')
    .get(controllers.handleShowFile)

router
    .route('/download/:uuid')
    .get(controllers.handleDownloadFile)

router
    .route('/send')
    .post(controllers.handleSendEmail)

module.exports = router;