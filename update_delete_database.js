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

// update database 
const Fruite = mongoose.model('Fruite', fruitSchema);
Fruite.updateOne({
    _id: '638f09373ca0861b12a521f3'
}, {
    name: 'Markisa'
}, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log(`berhasil update buah`);
    }
})

const buah = new Fruite({
    name: 'Apel',
    warna: 'merah',
    review: 'manis'
});

buah.save((err) => {
    if (err) console.log(err);
    console.log('data berhasil disimpan');
})
// delete database 
Fruite.deleteOne({
    // _id: '638f09373ca0861b12a521f3' //delete by id
    name: "Anggur" //delete by name
}, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log(`berhasil delete buah`);
    }
})