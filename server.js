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

let messages = []; // Xabarlarni xotirada saqlaymiz

io.on("connection", (socket) => {
  console.log("Foydalanuvchi ulandi");

  // Kirgan odamga eski xabarlar jo‘natiladi
  socket.emit("chat history", messages);

  // Yangi xabar kelganda
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
