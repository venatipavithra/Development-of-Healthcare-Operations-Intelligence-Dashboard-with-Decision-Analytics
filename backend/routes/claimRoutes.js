const express = require("express");

const router = express.Router();

const Claim = require("../models/Claim");


// GET ALL CLAIMS

router.get("/", async (req, res) => {

    try {

        const claims = await Claim.find()
            .sort({ claimDate: -1 });

        res.json(claims);

    } catch (error) {

        res.status(500).json({
            message: "Error fetching claims",
            error: error.message
        });

    }

});


// ADD CLAIM

router.post("/", async (req, res) => {

    try {

        const claim = new Claim(req.body);

        const savedClaim = await claim.save();

        res.status(201).json(savedClaim);

    } catch (error) {

        res.status(500).json({
            message: "Error adding claim",
            error: error.message
        });

    }

});


// UPDATE CLAIM

router.put("/:id", async (req, res) => {

    try {

        const updatedClaim =
            await Claim.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );

        res.json(updatedClaim);

    } catch (error) {

        res.status(500).json({
            message: "Error updating claim",
            error: error.message
        });

    }

});


// DELETE CLAIM

router.delete("/:id", async (req, res) => {

    try {

        await Claim.findByIdAndDelete(
            req.params.id
        );

        res.json({
            message: "Claim deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Error deleting claim",
            error: error.message
        });

    }

});


module.exports = router;