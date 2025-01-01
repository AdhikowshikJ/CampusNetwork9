const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const jwtsecret = "adhikowshikkowshikadhi";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "campusnetwork95@gmail.com",
    pass: "gonp bfyh fhlk ghig",
  },
});

const otpStore = new Map();

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: "campusnetwork95@gmail.com",
    to: email,
    subject: "Email Verification OTP",
    html: `
      <h1>Email Verification</h1>
      <p>Your OTP for email verification is: <strong>${otp}</strong></p>
      <p>This OTP is valid for 10 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
router.post("/signup", async (req, res) => {
  const { username, email, password, branch, section } = req.body;

  if (!username || !email || !password || !branch || !section) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  try {
    const existingUser = await USER.findOne({ email });
    const exisingUsername = await USER.findOne({ username });
    console.log(existingUser, exisingUsername);
    if (existingUser) {
      return res
        .status(422)
        .json({ error: "User already exists with that email" });
    } else if (exisingUsername) {
      return res.status(422).json({ error: " Username already exists " });
    }

    const otp = generateOTP();
    otpStore.set(email, {
      otp,
      username,
      password,
      branch,
      section,
      timestamp: Date.now(),
    });

    await sendOTPEmail(email, otp);

    res.json({
      message: "OTP sent to your email",
      email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const storedData = otpStore.get(email);

    if (!storedData) {
      return res.status(400).json({ error: "OTP expired or invalid email" });
    }

    if (Date.now() - storedData.timestamp > 600000) {
      // 10 minutes
      otpStore.delete(email);
      return res.status(400).json({ error: "OTP expired" });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const hashedPass = await bcrypt.hash(storedData.password, 10);
    const user = new USER({
      username: storedData.username,
      email,
      password: hashedPass,
      branch: storedData.branch,
      section: storedData.section,
      isVerified: true,
    });

    await user.save();
    otpStore.delete(email);

    const token = jwt.sign({ _id: user._id }, jwtsecret);
    res.json({
      message: "Account verified successfully",
      user,
      token: "Bearer " + token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/resend-otp", async (req, res) => {
  const { email } = req.body;

  try {
    const storedData = otpStore.get(email);
    if (!storedData) {
      return res
        .status(400)
        .json({ error: "Invalid email or signup session expired" });
    }

    const otp = generateOTP();
    otpStore.set(email, {
      ...storedData,
      otp,
      timestamp: Date.now(),
    });

    await sendOTPEmail(email, otp);
    res.json({ message: "OTP resent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Signin route
router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please add email or password" });
  }

  USER.findOne({ email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid Email or password" });
    }

    bcrypt.compare(password, savedUser.password).then((doMatch) => {
      if (doMatch) {
        const token = jwt.sign({ _id: savedUser._id }, jwtsecret);

        return res.json({
          message: "Successfully signed in",
          user: savedUser,
          token: "Bearer " + token,
        });
      } else {
        return res.status(422).json({ error: "Invalid Email or password" });
      }
    });
  });
});

router.get("/getUserByToken", (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "You must be logged in." });
  }

  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, jwtsecret, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "You must be logged in." });
    }
    const { _id } = payload;
    USER.findById(_id)
      .then((userdata) => {
        if (!userdata) {
          return res.status(404).json({ error: "User not found." });
        }
        res.json(userdata);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
      });
  });
});

module.exports = router;
