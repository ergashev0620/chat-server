const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*"
  }
});

app.use(cors());

let messages = [];

io.on("connection", (socket) => {
  console.log("Foydalanuvchi ulandi");

  socket.emit("chat history", messages);

  socket.on("chat message", (data) => {
    const msgData = {
      name: data.name,
      message: data.message,
      time: new Date().toLocaleTimeString()
    };
    messages.push(msgData);
    io.emit("chat message", msgData);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server ishga tushdi: ${PORT}`);
});
