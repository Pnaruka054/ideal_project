const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    Taxi_Number: { type: String },
    Address_number: { type: Number },
    Address: { type: String }
})

const Bus_no_NAC1 = mongoose.model('Bus_no_NAC1(Gov)', Schema)
const Bus_no_AC1 = mongoose.model('Bus_no_AC1(Gov)', Schema)
const Bus_no_NAC7 = mongoose.model('Bus_no_NAC7(Gov)', Schema)
const Bus_no_9A = mongoose.model('Bus_no_9A', Schema)
const Bus_no_10B = mongoose.model('Bus_no_10B', Schema)
const Bus_no_14 = mongoose.model('Bus_no_14', Schema)
const Bus_no_15 = mongoose.model('Bus_no_15', Schema)
const Bus_no_23 = mongoose.model('Bus_no_23', Schema)
const Bus_no_24 = mongoose.model('Bus_no_24', Schema)
const Bus_no_26 = mongoose.model('Bus_no_26', Schema)
const Bus_no_28 = mongoose.model('Bus_no_28', Schema)

module.exports = [Bus_no_AC1, Bus_no_NAC1, Bus_no_NAC7, Bus_no_9A, Bus_no_10B, Bus_no_14, Bus_no_15, Bus_no_23, Bus_no_24, Bus_no_26, Bus_no_28]