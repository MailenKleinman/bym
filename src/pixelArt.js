// Pixel art drawing helpers — all visuals are drawn procedurally on canvas

const SCALE = 3; // each "pixel" is 3×3 screen pixels

function px(ctx, x, y, color, s = SCALE) {
  ctx.fillStyle = color;
  ctx.fillRect(x * s, y * s, s, s);
}

// ── Character (boy) sprite ──────────────────────────────────
// A small 16×24 pixel-art boy with a walk cycle

const SKIN = '#f5cba7';
const HAIR = '#4a2c0a';
const SHIRT = '#3498db';
const PANTS = '#2c3e50';
const SHOES = '#1a1a2e';
const EYE = '#1a1a2e';
const BLUSH = '#ff6b9d';

export function drawCharacter(ctx, x, y, frame = 0, scale = SCALE) {
  const s = scale;
  const p = (px_x, px_y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x + px_x * s, y + px_y * s, s, s);
  };

  // Hair (top)
  for (let i = 3; i <= 11; i++) p(i, 0, HAIR);
  for (let i = 2; i <= 12; i++) p(i, 1, HAIR);
  for (let i = 2; i <= 12; i++) p(i, 2, HAIR);

  // Face
  for (let i = 3; i <= 11; i++) p(i, 3, SKIN);
  for (let i = 3; i <= 11; i++) p(i, 4, SKIN);
  // Hair sides
  p(2, 3, HAIR); p(2, 4, HAIR);
  p(12, 3, HAIR); p(12, 4, HAIR);

  // Eyes
  for (let i = 3; i <= 11; i++) p(i, 5, SKIN);
  p(5, 5, EYE); p(6, 5, EYE);
  p(9, 5, EYE); p(10, 5, EYE);

  // Blush & mouth
  for (let i = 3; i <= 11; i++) p(i, 6, SKIN);
  p(4, 6, BLUSH); p(10, 6, BLUSH);
  for (let i = 3; i <= 11; i++) p(i, 7, SKIN);
  p(6, 7, '#c0392b'); p(7, 7, '#c0392b'); p(8, 7, '#c0392b');

  // Neck
  for (let i = 5; i <= 9; i++) p(i, 8, SKIN);

  // Shirt body
  for (let r = 9; r <= 14; r++) {
    for (let i = 2; i <= 12; i++) p(i, r, SHIRT);
  }
  // Shirt collar accent
  p(5, 9, '#2980b9'); p(6, 9, '#2980b9'); p(8, 9, '#2980b9'); p(9, 9, '#2980b9');

  // Arms
  const armOffset = frame % 2 === 0 ? 0 : 1;
  for (let r = 9; r <= 13; r++) {
    p(1, r + (r % 2 === 0 ? armOffset : 0), SHIRT);
    p(0, r + (r % 2 === 0 ? armOffset : 0), SKIN);
    p(13, r + (r % 2 === 0 ? -armOffset : 0), SHIRT);
    p(14, r + (r % 2 === 0 ? -armOffset : 0), SKIN);
  }

  // Pants
  for (let r = 15; r <= 18; r++) {
    for (let i = 3; i <= 11; i++) p(i, r, PANTS);
  }
  // Pants gap
  p(7, 17, '#1a1a2e'); p(7, 18, '#1a1a2e');

  // Legs / walk animation
  const walkFrame = frame % 4;
  if (walkFrame === 0 || walkFrame === 2) {
    // Standing / mid-stride
    for (let i = 4; i <= 6; i++) { p(i, 19, PANTS); p(i, 20, SHOES); }
    for (let i = 8; i <= 10; i++) { p(i, 19, PANTS); p(i, 20, SHOES); }
  } else if (walkFrame === 1) {
    // Left leg forward
    for (let i = 3; i <= 5; i++) { p(i, 19, PANTS); p(i, 20, SHOES); }
    for (let i = 9; i <= 11; i++) { p(i, 19, PANTS); p(i, 20, SHOES); }
  } else {
    // Right leg forward
    for (let i = 5; i <= 7; i++) { p(i, 19, PANTS); p(i, 20, SHOES); }
    for (let i = 7; i <= 9; i++) { p(i, 19, PANTS); p(i, 20, SHOES); }
  }
}

// ── Shop / Store building ──────────────────────────────────
export function drawShop(ctx, x, y, scale = SCALE) {
  const s = scale;
  const p = (px_x, px_y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x + px_x * s, y + px_y * s, s, s);
  };

  const WALL = '#d4a574';
  const WALL_DARK = '#b8956a';
  const ROOF = '#c0392b';
  const ROOF_DARK = '#96281b';
  const WINDOW = '#85c1e9';
  const WINDOW_FRAME = '#5d4037';
  const DOOR = '#6d4c41';
  const DOOR_DARK = '#4e342e';
  const SIGN_BG = '#f8c291';
  const AWNING = '#e74c3c';
  const AWNING_STRIPE = '#fff';

  // Roof (triangle-ish)
  for (let r = 0; r <= 2; r++) {
    for (let i = 4 - r; i <= 35 + r; i++) {
      p(i, r, r === 0 ? ROOF_DARK : ROOF);
    }
  }
  for (let i = 1; i <= 38; i++) p(i, 3, ROOF);
  for (let i = 0; i <= 39; i++) p(i, 4, ROOF_DARK);

  // Main wall
  for (let r = 5; r <= 34; r++) {
    for (let i = 0; i <= 39; i++) {
      p(i, r, (r + i) % 8 === 0 ? WALL_DARK : WALL);
    }
  }

  // Sign background (bigger: rows -9 to -1)
  for (let r = -9; r <= -1; r++) {
    for (let i = 4; i <= 35; i++) {
      p(i, r, '#1a1a2e');
    }
  }
  // Sign border (neon frame — light blue)
  for (let i = 4; i <= 35; i++) { p(i, -10, '#5dade2'); p(i, 0, '#5dade2'); }
  for (let r = -10; r <= 0; r++) { p(4, r, '#5dade2'); p(35, r, '#5dade2'); }
  // Sign posts connecting to roof
  for (let r = -10; r <= 0; r++) { p(12, r, '#5d6d7e'); p(27, r, '#5d6d7e'); }

  // Neon glow behind letters
  ctx.fillStyle = 'rgba(93, 173, 226, 0.1)';
  ctx.fillRect(x + 4 * s, y - 10 * s, 32 * s, 10 * s);

  // ── Pixel letters: V R N (bigger — 7 rows tall) ──
  const NEON = '#5dade2';
  const NEON_BRIGHT = '#aed6f1';

  // Letter V (cols 7-14, rows -8 to -2)
  p(7, -8, NEON_BRIGHT); p(8, -8, NEON); p(9, -8, NEON);
  p(12, -8, NEON); p(13, -8, NEON); p(14, -8, NEON_BRIGHT);
  p(7, -7, NEON); p(8, -7, NEON); p(9, -7, NEON);
  p(12, -7, NEON); p(13, -7, NEON); p(14, -7, NEON);
  p(8, -6, NEON); p(9, -6, NEON); p(10, -6, NEON);
  p(11, -6, NEON); p(12, -6, NEON); p(13, -6, NEON);
  p(9, -5, NEON); p(10, -5, NEON_BRIGHT);
  p(11, -5, NEON_BRIGHT); p(12, -5, NEON);
  p(9, -4, NEON); p(10, -4, NEON); p(11, -4, NEON); p(12, -4, NEON);
  p(10, -3, NEON_BRIGHT); p(11, -3, NEON_BRIGHT);
  p(10, -2, NEON); p(11, -2, NEON);

  // Letter R (cols 16-23, rows -8 to -2)
  p(16, -8, NEON_BRIGHT); p(17, -8, NEON); p(18, -8, NEON); p(19, -8, NEON); p(20, -8, NEON); p(21, -8, NEON); p(22, -8, NEON_BRIGHT);
  p(16, -7, NEON); p(17, -7, NEON); p(22, -7, NEON); p(23, -7, NEON);
  p(16, -6, NEON); p(17, -6, NEON); p(22, -6, NEON); p(23, -6, NEON);
  p(16, -5, NEON_BRIGHT); p(17, -5, NEON); p(18, -5, NEON); p(19, -5, NEON); p(20, -5, NEON); p(21, -5, NEON); p(22, -5, NEON_BRIGHT);
  p(16, -4, NEON); p(17, -4, NEON); p(20, -4, NEON); p(21, -4, NEON);
  p(16, -3, NEON); p(17, -3, NEON); p(21, -3, NEON); p(22, -3, NEON);
  p(16, -2, NEON); p(17, -2, NEON); p(22, -2, NEON); p(23, -2, NEON);

  // Letter N (cols 25-33, rows -8 to -2)
  p(25, -8, NEON_BRIGHT); p(26, -8, NEON); p(32, -8, NEON); p(33, -8, NEON_BRIGHT);
  p(25, -7, NEON); p(26, -7, NEON); p(27, -7, NEON_BRIGHT); p(32, -7, NEON); p(33, -7, NEON);
  p(25, -6, NEON); p(26, -6, NEON); p(27, -6, NEON); p(28, -6, NEON_BRIGHT); p(32, -6, NEON); p(33, -6, NEON);
  p(25, -5, NEON); p(26, -5, NEON); p(28, -5, NEON); p(29, -5, NEON_BRIGHT); p(32, -5, NEON); p(33, -5, NEON);
  p(25, -4, NEON); p(26, -4, NEON); p(29, -4, NEON); p(30, -4, NEON_BRIGHT); p(32, -4, NEON); p(33, -4, NEON);
  p(25, -3, NEON); p(26, -3, NEON); p(30, -3, NEON); p(31, -3, NEON_BRIGHT); p(32, -3, NEON); p(33, -3, NEON);
  p(25, -2, NEON); p(26, -2, NEON_BRIGHT); p(31, -2, NEON); p(32, -2, NEON_BRIGHT); p(33, -2, NEON);

  // Outer neon glow
  ctx.shadowColor = '#5dade2';
  ctx.shadowBlur = 20;
  ctx.fillStyle = 'rgba(93, 173, 226, 0)';
  ctx.fillRect(x + 4 * s, y - 10 * s, 32 * s, 10 * s);
  ctx.shadowBlur = 0;

  // Awning
  for (let r = 11; r <= 13; r++) {
    for (let i = 0; i <= 39; i++) {
      p(i, r, (i % 4 < 2) ? AWNING : AWNING_STRIPE);
    }
  }
  // Awning bottom edge (scalloped)
  for (let i = 0; i <= 39; i++) {
    if (i % 4 < 2) p(i, 14, AWNING);
  }

  // Windows (left)
  for (let r = 16; r <= 23; r++) {
    for (let i = 3; i <= 10; i++) {
      p(i, r, WINDOW);
    }
  }
  // Window frame
  for (let i = 3; i <= 10; i++) { p(i, 16, WINDOW_FRAME); p(i, 23, WINDOW_FRAME); }
  for (let r = 16; r <= 23; r++) { p(3, r, WINDOW_FRAME); p(10, r, WINDOW_FRAME); p(6, r, WINDOW_FRAME); p(7, r, WINDOW_FRAME); }
  for (let i = 3; i <= 10; i++) p(i, 19, WINDOW_FRAME);

  // Windows (right)
  for (let r = 16; r <= 23; r++) {
    for (let i = 29; i <= 36; i++) {
      p(i, r, WINDOW);
    }
  }
  for (let i = 29; i <= 36; i++) { p(i, 16, WINDOW_FRAME); p(i, 23, WINDOW_FRAME); }
  for (let r = 16; r <= 23; r++) { p(29, r, WINDOW_FRAME); p(36, r, WINDOW_FRAME); p(32, r, WINDOW_FRAME); p(33, r, WINDOW_FRAME); }
  for (let i = 29; i <= 36; i++) p(i, 19, WINDOW_FRAME);

  // Door (center)
  for (let r = 20; r <= 34; r++) {
    for (let i = 16; i <= 23; i++) {
      p(i, r, DOOR);
    }
  }
  // Door frame
  for (let r = 20; r <= 34; r++) { p(16, r, DOOR_DARK); p(23, r, DOOR_DARK); }
  for (let i = 16; i <= 23; i++) p(i, 20, DOOR_DARK);
  // Door split
  for (let r = 20; r <= 34; r++) { p(19, r, DOOR_DARK); p(20, r, DOOR_DARK); }
  // Door knobs
  p(18, 27, '#f1c40f');
  p(21, 27, '#f1c40f');

  // Ground line
  for (let i = 0; i <= 39; i++) p(i, 35, '#5d4037');
}

