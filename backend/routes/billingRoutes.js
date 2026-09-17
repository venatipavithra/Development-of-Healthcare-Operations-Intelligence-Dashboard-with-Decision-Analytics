const express = require("express");

const router = express.Router();

const Billing = require("../models/Billing");


// GET ALL BILLS

router.get("/", async (req, res) => {

    try {

        const bills = await Billing.find()
            .sort({ billDate: -1 });

        res.json(bills);

    } catch (error) {

        res.status(500).json({
            message: "Error fetching billing records",
            error: error.message
        });

    }

});


// ADD BILL

router.post("/", async (req, res) => {

    try {

        const bill = new Billing(req.body);

        const savedBill = await bill.save();

        res.status(201).json(savedBill);

    } catch (error) {

        res.status(500).json({
            message: "Error adding billing record",
            error: error.message
        });

    }

});


// UPDATE BILL

router.put("/:id", async (req, res) => {

    try {

        const updatedBill =
            await Billing.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );

        res.json(updatedBill);

    } catch (error) {

        res.status(500).json({
            message: "Error updating billing record",
            error: error.message
        });

    }

});


// DELETE BILL

router.delete("/:id", async (req, res) => {

    try {

        await Billing.findByIdAndDelete(
            req.params.id
        );

        res.json({
            message: "Billing record deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Error deleting billing record",
            error: error.message
        });

    }

});


module.exports = router;