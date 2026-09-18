const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({

    patientName: {
        type: String,
        required: true
    },

    insuranceProvider: {
        type: String,
        required: true
    },

    claimNumber: {
        type: String,
        required: true,
        unique: true
    },

    department: {
        type: String,
        required: true
    },

    claimAmount: {
        type: Number,
        required: true
    },

    approvedAmount: {
        type: Number,
        default: 0
    },

    claimStatus: {
        type: String,
        enum: [
            "Submitted",
            "Processing",
            "Approved",
            "Denied"
        ],
        default: "Submitted"
    },

    denialReason: {
        type: String,
        default: ""
    },

    claimDate: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Claim", claimSchema);