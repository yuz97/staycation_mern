const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/db-mongoose', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const fruitSchema = new mongoose.Schema({
    name: String,
    warna: String,
    review: String
})

const Fruite = mongoose.model("Fruite", fruitSchema);
Fruite.find((err, fruits) => {
    if (err) {
        console.log(err);
    } else {
        mongoose.connection.close();
        // console.log(fruits);
        fruits.forEach((fruit) => console.log(fruit.name));
    }
})