const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../app');
const fs = require('fs-extra');


chai.use(chaiHttp);
describe('api endpoint staycation_mern', () => {
    it('GET landing page', done => {
        chai.request(app).get(`/api/v1/landing-page`).end((err, res) => {
            // response status 200 
            expect(err).to.be.null;
            expect(res).to.have.status(200);

            //hero in object
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('hero');
            expect(res.body.hero).to.have.all.keys('travelers', 'treasures', 'cities');

            //mostpicked
            expect(res.body).to.have.property('mostPicked');
            expect(res.body.mostPicked).to.have.an('array');

            //category
            expect(res.body).to.have.property('category');
            expect(res.body.category).to.have.an('array');

            //testimonial
            expect(res.body).to.have.property('testimonial');
            expect(res.body.testimonial).to.have.an('object');
            done();
        })
    });

    it('GET detail page', done => {
        chai.request(app).get(`/api/v1/detail-page/5e96cbe292b97300fc902232`).end((err, res) => {

            // response status 200 
            expect(err).to.be.null;
            expect(res).to.have.status(200);

            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('country');
            expect(res.body).to.have.property('isPopular');
            expect(res.body).to.have.property('unit');
            expect(res.body).to.have.property('sumBooking');
            expect(res.body).to.have.property('imageId');
            expect(res.body.imageId).to.have.an('array');
            expect(res.body).to.have.property('featureId');
            expect(res.body.featureId).to.have.an('array');
            expect(res.body).to.have.property('activityId');
            expect(res.body.activityId).to.have.an('array');
            expect(res.body).to.have.property('_id');
            expect(res.body).to.have.property('title');
            expect(res.body).to.have.property('price');
            expect(res.body).to.have.property('city');
            expect(res.body).to.have.property('description');
            expect(res.body).to.have.property('unit');
            expect(res.body).to.have.property('__v');
            expect(res.body).to.have.property('bank');
            expect(res.body.bank).to.have.an('array');
            expect(res.body).to.have.property('testimonial');
            expect(res.body.testimonial).to.have.an('object');

            done();
        })
    });

    it('POST booking page', done => {
        //test image
        const image = __dirname + '/1671886194567.svg';
        const dataSample = {
            idItem: "5e96cbe292b97300fc902222",
            duration: 2,
            bookingStartDate: '4-8-2022',
            bookingEndDate: '4-10-2022',
            firstName: 'Ayu',
            lastName: 'Ashari',
            email: 'ayu@gmail.com',
            phoneNumber: '02837',
            accountHolder: 'ayu',
            bankFrom: 'BCA',
            image
        }
        chai.request(app).post(`/api/v1/booking-page`)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .field('idItem', dataSample.idItem)
            .field('duration', dataSample.duration)
            .field('bookingStartDate', dataSample.bookingStartDate)
            .field('bookingEndDate', dataSample.bookingEndDate)
            .field('firstName', dataSample.firstName)
            .field('lastName', dataSample.lastName)
            .field('email', dataSample.email)
            .field('phoneNumber', dataSample.phoneNumber)
            .field('accountHolder', dataSample.accountHolder)
            .field('bankFrom', dataSample.bankFrom)
            .attach('image', fs.readFileSync(dataSample.image), '1671886194567.svg')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object');


                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('success booking');

                expect(res.body).to.have.property('booking');
                expect(res.body.booking).to.have.all.keys('payments', '_id', 'invoice', 'bookingStartDate', 'bookingEndDate', 'total', 'itemId', 'memberId', '__v');

                expect(res.body.booking.payments).to.have.all.keys('status', 'proofPayment', 'bankFrom', 'accountHolder');
                expect(res.body.booking.itemId).to.have.all.keys('_id', 'title', 'price', 'duration');
                console.log(res.body.booking);
                done();
            })
    })

});