const Driver = require('../models/driver');

module.exports = {
    greeting: function(req, res) {
        res.send({ hi: 'there' });
    },

    index: function(req, res, next) {
        const { lng, lat } = req.query;

        Driver.aggregate([{ 
            $geoNear :{ 
                near: 
                    { 
                        type: 'Point', 
                        coordinates: [ parseFloat(lng), parseFloat(lat) ] 
                    },
                spherical: true, 
                maxDistance: 200000, 
                distanceField: 'dist.calculated' 
                }}]) 
                .then(drivers => res.send(drivers))
                .catch(next)
    },
 
    create: function(req, res, next) {
        const driverProps = req.body;
        
        Driver.create(driverProps)
            .then(driver => res.send(driver))
            .catch(next);
    },

    edit: function(req, res, next) {
        const driverId = req.params.id;
        const driverProps = req.body;

        Driver.findByIdAndUpdate({ _id: driverId }, driverProps)
            .then(() => Driver.findById({ _id: driverId }))
            .then(driver => res.send(driver))
            .catch(next)
    },

    delete: function(req, res, next) {
        const driverId = req.params.id;
        
        Driver.findOneAndDelete({ _id: driverId })
            .then(driver => res.status(204).send(driver))
            .catch(next)
    }
};