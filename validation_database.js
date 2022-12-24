const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/db-mongoose', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const fruitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    warna: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    }
})

const Fruite = mongoose.model("Fruit", fruitSchema);