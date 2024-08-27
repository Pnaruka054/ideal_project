const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    Vehicle_number: { type: Number },
    Location_dis: { type: Number },
    Gents_price: { type: Number },
    Ladies_price: { type: Number },
    ST_price: { type: Number },
    Vehicle_start: { type: String },
    Vehicle_end: { type: String },
    Vehicle_total_dis: { type: Number },
    vehicle_icon: { type: String }
})

const model = mongoose.model('Vehicle_details', Schema)

module.exports = model