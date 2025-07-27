const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

const memes = [
  "/memes/meme1.jpg",
  "/memes/meme2.jpg",
  "/memes/meme3.jpg"
];

let players = [];
let captions = [];
let currentRound = 0;

io.on("connection", (socket) => {
  socket.on("join", (name) => {
    players.push({ id: socket.id, name, score: 0 });
    if (players.length >= 2) startRound();
  });

  socket.on("caption", (text) => {
    captions.push({ id: socket.id, text });
    if (captions.length === players.length) {
      io.emit("voting", shuffleArray(captions));
    }
  });

  socket.on("vote", (index) => {
    const voted = captions[index];
    const player = players.find(p => p.id === voted.id);
    if (player) player.score += 1;

    if (!--pendingVotes) {
      io.emit("scores", players);
      setTimeout(startRound, 5000);
    }
  });

  socket.on("disconnect", () => {
    players = players.filter(p => p.id !== socket.id);
  });
});

let pendingVotes = 0;

function startRound() {
  currentRound++;
  const meme = memes[Math.floor(Math.random() * memes.length)];
  captions = [];
  pendingVotes = players.length;
  io.emit("new-round", { round: currentRound, meme });
}

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

server.listen(3000, () => {
  console.log("Sunucu çalışıyor http://localhost:3000");
});
