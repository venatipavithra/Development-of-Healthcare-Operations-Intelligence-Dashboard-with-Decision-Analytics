const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    age: {
        type: Number,
        required: true
    },

    gender: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    department: {
        type: String,
        required: true
    },

    visitType: {
        type: String,
        default: "OPD"
    },

    admissionStatus: {
        type: String,
        default: "Outpatient"
    },

    waitingTime: {
        type: Number,
        default: 0
    },

    appointmentStatus: {
        type: String,
        default: "Scheduled"
    },

    lengthOfStay: {
        type: Number,
        default: 0
    }

});

module.exports = mongoose.model("Patient", patientSchema);