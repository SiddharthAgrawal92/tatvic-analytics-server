const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InsightSchema = new Schema({
    itemName: String,
    itemUrl: String,
    date: { type: Date, default: () => Date.now() }
})

module.exports = mongoose.model('Insights', InsightSchema);