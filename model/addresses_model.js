const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    Address: { type: String },
    Longitude: { type: String },
    Latitude: { type: String },
})

const model = mongoose.model('Address', Schema)

module.exports = model