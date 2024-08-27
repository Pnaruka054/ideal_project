const addresses = require('../model/addresses_model');
const vehicle_details = require('../model/vehicle_details');
const vechicle_number_model = require('../model/vehicle_number_model');
const vehicle_routes_list = require('../model/vehicle_routes_list');
const find_common = require('../helper/find_common_route')
const FindSingleRoute = require('../helper/find_single_route')

const get_addresses = async (req, res) => {
    try {
        const data = await addresses.find();
        res.json(data);
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

const get_direct_vehicle_details = async (req, res) => {
    try {
        let vehicle_number = req.body.vehicle_number;
        let ab = await FindSingleRoute(vehicle_number)
        res.json(ab);
    } catch (error) {
        console.error('Error in processing request:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const common_multipal_vehicle_details = async (req, res) => {
    try {
        let from_address = req.body.from_input_state;
        let to_address = req.body.to_input_state;

        let data = await vehicle_routes_list.findOne({ Cities: "Jaipur" });
        let abc = []
        for (const vehicle_number of data.Vehicle_numbers.split(',')) {
            let commen_long = await FindSingleRoute(vehicle_number)
            if (Object.keys(commen_long).length !== 0) {
                abc.push(commen_long[0].data);
            }
        }

        function convertRoutes(routes) {
            const routesObject = {};
            routes.forEach(route => {
                if (route.length > 0) {
                    const busNumber = `${route[0].Taxi_Number}`;
                    routesObject[busNumber] = route.map(stop => stop.Address);
                }
            });

            return routesObject;
        }
        const convertedRoutes = convertRoutes(abc);

        // function findAllRoutes(startPoint, endPoint) {
        //     const allRoutes = [];
        //     const queue = [{ route: [], location: startPoint, usedTaxis: new Set() }];

        //     while (queue.length > 0) {
        //         const { route, location, usedTaxis } = queue.shift();

        //         if (location === endPoint) {
        //             allRoutes.push(route);
        //             continue;
        //         }

        //         for (const [taxi, stops] of Object.entries(convertedRoutes)) {
        //             if (stops.includes(location) && !usedTaxis.has(taxi)) {
        //                 const nextIndex = stops.indexOf(location);

        //                 for (let i = nextIndex + 1; i < stops.length; i++) {
        //                     const nextLocation = stops[i];

        //                     if (!usedTaxis.has(taxi)) {
        //                         const newUsedTaxis = new Set(usedTaxis);
        //                         newUsedTaxis.add(taxi);

        //                         if (nextLocation === endPoint) {
        //                             allRoutes.push([...route, { taxi, transferPoint: location }, { taxi, transferPoint: nextLocation }]);
        //                         } else {
        //                             queue.push({
        //                                 route: [...route, { taxi, transferPoint: location }],
        //                                 location: nextLocation,
        //                                 usedTaxis: newUsedTaxis
        //                             });
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     }

        //     return allRoutes;
        // }

        let a = "yes"

        // function findAllRoutes(startPoint, endPoint) {
        //     const allRoutes = [];

        //     // Helper function to find paths from `from` to `to`
        //     function findPaths(from, to) {
        //         const paths = [];
        //         const queue = [{ route: [], location: from, usedTaxis: new Set() }];
        //         const visited = new Set();

        //         while (queue.length > 0) {
        //             const { route, location, usedTaxis } = queue.shift();

        //             // Check if the destination has been reached
        //             if (location === to) {
        //                 paths.push(route);
        //                 continue;
        //             }

        //             // Traverse all routes
        //             for (const [taxi, stops] of Object.entries(convertedRoutes)) {
        //                 if (stops.includes(location)) {
        //                     const nextIndex = stops.indexOf(location);

        //                     // Check subsequent stops in the same route
        //                     for (let i = nextIndex + 1; i < stops.length; i++) {
        //                         const nextLocation = stops[i];

        //                         if (!usedTaxis.has(taxi)) {
        //                             const newUsedTaxis = new Set(usedTaxis);
        //                             newUsedTaxis.add(taxi);

        //                             if (nextLocation === to) {
        //                                 paths.push([...route, { taxi, transferPoint: location }, { taxi, transferPoint: nextLocation }]);
        //                             } else if (!visited.has(nextLocation)) {
        //                                 visited.add(nextLocation);
        //                                 queue.push({
        //                                     route: [...route, { taxi, transferPoint: location }],
        //                                     location: nextLocation,
        //                                     usedTaxis: newUsedTaxis
        //                                 });
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        //         }

        //         return paths;
        //     }

        //     async function sort_function(start, end) {
        //         let routes_data = await findPaths(start, end)
        //         let sorted_data = []
        //         if (routes_data.length !== 0) {
        //             for (let item of routes_data) {
        //                 sorted_data.push(item.reverse())
        //             }
        //             return sorted_data
        //         }
        //     }

        //     // Find paths from startPoint to endPoint
        //     const forwardPaths = findPaths(startPoint, endPoint);

        //     // If forwardPaths are empty, try reverse search
        //     const reversePaths = sort_function(endPoint, startPoint);

        //     // Return all paths found, can include forward or reverse based on needs
        //     return forwardPaths.length > 0 ? forwardPaths : reversePaths;
        // }




        function findAllRoutes(startPoint, endPoint) {
            const allRoutes = [];

            // Helper function to find paths from `from` to `to` with complex route handling
            function findPaths(from, to) {
                const paths = [];
                const queue = [{ route: [], location: from, usedTaxis: new Set(), visited: new Set() }];

                while (queue.length > 0) {
                    const { route, location, usedTaxis, visited } = queue.shift();

                    if (location === to) {
                        paths.push([...route, { taxi: Array.from(usedTaxis).pop(), transferPoint: location }]);
                        continue;
                    }

                    for (const [taxi, stops] of Object.entries(convertedRoutes)) {
                        const idx = stops.indexOf(location);

                        if (idx !== -1) {
                            // Check all possible next locations in the route
                            for (let i = 0; i < stops.length; i++) {
                                const nextLocation = stops[i];

                                if (nextLocation === location) continue;

                                const newUsedTaxis = new Set(usedTaxis);
                                if (!newUsedTaxis.has(taxi)) {
                                    newUsedTaxis.add(taxi);

                                    if (nextLocation === to) {
                                        paths.push([...route, { taxi, transferPoint: location }, { taxi, transferPoint: nextLocation }]);
                                    } else if (!visited.has(nextLocation)) {
                                        visited.add(nextLocation);
                                        queue.push({
                                            route: [...route, { taxi, transferPoint: location }],
                                            location: nextLocation,
                                            usedTaxis: newUsedTaxis,
                                            visited
                                        });
                                    }
                                }
                            }
                        }
                    }
                }

                return paths;
            }

            function reverseRoute(route) {
                return route.reverse().map((segment, index) => {
                    if (index === 0) {
                        return { taxi: segment.taxi, transferPoint: endPoint };
                    }
                    return segment;
                });
            }

            const forwardPaths = findPaths(startPoint, endPoint);
            const reversePaths = findPaths(endPoint, startPoint).map(reverseRoute);

            allRoutes.push(...forwardPaths, ...reversePaths);

            if (Array.isArray(allRoutes)) {
                return allRoutes.length > 0 ? allRoutes : "No routes found";
            } else {
                console.error("Error: `allRoutes` is not an array");
                return "Error: `allRoutes` is not an array";
            }
        }


        function filterUniqueRoutes(routes) {
            // Helper function to get all taxis used in a route
            const getTaxis = (route) => new Set(route.map(stop => stop.taxi));

            // Create a set to store taxis from all routes
            const allTaxis = new Set();

            // Filter routes
            const uniqueRoutes = routes.filter(route => {
                const routeTaxis = getTaxis(route);
                // Check if this route's taxis overlap with any previously added routes' taxis
                const isUnique = ![...allTaxis].some(taxi => routeTaxis.has(taxi));

                // If unique, add its taxis to the allTaxis set
                if (isUnique) {
                    routeTaxis.forEach(taxi => allTaxis.add(taxi));
                }

                return isUnique;
            });

            return uniqueRoutes;
        }


        async function processRoutes(filteredRoutes) {
            let Total_Route = [];
            let Texi_unique_obj = new Set()
            for (let routes_Array of filteredRoutes) {
                let temp_Routes = []
                let index = [];
                let prev_texi = [routes_Array[0].taxi];
                let prev_data = [];
                temp_Routes.length = 0
                for (const route of routes_Array) {
                    let vehicle_data = await FindSingleRoute(route.taxi);
                    Texi_unique_obj.add(route.taxi)
                    if (!prev_texi.includes(route.taxi)) {
                        for (let a = 1; a <= 2; a++) {
                            if (a === 1) {
                                let idx = prev_data[0].findIndex(value => value.Address === route.transferPoint);
                                index.push(idx);
                                if (index.length === 2) {
                                    let sliced_data = prev_data[0].slice(Math.min(...index), Math.max(...index) + 1);
                                    sliced_data = sliced_data.sort((a, b) => a.Address_number - b.Address_number)

                                    if (sliced_data[sliced_data.length - 1].Address !== route.transferPoint) {
                                        temp_Routes.push(sliced_data.reverse());
                                    } else {
                                        temp_Routes.push(sliced_data);
                                    }
                                    index.length = 0;
                                    prev_texi.length = 0;
                                    prev_data.length = 0;
                                }
                            } else {
                                let idx = vehicle_data[0].data.findIndex(value => value.Address === route.transferPoint);
                                index.push(idx);
                                prev_texi.push(route.taxi);
                                prev_data.push(vehicle_data[0].data)
                            }
                        }
                    } else {
                        prev_texi.length = 0;
                        prev_data.length = 0;
                        let idx = vehicle_data[0].data.findIndex(value => value.Address === route.transferPoint);
                        index.push(idx);

                        if (index.length === 2) {
                            let sliced_data = vehicle_data[0].data.slice(Math.min(...index), Math.max(...index) + 1);
                            if (sliced_data[sliced_data.length - 1].Address !== route.transferPoint) {
                                temp_Routes.push(sliced_data.reverse());
                            } else {
                                temp_Routes.push(sliced_data);
                            }
                            index.length = 0;
                        }
                        prev_texi.push(route.taxi);
                        prev_data.push(vehicle_data[0].data);
                    }
                }
                // temp_Routes = temp_Routes.map(route =>
                //     route.sort((a, b) => a.Address_number - b.Address_number)
                // );

                Total_Route.push(temp_Routes)

            }
            res.json([Total_Route, Array.from(Texi_unique_obj)])
        }


        try {
            const routes = await findAllRoutes(from_address, to_address);
            const filteredRoutes = filterUniqueRoutes(routes);
            processRoutes(filteredRoutes);
        } catch (error) {
            console.error(error.message);
        }

    } catch (error) {
        console.error('Error in processing request:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const get_cities = () => {
    // Implementation for get_cities function
};

module.exports = { get_addresses, get_direct_vehicle_details, common_multipal_vehicle_details };
