const mongoose = require('mongoose');
const { Schema } = mongoose;

const accountSchema = new Schema({
    address: String,
    balance: String
})

const Account = mongoose.model('Account', accountSchema);

module.exports = {
    Account
};