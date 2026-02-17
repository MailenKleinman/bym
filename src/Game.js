import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  drawCharacter,
  drawGirlCharacter,
  drawShop,
  drawBar,
  drawAirplane,
  drawHouse,
  drawMotorcycle,
  drawGoSharp,
  drawModernBuilding,
  drawFinishFlag,
  drawGround,
  drawBackground,
  drawLampPost,
  drawCone,
} from './pixelArt';

const SCALE = 3;
const CANVAS_W = 800;
const CANVAS_H = 400;
const CHAR_Y_BASE = CANVAS_H - 6 * SCALE - 21 * SCALE; // ground minus char height
const CHAR_X = 100; // character stays at a fixed screen X
const WALK_SPEED = 4.5;
const LAMP_SPACING = 300;
const JUMP_VELOCITY = -7;
const DOUBLE_JUMP_VELOCITY = -9;
const GRAVITY = 0.45;
const HEART_SPACING = 180;
const HEART_Y = CHAR_Y_BASE - 55; // floating height — reachable by jumping
const CHAR_W = 15 * SCALE;
const CHAR_H = 21 * SCALE;
const CONE_SPACING = 220;
const CONE_W = 7 * SCALE;
const CONE_H = 8 * SCALE;
const CONE_Y = CANVAS_H - 6 * SCALE - CONE_H; // sits on ground
const INITIAL_LIVES = 5;
const INVINCIBILITY_FRAMES = 90; // frames of invincibility after losing a life
const TARGET_FRAME_MS = 1000 / 60; // baseline: 60fps

// Draw the girl waiting at the destination (animated idle)
let girlFrame = 0;
function drawGirlWaiting(ctx, x, y, scale) {
  girlFrame += 0.02;
  // Gentle bobbing
  const bob = Math.sin(girlFrame * 3) * 2;
  drawGirlCharacter(ctx, x + 10 * scale, y + 14 * scale + bob, Math.floor(girlFrame) % 2, scale);
}

const STAGES = [
  {
    buildingWorldX: 1800,
    buildingY: CANVAS_H - 6 * SCALE - 35 * SCALE,
    draw: drawShop,
    heartCount: 9,
  },
  {
    buildingWorldX: 1800,
    buildingY: CANVAS_H - 6 * SCALE - 35 * SCALE,
    draw: drawBar,
    heartCount: 9,
  },
  {
    buildingWorldX: 1800,
    buildingY: CANVAS_H - 6 * SCALE - 24 * SCALE,
    draw: drawAirplane,
    heartCount: 9,
  },
  {
    buildingWorldX: 1800,
    buildingY: CANVAS_H - 6 * SCALE - 35 * SCALE,
    draw: drawHouse,
    heartCount: 9,
  },
  {
    buildingWorldX: 1800,
    buildingY: CANVAS_H - 6 * SCALE - 35 * SCALE,
    draw: drawMotorcycle,
    heartCount: 9,
  },
  {
    buildingWorldX: 1600,
    buildingY: CANVAS_H - 6 * SCALE - 35 * SCALE,
    draw: drawGirlWaiting,
    heartCount: 9,
  },
  {
    buildingWorldX: 1800,
    buildingY: CANVAS_H - 6 * SCALE - 35 * SCALE,
    draw: drawGoSharp,
    heartCount: 9,
    twoPlayers: true,
  },
  {
    buildingWorldX: 1800,
    buildingY: CANVAS_H - 6 * SCALE - 35 * SCALE,
    draw: drawModernBuilding,
    heartCount: 9,
    twoPlayers: true,
  },
  {
    buildingWorldX: 1600,
    buildingY: CANVAS_H - 6 * SCALE - 35 * SCALE,
    draw: drawFinishFlag,
    heartCount: 9,
    twoPlayers: true,
    isFinish: true,
  },
];

// Generate hearts at fixed world positions along the path
function generateHearts(count = 9) {
  const hearts = [];
  for (let i = 1; i <= count; i++) {
    hearts.push({
      worldX: i * HEART_SPACING,
      y: HEART_Y + ((i * 7) % 15) - 7,
      collected: false,
      popFrame: 0,
    });
  }
  return hearts;
}

