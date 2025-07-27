import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const memeTemplates = [
  { id: 1, url: 'https://via.placeholder.com/400x300?text=Havalı+Kedi', name: 'Havalı Kedi' },
  { id: 2, url: 'https://via.placeholder.com/400x300?text=Düşünceli+Teyze', name: 'Düşünceli Teyze' },
  { id: 3, url: 'https://via.placeholder.com/400x300?text=Sinirli+Amca', name: 'Sinirli Amca' },
];

const App = () => {
  const [gameState, setGameState] = useState('lobby');
  const [players, setPlayers] = useState(['Oyuncu 1', 'Oyuncu 2', 'Oyuncu 3']);
  const [currentMeme, setCurrentMeme] = useState(null);
  const [captions, setCaptions] = useState({});
  const [scores, setScores] = useState({ 'Oyuncu 1': 0, 'Oyuncu 2': 0, 'Oyuncu 3': 0 });
  const [customMeme, setCustomMeme] = useState(null);
  const [captionInput, setCaptionInput] = useState('');

  // Rastgele meme seç
  const selectRandomMeme = () => {
    const randomIndex = Math.floor(Math.random() * memeTemplates.length);
    setCurrentMeme(memeTemplates[randomIndex]);
  };

  // Oyun başlat
  const startGame = () => {
    selectRandomMeme();
    setCaptions({});
    setGameState('caption');
  };

  // Altyazı gönder
  const submitCaption = (player, caption) => {
    setCaptions((prev) => ({ ...prev, [player]: caption }));
    if (Object.keys(captions).length + 1 === players.length) {
      setGameState('vote');
    }
  };

  // Oylama
  const voteCaption = (player, votedCaption) => {
    setScores((prev) => ({
      ...prev,
      [votedCaption]: prev[votedCaption] + 1,
    }));
    setGameState('scoreboard');
  };

  // Yeni tur
  const nextRound = () => {
    selectRandomMeme();
    setCaptions({});
    setGameState('caption');
  };

  // Özel meme yükleme
  const handleMemeUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomMeme({ id: memeTemplates.length + 1, url, name: 'Özel Meme' });
      memeTemplates.push({ id: memeTemplates.length + 1, url, name: 'Özel Meme' });
      setCurrentMeme({ id: memeTemplates.length + 1, url, name: 'Özel Meme' });
    }
  };

  // Oyun lobisi
  if (gameState === 'lobby') {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold mb-4 text-blue-600">Türkçe Meme Oyunu</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl mb-4">Oyuncular</h2>
          <ul className="list-disc pl-6 mb-4">
            {players.map((player) => (
              <li key={player}>{player}</li>
            ))}
          </ul>
          <button
            onClick={startGame}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Oyunu Başlat
          </button>
        </div>
      </div>
    );
  }

  // Altyazı ekleme ekranı
  if (gameState === 'caption') {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold mb-4 text-blue-600">Meme'ye Altyazı Ekle</h1>
        <img src={currentMeme.url} alt={currentMeme.name} className="w-96 mb-4 rounded" />
        <input
          type="file"
          accept="image/*"
          onChange={handleMemeUpload}
          className="mb-4"
        />
        <input
          type="text"
          value={captionInput}
          onChange={(e) => setCaptionInput(e.target.value)}
          placeholder="Komik bir altyazı yaz..."
          className="border p-2 rounded mb-4 w-64"
        />
        <button
          onClick={() => submitCaption('Oyuncu 1', captionInput)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Altyazıyı Gönder
        </button>
      </div>
    );
  }

  // Oylama ekranı
  if (gameState === 'vote') {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold mb-4 text-blue-600">Oylama Zamanı!</h1>
        <img src={currentMeme.url} alt={currentMeme.name} className="w-96 mb-4 rounded" />
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl mb-4">Altyazılar</h2>
          {Object.entries(captions).map(([player, caption]) => (
            <button
              key={player}
              onClick={() => voteCaption('Oyuncu 1', player)}
              className="block bg-gray-200 p-2 rounded mb-2 hover:bg-gray-300"
            >
              {caption}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Skor tablosu
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4 text-blue-600">Skor Tablosu</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl mb-4">Puanlar</h2>
        <ul className="list-disc pl-6 mb-4">
          {Object.entries(scores).map(([player, score]) => (
            <li key={player}>{player}: {score} puan</li>
          ))}
        </ul>
        <button
          onClick={nextRound}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Yeni Tur
        </button>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));