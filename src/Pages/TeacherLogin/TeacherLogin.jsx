const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google-login", async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();

    let teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return res
        .status(404)
        .json({ message: "No teacher account found. Contact admin." });
    }

    const authToken = jwt.sign({ id: teacher._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token: authToken,
      teacher: {
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        adminId: teacher.adminId,
      },
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid Google token." });
  }
});

module.exports = router;
