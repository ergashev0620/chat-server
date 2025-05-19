const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*", // barcha frontendga ruxsat beramiz
    methods: ["GET", "POST"]
  }
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("Foydalanuvchi ulandi:", socket.id);

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg); // barcha foydalanuvchilarga yuborish
  });

  socket.on("disconnect", () => {
    console.log("Foydalanuvchi chiqdi:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Socket.io server 3000-portda ishga tushdi");
});
