const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/db-mongoose', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const buahSchema = new mongoose.Schema({
    name: String,
    rating: Number,
    review: String
});

const Buah = mongoose.model('Buah', buahSchema);
const Duku = new Buah({
    nama: 'Duku',
    rating: 7.5,
    review: 'manis'
})
Duku.save((err) => {
    if (err) console.log(err);
    console.log('buah ditambahkan ke database');
})

const peopleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    occupation: String,
    favFruite: buahSchema
});
const Orang = mongoose.model("People", peopleSchema);
const siswa = new Orang({
    name: "Ridwan",
    age: 21,
    occupation: "Insinyur",
    favFruite: Duku
});

siswa.save((err) => {
    if (err) console.log(err);
    console.log('relasi berhasil ditambahkan');
});