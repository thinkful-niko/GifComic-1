const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EntrySchema = new Schema({
    mood: String,
    activity: String,
    journal: String,
    date: String,
    location: Object,
    userId: String,
    cards: Array,
    userEmail: String,
});

module.exports = mongoose.model('Entry', EntrySchema);