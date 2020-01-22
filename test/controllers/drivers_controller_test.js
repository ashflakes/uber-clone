const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Driver = mongoose.model('driver');

describe('Drivers controller', () => {
    it('Post to /api/drivers creates a new driver', (done) => {
        Driver.countDocuments().then(count => {
            request(app)
                .post('/api/drivers')
                .send({ email: 'test@test.com' })
                .end(() => {
                    Driver.countDocuments().then(newCount => {
                        assert(count + 1 === newCount);
                        done();
                    })
                });
        })
        
    });

    it('Put to /api/drivers/:id edits an existing driver', (done) => {
        const driver = new Driver({ email: 't@t.com', driving: false });

        driver.save().then(() => {
            request(app)
                .put('/api/drivers/' + driver._id)
                .send({ driving: true })
                .end(() => {
                    Driver.findOne({ email: 't@t.com' }).then((driver) => {
                        assert(driver.driving === true);
                        done();
                    });
                });
        });
    });

    it('Delete to /api/drivers/:id removes an existing driver', (done) => {
        const driver = new Driver({ email: 'tes@tes.com', drving: false});

        driver.save().then(() => {
            request(app)
                .delete('/api/drivers/' + driver._id)
                .end(() => {
                    Driver.findOne({ email: 'tes@tes.com' }).then((driver) => {
                        assert(driver === null);
                        done();
                    });
                });
        });
    });

    it('GET to /api/drivers finds drivers in a location', (done) => {
        const seattleDriver = new Driver({ 
            email: 'seattle@test.com',
            geometry: { type: 'Point', coordinates: [-122.4759, 47.6147] }
        });

        const miamiDriver = new Driver({
            email: 'miami@test.com',
            geometry: { type: 'Point', coordinates: [-85.254, 25.791]}
        });

        Promise.all([ seattleDriver.save(), miamiDriver.save() ])
            .then(() => {
                request(app)
                    .get('/api/drivers?lng=-80&latlat=25')
                    .end((err, response) => {
                        console.log(response);
                        done();
                    })
            })
    })
});