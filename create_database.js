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

const Buah = mongoose.model("Fruite", fruitSchema);

const Fruites = new Buah({
        name: 'Apel',
        warna: 'merah dan hijau',
        review: 'manis'
    }

);

//insert 1 data
Fruites.save(function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('berhasil ditambahkan ke database');
    }
});

//insert banyak data
const anggur = new Buah({
    name: 'Anggur',
    warna: 'ungu',
    review: 'manis'
})
const kiwi = new Buah({
    name: 'Kiwi',
    warna: 'Hijau',
    review: 'manis'
})


Buah.insertMany([anggur, kiwi], (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('berhasil');
    }
});