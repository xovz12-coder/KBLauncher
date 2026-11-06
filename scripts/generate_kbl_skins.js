/**
 * Comprehensive Skin Generator for 10 KBL Exclusive Minecraft Skins
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// PNG utilities
const crcTable = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}
function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) {
    c = (c >>> 8) ^ crcTable[(c ^ buf[i]) & 0xFF];
  }
  return (c ^ -1) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.slice(4, 8 + len);
  chunk.writeUInt32BE(crc32(typeAndData), 8 + len);
  return chunk;
}

function encodePng(width, height, rgbaBuffer) {
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = width * 4;
  const rawData = Buffer.alloc(height * (stride + 1));
  let destOffset = 0;
  for (let y = 0; y < height; y++) {
    rawData[destOffset++] = 0;
    rgbaBuffer.copy(rawData, destOffset, y * stride, (y + 1) * stride);
    destOffset += stride;
  }
  const compressed = zlib.deflateSync(rawData);
  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0))
  ]);
}

function parseHex(hex) {
  if (hex.startsWith('#')) hex = hex.slice(1);
  if (hex.length === 3) hex = hex.split('').map(c => c+c).join('');
  const num = parseInt(hex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255, 255];
}

function blend(c1, c2, t) {
  return [
    Math.round(c1[0] * (1 - t) + c2[0] * t),
    Math.round(c1[1] * (1 - t) + c2[1] * t),
    Math.round(c1[2] * (1 - t) + c2[2] * t),
    Math.round(c1[3] * (1 - t) + c2[3] * t)
  ];
}

function clampByte(val) {
  return Math.max(0, Math.min(255, Math.round(val)));
}

class SkinCanvas {
  constructor(w = 64, h = 64) {
    this.w = w;
    this.h = h;
    this.buf = Buffer.alloc(w * h * 4);
  }

  setPixel(x, y, color) {
    if (x < 0 || x >= this.w || y < 0 || y >= this.h) return;
    const idx = (y * this.w + x) * 4;
    const a = color[3] !== undefined ? color[3] : 255;
    if (a === 0) return;
    if (a === 255 || this.buf[idx + 3] === 0) {
      this.buf[idx] = color[0];
      this.buf[idx + 1] = color[1];
      this.buf[idx + 2] = color[2];
      this.buf[idx + 3] = a;
    } else {
      const srcA = a / 255.0;
      const dstA = this.buf[idx + 3] / 255.0;
      const outA = srcA + dstA * (1 - srcA);
      this.buf[idx] = Math.round((color[0] * srcA + this.buf[idx] * dstA * (1 - srcA)) / outA);
      this.buf[idx + 1] = Math.round((color[1] * srcA + this.buf[idx + 1] * dstA * (1 - srcA)) / outA);
      this.buf[idx + 2] = Math.round((color[2] * srcA + this.buf[idx + 2] * dstA * (1 - srcA)) / outA);
      this.buf[idx + 3] = Math.round(outA * 255);
    }
  }

  getPixel(x, y) {
    if (x < 0 || x >= this.w || y < 0 || y >= this.h) return [0, 0, 0, 0];
    const idx = (y * this.w + x) * 4;
    return [this.buf[idx], this.buf[idx + 1], this.buf[idx + 2], this.buf[idx + 3]];
  }

  fillRect(x0, y0, w, h, color) {
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        this.setPixel(x0 + dx, y0 + dy, color);
      }
    }
  }

  fillGradientV(x0, y0, w, h, colTop, colBot) {
    for (let dy = 0; dy < h; dy++) {
      const t = h > 1 ? dy / (h - 1) : 0;
      const c = blend(colTop, colBot, t);
      for (let dx = 0; dx < w; dx++) {
        this.setPixel(x0 + dx, y0 + dy, c);
      }
    }
  }

  addNoise(x0, y0, w, h, strength = 8) {
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        const x = x0 + dx, y = y0 + dy;
        const cur = this.getPixel(x, y);
        if (cur[3] === 0) continue;
        const delta = Math.floor((Math.random() - 0.5) * strength * 2);
        this.setPixel(x, y, [
          clampByte(cur[0] + delta),
          clampByte(cur[1] + delta),
          clampByte(cur[2] + delta),
          cur[3]
        ]);
      }
    }
  }

  drawBox(u, v, w, h, d, colMain, colShadow, colLight) {
    // 1. Top face (x: u+d, y: v, size: w x d)
    this.fillRect(u + d, v, w, d, colLight);
    // 2. Bottom face (x: u+d+w, y: v, size: w x d)
    this.fillRect(u + d + w, v, w, d, colShadow);
    // 3. Right (+X): (x: u, y: v+d, size: d x h)
    this.fillRect(u, v + d, d, h, colMain);
    // 4. Front (+Z): (x: u+d, y: v+d, size: w x h)
    this.fillRect(u + d, v + d, w, h, colMain);
    // 5. Left (-X): (x: u+d+w, y: v+d, size: d x h)
    this.fillRect(u + d + w, v + d, d, h, colMain);
    // 6. Back (-Z): (x: u+2d+w, y: v+d, size: w x h)
    this.fillRect(u + 2 * d + w, v + d, w, h, colShadow);
  }

  // Draw standard head with hair, face, and eyes
  drawHeadBase(skinCol, hairCol, eyeCol, mouthCol) {
    // Base skin box 8x8x8 at (0, 0)
    const skinLight = blend(skinCol, [255, 255, 255, 255], 0.08);
    const skinShadow = blend(skinCol, [0, 0, 0, 255], 0.12);
    this.drawBox(0, 0, 8, 8, 8, skinCol, skinShadow, skinLight);

    // Hair on top (8, 0, 8, 8)
    const hairLight = blend(hairCol, [255, 255, 255, 255], 0.12);
    const hairDark = blend(hairCol, [0, 0, 0, 255], 0.15);
    this.fillRect(8, 0, 8, 8, hairLight);
    this.addNoise(8, 0, 8, 8, 10);

    // Hair on back (24, 8, 8, 8)
    this.fillRect(24, 8, 8, 8, hairCol);
    this.addNoise(24, 8, 8, 8, 8);

    // Hair on sides (0, 8, 8, 8) and (16, 8, 8, 8) - upper 4 rows
    this.fillRect(0, 8, 8, 4, hairCol);
    this.fillRect(16, 8, 8, 4, hairCol);
    this.fillRect(0, 12, 2, 2, hairCol); // sideburns
    this.fillRect(22, 12, 2, 2, hairCol);

    // Hair bangs on front face (8, 8, 8, 8) - upper 2-3 rows
    this.fillRect(8, 8, 8, 2, hairCol);
    this.setPixel(9, 10, hairCol);
    this.setPixel(14, 10, hairCol);

    // Eyes at front face: y=12
    // Left eye at x=9..10, Right eye at x=13..14
    this.setPixel(9, 12, [255, 255, 255, 255]);
    this.setPixel(10, 12, eyeCol);
    this.setPixel(13, 12, eyeCol);
    this.setPixel(14, 12, [255, 255, 255, 255]);

    // Eyebrows
    const browCol = blend(hairCol, [0, 0, 0, 255], 0.2);
    this.fillRect(9, 11, 2, 1, browCol);
    this.fillRect(13, 11, 2, 1, browCol);

    // Nose & mouth
    const noseCol = blend(skinCol, [0, 0, 0, 255], 0.1);
    this.fillRect(11, 13, 2, 1, noseCol);
    if (mouthCol) {
      this.fillRect(11, 14, 2, 1, mouthCol);
    }
  }

  // Draw limbs and torso with colors
  drawStandardBody(torsoCol, armCol, legCol, shoeCol) {
    const tLight = blend(torsoCol, [255, 255, 255, 255], 0.08);
    const tDark = blend(torsoCol, [0, 0, 0, 255], 0.12);
    // Torso at (16, 16)
    this.drawBox(16, 16, 8, 12, 4, torsoCol, tDark, tLight);
    this.addNoise(16, 16, 24, 16, 6);

    // Right Arm at (40, 16)
    const aLight = blend(armCol, [255, 255, 255, 255], 0.08);
    const aDark = blend(armCol, [0, 0, 0, 255], 0.12);
    this.drawBox(40, 16, 4, 12, 4, armCol, aDark, aLight);
    this.addNoise(40, 16, 16, 16, 6);

    // Left Arm at (32, 48)
    this.drawBox(32, 48, 4, 12, 4, armCol, aDark, aLight);
    this.addNoise(32, 48, 16, 16, 6);

    // Right Leg at (0, 16)
    const lLight = blend(legCol, [255, 255, 255, 255], 0.08);
    const lDark = blend(legCol, [0, 0, 0, 255], 0.12);
    this.drawBox(0, 16, 4, 12, 4, legCol, lDark, lLight);
    this.addNoise(0, 16, 16, 16, 6);

    // Left Leg at (16, 48)
    this.drawBox(16, 48, 4, 12, 4, legCol, lDark, lLight);
    this.addNoise(16, 48, 16, 16, 6);

    // Shoes (bottom 3 rows of legs)
    if (shoeCol) {
      const sLight = blend(shoeCol, [255, 255, 255, 255], 0.12);
      // Right leg shoe
      this.fillRect(0, 29, 16, 3, shoeCol);
      this.fillRect(4, 16 + 4, 4, 4, sLight); // bottom of foot
      // Left leg shoe
      this.fillRect(16, 61, 16, 3, shoeCol);
      this.fillRect(20, 48 + 4, 4, 4, sLight);
    }
  }

  toPngBuffer() {
    return encodePng(this.w, this.h, this.buf);
  }
}

// Generate an 8x upscaled 64x64 face icon
function extractAvatar(skinCanvas) {
  const avatar = new SkinCanvas(64, 64);
  const face8 = [];
  for (let fy = 0; fy < 8; fy++) {
    for (let fx = 0; fx < 8; fx++) {
      let base = skinCanvas.getPixel(8 + fx, 8 + fy);
      let over = skinCanvas.getPixel(40 + fx, 8 + fy);
      if (over[3] > 10) {
        const t = over[3] / 255.0;
        base = [
          Math.round(over[0] * t + base[0] * (1 - t)),
          Math.round(over[1] * t + base[1] * (1 - t)),
          Math.round(over[2] * t + base[2] * (1 - t)),
          255
        ];
      }
      face8.push(base);
    }
  }

  for (let y = 0; y < 64; y++) {
    const fy = Math.floor(y / 8);
    for (let x = 0; x < 64; x++) {
      const fx = Math.floor(x / 8);
      avatar.setPixel(x, y, face8[fy * 8 + fx]);
    }
  }
  return avatar.toPngBuffer();
}

// Generate an orthographic 2D character preview (front + layers, 180x260)
function renderCharacterPreview(skin, skinName, tagLine) {
  const pw = 180, ph = 260;
  const prev = new SkinCanvas(pw, ph);

  // Background subtle dark synthwave gradient with sleek glass border
  for (let y = 0; y < ph; y++) {
    const t = y / ph;
    const bgCol = blend([24, 18, 42, 255], [12, 9, 24, 255], t);
    for (let x = 0; x < pw; x++) {
      prev.setPixel(x, y, bgCol);
    }
  }

  // Draw block scaled 5x
  const S = 5;
  const drawBlock = (px, py, col) => {
    if (col[3] < 10) return;
    for (let dy = 0; dy < S; dy++) {
      for (let dx = 0; dx < S; dx++) {
        prev.setPixel(px + dx, py + dy, col);
      }
    }
  };

  const cx = 50;
  const cy = 35;

  // Drop shadow beneath character feet
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 18 * S; x++) {
      const distFromCenter = Math.abs(x - 9 * S) / (9 * S);
      const alpha = Math.max(0, Math.round((1 - distFromCenter) * 80 * (1 - y / 8)));
      if (alpha > 0) prev.setPixel(cx - S + x, cy + 32 * S + y, [0, 0, 0, alpha]);
    }
  }

  // 1. Head
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      let col = skin.getPixel(8 + x, 8 + y);
      let hat = skin.getPixel(40 + x, 8 + y);
      if (hat[3] > 10) {
        const t = hat[3] / 255;
        col = [Math.round(hat[0]*t + col[0]*(1-t)), Math.round(hat[1]*t + col[1]*(1-t)), Math.round(hat[2]*t + col[2]*(1-t)), 255];
      }
      drawBlock(cx + (4 + x) * S, cy + y * S, col);
    }
  }

  // 2. Torso
  for (let y = 0; y < 12; y++) {
    for (let x = 0; x < 8; x++) {
      let col = skin.getPixel(20 + x, 20 + y);
      let jkt = skin.getPixel(20 + x, 36 + y);
      if (jkt[3] > 10) {
        const t = jkt[3] / 255;
        col = [Math.round(jkt[0]*t + col[0]*(1-t)), Math.round(jkt[1]*t + col[1]*(1-t)), Math.round(jkt[2]*t + col[2]*(1-t)), 255];
      }
      drawBlock(cx + (4 + x) * S, cy + (8 + y) * S, col);
    }
  }

  // 3. Right Arm
  for (let y = 0; y < 12; y++) {
    for (let x = 0; x < 4; x++) {
      let col = skin.getPixel(44 + x, 20 + y);
      let slv = skin.getPixel(44 + x, 36 + y);
      if (slv[3] > 10) {
        const t = slv[3] / 255;
        col = [Math.round(slv[0]*t + col[0]*(1-t)), Math.round(slv[1]*t + col[1]*(1-t)), Math.round(slv[2]*t + col[2]*(1-t)), 255];
      }
      drawBlock(cx + x * S, cy + (8 + y) * S, col);
    }
  }

  // 4. Left Arm
  for (let y = 0; y < 12; y++) {
    for (let x = 0; x < 4; x++) {
      let col = skin.getPixel(36 + x, 52 + y);
      let slv = skin.getPixel(52 + x, 52 + y);
      if (slv[3] > 10) {
        const t = slv[3] / 255;
        col = [Math.round(slv[0]*t + col[0]*(1-t)), Math.round(slv[1]*t + col[1]*(1-t)), Math.round(slv[2]*t + col[2]*(1-t)), 255];
      }
      drawBlock(cx + (12 + x) * S, cy + (8 + y) * S, col);
    }
  }

  // 5. Right Leg
  for (let y = 0; y < 12; y++) {
    for (let x = 0; x < 4; x++) {
      let col = skin.getPixel(4 + x, 20 + y);
      let pnt = skin.getPixel(4 + x, 36 + y);
      if (pnt[3] > 10) {
        const t = pnt[3] / 255;
        col = [Math.round(pnt[0]*t + col[0]*(1-t)), Math.round(pnt[1]*t + col[1]*(1-t)), Math.round(pnt[2]*t + col[2]*(1-t)), 255];
      }
      drawBlock(cx + (4 + x) * S, cy + (20 + y) * S, col);
    }
  }

  // 6. Left Leg
  for (let y = 0; y < 12; y++) {
    for (let x = 0; x < 4; x++) {
      let col = skin.getPixel(20 + x, 52 + y);
      let pnt = skin.getPixel(4 + x, 52 + y);
      if (pnt[3] > 10) {
        const t = pnt[3] / 255;
        col = [Math.round(pnt[0]*t + col[0]*(1-t)), Math.round(pnt[1]*t + col[1]*(1-t)), Math.round(pnt[2]*t + col[2]*(1-t)), 255];
      }
      drawBlock(cx + (8 + x) * S, cy + (20 + y) * S, col);
    }
  }

  // Subtle border
  const borderCol = [120, 90, 200, 60];
  for (let x = 0; x < pw; x++) {
    prev.setPixel(x, 0, borderCol);
    prev.setPixel(x, ph - 1, borderCol);
  }
  for (let y = 0; y < ph; y++) {
    prev.setPixel(0, y, borderCol);
    prev.setPixel(pw - 1, y, borderCol);
  }

  return prev.toPngBuffer();
}

// -------------------------------------------------------------
// DEFINITION OF THE 10 KBL EXCLUSIVE SKINS
// -------------------------------------------------------------
const SKINS = [];

// #1: KBL Cyber Neon
function makeSkin01() {
  const s = new SkinCanvas(64, 64);
  const skinTone = parseHex('#E0BB9B');
  const hairCol = parseHex('#2D1B4E');
  const cyan = parseHex('#00F0FF');
  const neonPink = parseHex('#E0248A');
  const darkSuit = parseHex('#12131A');
  const darkPants = parseHex('#1A1C27');
  const boots = parseHex('#0A0A0F');

  s.drawHeadBase(skinTone, hairCol, cyan, parseHex('#C4826F'));

  // Visor overlay on hat layer across eyes (40..47, 11..12)
  s.fillRect(40, 11, 8, 2, [0, 240, 255, 230]);
  s.fillRect(42, 11, 3, 1, [255, 255, 255, 240]); // reflection
  s.fillRect(32, 11, 8, 2, [20, 20, 35, 200]); // side straps
  s.fillRect(48, 11, 8, 2, [20, 20, 35, 200]);

  // Cybernetic hair tips
  s.fillRect(40, 8, 2, 2, cyan);
  s.fillRect(46, 8, 2, 2, neonPink);

  s.drawStandardBody(darkSuit, darkSuit, darkPants, boots);

  // Neon circuit lines on chest (20..27, 20..31)
  s.setPixel(21, 23, cyan);
  s.setPixel(22, 24, cyan);
  s.setPixel(23, 24, cyan);
  s.setPixel(24, 25, cyan);
  s.setPixel(25, 25, neonPink);
  s.setPixel(26, 26, neonPink);
  // KBL glowing core on jacket overlay
  s.fillRect(23, 39, 2, 2, cyan);
  s.fillRect(21, 38, 1, 1, neonPink);
  s.fillRect(26, 38, 1, 1, neonPink);

  // Arm glowing bands
  s.fillRect(44, 25, 4, 1, cyan);
  s.fillRect(36, 57, 4, 1, neonPink);

  // Leg neon stripes
  s.fillRect(5, 22, 1, 6, cyan);
  s.fillRect(22, 54, 1, 6, neonPink);

  return s;
}

// #2: KBL Synthwave Sunset
function makeSkin02() {
  const s = new SkinCanvas(64, 64);
  const skinTone = parseHex('#E8C39E');
  const hairCol = parseHex('#3B1443');
  const gold = parseHex('#F59E0B');
  const orange = parseHex('#F97316');
  const pink = parseHex('#EC4899');
  const violet = parseHex('#3B0764');
  const denim = parseHex('#1E1B4B');
  const shoes = parseHex('#FAFAFA');

  s.drawHeadBase(skinTone, hairCol, [236, 72, 153, 255], parseHex('#B86E63'));

  // Retro Aviator Sunglasses on hat layer (40..47, 11..13)
  s.fillRect(41, 11, 3, 2, gold);
  s.fillRect(45, 11, 3, 2, gold);
  s.setPixel(42, 12, pink);
  s.setPixel(46, 12, pink);
  s.fillRect(41, 11, 1, 1, [255, 255, 255, 220]); // flare
  s.fillRect(45, 11, 1, 1, [255, 255, 255, 220]);
  s.fillRect(32, 11, 8, 1, [40, 20, 60, 200]); // gold frame arms
  s.fillRect(48, 11, 8, 1, [40, 20, 60, 200]);

  // Torso: Sunset gradient bomber
  s.drawStandardBody(violet, violet, denim, shoes);
  s.fillGradientV(20, 20, 8, 7, orange, pink); // front chest sunset
  s.fillGradientV(32, 20, 8, 8, gold, violet); // back jacket sunset

  // Bomber jacket collar on overlay
  s.fillRect(21, 36, 6, 2, [245, 158, 11, 230]);
  s.fillRect(23, 40, 2, 7, [255, 255, 255, 240]); // white inner tee

  // Retro sneakers with pink stripe
  s.fillRect(0, 31, 16, 1, pink);
  s.fillRect(16, 63, 16, 1, pink);

  return s;
}

// #3: KBL Gold Founder
function makeSkin03() {
  const s = new SkinCanvas(64, 64);
  const skinTone = parseHex('#E5BE9E');
  const hairCol = parseHex('#1C1917');
  const gold = parseHex('#F59E0B');
  const goldLight = parseHex('#FDE68A');
  const goldDark = parseHex('#B45309');
  const velvet = parseHex('#18181B');
  const ruby = parseHex('#DC2626');

  s.drawHeadBase(skinTone, hairCol, gold, parseHex('#A86858'));

  // Golden Laurel Crown on hat layer (40..47, 8..10)
  s.fillRect(40, 9, 8, 1, gold);
  s.fillRect(32, 9, 8, 1, gold);
  s.fillRect(48, 9, 8, 1, gold);
  s.fillRect(56, 9, 8, 1, gold);
  s.setPixel(43, 8, goldLight);
  s.setPixel(44, 8, ruby); // center ruby gem
  s.setPixel(45, 8, goldLight);

  s.drawStandardBody(velvet, velvet, velvet, [30, 25, 20, 255]);

  // Ornate Gold Trim on Torso & Jacket overlay
  s.fillRect(20, 36, 8, 1, gold);
  s.fillRect(20, 47, 8, 1, gold);
  s.fillRect(23, 37, 2, 10, goldDark); // center zipper / sash
  // Golden KBL emblem medallion on chest
  s.fillRect(23, 39, 2, 2, goldLight);
  s.setPixel(24, 39, ruby);

  // Gold Gauntlets on wrists
  s.fillRect(44, 28, 4, 3, gold);
  s.fillRect(36, 60, 4, 3, gold);

  // Gold Tuxedo stripe on trousers
  s.fillRect(0, 20, 1, 9, gold);
  s.fillRect(27, 52, 1, 9, gold);

  return s;
}

// #4: KBL Void Walker
function makeSkin04() {
  const s = new SkinCanvas(64, 64);
  const skinTone = parseHex('#2E2344');
  const hairCol = parseHex('#120722');
  const voidPurple = parseHex('#0F051D');
  const riftViolet = parseHex('#A855F7');
  const starGlow = parseHex('#E879F9');
  const enderEye = parseHex('#C084FC');

  s.drawHeadBase(skinTone, hairCol, enderEye, null);

  // Ethereal glowing eye aura
  s.fillRect(40, 11, 2, 2, [192, 132, 252, 180]);
  s.fillRect(45, 11, 2, 2, [192, 132, 252, 180]);
  // Void hood / cowl overlay
  s.fillRect(40, 8, 8, 3, [18, 7, 34, 240]);
  s.fillRect(32, 8, 8, 8, [18, 7, 34, 240]);
  s.fillRect(48, 8, 8, 8, [18, 7, 34, 240]);

  s.drawStandardBody(voidPurple, voidPurple, voidPurple, [10, 5, 20, 255]);

  // Cosmic rift specks on chest
  s.setPixel(22, 22, riftViolet);
  s.setPixel(25, 24, starGlow);
  s.setPixel(23, 27, riftViolet);
  s.setPixel(26, 28, starGlow);

  // Glowing void fingertips
  s.fillRect(44, 29, 4, 2, riftViolet);
  s.fillRect(36, 61, 4, 2, riftViolet);

  // Ethereal runes at hem of robe
  s.fillRect(4, 30, 4, 1, riftViolet);
  s.fillRect(20, 62, 4, 1, riftViolet);

  return s;
}

// #5: KBL Mecha Titan
function makeSkin05() {
  const s = new SkinCanvas(64, 64);
  const metal = parseHex('#334155');
  const darkMetal = parseHex('#1E293B');
  const steel = parseHex('#64748B');
  const coreCyan = parseHex('#06B6D4');
  const coreBright = parseHex('#67E8F9');
  const hazard = parseHex('#F97316');

  // Robotic head
  s.drawBox(0, 0, 8, 8, 8, metal, darkMetal, steel);
  // Optic mono-eye band across face
  s.fillRect(8, 11, 8, 2, darkMetal);
  s.fillRect(11, 11, 2, 2, coreBright); // glowing optic sensor
  s.fillRect(8, 14, 8, 1, hazard); // hazard mouth vent

  // Mecha helmet overlay with ear vents
  s.fillRect(40, 8, 8, 3, [71, 85, 105, 220]);
  s.fillRect(32, 10, 2, 4, coreCyan); // ear lights
  s.fillRect(48, 10, 2, 4, coreCyan);

  s.drawStandardBody(darkMetal, steel, metal, darkMetal);

  // Circular Arc Reactor on chest (20..27, 20..31)
  s.fillRect(22, 23, 4, 4, coreCyan);
  s.fillRect(23, 24, 2, 2, coreBright);

  // Hazard warning diagonal stripes on right arm
  s.setPixel(44, 23, hazard);
  s.setPixel(45, 24, hazard);
  s.setPixel(46, 25, hazard);

  // Hydraulic knee pistons on legs
  s.fillRect(5, 24, 2, 3, steel);
  s.fillRect(21, 56, 2, 3, steel);

  return s;
}

// #6: KBL Streetwear Hoodie
function makeSkin06() {
  const s = new SkinCanvas(64, 64);
  const skinTone = parseHex('#ECC9A8');
  const hairCol = parseHex('#44403C');
  const hoodie = parseHex('#18181B');
  const purpleAccent = parseHex('#7C3AED');
  const white = parseHex('#FFFFFF');
  const cargoPants = parseHex('#27272A');
  const sneakers = parseHex('#F4F4F5');

  s.drawHeadBase(skinTone, hairCol, parseHex('#3B82F6'), parseHex('#C4826F'));

  // Gamer RGB Headphones on hat layer
  // Headband across top
  s.fillRect(40, 0, 8, 1, [24, 24, 27, 255]);
  // Ear cups on sides
  s.fillRect(32, 10, 2, 4, [24, 24, 27, 255]);
  s.fillRect(48, 10, 2, 4, [24, 24, 27, 255]);
  // Glowing RGB ring
  s.setPixel(32, 11, purpleAccent);
  s.setPixel(32, 12, purpleAccent);
  s.setPixel(49, 11, purpleAccent);
  s.setPixel(49, 12, purpleAccent);

  s.drawStandardBody(hoodie, hoodie, cargoPants, sneakers);

  // Drawstrings on hoodie
  s.fillRect(22, 22, 1, 4, white);
  s.fillRect(25, 22, 1, 4, white);

  // "KBL" print across chest
  // K
  s.fillRect(21, 25, 1, 3, purpleAccent);
  s.setPixel(22, 26, purpleAccent);
  // B
  s.fillRect(23, 25, 1, 3, white);
  s.setPixel(24, 25, white);
  s.setPixel(24, 27, white);
  // L
  s.fillRect(25, 25, 1, 3, purpleAccent);
  s.setPixel(26, 27, purpleAccent);

  // Kangaroo pocket
  s.fillRect(21, 29, 6, 2, [35, 35, 42, 255]);

  return s;
}

// #7: KBL Shadow Hacker
function makeSkin07() {
  const s = new SkinCanvas(64, 64);
  const skinTone = parseHex('#332A3D');
  const matrixGreen = parseHex('#22C55E');
  const brightGreen = parseHex('#4ADE80');
  const darkCoat = parseHex('#09090B');
  const techGray = parseHex('#27272A');

  // Shadow face
  s.drawBox(0, 0, 8, 8, 8, [20, 20, 25, 255], [10, 10, 15, 255], [30, 30, 35, 255]);
  // Single glowing holographic monocle eye
  s.fillRect(9, 11, 2, 2, brightGreen);
  s.setPixel(10, 11, [255, 255, 255, 255]);

  // Deep cowl hood on hat overlay covering top and sides
  s.fillRect(40, 8, 8, 3, [9, 9, 11, 255]);
  s.fillRect(32, 8, 8, 8, [9, 9, 11, 255]);
  s.fillRect(48, 8, 8, 8, [9, 9, 11, 255]);
  s.fillRect(56, 8, 8, 8, [9, 9, 11, 255]);

  s.drawStandardBody(darkCoat, darkCoat, techGray, [15, 15, 20, 255]);

  // Matrix code streams on jacket overlay
  s.setPixel(21, 38, matrixGreen);
  s.setPixel(21, 40, brightGreen);
  s.setPixel(23, 39, matrixGreen);
  s.setPixel(25, 37, brightGreen);
  s.setPixel(25, 41, matrixGreen);

  // Wrist cyber-deck terminal on left sleeve overlay
  s.fillRect(52, 58, 4, 3, [15, 23, 42, 240]);
  s.fillRect(53, 59, 2, 1, brightGreen);

  return s;
}

// #8: KBL Obsidian Knight
function makeSkin08() {
  const s = new SkinCanvas(64, 64);
  const obsidian = parseHex('#18181B');
  const netherite = parseHex('#27272A');
  const steel = parseHex('#52525B');
  const amethyst = parseHex('#9333EA');
  const brightAme = parseHex('#C084FC');

  // Knight Armet Helmet
  s.drawBox(0, 0, 8, 8, 8, netherite, obsidian, steel);
  // Visor eye slit
  s.fillRect(9, 11, 6, 1, amethyst);
  s.fillRect(11, 11, 2, 1, brightAme); // glowing center

  // Helmet crest on hat layer
  s.fillRect(43, 0, 2, 8, [147, 51, 234, 230]); // purple plume
  s.fillRect(40, 8, 8, 2, [39, 39, 42, 220]); // helmet visor brow

  s.drawStandardBody(obsidian, netherite, netherite, obsidian);

  // Carved obsidian chestplate with glowing runes
  s.fillRect(23, 22, 2, 4, amethyst);
  s.fillRect(21, 24, 6, 1, amethyst);
  s.setPixel(23, 23, brightAme);

  // Heavy shoulder pauldrons on sleeve overlay
  s.fillRect(40, 36, 4, 4, [82, 82, 91, 240]);
  s.fillRect(48, 52, 4, 4, [82, 82, 91, 240]);
  s.fillRect(41, 37, 2, 2, amethyst);
  s.fillRect(49, 53, 2, 2, amethyst);

  // Knee guard amethyst gems
  s.fillRect(5, 25, 2, 2, brightAme);
  s.fillRect(21, 57, 2, 2, brightAme);

  return s;
}

// #9: KBL Vaporwave Glitch
function makeSkin09() {
  const s = new SkinCanvas(64, 64);
  const skinTone = parseHex('#FAE8E0');
  const cyan = parseHex('#22D3EE');
  const pink = parseHex('#F472B6');
  const darkSlate = parseHex('#334155');
  const white = parseHex('#FFFFFF');

  // Split-dye hair: left half pink, right half cyan!
  s.drawHeadBase(skinTone, darkSlate, cyan, pink);
  s.fillRect(8, 0, 4, 8, cyan);
  s.fillRect(12, 0, 4, 8, pink);
  s.fillRect(0, 8, 8, 4, cyan); // right side
  s.fillRect(16, 8, 8, 4, pink); // left side

  // Glitch shades with chromatic aberration on hat overlay
  s.fillRect(41, 11, 3, 2, cyan);
  s.fillRect(45, 11, 3, 2, pink);
  s.setPixel(44, 11, white); // glitch shift

  // 90s Colorblock Windbreaker
  s.drawStandardBody(white, white, darkSlate, white);
  // Diagonal pastel blocks on chest
  s.fillRect(20, 20, 4, 6, cyan);
  s.fillRect(24, 20, 4, 6, pink);
  s.fillRect(20, 26, 8, 5, darkSlate);

  // Striped sleeves
  s.fillRect(44, 22, 4, 2, cyan);
  s.fillRect(44, 26, 4, 2, pink);
  s.fillRect(36, 54, 4, 2, pink);
  s.fillRect(36, 58, 4, 2, cyan);

  // Checkerboard cuffs
  s.setPixel(44, 29, white); s.setPixel(46, 29, white);
  s.setPixel(36, 61, white); s.setPixel(38, 61, white);

  return s;
}

// #10: KBL Arctic SpecOps
function makeSkin10() {
  const s = new SkinCanvas(64, 64);
  const skinTone = parseHex('#F0D5C0');
  const snowCamo = parseHex('#F1F5F9');
  const camoGray = parseHex('#CBD5E1');
  const slate = parseHex('#334155');
  const cryoBlue = parseHex('#38BDF8');
  const fur = parseHex('#E2E8F0');

  // Balaclava head with bright blue eyes
  s.drawBox(0, 0, 8, 8, 8, slate, [30, 41, 59, 255], [71, 85, 105, 255]);
  s.fillRect(9, 11, 6, 2, skinTone); // face opening
  s.fillRect(10, 11, 1, 1, cryoBlue); // left eye
  s.fillRect(13, 11, 1, 1, cryoBlue); // right eye

  // Ski goggles on forehead of hat overlay
  s.fillRect(40, 9, 8, 2, [15, 23, 42, 240]);
  s.fillRect(41, 9, 3, 2, cryoBlue);
  s.fillRect(45, 9, 3, 2, cryoBlue);

  s.drawStandardBody(snowCamo, snowCamo, slate, [15, 23, 42, 255]);
  s.addNoise(20, 20, 8, 12, 10); // camo pattern

  // Fur trim around parka collar on jacket overlay
  s.fillRect(20, 36, 8, 2, fur);
  s.fillRect(20, 38, 1, 6, fur);
  s.fillRect(27, 38, 1, 6, fur);

  // Cryo LED power strips
  s.fillRect(22, 25, 4, 1, cryoBlue);
  s.fillRect(44, 25, 4, 1, cryoBlue);
  s.fillRect(36, 57, 4, 1, cryoBlue);

  // Tactical thigh holster on right leg
  s.fillRect(0, 23, 4, 3, slate);
  s.fillRect(1, 24, 2, 2, [15, 23, 42, 255]);

  return s;
}

// -------------------------------------------------------------
// EXECUTE GENERATION OF ALL 10 VARIANTS
// -------------------------------------------------------------
const catalogDir = path.resolve(__dirname, '../skins_catalog/kbl_variants');
if (!fs.existsSync(catalogDir)) {
  fs.mkdirSync(catalogDir, { recursive: true });
}

const VARIANTS = [
  { id: 'kbl_01_cyber_neon', name: 'KBL Cyber Neon', tag: 'Сайбер Неон', desc: 'Высокотехнологичный киберкостюм с неоновыми цепями, визором HUD и ядром KBL', fn: makeSkin01 },
  { id: 'kbl_02_synthwave_sunset', name: 'KBL Synthwave Sunset', tag: 'Синтвейв Сансет', desc: 'Ретро-бомбер 80-х с закатным градиентом, авиаторами и неоновыми кроссовками', fn: makeSkin02 },
  { id: 'kbl_03_gold_founder', name: 'KBL Gold Founder', tag: 'Основатель 24K', desc: 'Королевский бархатный худи с 24K золотой филигранью, лавровой короной и рубином', fn: makeSkin03 },
  { id: 'kbl_04_void_walker', name: 'KBL Void Walker', tag: 'Странник Бездны', desc: 'Мистический странник Края с мерцающими фиолетовыми разломами и частицами', fn: makeSkin04 },
  { id: 'kbl_05_mecha_titan', name: 'KBL Mecha Titan', tag: 'Боевой Меха', desc: 'Тяжелый титановый экзоскелет с дуговым реактором и оптическим визором', fn: makeSkin05 },
  { id: 'kbl_06_street_hoodie', name: 'KBL Streetwear Hoodie', tag: 'Уличный Оверсайз', desc: 'Трендовый оверсайз-худи с принтом KBL, RGB-наушниками и брюками-карго', fn: makeSkin06 },
  { id: 'kbl_07_shadow_hacker', name: 'KBL Shadow Hacker', tag: 'Кибер-Хакер', desc: 'Скрытный хакер в глубоком капюшоне с зеленым AR-монокуляром и датападом', fn: makeSkin07 },
  { id: 'kbl_08_obsidian_knight', name: 'KBL Obsidian Knight', tag: 'Обсидиановый Рыцарь', desc: 'Древние латы из полированного незерита и обсидиана с аметистовыми рунами', fn: makeSkin08 },
  { id: 'kbl_09_vapor_glitch', name: 'KBL Vaporwave Glitch', tag: 'Вейпорвейв Глитч', desc: 'Ретровейв с двухцветными волосами, глитч-очками и геометрической ветровкой', fn: makeSkin09 },
  { id: 'kbl_10_arctic_specops', name: 'KBL Arctic SpecOps', tag: 'Арктический Спецназ', desc: 'Арктический тактический спецкостюм с меховым воротником и крио-подсветкой', fn: makeSkin10 }
];

console.log(`Generating ${VARIANTS.length} exclusive KBL skins...`);

const manifest = [];

for (let i = 0; i < VARIANTS.length; i++) {
  const item = VARIANTS[i];
  const skinCanvas = item.fn();

  const skinFileName = `${item.id}.png`;
  const avatarFileName = `${item.id}_avatar.png`;
  const previewFileName = `${item.id}_preview.png`;

  const skinFilePath = path.join(catalogDir, skinFileName);
  const avatarFilePath = path.join(catalogDir, avatarFileName);
  const previewFilePath = path.join(catalogDir, previewFileName);

  fs.writeFileSync(skinFilePath, skinCanvas.toPngBuffer());
  fs.writeFileSync(avatarFilePath, extractAvatar(skinCanvas));
  fs.writeFileSync(previewFilePath, renderCharacterPreview(skinCanvas, item.name, item.tag));

  manifest.push({
    index: i + 1,
    id: item.id,
    name: item.name,
    tag: item.tag,
    desc: item.desc,
    skinFile: skinFileName,
    avatarFile: avatarFileName,
    previewFile: previewFileName
  });

  console.log(`[${i + 1}/10] Created ${item.name} -> ${skinFileName}`);
}

// Write manifest JSON
fs.writeFileSync(path.join(catalogDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

console.log('All 10 skins generated successfully!');