// ── Brewery Bar building ────────────────────────────────────
export function drawBar(ctx, x, y, scale = SCALE) {
  const s = scale;
  const p = (px_x, px_y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x + px_x * s, y + px_y * s, s, s);
  };

  const BRICK = '#8b4513';
  const BRICK_DARK = '#6b3410';
  const ROOF = '#2c2c2c';
  const ROOF_LIGHT = '#3d3d3d';
  const WINDOW = '#f9e79f';
  const WINDOW_FRAME = '#3e2723';
  const DOOR = '#4e342e';
  const DOOR_DARK = '#3e2723';
  const WOOD = '#a0522d';
  const WOOD_DARK = '#7a3b10';

  // Flat roof
  for (let i = 0; i <= 44; i++) { p(i, 0, ROOF); p(i, 1, ROOF_LIGHT); }
  for (let i = -1; i <= 45; i++) p(i, 2, ROOF);

  // Brick wall
  for (let r = 3; r <= 34; r++) {
    for (let i = 0; i <= 44; i++) {
      // Brick pattern
      const brickRow = Math.floor(r / 2);
      const offset = brickRow % 2 === 0 ? 0 : 3;
      const inGap = (i + offset) % 6 === 0 || r % 2 === 0 && (r % 4 === 0);
      p(i, r, inGap ? BRICK_DARK : BRICK);
    }
  }

  // Big front window (left) — warm glow
  for (let r = 10; r <= 24; r++) {
    for (let i = 3; i <= 14; i++) {
      p(i, r, WINDOW);
    }
  }
  // Window frame
  for (let i = 3; i <= 14; i++) { p(i, 10, WINDOW_FRAME); p(i, 24, WINDOW_FRAME); }
  for (let r = 10; r <= 24; r++) { p(3, r, WINDOW_FRAME); p(14, r, WINDOW_FRAME); p(8, r, WINDOW_FRAME); p(9, r, WINDOW_FRAME); }
  for (let i = 3; i <= 14; i++) p(i, 17, WINDOW_FRAME);
  // Window warm glow effect
  ctx.fillStyle = 'rgba(249, 231, 159, 0.06)';
  ctx.fillRect(x + 3 * s, y + 24 * s, 12 * s, 12 * s);

  // Big front window (right) — warm glow
  for (let r = 10; r <= 24; r++) {
    for (let i = 30; i <= 41; i++) {
      p(i, r, WINDOW);
    }
  }
  for (let i = 30; i <= 41; i++) { p(i, 10, WINDOW_FRAME); p(i, 24, WINDOW_FRAME); }
  for (let r = 10; r <= 24; r++) { p(30, r, WINDOW_FRAME); p(41, r, WINDOW_FRAME); p(35, r, WINDOW_FRAME); p(36, r, WINDOW_FRAME); }
  for (let i = 30; i <= 41; i++) p(i, 17, WINDOW_FRAME);
  ctx.fillStyle = 'rgba(249, 231, 159, 0.06)';
  ctx.fillRect(x + 30 * s, y + 24 * s, 12 * s, 12 * s);

  // Door (center, arched top)
  for (let r = 16; r <= 34; r++) {
    for (let i = 18; i <= 26; i++) {
      p(i, r, DOOR);
    }
  }
  // Arch top
  for (let i = 19; i <= 25; i++) p(i, 15, DOOR);
  for (let i = 20; i <= 24; i++) p(i, 14, DOOR);
  // Door frame
  for (let r = 14; r <= 34; r++) { p(17, r, DOOR_DARK); p(27, r, DOOR_DARK); }
  for (let i = 18; i <= 26; i++) p(i, 16, DOOR_DARK);
  // Door handle
  p(25, 25, '#f1c40f'); p(25, 26, '#f1c40f');

  // Wooden sign board above door — "BAR"
  for (let r = 4; r <= 8; r++) {
    for (let i = 14; i <= 30; i++) {
      p(i, r, WOOD);
    }
  }
  // Sign border
  for (let i = 14; i <= 30; i++) { p(i, 4, WOOD_DARK); p(i, 8, WOOD_DARK); }
  for (let r = 4; r <= 8; r++) { p(14, r, WOOD_DARK); p(30, r, WOOD_DARK); }

  // Neon "BAR" text on the sign
  const N = '#f9e79f';
  const NB = '#fff';
  // B
  p(16, 5, NB); p(17, 5, N); p(18, 5, N); p(19, 5, N);
  p(16, 6, N); p(19, 6, N);
  p(16, 6, NB); p(17, 6, N); p(18, 6, N); p(19, 6, N);
  p(16, 7, N); p(19, 7, N);
  // A
  p(21, 5, N); p(22, 5, NB); p(23, 5, N);
  p(21, 6, N); p(23, 6, N);
  p(21, 6, N); p(22, 6, NB); p(23, 6, N);
  p(21, 7, N); p(23, 7, N);
  // R
  p(25, 5, NB); p(26, 5, N); p(27, 5, N); p(28, 5, N);
  p(25, 6, N); p(28, 6, N);
  p(25, 6, NB); p(26, 6, N); p(27, 6, N);
  p(25, 7, N); p(27, 7, N); p(28, 7, N);

  // Sign glow
  ctx.shadowColor = '#f9e79f';
  ctx.shadowBlur = 12;
  ctx.fillStyle = 'rgba(249, 231, 159, 0)';
  ctx.fillRect(x + 14 * s, y + 4 * s, 17 * s, 5 * s);
  ctx.shadowBlur = 0;

  // Beer mug decoration (left of door)
  const MUG = '#f0c040';
  const FOAM = '#fff';
  p(4, 27, FOAM); p(5, 27, FOAM); p(6, 27, FOAM);
  p(4, 28, MUG); p(5, 28, MUG); p(6, 28, MUG); p(7, 28, MUG);
  p(4, 29, MUG); p(5, 29, MUG); p(6, 29, MUG); p(7, 29, BRICK);
  p(4, 30, MUG); p(5, 30, MUG); p(6, 30, MUG); p(7, 30, MUG);
  p(8, 28, '#d4a017'); p(8, 29, '#d4a017');

  // Ground line
  for (let i = -1; i <= 45; i++) p(i, 35, '#3e2723');
}

