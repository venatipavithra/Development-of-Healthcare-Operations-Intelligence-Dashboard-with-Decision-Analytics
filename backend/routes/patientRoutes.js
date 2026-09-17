const express = require("express");
const Patient = require("../models/Patient");

const router = express.Router();

// Add a new patient
router.post("/", async (req, res) => {
    try {
        const patient = new Patient(req.body);
        const savedPatient = await patient.save();

        res.status(201).json(savedPatient);
    } catch (error) {
        res.status(500).json({
            message: "Error adding patient",
            error: error.message
        });
    }
});

// Get all patients
router.get("/", async (req, res) => {
    try {
        const patients = await Patient.find();

        res.json(patients);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching patients",
            error: error.message
        });
    }
});


// Update a patient
router.put("/:id", async (req, res) => {
    try {
        const updatedPatient = await Patient.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedPatient);
    } catch (error) {
        res.status(500).json({
            message: "Error updating patient",
            error: error.message
        });
    }
});

// Delete a patient
router.delete("/:id", async (req, res) => {
    try {
        await Patient.findByIdAndDelete(req.params.id);

        res.json({
            message: "Patient deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting patient",
            error: error.message
        });
    }
});


module.exports = router;