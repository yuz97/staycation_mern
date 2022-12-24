const mongoose = require('mongoose');
const {
    ObjectId
} = mongoose.Schema;

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        default: 'Indonesia'
    },
    city: {
        type: String,
        required: true
    },
    isPopular: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        defult: 'night'
    },
    sumBooking: {
        type: Number,
        defult: 0
    },
    imageId: [{
        type: ObjectId,
        ref: 'Image'
    }],
    categoryId: [{
        type: ObjectId,
        ref: 'Category'
    }],
    featureId: [{
        type: ObjectId,
        ref: 'Feature'
    }],
    activityId: [{
        type: ObjectId,
        ref: 'Activity'
    }]

})

module.exports = mongoose.model("Item", itemSchema);