// ── Airplane ────────────────────────────────────────────────
export function drawAirplane(ctx, x, y, scale = SCALE) {
  const s = scale;
  const p = (px_x, px_y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x + px_x * s, y + px_y * s, s, s);
  };

  const BODY = '#ecf0f1';
  const BODY_SHADE = '#bdc3c7';
  const WING = '#95a5a6';
  const WING_DARK = '#7f8c8d';
  const TAIL = '#3498db';
  const TAIL_DARK = '#2980b9';
  const WINDOW_C = '#5dade2';
  const NOSE = '#bdc3c7';
  const ENGINE = '#7f8c8d';
  const RED = '#e74c3c';

  // ── Tail fin (vertical) ──
  for (let i = 0; i <= 3; i++) p(i, 5, TAIL_DARK);
  for (let i = 1; i <= 4; i++) p(i, 6, TAIL);
  for (let i = 2; i <= 5; i++) p(i, 7, TAIL);
  for (let i = 3; i <= 6; i++) p(i, 8, TAIL);
  for (let i = 3; i <= 6; i++) p(i, 9, TAIL_DARK);
  // Red stripe on tail
  p(1, 5, RED); p(2, 6, RED); p(3, 7, RED); p(4, 8, RED);

  // ── Fuselage (main body) ──
  // Top
  for (let i = 5; i <= 38; i++) p(i, 10, BODY_SHADE);
  // Body rows
  for (let r = 11; r <= 16; r++) {
    for (let i = 4; i <= 40; i++) {
      p(i, r, r <= 12 ? BODY : BODY_SHADE);
    }
  }
  // Bottom
  for (let i = 5; i <= 39; i++) p(i, 17, BODY_SHADE);

  // Red stripe along fuselage
  for (let i = 6; i <= 39; i++) p(i, 14, RED);

  // ── Nose (rounded front) ──
  for (let r = 11; r <= 16; r++) p(41, r, NOSE);
  for (let r = 12; r <= 15; r++) p(42, r, NOSE);
  for (let r = 12; r <= 15; r++) p(43, r, BODY_SHADE);
  for (let r = 13; r <= 14; r++) p(44, r, BODY_SHADE);

  // ── Windows ──
  for (let i = 10; i <= 36; i += 3) {
    p(i, 12, WINDOW_C); p(i + 1, 12, WINDOW_C);
  }

  // ── Cockpit window ──
  p(39, 11, WINDOW_C); p(40, 11, WINDOW_C); p(41, 11, WINDOW_C);
  p(39, 12, WINDOW_C); p(40, 12, WINDOW_C);

  // ── Wings ──
  // Top wing
  for (let i = 14; i <= 30; i++) p(i, 8, WING);
  for (let i = 13; i <= 31; i++) p(i, 9, WING_DARK);
  for (let i = 15; i <= 29; i++) p(i, 7, WING);
  // Bottom wing
  for (let i = 15; i <= 29; i++) p(i, 19, WING);
  for (let i = 14; i <= 30; i++) p(i, 18, WING_DARK);
  for (let i = 16; i <= 28; i++) p(i, 20, WING);

  // ── Engines (under wings) ──
  for (let r = 19; r <= 22; r++) {
    p(17, r, ENGINE); p(18, r, ENGINE); p(19, r, ENGINE);
    p(25, r, ENGINE); p(26, r, ENGINE); p(27, r, ENGINE);
  }
  // Engine intake
  p(17, 19, BODY_SHADE); p(18, 19, BODY_SHADE); p(19, 19, BODY_SHADE);
  p(25, 19, BODY_SHADE); p(26, 19, BODY_SHADE); p(27, 19, BODY_SHADE);

  // ── Tail horizontal stabilizers ──
  for (let i = 0; i <= 8; i++) { p(i, 10, WING); p(i, 17, WING); }

  // ── Landing gear ──
  p(15, 21, '#5d6d7e'); p(15, 22, '#5d6d7e'); p(14, 23, '#5d6d7e'); p(15, 23, '#5d6d7e'); p(16, 23, '#5d6d7e');
  p(33, 21, '#5d6d7e'); p(33, 22, '#5d6d7e'); p(32, 23, '#5d6d7e'); p(33, 23, '#5d6d7e'); p(34, 23, '#5d6d7e');

  // Ground / tarmac line
  for (let i = -2; i <= 46; i++) p(i, 35, '#5d4037');
}

