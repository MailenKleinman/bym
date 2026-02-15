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
      <div className="start-caption">Presionar barra espaciadora para recolectar corazones</div>
      <div className="start-caption2">Para Bauti de Mai - 15.02.2026</div>
    </div>
  );
}

const MODALS = [
  {
    title: 'Donde todo empezó',
    image: '/images/modal-1.png',
    text: '1000 cafecitos y viajes a la dietética me hicieron darme cuenta que me gustabas',
  },
  {
    title: 'El día que clickeamos',
    image: '/images/modal-2.png',
    text: 'Logré convencerte de hacer tiempo en un barcito y hablamos muchas horas en un bar',
  },
  {
    title: 'Sorteamos 1000 desafíos',
    image: '/images/modal-3.png',
    text: 'Bajo circunstancias no tan lindas, nos reencontramos en Barcelona y nos pusimos de novios oficialmente',
  },
  {
    title: 'Conocí Rada Tilly',
    image: '/images/modal-4.png',
    text: 'Y con eso... tu mundo, tus personas, tu hogar y lo que te hacía feliz',
  },
  {
    title: 'Aprendí a amarte',
    image: '/images/modal-5.png',
    text: 'Tuve que aceptar muchas cosas A REGAÑADIENTES',
  },
  {
    title: 'Aprendiste a amarme',
    image: '/images/modal-6.png',
    text: 'Me bancaste en mis 48345 crisis, llantos y estreses REPETIDAS veces',
  },
  {
    title: 'Nos potenciamos constantemente',
    image: '/images/modal-7.png',
    text: 'Y entre los dos construimos, inventamos, aprendimos y nos volvimos mejores',
  },
  {
    title: 'Y ahora llega otra etapa',
    image: '/images/modal-8.png',
    text: 'En donde vamos a armar nuestra casita y nuestra nueva vida, ¡y eso me hace muy feliz!',
  },
  {
    title: '¡Feliz aniversario!',
    image: '/images/modal-9.png',
    text: 'Esto es solo el principio, no puedo esperar a todo lo que vamos a vivir. Te amo mucho amor.',
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
