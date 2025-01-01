// routes/leaderboard.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const POST = mongoose.model("POST");

// const calculateRanksAndTrends = async () => {
//   // Fetch all students and their points
//   const students = await USER.find().sort({ points: -1 }).lean();

//   let previousPoints = {}; // Retrieve this from your persistent storage

//   const results = students.map((student, index) => {
//     const previousPoint = previousPoints[student._id] || 0;
//     let trend = 'stable';

//     if (student.points > previousPoint) {
//       trend = 'up';
//     } else if (student.points < previousPoint) {
//       trend = 'down';
//     }

//     previousPoints[student._id] = student.points; // Update the stored points

//     return {
//       ...student,
//       rank: index + 1,
//       trend,
//     };
//   });

//   // Save updated points to persistent storage
//   return results;
// };

// router.get('/leaderboard', requireLogin, async (req, res) => {
//   try {
//     const leaderboard = await calculateRanksAndTrends();
//     res.json({ users: leaderboard });
//   } catch (err) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });
router.get("/leaderboard", async (req, res) => {
  try {
    // Fetch users and sort them by points in descending order
    const users = await USER.find({})
      .sort({ points: -1 })
      .limit(10) // Adjust the limit as needed
      .select("username name points profileImage") // Make sure to include the avatar field
      .lean();

    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// routes/leaderboard.js
// Updated route
router.get("/sow", async (req, res) => {
  try {
    const topStudent = await USER.findOne({})
      .sort({ points: -1 })
      .select(
        "username email name points profileImage branch section followers"
      )
      .lean();

    if (!topStudent) {
      return res.status(404).json({ error: "No students found" });
    }

    // Get post count efficiently
    const postCount = await POST.countDocuments({ postedBy: topStudent._id });

    // Add post count to student object
    const studentWithCount = {
      ...topStudent,
      postCount,
    };

    res.json({ student: studentWithCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