// ── Red Brick House (two stories) ───────────────────────────
export function drawHouse(ctx, x, y, scale = SCALE) {
  const s = scale;
  const p = (px_x, px_y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x + px_x * s, y + px_y * s, s, s);
  };

  const BRICK = '#b03a2e';
  const BRICK_DARK = '#922b21';
  const TRIM = '#f7f9f9';
  const TRIM_SHADE = '#d5d8dc';
  const ROOF_COL = '#1c1c1c';
  const ROOF_LIGHT = '#2d2d2d';
  const WINDOW_COL = '#85c1e9';
  const WINDOW_DARK = '#5dade2';
  const DOOR_COL = '#4e342e';
  const DOOR_DARK = '#3e2723';

  // Layout: roof -20 to -11, 2nd floor -10 to 11, 1st floor 12 to 34, ground 35
  // Total visible height ~55 rows

  // ── Chimney ──
  for (let r = -27; r <= -18; r++) {
    p(6, r, BRICK); p(7, r, BRICK); p(8, r, BRICK_DARK); p(9, r, BRICK);
  }
  for (let i = 5; i <= 10; i++) p(i, -27, ROOF_COL);
  for (let i = 5; i <= 10; i++) p(i, -28, TRIM);

  // ── Roof (triangle) ──
  for (let r = 0; r <= 8; r++) {
    const left = 20 - r * 2.5;
    const right = 20 + r * 2.5;
    for (let i = Math.ceil(left); i <= Math.floor(right); i++) {
      p(i, r - 20, r % 2 === 0 ? ROOF_COL : ROOF_LIGHT);
    }
  }
  // Roof base
  for (let i = -1; i <= 41; i++) p(i, -11, ROOF_COL);
  for (let i = -1; i <= 41; i++) p(i, -10, TRIM);

  // ── Second floor walls ──
  for (let r = -9; r <= 11; r++) {
    for (let i = 0; i <= 39; i++) {
      const brickRow = Math.floor((r + 20) / 2);
      const offset = brickRow % 2 === 0 ? 0 : 3;
      const inGap = (i + offset) % 6 === 0;
      p(i, r, inGap ? BRICK_DARK : BRICK);
    }
  }
  // White trim corners (2nd floor)
  for (let r = -9; r <= 11; r++) {
    p(0, r, TRIM); p(1, r, TRIM_SHADE);
    p(38, r, TRIM_SHADE); p(39, r, TRIM);
  }

  // ── Floor divider (white trim band) ──
  for (let i = -1; i <= 41; i++) { p(i, 11, TRIM); p(i, 12, TRIM_SHADE); }

  // ── First floor walls ──
  for (let r = 13; r <= 34; r++) {
    for (let i = 0; i <= 39; i++) {
      const brickRow = Math.floor(r / 2);
      const offset = brickRow % 2 === 0 ? 0 : 3;
      const inGap = (i + offset) % 6 === 0;
      p(i, r, inGap ? BRICK_DARK : BRICK);
    }
  }
  // White trim corners (1st floor)
  for (let r = 13; r <= 34; r++) {
    p(0, r, TRIM); p(1, r, TRIM_SHADE);
    p(38, r, TRIM_SHADE); p(39, r, TRIM);
  }

  // ── Helper: draw a window with cross frame ──
  const drawWindow = (wx, wy) => {
    // Frame
    for (let i = wx; i <= wx + 8; i++) { p(i, wy, TRIM); p(i, wy + 9, TRIM); }
    for (let r = wy; r <= wy + 9; r++) { p(wx, r, TRIM); p(wx + 8, r, TRIM); }
    // Sill
    for (let i = wx - 1; i <= wx + 9; i++) p(i, wy + 10, TRIM);
    // Glass
    for (let r = wy + 1; r <= wy + 8; r++) {
      for (let i = wx + 1; i <= wx + 7; i++) {
        p(i, r, r < wy + 5 ? WINDOW_COL : WINDOW_DARK);
      }
    }
    // Cross
    for (let r = wy + 1; r <= wy + 8; r++) p(wx + 4, r, TRIM);
    for (let i = wx + 1; i <= wx + 7; i++) p(i, wy + 4, TRIM);
  };

  // ── 2nd floor windows (3 windows) ──
  drawWindow(4, -7);
  drawWindow(16, -7);
  drawWindow(28, -7);

  // ── 1st floor windows (left and right of door) ──
  drawWindow(4, 15);
  drawWindow(28, 15);

  // ── Door (center, 1st floor) ──
  for (let i = 16; i <= 23; i++) p(i, 20, TRIM);
  for (let r = 20; r <= 34; r++) { p(16, r, TRIM); p(23, r, TRIM); }
  for (let r = 21; r <= 34; r++) {
    for (let i = 17; i <= 22; i++) {
      p(i, r, DOOR_COL);
    }
  }
  // Door panels
  for (let r = 22; r <= 26; r++) {
    for (let i = 18; i <= 21; i++) p(i, r, DOOR_DARK);
  }
  for (let r = 28; r <= 33; r++) {
    for (let i = 18; i <= 21; i++) p(i, r, DOOR_DARK);
  }
  // Door knob
  p(21, 28, '#f1c40f');
  // Doorstep
  for (let i = 15; i <= 24; i++) p(i, 35, TRIM);

  // ── Welcome mat ──
  for (let i = 17; i <= 22; i++) p(i, 35, '#c0392b');

  // Ground line
  for (let i = -1; i <= 41; i++) p(i, 35, '#5d4037');
}

// ── Motorcycle ──────────────────────────────────────────────
export function drawMotorcycle(ctx, x, y, scale = SCALE) {
  const s = scale;
  const p = (px_x, px_y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x + px_x * s, y + px_y * s, s, s);
  };

  const TIRE = '#1c1c1c';
  const TIRE_INNER = '#2d2d2d';
  const RIM = '#bdc3c7';
  const SPOKE = '#95a5a6';
  const FRAME = '#5d6d7e';
  const FRAME_L = '#7f8c8d';
  const BODY = '#e74c3c';
  const BODY_D = '#c0392b';
  const SEAT = '#2c3e50';
  const SEAT_L = '#34495e';
  const ENGINE = '#7f8c8d';
  const ENGINE_D = '#5d6d7e';
  const CHROME = '#ecf0f1';
  const CHROME_D = '#bdc3c7';
  const LIGHT = '#f9e79f';

  // ── Back wheel (center at 8, 28) ──
  const bx = 8, by = 28;
  // Outer tire
  const tireR = 5;
  for (let dy = -tireR; dy <= tireR; dy++) {
    for (let dx = -tireR; dx <= tireR; dx++) {
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= tireR && dist >= tireR - 1.2) p(bx + dx, by + dy, TIRE);
      else if (dist <= tireR - 1.2 && dist >= tireR - 2) p(bx + dx, by + dy, TIRE_INNER);
    }
  }
  // Rim
  p(bx, by, RIM); p(bx - 1, by, RIM); p(bx + 1, by, RIM);
  p(bx, by - 1, RIM); p(bx, by + 1, RIM);
  // Spokes
  p(bx - 2, by - 2, SPOKE); p(bx + 2, by - 2, SPOKE);
  p(bx - 2, by + 2, SPOKE); p(bx + 2, by + 2, SPOKE);
  p(bx - 3, by, SPOKE); p(bx + 3, by, SPOKE);
  p(bx, by - 3, SPOKE); p(bx, by + 3, SPOKE);

  // ── Front wheel (center at 30, 28) ──
  const fx = 30, fy = 28;
  for (let dy = -tireR; dy <= tireR; dy++) {
    for (let dx = -tireR; dx <= tireR; dx++) {
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= tireR && dist >= tireR - 1.2) p(fx + dx, fy + dy, TIRE);
      else if (dist <= tireR - 1.2 && dist >= tireR - 2) p(fx + dx, fy + dy, TIRE_INNER);
    }
  }
  p(fx, fy, RIM); p(fx - 1, fy, RIM); p(fx + 1, fy, RIM);
  p(fx, fy - 1, RIM); p(fx, fy + 1, RIM);
  p(fx - 2, fy - 2, SPOKE); p(fx + 2, fy - 2, SPOKE);
  p(fx - 2, fy + 2, SPOKE); p(fx + 2, fy + 2, SPOKE);
  p(fx - 3, fy, SPOKE); p(fx + 3, fy, SPOKE);
  p(fx, fy - 3, SPOKE); p(fx, fy + 3, SPOKE);

  // ── Frame ──
  // Main tube (back wheel hub to top)
  for (let r = 20; r <= 27; r++) { p(10, r, FRAME); p(11, r, FRAME_L); }
  // Top tube
  for (let i = 11; i <= 26; i++) { p(i, 19, FRAME); p(i, 20, FRAME_L); }
  // Down tube (to front)
  p(24, 21, FRAME); p(25, 21, FRAME_L);
  p(26, 22, FRAME); p(27, 22, FRAME_L);
  p(28, 23, FRAME); p(29, 23, FRAME_L);

  // ── Engine ──
  for (let r = 22; r <= 26; r++) {
    for (let i = 13; i <= 21; i++) {
      p(i, r, (i + r) % 3 === 0 ? ENGINE_D : ENGINE);
    }
  }
  // Cylinder fins
  for (let i = 14; i <= 20; i += 2) { p(i, 22, CHROME_D); p(i, 24, CHROME_D); }
  // Exhaust pipes
  for (let i = 8; i <= 14; i++) { p(i, 27, CHROME); p(i, 28, CHROME_D); }
  for (let i = 5; i <= 8; i++) p(i, 27, CHROME);
  p(5, 26, CHROME); p(4, 26, CHROME);

  // ── Gas tank (red) ──
  for (let r = 17; r <= 20; r++) {
    for (let i = 13; i <= 22; i++) {
      p(i, r, r <= 18 ? BODY : BODY_D);
    }
  }
  // Tank stripe
  for (let i = 14; i <= 21; i++) p(i, 18, '#fff');
  // Tank cap
  p(17, 17, CHROME); p(18, 17, CHROME);

  // ── Seat ──
  for (let i = 8; i <= 15; i++) { p(i, 17, SEAT_L); p(i, 18, SEAT); }
  for (let i = 6; i <= 9; i++) p(i, 17, SEAT);
  // Seat tail
  p(6, 16, BODY_D); p(7, 16, BODY); p(8, 16, BODY);

  // ── Rear fender ──
  for (let i = 5; i <= 11; i++) p(i, 22, BODY_D);
  for (let i = 4; i <= 10; i++) p(i, 23, BODY);

  // ── Tail light ──
  p(4, 22, '#e74c3c'); p(3, 22, '#ff6b6b');

  // ── Front fork ──
  p(29, 20, CHROME); p(29, 21, CHROME); p(30, 21, CHROME_D);
  p(30, 22, CHROME); p(30, 23, CHROME_D);
  p(29, 19, FRAME);

  // ── Front fender ──
  for (let i = 28; i <= 33; i++) p(i, 23, BODY);
  for (let i = 27; i <= 32; i++) p(i, 24, BODY_D);

  // ── Headlight ──
  p(32, 19, LIGHT); p(33, 19, LIGHT); p(34, 19, LIGHT);
  p(32, 20, LIGHT); p(33, 20, '#fff'); p(34, 20, LIGHT);
  p(33, 18, CHROME);
  // Headlight glow
  ctx.fillStyle = 'rgba(249, 231, 159, 0.08)';
  ctx.beginPath();
  ctx.arc(x + 33 * s, y + 19 * s, 12, 0, Math.PI * 2);
  ctx.fill();

  // ── Handlebars ──
  p(28, 17, FRAME); p(29, 16, FRAME); p(30, 15, FRAME);
  p(31, 16, FRAME); p(32, 17, FRAME);
  // Grips
  p(29, 15, '#2c3e50'); p(30, 14, '#2c3e50'); p(31, 15, '#2c3e50');
  // Mirror
  p(28, 15, CHROME); p(28, 14, CHROME); p(32, 15, CHROME); p(32, 14, CHROME);

  // ── Kickstand ──
  p(15, 29, FRAME); p(16, 30, FRAME); p(17, 31, FRAME);
  p(17, 32, FRAME); p(16, 32, FRAME);

  // Ground line
  for (let i = -2; i <= 40; i++) p(i, 35, '#5d4037');
}

