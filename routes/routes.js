const express = require('express')
const app = express()
const controller = require('../controller/controller')

app.get('/addresses', controller.get_addresses)
app.post('/direct_vehicle_details', controller.get_direct_vehicle_details)
app.post('/common_multipal_vehicle_details', controller.common_multipal_vehicle_details)

module.exports = app