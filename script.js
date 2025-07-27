const socket = io();
let username = "";

function joinGame() {
  username = document.getElementById("username").value.trim();
  if (!username) return alert("Lütfen bir isim girin.");
  socket.emit("join", username);
  document.getElementById("lobby").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
}

function submitCaption() {
  const caption = document.getElementById("caption-input").value.trim();
  if (!caption) return;
  socket.emit("caption", caption);
  document.getElementById("caption-area").classList.add("hidden");
}

socket.on("new-round", (data) => {
  document.getElementById("round-info").textContent = `Tur: ${data.round}`;
  document.getElementById("meme-img").src = data.meme;
  document.getElementById("caption-input").value = "";
  document.getElementById("caption-area").classList.remove("hidden");
  document.getElementById("captions-list").innerHTML = "";
  document.getElementById("captions-list").classList.add("hidden");
  document.getElementById("scores").classList.add("hidden");
});

socket.on("voting", (captions) => {
  const list = document.getElementById("captions-list");
  list.innerHTML = "<h3>Oyla!</h3>";
  captions.forEach((caption, index) => {
    const btn = document.createElement("button");
    btn.textContent = caption.text;
    btn.onclick = () => socket.emit("vote", index);
    list.appendChild(btn);
    list.appendChild(document.createElement("br"));
  });
  list.classList.remove("hidden");
});

socket.on("scores", (players) => {
  const scoreDiv = document.getElementById("scores");
  scoreDiv.innerHTML = "<h3>Puan Durumu</h3>";
  players.forEach(p => {
    const pEl = document.createElement("p");
    pEl.textContent = `${p.name}: ${p.score} puan`;
    scoreDiv.appendChild(pEl);
  });
  scoreDiv.classList.remove("hidden");
});