// ── GoSharp Office Building (tall, 3 floors) ───────────────
export function drawGoSharp(ctx, x, y, scale = SCALE) {
  const s = scale;
  const p = (px_x, px_y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x + px_x * s, y + px_y * s, s, s);
  };

  const GLASS = '#2c3e50';
  const GLASS_L = '#34495e';
  const FRAME_C = '#ecf0f1';
  const FRAME_D = '#bdc3c7';
  const ACCENT = '#3498db';
  const ACCENT_D = '#2980b9';
  const WALL = '#ecf0f1';
  const WALL_D = '#d5d8dc';

  // Building extends from row -25 (roof) to row 35 (ground)
  // 3 floors: floor 3 (-23 to -10), floor 2 (-8 to 5), floor 1 (7 to 34)

  // ── Flat roof ──
  for (let i = -1; i <= 45; i++) p(i, -25, ACCENT_D);
  for (let i = -1; i <= 45; i++) p(i, -24, ACCENT);
  for (let i = -1; i <= 45; i++) p(i, -23, FRAME_D);

  // ── Full facade ──
  for (let r = -22; r <= 34; r++) {
    for (let i = 0; i <= 44; i++) {
      p(i, r, (i === 0 || i === 44) ? WALL_D : WALL);
    }
  }

  // Helper: draw a row of 3 glass windows
  const drawWindowRow = (startR) => {
    for (let col = 0; col < 3; col++) {
      const wx = 3 + col * 14;
      for (let r = startR; r <= startR + 8; r++) {
        for (let i = wx; i <= wx + 10; i++) {
          p(i, r, (r + i) % 4 === 0 ? GLASS_L : GLASS);
        }
      }
      for (let i = wx; i <= wx + 10; i++) { p(i, startR, FRAME_D); p(i, startR + 8, FRAME_D); }
      for (let r = startR; r <= startR + 8; r++) { p(wx, r, FRAME_D); p(wx + 10, r, FRAME_D); p(wx + 5, r, FRAME_C); }
    }
  };

  // ── Blue accent band (top of building) ──
  for (let r = -22; r <= -20; r++) {
    for (let i = 0; i <= 44; i++) p(i, r, ACCENT);
  }

  // ── Floor 3 windows ──
  drawWindowRow(-18);

  // ── Floor divider 3→2 ──
  for (let i = 0; i <= 44; i++) { p(i, -8, ACCENT_D); p(i, -7, ACCENT); }

  // ── Floor 2 windows ──
  drawWindowRow(-5);

  // ── Floor divider 2→1 ──
  for (let i = 0; i <= 44; i++) { p(i, 5, ACCENT_D); p(i, 6, ACCENT); }

  // ── Floor 1: windows left & right, door center ──
  // Left window
  for (let r = 9; r <= 17; r++) {
    for (let i = 3; i <= 13; i++) p(i, r, (r + i) % 4 === 0 ? GLASS_L : GLASS);
  }
  for (let i = 3; i <= 13; i++) { p(i, 9, FRAME_D); p(i, 17, FRAME_D); }
  for (let r = 9; r <= 17; r++) { p(3, r, FRAME_D); p(13, r, FRAME_D); p(8, r, FRAME_C); }

  // Right window
  for (let r = 9; r <= 17; r++) {
    for (let i = 31; i <= 41; i++) p(i, r, (r + i) % 4 === 0 ? GLASS_L : GLASS);
  }
  for (let i = 31; i <= 41; i++) { p(i, 9, FRAME_D); p(i, 17, FRAME_D); }
  for (let r = 9; r <= 17; r++) { p(31, r, FRAME_D); p(41, r, FRAME_D); p(36, r, FRAME_C); }

  // ── Glass door (center) ──
  for (let r = 20; r <= 34; r++) {
    for (let i = 17; i <= 27; i++) p(i, r, GLASS);
  }
  for (let r = 20; r <= 34; r++) { p(17, r, FRAME_C); p(27, r, FRAME_C); p(22, r, FRAME_C); }
  for (let i = 17; i <= 27; i++) p(i, 20, FRAME_C);
  p(21, 27, ACCENT); p(21, 28, ACCENT);
  p(23, 27, ACCENT); p(23, 28, ACCENT);

  // ── GoSharp sign (big, above roof) ──
  // Wider sign: cols -2 to 46, rows -35 to -27
  for (let r = -35; r <= -27; r++) {
    for (let i = -2; i <= 46; i++) p(i, r, '#1a1a2e');
  }
  // Sign border
  for (let i = -2; i <= 46; i++) { p(i, -36, ACCENT); p(i, -26, ACCENT); }
  for (let r = -36; r <= -26; r++) { p(-2, r, ACCENT); p(46, r, ACCENT); }
  // Sign posts
  for (let r = -26; r <= -25; r++) { p(10, r, '#5d6d7e'); p(34, r, '#5d6d7e'); }

  // Sign glow
  ctx.fillStyle = 'rgba(52, 152, 219, 0.1)';
  ctx.fillRect(x - 2 * s, y - 36 * s, 49 * s, 10 * s);

  // ── Neon "GoSharp" letters (6 rows: -34 to -29) ──
  // Each letter ~5 cols wide, 2 col gap between = 7 letters × 5 + 6 gaps × 2 = 47
  // Starting at col 0, fits in -2..46
  const N = '#3498db';
  const NB = '#85c1e9';

  // G (cols 1-5)
  p(2, -34, NB); p(3, -34, N); p(4, -34, N);
  p(1, -33, N); p(5, -33, N);
  p(1, -32, N);
  p(1, -31, N); p(3, -31, N); p(4, -31, NB); p(5, -31, N);
  p(1, -30, N); p(5, -30, N);
  p(2, -29, NB); p(3, -29, N); p(4, -29, N);

  // o (cols 7-11)
  p(8, -34, N); p(9, -34, NB); p(10, -34, N);
  p(7, -33, N); p(11, -33, N);
  p(7, -32, N); p(11, -32, N);
  p(7, -31, N); p(11, -31, N);
  p(7, -30, N); p(11, -30, N);
  p(8, -29, NB); p(9, -29, N); p(10, -29, N);

  // S (cols 13-17)
  p(14, -34, NB); p(15, -34, N); p(16, -34, N);
  p(13, -33, N);
  p(13, -32, N); p(14, -32, NB);
  p(15, -31, N); p(16, -31, NB);
  p(17, -30, N);
  p(13, -29, N); p(14, -29, N); p(15, -29, NB); p(16, -29, N);

  // h (cols 19-23)
  p(19, -34, NB); p(19, -33, N); p(19, -32, N);
  p(19, -31, NB); p(20, -31, N); p(21, -31, N); p(22, -31, N);
  p(19, -30, N); p(23, -30, N);
  p(19, -29, N); p(23, -29, NB);

  // a (cols 25-29)
  p(26, -34, N); p(27, -34, NB); p(28, -34, N);
  p(25, -33, N); p(29, -33, N);
  p(25, -32, N); p(26, -32, N); p(27, -32, NB); p(28, -32, N); p(29, -32, N);
  p(25, -31, N); p(29, -31, N);
  p(25, -30, N); p(29, -30, N);
  p(25, -29, N); p(29, -29, NB);

  // r (cols 31-35)
  p(31, -34, NB); p(32, -34, N); p(33, -34, N); p(34, -34, N);
  p(31, -33, N); p(35, -33, N);
  p(31, -32, N); p(35, -32, N);
  p(31, -31, NB); p(32, -31, N); p(33, -31, N); p(34, -31, N);
  p(31, -30, N); p(33, -30, N);
  p(31, -29, N); p(34, -29, N); p(35, -29, NB);

  // p (cols 37-41)
  p(37, -34, NB); p(38, -34, N); p(39, -34, N); p(40, -34, N);
  p(37, -33, N); p(41, -33, N);
  p(37, -32, N); p(41, -32, N);
  p(37, -31, NB); p(38, -31, N); p(39, -31, N); p(40, -31, N);
  p(37, -30, N);
  p(37, -29, NB);

  // Sign neon glow
  ctx.shadowColor = '#3498db';
  ctx.shadowBlur = 22;
  ctx.fillStyle = 'rgba(52, 152, 219, 0)';
  ctx.fillRect(x - 2 * s, y - 36 * s, 49 * s, 10 * s);
  ctx.shadowBlur = 0;

  // Ground line
  for (let i = -1; i <= 45; i++) p(i, 35, '#5d4037');
}

