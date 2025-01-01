const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
//dotenv
require("dotenv").config();

// Import your models
require("./models/user");
require("./models/post");
require("./models/comment");
require("./models/forum");
require("./models/message");
require("./models/conversation");
require("./models/notification");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

// Middleware
app.use(
  cors({
    origin: [process.env.CLIENT_URL, "http://localhost:5173"],
  })
);
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use(require("./routes/auth")); // Prefix routes with /api
app.use(require("./routes/createPost")); // Prefix routes with /api
app.use(require("./routes/getUser")); // Prefix routes with /api
app.use(require("./routes/profile"));
app.use(require("./routes/follow"));
app.use(require("./routes/forumRoute"));
app.use("/chat", require("./routes/chatRoute"));
app.use(
  "/message",

  require("./routes/messageRoute")
);

app.use("/notification", require("./routes/notification"));

app.use(require("./routes/leaderboard"));

// Socket.IO connection handling
let activeUsers = [];
let activeChatUsers = [];

io.on("connection", (socket) => {
  console.log("connected with:", socket.id);
  // add new User
  socket.on("new-user-add", (newUserId) => {
    // if user is not added previously
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("New User Connected", activeUsers);
    }

    io.emit("get-users", activeUsers);
  });
  socket.on("new-chat-user-add", (newUserId) => {
    if (!activeChatUsers.some((user) => user.userId === newUserId)) {
      activeChatUsers.push({ userId: newUserId, socketId: socket.id });
    }
  });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    activeChatUsers = activeChatUsers.filter(
      (user) => user.socketId !== socket.id
    );
    console.log("User Disconnected", activeUsers);
    // send all active users to all users
    io.emit("get-users", activeUsers);
  });

  // send message to a specific user
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeChatUsers.find((user) => user.userId === receiverId);
    console.log("Sending from socket to :", receiverId);
    console.log("Data: ", data);
    if (user) {
      io.to(user.socketId).emit("recieve-message", data);
    }
  });
  socket.on("notification", (data) => {
    console.log("Sending from socket to :", data.receiver._id);
    const { receiver } = data;

    console.log(receiver);
    const user = activeUsers.find((user) => user.userId === receiver._id);
    console.log(user);
    if (user) {
      io.emit("receive-notification", data);
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = { app, server };
