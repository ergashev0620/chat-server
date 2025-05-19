const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const FILE_PATH = path.join(__dirname, "messages.json");

let messages = [];
if (fs.existsSync(FILE_PATH)) {
  try {
    const data = fs.readFileSync(FILE_PATH, "utf8");
    messages = JSON.parse(data);
  } catch (err) {
    console.error("Xabarlarni o‘qishda xatolik:", err);
  }
}

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("Yangi foydalanuvchi ulandi");

  // Eski xabarlarni yuborish
  socket.emit("chat history", messages);

  // Yangi xabar
  socket.on("chat message", (data) => {
    const msgData = {
      name: data.name,
      message: data.message,
      time: new Date().toLocaleTimeString()
    };

    messages.push(msgData);

    fs.writeFile(FILE_PATH, JSON.stringify(messages, null, 2), (err) => {
      if (err) console.error("Faylga yozishda xatolik:", err);
    });

    io.emit("chat message", msgData);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server ishlayapti: http://localhost:${PORT}`);
});