// ── Modern Building with Trees & Balcony ────────────────────
export function drawModernBuilding(ctx, x, y, scale = SCALE) {
  const s = scale;
  const p = (px_x, px_y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x + px_x * s, y + px_y * s, s, s);
  };

  const WALL = '#d5d8dc';
  const WALL_D = '#bdc3c7';
  const WALL_ACC = '#aeb6bf';
  const GLASS = '#2c3e50';
  const GLASS_L = '#34495e';
  const FRAME = '#ecf0f1';
  const FRAME_D = '#bdc3c7';
  const BALC = '#95a5a6';
  const BALC_D = '#7f8c8d';
  const RAIL = '#ecf0f1';
  const TRUNK = '#6d4c41';
  const LEAF = '#27ae60';
  const LEAF_D = '#1e8449';
  const LEAF_L = '#2ecc71';
  const DOOR = '#2c3e50';
  const ACCENT = '#e67e22';
  const ACCENT_D = '#d35400';

  // Building: rows -20 (roof) to 35 (ground), 2 floors

  // ── Flat roof ──
  for (let i = -1; i <= 43; i++) p(i, -20, ACCENT_D);
  for (let i = -1; i <= 43; i++) p(i, -19, ACCENT);

  // ── Upper floor walls (-18 to 6) ──
  for (let r = -18; r <= 6; r++) {
    for (let i = 0; i <= 42; i++) {
      p(i, r, (i === 0 || i === 42) ? WALL_D : WALL);
    }
  }

  // ── Floor divider / balcony floor (rows 7-8) ──
  for (let i = -2; i <= 44; i++) { p(i, 7, BALC_D); p(i, 8, BALC); }

  // ── Balcony railing ──
  for (let i = -2; i <= 44; i++) {
    if (i % 3 === 0) {
      p(i, 4, RAIL); p(i, 5, RAIL); p(i, 6, RAIL);
    }
  }
  // Railing top bar
  for (let i = -2; i <= 44; i++) p(i, 4, RAIL);
  // Railing bottom bar
  for (let i = -2; i <= 44; i++) p(i, 6, RAIL);

  // ── Lower floor walls (9 to 34) ──
  for (let r = 9; r <= 34; r++) {
    for (let i = 0; i <= 42; i++) {
      p(i, r, (i === 0 || i === 42) ? WALL_D : WALL);
    }
  }

  // ── Orange accent strip under balcony ──
  for (let i = 0; i <= 42; i++) p(i, 9, ACCENT);

  // Helper: draw window
  const drawWin = (wx, wy, ww, wh) => {
    for (let r = wy; r <= wy + wh; r++) {
      for (let i = wx; i <= wx + ww; i++) {
        p(i, r, (r + i) % 3 === 0 ? GLASS_L : GLASS);
      }
    }
    for (let i = wx; i <= wx + ww; i++) { p(i, wy, FRAME_D); p(i, wy + wh, FRAME_D); }
    for (let r = wy; r <= wy + wh; r++) { p(wx, r, FRAME_D); p(wx + ww, r, FRAME_D); }
  };

  // ── Upper floor: 3 tall windows ──
  drawWin(4, -16, 8, 14);
  drawWin(17, -16, 8, 14);
  drawWin(30, -16, 8, 14);
  // Window dividers (vertical)
  for (let r = -16; r <= -2; r++) { p(8, r, FRAME); p(21, r, FRAME); p(34, r, FRAME); }

  // ── Lower floor: 2 windows + door ──
  drawWin(4, 12, 8, 10);
  for (let r = 12; r <= 22; r++) p(8, r, FRAME);
  drawWin(30, 12, 8, 10);
  for (let r = 12; r <= 22; r++) p(34, r, FRAME);

  // ── Front door (center, modern) ──
  for (let r = 18; r <= 34; r++) {
    for (let i = 17; i <= 25; i++) p(i, r, DOOR);
  }
  for (let r = 18; r <= 34; r++) { p(17, r, FRAME); p(25, r, FRAME); p(21, r, FRAME); }
  for (let i = 17; i <= 25; i++) p(i, 18, FRAME);
  // Frosted glass panel on door
  for (let r = 19; r <= 26; r++) {
    p(18, r, GLASS_L); p(19, r, GLASS_L); p(20, r, GLASS_L);
    p(22, r, GLASS_L); p(23, r, GLASS_L); p(24, r, GLASS_L);
  }
  // Door handle
  p(20, 28, ACCENT); p(22, 28, ACCENT);
  // Door number
  p(20, 19, ACCENT); p(21, 19, ACCENT); p(22, 19, ACCENT);

  // ── Balcony plants (potted plants on balcony floor) ──
  // Pot 1 (left)
  p(3, 5, '#c0392b'); p(4, 5, '#c0392b'); p(5, 5, '#c0392b');
  p(3, 6, '#a93226'); p(4, 6, '#a93226'); p(5, 6, '#a93226');
  p(3, 3, LEAF); p(4, 2, LEAF_L); p(5, 3, LEAF);
  p(4, 3, LEAF_D); p(3, 2, LEAF_D); p(5, 2, LEAF);

  // Pot 2 (center-left)
  p(15, 5, '#c0392b'); p(16, 5, '#c0392b'); p(17, 5, '#c0392b');
  p(15, 6, '#a93226'); p(16, 6, '#a93226'); p(17, 6, '#a93226');
  p(15, 3, LEAF); p(16, 2, LEAF_L); p(17, 3, LEAF);
  p(16, 3, LEAF_D); p(14, 3, LEAF);

  // Pot 3 (center-right)
  p(25, 5, '#c0392b'); p(26, 5, '#c0392b'); p(27, 5, '#c0392b');
  p(25, 6, '#a93226'); p(26, 6, '#a93226'); p(27, 6, '#a93226');
  p(25, 3, LEAF); p(26, 2, LEAF_L); p(27, 3, LEAF);
  p(26, 3, LEAF_D); p(28, 3, LEAF);

  // Pot 4 (right)
  p(37, 5, '#c0392b'); p(38, 5, '#c0392b'); p(39, 5, '#c0392b');
  p(37, 6, '#a93226'); p(38, 6, '#a93226'); p(39, 6, '#a93226');
  p(37, 3, LEAF); p(38, 2, LEAF_L); p(39, 3, LEAF);
  p(38, 3, LEAF_D); p(37, 2, LEAF_D); p(39, 2, LEAF);

  // ── Trees flanking the entrance ──
  // Left tree
  // Trunk
  for (let r = 28; r <= 34; r++) { p(-3, r, TRUNK); p(-2, r, TRUNK); }
  // Canopy
  for (let dy = -4; dy <= 3; dy++) {
    for (let dx = -3; dx <= 3; dx++) {
      const dist = Math.abs(dx) + Math.abs(dy);
      if (dist <= 4) {
        const c = dist <= 2 ? LEAF_L : (dist <= 3 ? LEAF : LEAF_D);
        p(-2.5 + dx, 24 + dy, c);
      }
    }
  }

  // Right tree
  for (let r = 28; r <= 34; r++) { p(44, r, TRUNK); p(45, r, TRUNK); }
  for (let dy = -4; dy <= 3; dy++) {
    for (let dx = -3; dx <= 3; dx++) {
      const dist = Math.abs(dx) + Math.abs(dy);
      if (dist <= 4) {
        const c = dist <= 2 ? LEAF_L : (dist <= 3 ? LEAF : LEAF_D);
        p(44.5 + dx, 24 + dy, c);
      }
    }
  }

  // Ground line
  for (let i = -5; i <= 47; i++) p(i, 35, '#5d4037');
}

