import React, { useState, useRef, useEffect, useMemo } from 'react';
import './App.css';
import Game from './Game';
import { drawStartPreview } from './pixelArt';

function StartScreen({ onStart }) {
  const charCanvasRef = useRef(null);
  const frameRef = useRef(0);
  const animRef = useRef(null);

  useEffect(() => {
    const animate = () => {
      frameRef.current += 1;
      if (charCanvasRef.current) {
        drawStartPreview(charCanvasRef.current, frameRef.current);
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const stars = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        left: `${(i * 37 + 13) % 100}%`,
        top: `${(i * 23 + 7) % 100}%`,
        size: (i % 3) + 1,
        delay: `${(i * 0.3) % 3}s`,
      })),
    []
  );

  const hearts = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        left: `${10 + (i * 12) % 80}%`,
        duration: `${4 + (i % 4)}s`,
        delay: `${i * 0.8}s`,
      })),
    []
  );

  return (
    <div className="start-screen">
      {/* Stars */}
      <div className="stars">
        {stars.map((s, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              animationDelay: s.delay,
            }}
          />
        ))}
      </div>

    

      <div className="start-title">Bauti y Mai</div>
      <div className="start-subtitle">Nuestra historia</div>

      <div className="character-preview">
        <canvas ref={charCanvasRef} />
      </div>

      <button className="start-btn" onClick={onStart}>
        START
      </button>
      <div className="start-caption">Press the space bar to collect hearts.</div>
    </div>
  );
}

const MODALS = [
  {
    title: 'Where it all began',
    image: '/images/modal-1.png',
    text: 'This is the place where we first met.',
  },
  {
    title: 'Our favorite bar',
    image: '/images/modal-2.png',
    text: 'Where we shared our best conversations over a cold beer.',
  },
  {
    title: 'Our first trip together',
    image: '/images/modal-3.png',
    text: 'The adventure that brought us even closer.',
  },
  {
    title: 'Home',
    image: '/images/modal-4.png',
    text: 'Where we built our little world together.',
  },
  {
    title: 'Our wild rides',
    image: '/images/modal-5.png',
    text: 'Adventures on two wheels, chasing the horizon together.',
  },
  {
    title: 'You',
    image: '/images/modal-6.png',
    text: 'Every road leads me back to you. Happy anniversary, Mai.',
  },
  {
    title: 'GoSharp',
    image: '/images/modal-7.png',
    text: 'Where we work side by side, building something great together.',
  },
  {
    title: 'Our place',
    image: '/images/modal-8.png',
    text: 'The place we call ours.',
  },
  {
    title: 'Happy Anniversary!',
    image: '/images/modal-9.png',
    text: 'This is just the beginning. I love you, Bauti.',
  },
];

function StoryModal({ stageIndex, onClose }) {
  const modal = MODALS[stageIndex] || MODALS[0];
  const isLast = stageIndex >= MODALS.length - 1;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">{modal.title}</div>
        <div className="modal-image-container">
          <img src={process.env.PUBLIC_URL + modal.image} alt={modal.title} />
        </div>
        <div className="modal-text">{modal.text}</div>
        <button className="modal-btn" onClick={onClose}>
          {isLast ? 'Fin ❤' : 'Continue...'}
        </button>
      </div>
    </div>
  );
}

function App() {
  const [phase, setPhase] = useState('start'); // 'start' | 'walking' | 'arrived'
  const [stage, setStage] = useState(0); // which destination (0 = shop, 1 = bar, ...)
  const [showModal, setShowModal] = useState(false);

  const handleStart = () => setPhase('walking');

  const handleArrive = () => {
    setPhase('arrived');
    setTimeout(() => setShowModal(true), 600);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    const nextStage = stage + 1;
    if (nextStage < MODALS.length) {
      setStage(nextStage);
      setPhase('walking');
    }
  };

  return (
    <div className="game-container">
      {phase === 'start' && <StartScreen onStart={handleStart} />}

      {(phase === 'walking' || phase === 'arrived') && (
        <Game stage={stage} onArrive={handleArrive} />
      )}

      {showModal && <StoryModal stageIndex={stage} onClose={handleCloseModal} />}
    </div>
  );
}

export default App;
