const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    Cities: { type: String},
    Vehicle_numbers: { type: String},
});

const Model = mongoose.model('vehicle_routes_list', Schema);

module.exports = Model;