// Generate cones spread across the full path with random offsets
function generateCones(count = 4, pathLength = 1700) {
  const cones = [];
  const zoneSize = pathLength / count;
  for (let i = 0; i < count; i++) {
    const zoneStart = i * zoneSize + 100; // 100px initial offset
    const pos = zoneStart + Math.random() * (zoneSize * 0.6);
    cones.push({
      worldX: pos,
      hit: false,
    });
  }
  return cones;
}

export default function Game({ stage = 0, onArrive, onGameOver, totalHearts = 0 }) {
  const canvasRef = useRef(null);
  const [arrived, setArrived] = useState(false);
  const [score, setScore] = useState(0);
  const worldXRef = useRef(0);
  const frameRef = useRef(0);
  const animRef = useRef(null);
  const arrivedRef = useRef(false);
  const jumpVelRef = useRef(0);
  const jumpOffsetRef = useRef(0);
  const isGroundedRef = useRef(true);
  const canDoubleJumpRef = useRef(true);
  const stageConf = STAGES[stage] || STAGES[0];
  const heartsRef = useRef(generateHearts(stageConf.heartCount));
  const conesRef = useRef(generateCones());
  const scoreRef = useRef(0);
  const livesRef = useRef(INITIAL_LIVES);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const invincibleRef = useRef(0);
  const lastTimeRef = useRef(null);
  const stageRef = useRef(stage);

  // Reset state when stage changes
  useEffect(() => {
    if (stage !== stageRef.current) {
      stageRef.current = stage;
      worldXRef.current = 0;
      frameRef.current = 0;
      arrivedRef.current = false;
      setArrived(false);
      jumpVelRef.current = 0;
      jumpOffsetRef.current = 0;
      isGroundedRef.current = true;
      heartsRef.current = generateHearts(STAGES[stage]?.heartCount || 9);
      conesRef.current = generateCones();
      scoreRef.current = 0;
      setScore(0);
      invincibleRef.current = 0;
      lastTimeRef.current = null;
    }
  }, [stage]);

  // Jump handler (spacebar + touch)
  useEffect(() => {
    const jump = () => {
      if (arrivedRef.current) return;
      if (isGroundedRef.current) {
        jumpVelRef.current = JUMP_VELOCITY;
        isGroundedRef.current = false;
        canDoubleJumpRef.current = true;
      } else if (canDoubleJumpRef.current) {
        jumpVelRef.current = DOUBLE_JUMP_VELOCITY;
        canDoubleJumpRef.current = false;
      }
    };
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };
    const handleTouch = (e) => {
      e.preventDefault();
      jump();
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouch, { passive: false });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouch);
    };
  }, []);

  const gameLoop = useCallback((timestamp) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Delta-time: dt = 1.0 at 60fps, scales proportionally on other refresh rates
    if (lastTimeRef.current === null) lastTimeRef.current = timestamp;
    const elapsed = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;
    // Clamp dt to avoid huge jumps (e.g. after tab switch)
    const dt = Math.min(elapsed / TARGET_FRAME_MS, 3);

    // Advance world
    if (!arrivedRef.current) {
      worldXRef.current += WALK_SPEED * dt;
    }

    // Jump physics
    if (!isGroundedRef.current) {
      jumpOffsetRef.current += jumpVelRef.current * dt;
      jumpVelRef.current += GRAVITY * dt;
      if (jumpOffsetRef.current >= 0) {
        jumpOffsetRef.current = 0;
        jumpVelRef.current = 0;
        isGroundedRef.current = true;
        canDoubleJumpRef.current = true;
      }
    }

    const worldX = worldXRef.current;
    frameRef.current += dt;
    const walkFrame = Math.floor(frameRef.current / 8); // animation speed

    // Clear
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Background (sky + buildings)
    drawBackground(ctx, worldX, CANVAS_W, CANVAS_H, SCALE);

    // Lamp posts
    for (let i = 0; i < 10; i++) {
      const lampWorldX = i * LAMP_SPACING;
      const lampScreenX = lampWorldX - worldX + CHAR_X;
      if (lampScreenX > -20 && lampScreenX < CANVAS_W + 20) {
        drawLampPost(ctx, lampScreenX, CHAR_Y_BASE - 2 * SCALE, SCALE);
      }
    }

    // Destination building
    const conf = STAGES[stageRef.current] || STAGES[0];
    const buildingScreenX = conf.buildingWorldX - worldX + CHAR_X;
    if (buildingScreenX < CANVAS_W + 200 && buildingScreenX > -200) {
      conf.draw(ctx, buildingScreenX, conf.buildingY, SCALE);
    }

    // Hearts
    const charY = CHAR_Y_BASE + jumpOffsetRef.current;
    heartsRef.current.forEach((heart) => {
      const heartScreenX = heart.worldX - worldX + CHAR_X;

      // Collection animation (pop effect)
      if (heart.collected && heart.popFrame > 0) {
        heart.popFrame -= dt;
        const alpha = heart.popFrame / 15;
        const rise = (15 - heart.popFrame) * 2;
        ctx.globalAlpha = alpha;
        ctx.font = `${16 + (15 - heart.popFrame)}px serif`;
        ctx.fillStyle = '#ff6b9d';
        ctx.fillText('\u2764', heartScreenX + 2, heart.y - rise);
        ctx.globalAlpha = 1;
        return;
      }
      if (heart.collected) return;

      // Only draw if on screen
      if (heartScreenX < -20 || heartScreenX > CANVAS_W + 20) return;

      // Bobbing animation
      const bob = Math.sin(frameRef.current * 0.06 + heart.worldX) * 4;

      // Draw pixel heart
      const hx = heartScreenX;
      const hy = heart.y + bob;
      const hs = SCALE;
      ctx.fillStyle = '#ff6b9d';
      // Heart shape (pixel art)
      // Row 0:  ##  ##
      ctx.fillRect(hx + 1*hs, hy + 0*hs, 2*hs, hs);
      ctx.fillRect(hx + 4*hs, hy + 0*hs, 2*hs, hs);
      // Row 1: ########
      ctx.fillRect(hx + 0*hs, hy + 1*hs, 7*hs, hs);
      // Row 2: ########
      ctx.fillStyle = '#ff85ad';
      ctx.fillRect(hx + 0*hs, hy + 2*hs, 7*hs, hs);
      // Row 3:  ######
      ctx.fillStyle = '#ff6b9d';
      ctx.fillRect(hx + 1*hs, hy + 3*hs, 5*hs, hs);
      // Row 4:   ####
      ctx.fillRect(hx + 2*hs, hy + 4*hs, 3*hs, hs);
      // Row 5:    ##
      ctx.fillRect(hx + 3*hs, hy + 5*hs, 1*hs, hs);
      // Shine highlight
      ctx.fillStyle = '#ffb3cc';
      ctx.fillRect(hx + 1*hs, hy + 1*hs, hs, hs);

      // Glow
      ctx.fillStyle = 'rgba(255, 107, 157, 0.1)';
      ctx.beginPath();
      ctx.arc(hx + 3.5 * hs, hy + 2.5 * hs, 14, 0, Math.PI * 2);
      ctx.fill();

      // Collision detection (character bounding box vs heart)
      const heartLeft = hx;
      const heartRight = hx + 7 * hs;
      const heartTop = hy;
      const heartBottom = hy + 6 * hs;
      const charLeft = CHAR_X;
      const charRight = CHAR_X + CHAR_W;
      const charTop = charY;
      const charBottom = charY + CHAR_H;

      if (charRight > heartLeft && charLeft < heartRight &&
          charBottom > heartTop && charTop < heartBottom) {
        heart.collected = true;
        heart.popFrame = 15;
        scoreRef.current += 1;
        setScore(scoreRef.current);
      }
    });

    // Cones
    if (invincibleRef.current > 0) {
      invincibleRef.current -= dt;
    }
    conesRef.current.forEach((cone) => {
      if (cone.hit) return;
      const coneScreenX = cone.worldX - worldX + CHAR_X;
      if (coneScreenX < -20 || coneScreenX > CANVAS_W + 20) return;

      drawCone(ctx, coneScreenX, CONE_Y, SCALE);

      // Collision detection — only when character is on/near the ground
      if (invincibleRef.current > 0) return;
      const charLeft = CHAR_X;
      const charRight = CHAR_X + CHAR_W;
      const charBottom = charY + CHAR_H;
      const charTop = charY;
      const coneLeft = coneScreenX;
      const coneRight = coneScreenX + CONE_W;
      const coneTop = CONE_Y;
      const coneBottom = CONE_Y + CONE_H;

      if (charRight > coneLeft && charLeft < coneRight &&
          charBottom > coneTop && charTop < coneBottom) {
        cone.hit = true;
        livesRef.current = Math.max(0, livesRef.current - 1);
        setLives(livesRef.current);
        invincibleRef.current = INVINCIBILITY_FRAMES;
        if (livesRef.current <= 0 && onGameOver) {
          onGameOver();
        }
      }
    });

    // Ground / street
    drawGround(ctx, worldX, CANVAS_W, CANVAS_H, SCALE);

    // Character(s) (apply jump offset)
    const isTwoPlayers = conf.twoPlayers;
    const isFinish = conf.isFinish;

    if (arrivedRef.current && isFinish) {
      // Celebration animation: both characters jump alternately
      const celebFrame = frameRef.current;
      const boyBounce = Math.abs(Math.sin(celebFrame * 0.08)) * 25;
      const girlBounce = Math.abs(Math.sin(celebFrame * 0.08 + 1.5)) * 25;
      const boyF = Math.floor(celebFrame / 6) % 4;
      const girlF = Math.floor(celebFrame / 6 + 2) % 4;

      drawGirlCharacter(ctx, CHAR_X - 16 * SCALE, CHAR_Y_BASE - girlBounce, girlF, SCALE);
      drawCharacter(ctx, CHAR_X, CHAR_Y_BASE - boyBounce, boyF, SCALE);

      // Celebration hearts/confetti particles rising
      const confettiColors = ['#e74c3c', '#f1c40f', '#3498db', '#2ecc71', '#9b59b6', '#ff6b9d'];
      for (let i = 0; i < 8; i++) {
        const seed = i * 137;
        const px = CHAR_X - 20 + (seed % 80);
        const speed = 0.5 + (i % 3) * 0.3;
        const py = CHAR_Y_BASE - ((celebFrame * speed + seed) % 120);
        const size = 2 + (i % 2);
        ctx.fillStyle = confettiColors[i % confettiColors.length];
        ctx.globalAlpha = Math.max(0, 1 - ((celebFrame * speed + seed) % 120) / 120);
        ctx.fillRect(px, py, size, size);
      }
      ctx.globalAlpha = 1;
    } else {
      const charFrame = arrivedRef.current ? 0 : (isGroundedRef.current ? walkFrame : 1);
      // Blink character when invincible (visible every other 6 frames)
      const showChar = invincibleRef.current === 0 || Math.floor(frameRef.current / 6) % 2 === 0;
      if (isTwoPlayers) {
        // Girl jumps together with the boy
        const girlY = CHAR_Y_BASE + jumpOffsetRef.current;
        const girlFrame = arrivedRef.current ? 0 : (isGroundedRef.current ? walkFrame : 1);
        drawGirlCharacter(ctx, CHAR_X - 16 * SCALE, girlY, girlFrame, SCALE);
      }
      if (showChar) {
        drawCharacter(ctx, CHAR_X, charY, charFrame, SCALE);
      }
    }

    // Lives display (top-right)
    ctx.font = '14px "Press Start 2P", cursive';
    ctx.fillStyle = '#e67e22';
    ctx.fillText('\u2666 ' + livesRef.current, CANVAS_W - 200, 30);

    // Score display (total across all stages + current stage)
    const displayScore = totalHearts + scoreRef.current;
    if (displayScore > 0) {
      ctx.font = '14px "Press Start 2P", cursive';
      ctx.fillStyle = '#ff6b9d';
      ctx.fillText('\u2764 ' + displayScore, CANVAS_W - 100, 30);
    }

    // Check arrival
    if (!arrivedRef.current && buildingScreenX <= CHAR_X + 60) {
      arrivedRef.current = true;
      setArrived(true);
      onArrive({ hearts: scoreRef.current, lives: livesRef.current });
    }

    animRef.current = requestAnimationFrame(gameLoop);
  }, [onArrive]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [gameLoop]);

  return (
    <div className="game-canvas-container">
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          border: '3px solid #ff6b9d',
          boxShadow: '0 0 30px rgba(255, 107, 157, 0.2)',
        }}
      />
    </div>
  );
}
