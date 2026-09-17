const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema({

    patientName: {
        type: String,
        required: true
    },

    department: {
        type: String,
        required: true
    },

    provider: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    paidAmount: {
        type: Number,
        default: 0
    },

    paymentStatus: {
        type: String,
        enum: ["Paid", "Partial", "Pending"],
        default: "Pending"
    },

    paymentMethod: {
        type: String,
        default: "Cash"
    },

    billDate: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Billing", billingSchema);