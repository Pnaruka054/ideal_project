async function find_common(vechicle_number_model, from_vehicle_array, to_vehicle_array) {
    let ab = []
    let arr1 = []
    for (const model of vechicle_number_model) {
        for (const value of from_vehicle_array) {
            try {
                const busNumbers = value.split(',').map(Number);
                const data = await model.find({ Bus_Number: busNumbers });
                if (data.length !== 0) {
                    ab.push({ model: model.modelName, data });
                }
            } catch (error) {
                console.error(`Error fetching data for model ${model.modelName} with Bus_Number ${value}:`, error);
            }
        }
        for (const value of to_vehicle_array) {
            try {
                const busNumbers = value.split(',').map(Number);
                const data = await model.find({ Bus_Number: busNumbers });
                if (data.length !== 0) {
                    ab.push({ model: model.modelName, data });
                }
            } catch (error) {
                console.error(`Error fetching data for model ${model.modelName} with Bus_Number ${value}:`, error);
            }
        }
        for (const obj of ab) {
            for (const arr of obj.data) {
                arr1.push(arr)
            }
        }
    }

    // Step 1: Create a map to store addresses by Bus_Number
    const addressMap = {};

    // Fill the map with addresses
    arr1.forEach(item => {
        const { Bus_Number, Address } = item;
        if (!addressMap[Bus_Number]) {
            addressMap[Bus_Number] = new Set();
        }
        addressMap[Bus_Number].add(Address);
    });

    // Step 2: Identify common addresses across all bus numbers
    const busNumbers = Object.keys(addressMap);
    const commonAddresses = [];

    if (busNumbers.length > 0) {
        // Convert sets to arrays
        const firstBusNumberAddresses = Array.from(addressMap[busNumbers[0]]);

        commonAddresses.push(...firstBusNumberAddresses.filter(address =>
            busNumbers.every(busNumber => addressMap[busNumber].has(address))
        ));
    }

    // Step 3: Extract common addresses for each Bus_Number
    const commonAddressesByBusNumber = {};
    busNumbers.forEach(busNumber => {
        const common = Array.from(addressMap[busNumber]).filter(address =>
            commonAddresses.includes(address)
        );
        if (common.length > 0) {
            commonAddressesByBusNumber[busNumber] = common;
        }
    });

    return commonAddressesByBusNumber
}

module.exports = find_common