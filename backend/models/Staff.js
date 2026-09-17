const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    role: {
        type: String,
        required: true
    },

    department: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    attendance: {
        type: Number,
        default: 0
    },

    workload: {
        type: Number,
        default: 0
    },

    productivity: {
        type: Number,
        default: 0
    }

});

module.exports = mongoose.model("Staff", staffSchema);