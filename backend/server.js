const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const patientRoutes = require("./routes/patientRoutes");
const staffRoutes = require("./routes/staffRoutes");
const billingRoutes = require("./routes/billingRoutes");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/patients", patientRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/billing", billingRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error.message);
    });

app.get("/", (req, res) => {
    res.send("Medical Operations Intelligence API is running");
});

app.get("/add-test-patient", async (req, res) => {
    try {
        const Patient = require("./models/Patient");

        const patient = new Patient({
            name: "Pavithra",
            age: 21,
            gender: "Female",
            phone: "9876543210",
            department: "General"
        });

        const savedPatient = await patient.save();

        res.json({
            message: "Test patient added successfully!",
            patient: savedPatient
        });
    } catch (error) {
        res.status(500).json({
            message: "Error adding patient",
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});