// ── Finish Flag ─────────────────────────────────────────────
export function drawFinishFlag(ctx, x, y, scale = SCALE) {
  const s = scale;
  const p = (px_x, px_y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x + px_x * s, y + px_y * s, s, s);
  };

  const POLE = '#bdc3c7';
  const POLE_D = '#95a5a6';

  // ── Pole ──
  for (let r = 0; r <= 35; r++) {
    p(20, r, POLE); p(21, r, POLE_D);
  }
  // Pole ball top
  p(19, -1, '#f1c40f'); p(20, -1, '#f1c40f'); p(21, -1, '#f1c40f'); p(22, -1, '#f1c40f');
  p(19, -2, '#f1c40f'); p(20, -2, '#f39c12'); p(21, -2, '#f39c12'); p(22, -2, '#f1c40f');
  p(20, -3, '#f1c40f'); p(21, -3, '#f1c40f');

  // ── Checkered flag ──
  const flagTop = 1;
  const flagH = 10;
  const flagW = 14;
  for (let r = 0; r < flagH; r++) {
    for (let i = 0; i < flagW; i++) {
      const isBlack = (Math.floor(r / 2) + Math.floor(i / 2)) % 2 === 0;
      p(22 + i, flagTop + r, isBlack ? '#1c1c1c' : '#ffffff');
    }
  }
  // Flag border
  for (let i = 0; i <= flagW; i++) { p(22 + i, flagTop, '#5d6d7e'); p(22 + i, flagTop + flagH, '#5d6d7e'); }
  for (let r = flagTop; r <= flagTop + flagH; r++) p(22 + flagW, r, '#5d6d7e');

  // ── Confetti (static decorations around the flag) ──
  const confettiColors = ['#e74c3c', '#f1c40f', '#3498db', '#2ecc71', '#9b59b6', '#ff6b9d'];
  const confetti = [
    [8, 5], [12, 2], [15, 8], [10, 12], [30, 3], [34, 7], [38, 1],
    [6, 15], [14, 18], [28, 14], [32, 10], [40, 5], [5, 9], [36, 15],
  ];
  confetti.forEach(([cx, cy], i) => {
    p(cx, cy, confettiColors[i % confettiColors.length]);
    p(cx + 1, cy, confettiColors[(i + 1) % confettiColors.length]);
  });

  // ── "FIN" text well above flag ──
  const T = '#ff6b9d';
  const TB = '#ffb3cc';
  // F (cols 11-16, rows -18 to -11)
  p(11, -18, TB); p(12, -18, T); p(13, -18, T); p(14, -18, T); p(15, -18, T); p(16, -18, T);
  p(11, -17, T); p(12, -17, T);
  p(11, -16, T); p(12, -16, T);
  p(11, -15, TB); p(12, -15, T); p(13, -15, T); p(14, -15, T); p(15, -15, T);
  p(11, -14, T); p(12, -14, T);
  p(11, -13, T); p(12, -13, T);
  p(11, -12, T); p(12, -12, T);
  p(11, -11, TB);
  // I (cols 18-22, rows -18 to -11)
  p(18, -18, T); p(19, -18, TB); p(20, -18, T); p(21, -18, T); p(22, -18, T);
  p(20, -17, T);
  p(20, -16, TB);
  p(20, -15, T);
  p(20, -14, T);
  p(20, -13, TB);
  p(20, -12, T);
  p(18, -11, T); p(19, -11, T); p(20, -11, TB); p(21, -11, T); p(22, -11, T);
  // N (cols 24-30, rows -18 to -11)
  p(24, -18, TB); p(25, -18, T); p(29, -18, T); p(30, -18, TB);
  p(24, -17, T); p(25, -17, T); p(26, -17, T); p(29, -17, T); p(30, -17, T);
  p(24, -16, T); p(25, -16, T); p(26, -16, TB); p(29, -16, T); p(30, -16, T);
  p(24, -15, T); p(25, -15, T); p(27, -15, TB); p(29, -15, T); p(30, -15, T);
  p(24, -14, T); p(27, -14, T); p(28, -14, TB); p(29, -14, T); p(30, -14, T);
  p(24, -13, T); p(28, -13, T); p(29, -13, T); p(30, -13, T);
  p(24, -12, T); p(29, -12, T); p(30, -12, T);
  p(24, -11, TB); p(30, -11, TB);

  // Ground line
  for (let i = -2; i <= 42; i++) p(i, 35, '#5d4037');
}

// ── Ground / Street tiles ───────────────────────────────────
export function drawGround(ctx, offsetX, canvasW, canvasH, scale = SCALE) {
  const groundY = canvasH - 6 * scale;
  const tileSize = 8; // in pixels

  // Sidewalk
  ctx.fillStyle = '#7f8c8d';
  ctx.fillRect(0, groundY, canvasW, 6 * scale);

  // Sidewalk pattern
  for (let x = -((offsetX * scale) % (tileSize * scale)); x < canvasW; x += tileSize * scale) {
    ctx.fillStyle = '#95a5a6';
    ctx.fillRect(x, groundY, tileSize * scale - 1, 2 * scale);
    ctx.fillStyle = '#6c7a7a';
    ctx.fillRect(x + tileSize * scale - 1, groundY, 1, 6 * scale);
  }

  // Curb
  ctx.fillStyle = '#5d4e37';
  ctx.fillRect(0, groundY - 2 * scale, canvasW, 2 * scale);

  // Road
  ctx.fillStyle = '#34495e';
  ctx.fillRect(0, groundY + 6 * scale, canvasW, canvasH);
}

