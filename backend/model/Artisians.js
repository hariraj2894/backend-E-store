const mongoose = require('mongoose');

const ArtisanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role : {
        type: String,
        enum: ['artisan', 'user'],
        default: 'artisan'
    },
    img:{
        type: String,
        default: 'none'
    },
    contact:{
        type: Number,
        default: 0
    },
    earnedAmount: { type: Number, default: 0 },
    badge :{
        type: String,
        default: 'none'
    }
});

const Artisan = mongoose.model('Artisan', ArtisanSchema);

module.exports = Artisan;
