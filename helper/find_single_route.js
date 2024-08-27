const vechicle_number_model = require('../model/vehicle_number_model');

const FindSingleRoute = async (common_values) => {
    let ab = [];
    for (const model of vechicle_number_model) {
        try {
            const data = await model.find({ Taxi_Number: { $in: common_values } });
            if (data.length !== 0) {
                ab.push({ model: model.modelName, data });
            }
        } catch (error) {
            console.error(`Error fetching data for model ${model.modelName} with Bus_Number ${common_values}:`, error);
        }
    }
    return ab
}

module.exports = FindSingleRoute;