// ── Sky / Background buildings ──────────────────────────────
export function drawBackground(ctx, offsetX, canvasW, canvasH, scale = SCALE) {
  // Sky gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvasH * 0.7);
  gradient.addColorStop(0, '#1a1a2e');
  gradient.addColorStop(0.5, '#16213e');
  gradient.addColorStop(1, '#0f3460');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasW, canvasH);

  // Stars
  const starSeed = 12345;
  for (let i = 0; i < 60; i++) {
    const sx = ((starSeed * (i + 1) * 7) % canvasW);
    const sy = ((starSeed * (i + 1) * 13) % (canvasH * 0.4));
    const brightness = 150 + ((i * 37) % 105);
    ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness + 40})`;
    const size = (i % 3 === 0) ? 2 : 1;
    ctx.fillRect(sx, sy, size, size);
  }

  // Moon
  ctx.fillStyle = '#f5f5dc';
  ctx.beginPath();
  ctx.arc(canvasW - 80, 60, 25, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1a1a2e';
  ctx.beginPath();
  ctx.arc(canvasW - 70, 55, 22, 0, Math.PI * 2);
  ctx.fill();

  // Background buildings (parallax — move slower)
  const buildingColors = ['#1c2331', '#1e2a3a', '#212f3d', '#1b2631'];
  const buildings = [
    { x: 0, w: 60, h: 100 },
    { x: 70, w: 45, h: 130 },
    { x: 125, w: 55, h: 90 },
    { x: 190, w: 70, h: 150 },
    { x: 270, w: 50, h: 110 },
    { x: 330, w: 65, h: 80 },
    { x: 405, w: 50, h: 140 },
    { x: 465, w: 60, h: 95 },
    { x: 535, w: 45, h: 120 },
    { x: 600, w: 70, h: 85 },
    { x: 680, w: 55, h: 135 },
    { x: 745, w: 60, h: 105 },
    { x: 815, w: 50, h: 145 },
    { x: 875, w: 65, h: 90 },
  ];

  const parallax = offsetX * 0.3;
  const groundY = canvasH - 6 * scale;

  buildings.forEach((b, i) => {
    const bx = ((b.x - parallax) % 950);
    const adjustedBx = bx < -100 ? bx + 950 : bx;
    ctx.fillStyle = buildingColors[i % buildingColors.length];
    ctx.fillRect(adjustedBx, groundY - 2 * scale - b.h, b.w, b.h);

    // Windows on buildings
    ctx.fillStyle = (i * 3 + Math.floor(offsetX / 100)) % 5 < 3 ? '#f9e79f' : '#2c3e50';
    for (let wy = 10; wy < b.h - 15; wy += 18) {
      for (let wx = 8; wx < b.w - 10; wx += 14) {
        ctx.fillRect(adjustedBx + wx, groundY - 2 * scale - b.h + wy, 6, 8);
      }
    }
  });
}

// ── Lamp posts (street decoration) ─────────────────────────
export function drawLampPost(ctx, x, y, scale = SCALE) {
  const s = scale;
  const p = (px_x, px_y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x + px_x * s, y + px_y * s, s, s);
  };

  const POST = '#5d6d7e';
  const LIGHT = '#f9e79f';

  // Pole
  for (let r = 0; r <= 20; r++) { p(1, r, POST); p(2, r, POST); }
  // Top
  for (let i = -1; i <= 4; i++) p(i, 0, POST);
  // Lamp
  p(-1, -1, LIGHT); p(0, -1, LIGHT); p(3, -1, LIGHT); p(4, -1, LIGHT);
  p(0, -2, LIGHT); p(1, -2, LIGHT); p(2, -2, LIGHT); p(3, -2, LIGHT);
  // Glow
  ctx.fillStyle = 'rgba(249, 231, 159, 0.1)';
  ctx.beginPath();
  ctx.arc(x + 1.5 * s, y - 2 * s, 25, 0, Math.PI * 2);
  ctx.fill();
  // Base
  for (let i = -1; i <= 4; i++) { p(i, 21, POST); p(i, 22, POST); }
}

// ── Girl character sprite ───────────────────────────────────
const GIRL_HAIR = '#4a2c0a';
const GIRL_DRESS = '#ff6b9d';
const GIRL_DRESS_DARK = '#e74c7a';
const GIRL_SKIN = '#f5cba7';
const GIRL_SHOES = '#c0392b';

export function drawGirlCharacter(ctx, x, y, frame = 0, scale = SCALE) {
  const s = scale;
  const p = (px_x, px_y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x + px_x * s, y + px_y * s, s, s);
  };

  // Hair (longer, with side strands)
  for (let i = 3; i <= 11; i++) p(i, 0, GIRL_HAIR);
  for (let i = 2; i <= 12; i++) p(i, 1, GIRL_HAIR);
  for (let i = 2; i <= 12; i++) p(i, 2, GIRL_HAIR);

  // Face
  for (let i = 3; i <= 11; i++) p(i, 3, GIRL_SKIN);
  for (let i = 3; i <= 11; i++) p(i, 4, GIRL_SKIN);
  // Hair sides (longer strands)
  p(2, 3, GIRL_HAIR); p(2, 4, GIRL_HAIR); p(2, 5, GIRL_HAIR); p(2, 6, GIRL_HAIR);
  p(1, 5, GIRL_HAIR); p(1, 6, GIRL_HAIR); p(1, 7, GIRL_HAIR); p(1, 8, GIRL_HAIR);
  p(12, 3, GIRL_HAIR); p(12, 4, GIRL_HAIR); p(12, 5, GIRL_HAIR); p(12, 6, GIRL_HAIR);
  p(13, 5, GIRL_HAIR); p(13, 6, GIRL_HAIR); p(13, 7, GIRL_HAIR); p(13, 8, GIRL_HAIR);

  // Eyes
  for (let i = 3; i <= 11; i++) p(i, 5, GIRL_SKIN);
  p(5, 5, EYE); p(6, 5, EYE);
  p(9, 5, EYE); p(10, 5, EYE);

  // Blush & mouth
  for (let i = 3; i <= 11; i++) p(i, 6, GIRL_SKIN);
  p(4, 6, BLUSH); p(10, 6, BLUSH);
  for (let i = 3; i <= 11; i++) p(i, 7, GIRL_SKIN);
  p(6, 7, '#e74c3c'); p(7, 7, '#e74c3c'); p(8, 7, '#e74c3c');

  // Neck
  for (let i = 5; i <= 9; i++) p(i, 8, GIRL_SKIN);

  // Dress top
  for (let r = 9; r <= 12; r++) {
    for (let i = 3; i <= 11; i++) p(i, r, GIRL_DRESS);
  }
  // Collar / neckline
  p(6, 9, GIRL_DRESS_DARK); p(7, 9, GIRL_DRESS_DARK); p(8, 9, GIRL_DRESS_DARK);

  // Arms
  const armOffset = frame % 2 === 0 ? 0 : 1;
  for (let r = 9; r <= 12; r++) {
    p(2, r + (r % 2 === 0 ? armOffset : 0), GIRL_DRESS);
    p(1, r + (r % 2 === 0 ? armOffset : 0), GIRL_SKIN);
    p(12, r + (r % 2 === 0 ? -armOffset : 0), GIRL_DRESS);
    p(13, r + (r % 2 === 0 ? -armOffset : 0), GIRL_SKIN);
  }

  // Dress skirt (flared)
  for (let i = 2; i <= 12; i++) p(i, 13, GIRL_DRESS);
  for (let i = 1; i <= 13; i++) p(i, 14, GIRL_DRESS);
  for (let i = 1; i <= 13; i++) p(i, 15, GIRL_DRESS);
  for (let i = 1; i <= 13; i++) p(i, 16, GIRL_DRESS_DARK);
  // Skirt bottom detail
  for (let i = 0; i <= 14; i++) p(i, 17, GIRL_DRESS);

  // Legs
  const walkFrame = frame % 4;
  if (walkFrame === 0 || walkFrame === 2) {
    for (let i = 4; i <= 6; i++) { p(i, 18, GIRL_SKIN); p(i, 19, GIRL_SKIN); p(i, 20, GIRL_SHOES); }
    for (let i = 8; i <= 10; i++) { p(i, 18, GIRL_SKIN); p(i, 19, GIRL_SKIN); p(i, 20, GIRL_SHOES); }
  } else if (walkFrame === 1) {
    for (let i = 3; i <= 5; i++) { p(i, 18, GIRL_SKIN); p(i, 19, GIRL_SKIN); p(i, 20, GIRL_SHOES); }
    for (let i = 9; i <= 11; i++) { p(i, 18, GIRL_SKIN); p(i, 19, GIRL_SKIN); p(i, 20, GIRL_SHOES); }
  } else {
    for (let i = 5; i <= 7; i++) { p(i, 18, GIRL_SKIN); p(i, 19, GIRL_SKIN); p(i, 20, GIRL_SHOES); }
    for (let i = 7; i <= 9; i++) { p(i, 18, GIRL_SKIN); p(i, 19, GIRL_SKIN); p(i, 20, GIRL_SHOES); }
  }
}

// ── Animated start screen preview (both characters) ─────────
export function drawStartPreview(canvas, frameCount) {
  const ctx = canvas.getContext('2d');
  const scale = 5;
  const charW = 16 * scale;
  const charH = 22 * scale;
  const padding = 40;
  canvas.width = charW * 2 + padding * 2 + 20;
  canvas.height = charH + 40;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Boy stands in the center
  const boyX = Math.floor(canvas.width / 2 - charW / 2);
  const boyY = 20;
  drawCharacter(ctx, boyX, boyY, 0, scale);

  // Girl jumps/orbits around the boy
  const t = frameCount * 0.04;
  const radiusX = charW * 0.9;
  const radiusY = 18;
  const girlCenterX = boyX;
  const girlCenterY = boyY;
  const girlOffsetX = Math.cos(t) * radiusX;
  const girlOffsetY = Math.sin(t) * radiusY;

  // Jump: bounce vertically using abs(sin)
  const jumpHeight = Math.abs(Math.sin(t * 2.5)) * 20;

  const girlX = girlCenterX + girlOffsetX;
  const girlY = girlCenterY + girlOffsetY - jumpHeight;

  // Determine if girl is "in front of" or "behind" the boy based on Y
  const girlInFront = Math.sin(t) > 0;

  const walkFrame = Math.floor(frameCount / 6);

  if (!girlInFront) {
    // Draw girl behind boy
    drawGirlCharacter(ctx, girlX, girlY, walkFrame, scale);
    drawCharacter(ctx, boyX, boyY, 0, scale);
  } else {
    // Draw girl in front of boy
    drawCharacter(ctx, boyX, boyY, 0, scale);
    drawGirlCharacter(ctx, girlX, girlY, walkFrame, scale);
  }

  // Small hearts trail behind the girl
  for (let i = 0; i < 3; i++) {
    const ht = t - i * 0.3;
    const hx = girlCenterX + Math.cos(ht) * radiusX + charW / 2;
    const hy = girlCenterY + Math.sin(ht) * radiusY - Math.abs(Math.sin(ht * 2.5)) * 20 - 10 - i * 8;
    const alpha = Math.max(0, 0.7 - i * 0.25);
    ctx.fillStyle = `rgba(255, 107, 157, ${alpha})`;
    ctx.font = `${10 - i * 2}px serif`;
    ctx.fillText('\u2764', hx, hy);
  }
}
