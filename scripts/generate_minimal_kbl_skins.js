/**
 * Generator for 10 Minimalist KB & KBL Minecraft Skins
 * Styled using OKLCH Perceptual Colors & High-Legibility Typography
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// --- PNG Utilities ---
const crcTable = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  crcTable[n] = c;
}
function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = (c >>> 8) ^ crcTable[(c ^ buf[i]) & 0xFF];
  return (c ^ -1) >>> 0;
}
function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  chunk.writeUInt32BE(crc32(chunk.slice(4, 8 + len)), 8 + len);
  return chunk;
}
function encodePng(width, height, rgbaBuffer) {
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  const stride = width * 4;
  const rawData = Buffer.alloc(height * (stride + 1));
  let destOffset = 0;
  for (let y = 0; y < height; y++) {
    rawData[destOffset++] = 0;
    rgbaBuffer.copy(rawData, destOffset, y * stride, (y + 1) * stride);
    destOffset += stride;
  }
  const compressed = zlib.deflateSync(rawData);
  return Buffer.concat([signature, makeChunk('IHDR', ihdr), makeChunk('IDAT', compressed), makeChunk('IEND', Buffer.alloc(0))]);
}

// --- OKLCH to sRGB Converter ---
function oklch(L, C, H, alpha = 255) {
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const rLin = +4.0767434729 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bLin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  function gamma(c) {
    if (c <= 0.0031308) return 12.92 * c;
    return 1.055 * Math.pow(Math.max(0, c), 1 / 2.4) - 0.055;
  }

  const r = Math.min(255, Math.max(0, Math.round(gamma(rLin) * 255)));
  const g = Math.min(255, Math.max(0, Math.round(gamma(gLin) * 255)));
  const bl = Math.min(255, Math.max(0, Math.round(gamma(bLin) * 255)));
  return [r, g, bl, alpha];
}

function blend(c1, c2, t) {
  return [
    Math.round(c1[0] * (1 - t) + c2[0] * t),
    Math.round(c1[1] * (1 - t) + c2[1] * t),
    Math.round(c1[2] * (1 - t) + c2[2] * t),
    Math.round((c1[3] !== undefined ? c1[3] : 255) * (1 - t) + (c2[3] !== undefined ? c2[3] : 255) * t)
  ];
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

  drawBox(u, v, w, h, d, colMain, colShadow, colLight) {
    this.fillRect(u + d, v, w, d, colLight); // Top
    this.fillRect(u + d + w, v, w, d, colShadow); // Bottom
    this.fillRect(u, v + d, d, h, colMain); // Right (+X)
    this.fillRect(u + d, v + d, w, h, colMain); // Front (+Z)
    this.fillRect(u + d + w, v + d, d, h, colMain); // Left (-X)
    this.fillRect(u + 2 * d + w, v + d, w, h, colShadow); // Back (-Z)
  }

  // Draw clean aesthetic head with modern parted curtain bangs, richly textured back/crown, clean neckline, and soft expressive face
  drawAestheticHead(skinCol, hairCol, eyeCol, hairHighlightCol = null) {
    const skinLight = blend(skinCol, [255, 255, 255, 255], 0.05);
    const skinShadow = blend(skinCol, [0, 0, 0, 255], 0.08);
    this.drawBox(0, 0, 8, 8, 8, skinCol, skinShadow, skinLight);

    // Warm, cohesive hair tones (NO harsh grey/white blends or discolored patches!)
    const hSoft = hairHighlightCol || blend(hairCol, [255, 215, 170, 255], 0.08); // Subtle natural sheen
    const hDark = blend(hairCol, [0, 0, 0, 255], 0.10);  // Soft depth shadow
    const hDeep = blend(hairCol, [0, 0, 0, 255], 0.18);  // Strand division groove

    // -------------------------------------------------------------
    // 1. TOP OF HEAD (u=8..15, v=0..7 on Base; u=40..47, v=0..7 on Hat)
    // Organic crown flow with subtle center parting (NO harsh 6x2 flat stripes!)
    // -------------------------------------------------------------
    this.fillRect(8, 0, 8, 8, hairCol);
    this.fillRect(40, 0, 8, 8, hairCol);

    // Center parting flow & delicate strand texture on crown
    this.setPixel(11, 2, hDark);
    this.setPixel(12, 3, hDark);
    this.setPixel(11, 4, hDark);
    this.setPixel(12, 5, hDark);
    this.setPixel(10, 2, hSoft);
    this.setPixel(13, 3, hSoft);
    this.setPixel(9, 4, hSoft);
    this.setPixel(14, 5, hSoft);

    // Hat crown texture
    this.setPixel(43, 2, hDark);
    this.setPixel(44, 3, hDark);
    this.setPixel(43, 4, hDark);
    this.setPixel(44, 5, hDark);
    this.setPixel(42, 2, hSoft);
    this.setPixel(45, 3, hSoft);

    // -------------------------------------------------------------
    // 2. BACK OF HEAD (u=24..31, v=8..15 on Base; u=56..63, v=8..15 on Hat)
    // Richly textured layered hair with vertical strand grooves, tapered nape & neck skin
    // -------------------------------------------------------------
    // Base Back (24..31, 8..15)
    this.fillRect(24, 8, 8, 5, hairCol); // Rows 8..12 base

    // Vertical strand grooves (разделение прядей на затылке)
    for (let y = 8; y <= 11; y++) {
      this.setPixel(26, y, hDark); // Groove 1
      this.setPixel(29, y, hDark); // Groove 2
    }
    // Strand highlights along lock bodies
    this.setPixel(25, 9, hSoft);
    this.setPixel(28, 10, hSoft);
    this.setPixel(30, 9, hSoft);
    this.setPixel(27, 8, hSoft);

    // Row 12: Layered transition seam
    this.setPixel(24, 12, hDark);
    this.setPixel(27, 12, hDark);
    this.setPixel(30, 12, hDark);

    // Rows 13..15: Realistic tapered hairline (натуральная линия шеи)
    // Row 13: Hair in center, skin at outer edges
    this.setPixel(24, 13, skinShadow);
    this.fillRect(25, 13, 6, 1, hairCol);
    this.setPixel(27, 13, hDark);
    this.setPixel(31, 13, skinShadow);

    // Row 14: Tapered V-nape locks, skin visible on sides
    this.fillRect(24, 14, 2, 1, skinCol);
    this.setPixel(26, 14, hairCol);
    this.fillRect(27, 14, 2, 1, hDark); // Nape center tip
    this.setPixel(29, 14, hairCol);
    this.fillRect(30, 14, 2, 1, skinCol);

    // Row 15: Clean human neck!
    this.fillRect(24, 15, 8, 1, skinCol);
    this.setPixel(27, 15, skinShadow);
    this.setPixel(28, 15, skinShadow);

    // 3D Hat Layer Back (56..63, 8..15): Volumetric outer layer floating over nape
    this.fillRect(56, 8, 8, 4, hairCol); // Rows 8..11 full volume
    for (let y = 8; y <= 11; y++) {
      this.setPixel(58, y, hDark);
      this.setPixel(61, y, hDark);
    }
    this.setPixel(57, 9, hSoft);
    this.setPixel(60, 10, hSoft);

    // Row 12: Jagged layered outer hem (leaves grooves at 58 and 61 open)
    this.setPixel(56, 12, hairCol);
    this.setPixel(57, 12, hairCol);
    this.setPixel(59, 12, hairCol);
    this.setPixel(60, 12, hairCol);
    this.setPixel(62, 12, hairCol);
    this.setPixel(63, 12, hairCol);
    // Rows 13..15 on Hat are transparent so the tapered nape and neck beneath show through!

    // -------------------------------------------------------------
    // 3. SIDES OF HEAD (Right: 0..7, 8..15; Left: 16..23, 8..15)
    // -------------------------------------------------------------
    this.fillRect(0, 8, 8, 5, hairCol);
    this.fillRect(16, 8, 8, 5, hairCol);
    // Vertical strand shadows on sides
    this.setPixel(2, 9, hDark);
    this.setPixel(5, 10, hDark);
    this.setPixel(18, 9, hDark);
    this.setPixel(21, 10, hDark);
    // Sideburns down to row 13 at front edge
    this.fillRect(6, 13, 2, 1, hairCol);
    this.fillRect(16, 13, 2, 1, hairCol);
    // Ear/neck skin at row 14-15
    this.fillRect(1, 14, 4, 2, skinCol);
    this.fillRect(19, 14, 4, 2, skinCol);

    // Sides Hat Layer (32..39 & 48..55)
    this.fillRect(32, 8, 8, 4, hairCol);
    this.fillRect(48, 8, 8, 4, hairCol);
    this.fillRect(38, 12, 2, 2, hairCol); // 3D right sideburn
    this.fillRect(48, 12, 2, 2, hairCol); // 3D left sideburn

    // -------------------------------------------------------------
    // 4. FRONT FACE: CLEAN CURTAIN BANGS (NO RECTANGULAR BLOCKS!)
    // -------------------------------------------------------------
    // Row 8: Forehead top - solid hair
    this.fillRect(8, 8, 8, 1, hairCol);

    // Row 9: Upper curtain drape with natural center parting gap at x=12
    this.fillRect(8, 9, 4, 1, hairCol); // Left curtain: 8..11
    this.setPixel(12, 9, skinShadow);   // Soft skin tone in parting gap
    this.fillRect(13, 9, 3, 1, hairCol); // Right curtain: 13..15

    // Row 10: Smooth flowing curtains (ALL matching hairCol - zero rectangles!)
    this.fillRect(8, 10, 3, 1, hairCol); // Left curtain lock: 8..10
    this.setPixel(11, 10, hairCol);      // Dipping strand: 11
    this.setPixel(12, 10, skinCol);      // Forehead skin: 12
    this.fillRect(13, 10, 3, 1, hairCol); // Right curtain lock: 13..15

    // Row 11: Eyebrows & Cascading Lock Tips
    // Eyebrows at y=11
    this.fillRect(9, 11, 2, 1, hDark);
    this.fillRect(13, 11, 2, 1, hDark);
    // Face-framing side strands falling down
    this.setPixel(8, 11, hairCol);
    this.setPixel(15, 11, hairCol);
    // Dipping fringe tip crossing over forehead
    this.setPixel(11, 11, hairCol);
    // Center forehead skin between brows
    this.setPixel(12, 11, skinCol);

    // Row 12: Clean expressive eyes & sideburn locks
    this.setPixel(8, 12, hairCol); // Side framing strand
    this.setPixel(9, 12, [255, 255, 255, 255]); // Sclera left
    this.setPixel(10, 12, eyeCol); // Pupil left
    this.setPixel(11, 12, skinShadow); // Nose bridge
    this.setPixel(12, 12, skinShadow);
    this.setPixel(13, 12, eyeCol); // Pupil right
    this.setPixel(14, 12, [255, 255, 255, 255]); // Sclera right
    this.setPixel(15, 12, hairCol); // Side framing strand

    // Row 13: Natural soft blush & cheeks
    const blushCol = blend(skinCol, [255, 120, 140, 255], 0.18);
    this.setPixel(8, 13, blushCol);
    this.setPixel(15, 13, blushCol);

    // Row 14: Expressive natural mouth
    const mouthCol = blend(skinCol, [170, 75, 75, 255], 0.35);
    this.setPixel(11, 14, mouthCol);
    this.setPixel(12, 14, mouthCol);

    // -------------------------------------------------------------
    // FRONT FACE 3D HAT LAYER (40..47, 8..15): CLEAN 3D CURTAINS
    // (100% hairCol - ZERO discolored patches or weird rectangles!)
    // -------------------------------------------------------------
    this.fillRect(40, 8, 8, 1, hairCol); // Row 8 cap

    // Row 9: 3D Left and Right Curtains with open center parting gap at 43
    this.fillRect(40, 9, 3, 1, hairCol); // 40..42
    // 43 is transparent! Center parting allows skin beneath to show
    this.fillRect(44, 9, 4, 1, hairCol); // 44..47

    // Row 10: 3D Curtain strands (40..42 and 45..47)
    this.fillRect(40, 10, 3, 1, hairCol); // 40..42
    // 43, 44 transparent
    this.fillRect(45, 10, 3, 1, hairCol); // 45..47

    // Row 11: 3D Strand tips
    this.setPixel(40, 11, hairCol);
    this.setPixel(42, 11, hairCol);
    this.setPixel(45, 11, hairCol);
    this.setPixel(47, 11, hairCol);

    // Row 12: 3D Side framing locks
    this.setPixel(40, 12, hairCol);
    this.setPixel(47, 12, hairCol);
  }

  // Draw clean minimalist clothes with tailored aesthetic pants, belt with metal buckle, knee folds, 3D cuffs, and stylish footwear
  drawMinimalistBody(shirtCol, pantsCol, shoesCol, hasJacketOverlay = true, options = {}) {
    const sLight = blend(shirtCol, [255, 255, 255, 255], 0.06);
    const sDark = blend(shirtCol, [0, 0, 0, 255], 0.10);

    // Torso (16, 16)
    this.drawBox(16, 16, 8, 12, 4, shirtCol, sDark, sLight);

    // Right Arm (40, 16)
    this.drawBox(40, 16, 4, 12, 4, shirtCol, sDark, sLight);

    // Left Arm (32, 48)
    this.drawBox(32, 48, 4, 12, 4, shirtCol, sDark, sLight);

    // -------------------------------------------------------------
    // HIGH-END AESTHETIC TAILORED PANTS & LEGS
    // -------------------------------------------------------------
    const pDark = blend(pantsCol, [0, 0, 0, 255], 0.12);
    const pDeeper = blend(pantsCol, [0, 0, 0, 255], 0.22);
    const pLight = blend(pantsCol, [255, 255, 255, 255], 0.08);

    // 1. Right Leg Base Box (0, 16)
    this.drawBox(0, 16, 4, 12, 4, pantsCol, pDark, pLight);

    // 2. Left Leg Base Box (16, 48)
    this.drawBox(16, 48, 4, 12, 4, pantsCol, pDark, pLight);

    // 3. Tailored Belt & Metallic Buckle
    const beltCol = options.beltCol || blend(pantsCol, [0, 0, 0, 255], 0.35); // Complementary dark leather / canvas
    const buckleCol = options.buckleCol || oklch(0.85, 0.14, 85); // Polished metallic buckle

    // Right Leg Belt (Row 20 across all faces)
    this.fillRect(0, 20, 16, 1, beltCol);
    this.setPixel(7, 20, buckleCol); // Right half of buckle

    // Left Leg Belt (Row 52 across all faces)
    this.fillRect(16, 52, 16, 1, beltCol);
    this.setPixel(20, 52, buckleCol); // Left half of buckle

    // 4. Inner Leg Shadow (creates clean physical separation between legs)
    for (let dy = 1; dy < 8; dy++) {
      this.setPixel(7, 20 + dy, pDark); // Right leg inner front
      this.setPixel(20, 52 + dy, pDark); // Left leg inner front
    }

    // 5. Front Slant Pockets (косые карманы)
    this.setPixel(4, 21, pDark);
    this.setPixel(5, 22, pDark);
    this.setPixel(23, 53, pDark);
    this.setPixel(22, 54, pDark);

    // 6. Outer Leg Seam / Crease (боковой шов)
    for (let dy = 1; dy < 8; dy++) {
      this.setPixel(1, 20 + dy, pDark); // Right outer seam
      this.setPixel(26, 52 + dy, pDark); // Left outer seam
    }

    // 7. Knee Creases & Folds (реалистичные складки на коленях)
    // Right knee: rows 24-25
    this.fillRect(4, 24, 3, 1, pLight); // Light stretch
    this.fillRect(4, 25, 3, 1, pDark);  // Crease shadow
    // Left knee: rows 56-57
    this.fillRect(21, 56, 3, 1, pLight); // Light stretch
    this.fillRect(21, 57, 3, 1, pDark);  // Crease shadow

    // 8. Back Pockets on back of pants
    // Right back: x=13..14, y=22..24
    this.fillRect(13, 22, 2, 1, pLight); // pocket welt
    this.fillRect(13, 24, 2, 1, pDeeper); // bottom seam
    // Left back: x=29..30, y=54..56
    this.fillRect(29, 54, 2, 1, pLight); // pocket welt
    this.fillRect(29, 56, 2, 1, pDeeper); // bottom seam

    // 9. Ankle hem fold
    this.fillRect(4, 28, 3, 1, pDark);
    this.fillRect(21, 60, 3, 1, pDark);

    // -------------------------------------------------------------
    // 3D PANTS OVERLAY: ROLLED-UP CUFFS (ПОДВОРОТЫ)
    // Right Overlay: u=0..15, v=32..47 (Leg front is y=36..47)
    // Left Overlay:  u=0..15, v=48..63 (Leg front is y=52..63)
    // -------------------------------------------------------------
    const hasCuffs = options.hasCuffs !== false;
    if (hasCuffs) {
      const cuffCol = blend(pantsCol, [255, 255, 255, 255], 0.14);
      const cuffDark = blend(pantsCol, [0, 0, 0, 255], 0.10);

      // Right Leg 3D Rolled Cuff (All 4 faces at y=44..45)
      this.fillRect(0, 44, 16, 1, cuffCol);
      this.fillRect(0, 45, 16, 1, cuffDark);

      // Left Leg 3D Rolled Cuff (All 4 faces at y=60..61)
      this.fillRect(0, 60, 16, 1, cuffCol);
      this.fillRect(0, 61, 16, 1, cuffDark);
    }

    // -------------------------------------------------------------
    // FOOTWEAR: ELEGANT LOAFERS OR RETRO SNEAKERS
    // -------------------------------------------------------------
    if (shoesCol) {
      const isLoafers = options.isLoafers || false;
      if (isLoafers) {
        // Classic Penny Loafers (skin #5 aesthetic)
        const shDark = blend(shoesCol, [0, 0, 0, 255], 0.20);
        const shStrap = blend(shoesCol, [255, 255, 255, 255], 0.14);
        const shSole = oklch(0.14, 0.02, 55); // Dark leather outsole

        // Right Shoe (Rows 29..31)
        this.fillRect(0, 29, 16, 1, shoesCol);
        this.setPixel(5, 29, shStrap); // Penny saddle notch
        this.setPixel(6, 29, shStrap);
        this.fillRect(0, 30, 16, 1, shDark); // Welt
        this.fillRect(0, 31, 16, 1, shSole); // Leather sole
        this.fillRect(8, 16, 4, 4, shSole); // Shoe bottom sole

        // Left Shoe (Rows 61..63)
        this.fillRect(16, 61, 16, 1, shoesCol);
        this.setPixel(21, 61, shStrap); // Penny saddle notch
        this.setPixel(22, 61, shStrap);
        this.fillRect(16, 62, 16, 1, shDark); // Welt
        this.fillRect(16, 63, 16, 1, shSole); // Leather sole
        this.fillRect(24, 48, 4, 4, shSole); // Shoe bottom sole
      } else {
        // Retro Minimalist Two-Tone Sneakers
        const shDark = blend(shoesCol, [0, 0, 0, 255], 0.15);
        const shLaces = blend(shoesCol, [255, 255, 255, 255], 0.25);
        const rubberMidsole = oklch(0.96, 0.005, 270); // Crisp off-white foxing
        const rubberOutsole = oklch(0.20, 0.01, 270); // Grippy tread

        // Right Shoe
        this.fillRect(0, 29, 16, 1, shoesCol);
        this.setPixel(5, 29, shLaces); // Center laces
        this.setPixel(6, 29, shLaces);
        this.fillRect(0, 30, 16, 1, rubberMidsole); // Thick rubber midsole
        this.fillRect(0, 31, 16, 1, rubberOutsole); // Dark tread
        this.fillRect(8, 16, 4, 4, rubberOutsole); // Shoe bottom sole

        // Left Shoe
        this.fillRect(16, 61, 16, 1, shoesCol);
        this.setPixel(21, 61, shLaces); // Center laces
        this.setPixel(22, 61, shLaces);
        this.fillRect(16, 62, 16, 1, rubberMidsole);
        this.fillRect(16, 63, 16, 1, rubberOutsole);
        this.fillRect(24, 48, 4, 4, rubberOutsole); // Shoe bottom sole
      }
    }

    if (hasJacketOverlay) {
      // 3D Hoodie collar & hem overlay
      this.fillRect(21, 36, 6, 1, blend(shirtCol, [255, 255, 255, 255], 0.12));
      this.fillRect(20, 46, 8, 2, sDark);
      this.fillRect(44, 46, 4, 2, sDark);
      this.fillRect(52, 62, 4, 2, sDark);
    }
  }

  // --- 100% READABLE PIXEL-PERFECT TYPOGRAPHY ---

  /**
   * Crystal-Clear High-Legibility "KB" Logo
   * 4-wide K + 1-wide space + 3-wide B = 8 pixels wide across torso front (x=20..27)
   * K has real diagonals: col 0 stem, col 1 junction, col 2-3 branches.
   * B has real counters: col 0 stem, col 1 open holes at rows 1 & 3, col 2 rounded curves.
   */
  drawFrontKB(logoCol, yPos = 23) {
    const k = [
      [1, 0, 0, 1], // row 0: K..K
      [1, 0, 1, 0], // row 1: K.K.
      [1, 1, 0, 0], // row 2: KK.. (clean middle junction)
      [1, 0, 1, 0], // row 3: K.K.
      [1, 0, 0, 1]  // row 4: K..K
    ];
    const b = [
      [1, 1, 0],    // row 0: BB.
      [1, 0, 1],    // row 1: B.B (hole in middle!)
      [1, 1, 0],    // row 2: BB.
      [1, 0, 1],    // row 3: B.B (hole in middle!)
      [1, 1, 0]     // row 4: BB.
    ];

    // Draw on Base Torso Layer (x=20..27, y=20..31)
    for (let dy = 0; dy < 5; dy++) {
      for (let dx = 0; dx < 4; dx++) {
        if (k[dy][dx]) {
          this.setPixel(20 + dx, yPos + dy, logoCol);
          this.setPixel(20 + dx, yPos + 16 + dy, logoCol); // also on jacket overlay!
        }
      }
      for (let dx = 0; dx < 3; dx++) {
        if (b[dy][dx]) {
          this.setPixel(25 + dx, yPos + dy, logoCol);
          this.setPixel(25 + dx, yPos + 16 + dy, logoCol); // also on jacket overlay!
        }
      }
    }
  }

  /**
   * Crystal-Clear High-Legibility Vertical "K - B - L" down the back spine
   * Width: 3 pixels (x=35..37), height: 11 pixels (y=20..30).
   * Perfectly proportioned with distinct letter shapes and 1px spacing.
   */
  drawBackSpineKBL(logoCol, xCenter = 35, yPos = 20) {
    const k = [
      [1, 0, 1], // #.#
      [1, 1, 0], // ##.
      [1, 0, 1]  // #.#
    ];
    const b = [
      [1, 1, 0], // ##.
      [1, 0, 1], // #.# (open hole!)
      [1, 1, 0]  // ##.
    ];
    const l = [
      [1, 0, 0], // #..
      [1, 0, 0], // #..
      [1, 1, 1]  // ###
    ];

    // Draw on Base Back (x=32..39, y=20..31) & Jacket Back (y=36..47)
    // K at yPos
    for (let dy = 0; dy < 3; dy++) {
      for (let dx = 0; dx < 3; dx++) {
        if (k[dy][dx]) {
          this.setPixel(xCenter + dx, yPos + dy, logoCol);
          this.setPixel(xCenter + dx, yPos + 16 + dy, logoCol);
        }
      }
    }
    // B at yPos + 4
    for (let dy = 0; dy < 3; dy++) {
      for (let dx = 0; dx < 3; dx++) {
        if (b[dy][dx]) {
          this.setPixel(xCenter + dx, yPos + 4 + dy, logoCol);
          this.setPixel(xCenter + dx, yPos + 20 + dy, logoCol);
        }
      }
    }
    // L at yPos + 8
    for (let dy = 0; dy < 3; dy++) {
      for (let dx = 0; dx < 3; dx++) {
        if (l[dy][dx]) {
          this.setPixel(xCenter + dx, yPos + 8 + dy, logoCol);
          this.setPixel(xCenter + dx, yPos + 24 + dy, logoCol);
        }
      }
    }
  }

  /**
   * Bold Horizontal "KB" across the back shoulders (x=32..39)
   */
  drawBackKB(logoCol, yPos = 23) {
    const k = [
      [1, 0, 0, 1],
      [1, 0, 1, 0],
      [1, 1, 0, 0],
      [1, 0, 1, 0],
      [1, 0, 0, 1]
    ];
    const b = [
      [1, 1, 0],
      [1, 0, 1],
      [1, 1, 0],
      [1, 0, 1],
      [1, 1, 0]
    ];

    for (let dy = 0; dy < 5; dy++) {
      for (let dx = 0; dx < 4; dx++) {
        if (k[dy][dx]) {
          this.setPixel(32 + dx, yPos + dy, logoCol);
          this.setPixel(32 + dx, yPos + 16 + dy, logoCol);
        }
      }
      for (let dx = 0; dx < 3; dx++) {
        if (b[dy][dx]) {
          this.setPixel(37 + dx, yPos + dy, logoCol);
          this.setPixel(37 + dx, yPos + 16 + dy, logoCol);
        }
      }
    }
  }

  drawDrawstrings(col = [255, 255, 255, 255]) {
    this.fillRect(22, 20, 1, 3, col);
    this.fillRect(25, 20, 1, 3, col);
  }

  toPngBuffer() {
    return encodePng(this.w, this.h, this.buf);
  }
}

// Generate 8x face avatar
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

// Render clean 180x260 orthographic preview
function renderPreview(skin) {
  const pw = 180, ph = 260;
  const prev = new SkinCanvas(pw, ph);

  for (let y = 0; y < ph; y++) {
    const t = y / ph;
    const bgCol = blend([26, 20, 44, 255], [14, 10, 24, 255], t);
    for (let x = 0; x < pw; x++) prev.setPixel(x, y, bgCol);
  }

  const S = 5;
  const drawBlock = (px, py, col) => {
    if (col[3] < 10) return;
    for (let dy = 0; dy < S; dy++) {
      for (let dx = 0; dx < S; dx++) prev.setPixel(px + dx, py + dy, col);
    }
  };

  const cx = 50, cy = 35;

  // Drop shadow
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 18 * S; x++) {
      const dist = Math.abs(x - 9 * S) / (9 * S);
      const alpha = Math.max(0, Math.round((1 - dist) * 90 * (1 - y / 8)));
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

  return prev.toPngBuffer();
}

// -------------------------------------------------------------
// DEFINITION OF THE 10 SKINS WITH 100% READABLE LETTERS
// -------------------------------------------------------------

// 1. KB Onyx Hoodie
function makeMinSkin01() {
  const s = new SkinCanvas(64, 64);
  const skinTone = oklch(0.82, 0.05, 55);
  const hairCol = oklch(0.28, 0.03, 50);
  const eyeCol = oklch(0.40, 0.08, 250);
  const onyx = oklch(0.18, 0.01, 270);
  const starkWhite = oklch(0.98, 0.005, 270); // Pure White, ΔL=0.80!
  const denim = oklch(0.25, 0.01, 270);
  const sneakers = oklch(0.96, 0.005, 270);

  s.drawAestheticHead(skinTone, hairCol, eyeCol);
  s.drawMinimalistBody(onyx, denim, sneakers);
  s.drawDrawstrings(starkWhite);

  s.drawFrontKB(starkWhite, 23);
  s.drawBackSpineKBL(starkWhite, 35, 20);

  return s;
}

// 2. KBL Oat Sweatshirt
function makeMinSkin02() {
  const s = new SkinCanvas(64, 64);
  const skinTone = oklch(0.84, 0.05, 60);
  const hairCol = oklch(0.60, 0.07, 75);
  const eyeCol = oklch(0.55, 0.08, 150);
  const oatCream = oklch(0.91, 0.02, 85);
  // High contrast Deep Royal Violet (L=0.36 vs Oat L=0.91, ΔL=0.55 - crystal clear!)
  const deepViolet = oklch(0.36, 0.22, 305);
  const slatePants = oklch(0.32, 0.02, 260);
  const retroTrainers = oklch(0.93, 0.02, 85);

  s.drawAestheticHead(skinTone, hairCol, eyeCol);
  s.drawMinimalistBody(oatCream, slatePants, retroTrainers);

  s.drawFrontKB(deepViolet, 23);
  s.drawBackSpineKBL(deepViolet, 35, 20);

  return s;
}

// 3. KB Midnight Stealth
function makeMinSkin03() {
  const s = new SkinCanvas(64, 64);
  const skinTone = oklch(0.80, 0.05, 50);
  const hairCol = oklch(0.18, 0.01, 270);
  const eyeCol = oklch(0.82, 0.16, 210);
  const midnight = oklch(0.16, 0.04, 275);
  const electricCyan = oklch(0.86, 0.18, 210); // L=0.86 vs L=0.16, ΔL=0.70!
  const joggers = oklch(0.20, 0.02, 275);
  const techShoes = oklch(0.14, 0.01, 270);

  s.drawAestheticHead(skinTone, hairCol, eyeCol);
  s.drawMinimalistBody(midnight, joggers, techShoes);

  s.drawFrontKB(electricCyan, 23);
  s.drawDrawstrings(electricCyan);
  s.drawBackSpineKBL(electricCyan, 35, 20);

  s.fillRect(36, 59, 2, 1, electricCyan); // cuff tag

  return s;
}

// 4. KBL White Streetwear
function makeMinSkin04() {
  const s = new SkinCanvas(64, 64);
  const skinTone = oklch(0.83, 0.05, 55);
  const hairCol = oklch(0.36, 0.06, 45);
  const eyeCol = oklch(0.42, 0.06, 230);
  const pristineWhite = oklch(0.97, 0.005, 270);
  const pitchBlack = oklch(0.12, 0.005, 270); // L=0.12 vs L=0.97, ΔL=0.85!
  const washedDenim = oklch(0.46, 0.09, 245);
  const lowTops = oklch(0.96, 0.005, 270);

  s.drawAestheticHead(skinTone, hairCol, eyeCol);
  s.drawMinimalistBody(pristineWhite, washedDenim, lowTops);

  s.drawFrontKB(pitchBlack, 23);
  s.drawBackSpineKBL(pitchBlack, 35, 20);

  s.fillRect(22, 20, 4, 1, oklch(0.92, 0.005, 270));

  return s;
}

// 5. KB Sand Dune Knit
function makeMinSkin05() {
  const s = new SkinCanvas(64, 64);
  const skinTone = oklch(0.82, 0.05, 60);
  const hairCol = oklch(0.24, 0.03, 50);
  const eyeCol = oklch(0.45, 0.05, 60);
  const sandKnit = oklch(0.76, 0.05, 75);
  const darkEspresso = oklch(0.20, 0.04, 55); // L=0.20 vs Sand L=0.76, ΔL=0.56!
  const ivoryPants = oklch(0.90, 0.02, 85);
  const loafers = oklch(0.26, 0.04, 55);

  s.drawAestheticHead(skinTone, hairCol, eyeCol);
  s.drawMinimalistBody(sandKnit, ivoryPants, loafers, true, {
    beltCol: darkEspresso,
    buckleCol: oklch(0.86, 0.16, 85), // Polished gold buckle
    isLoafers: true,
    hasCuffs: true
  });

  s.drawFrontKB(darkEspresso, 23);
  s.drawBackKB(darkEspresso, 23);

  s.fillRect(21, 36, 6, 1, oklch(0.70, 0.05, 75));

  return s;
}

// 5B / 6. KB Sand Dune (White Edition) - Копия любимого скина с белыми волосами и белыми брюками
function makeMinSkin05White() {
  const s = new SkinCanvas(64, 64);
  const skinTone = oklch(0.82, 0.05, 60);
  // Pure Platinum / Snow White Hair with brilliant highlight
  const hairCol = oklch(0.96, 0.012, 260);
  const hairHighlight = oklch(0.99, 0.005, 260);
  const eyeCol = oklch(0.42, 0.14, 260); // Deep sapphire eyes (gorgeous contrast with white hair!)
  const sandKnit = oklch(0.76, 0.05, 75);
  const darkEspresso = oklch(0.20, 0.04, 55); // L=0.20 vs Sand L=0.76, ΔL=0.56!
  const whitePants = oklch(0.97, 0.005, 270);
  const whiteLoafers = oklch(0.95, 0.005, 270);

  s.drawAestheticHead(skinTone, hairCol, eyeCol, hairHighlight);
  s.drawMinimalistBody(sandKnit, whitePants, whiteLoafers, true, {
    beltCol: darkEspresso,
    buckleCol: oklch(0.86, 0.16, 85), // Polished gold buckle
    isLoafers: true,
    hasCuffs: true
  });

  s.drawFrontKB(darkEspresso, 23);
  s.drawBackKB(darkEspresso, 23);

  s.fillRect(21, 36, 6, 1, oklch(0.70, 0.05, 75));

  return s;
}

// 6. KB Emerald Varsity Bomber
function makeMinSkin06() {
  const s = new SkinCanvas(64, 64);
  const skinTone = oklch(0.81, 0.05, 55);
  const hairCol = oklch(0.20, 0.01, 270);
  const eyeCol = oklch(0.48, 0.07, 160);
  const deepEmerald = oklch(0.36, 0.12, 155);
  const ivorySleeves = oklch(0.94, 0.01, 90); // L=0.94 vs L=0.36, ΔL=0.58!
  const beigeChinos = oklch(0.42, 0.04, 75);
  const varsityShoes = oklch(0.92, 0.01, 90);

  s.drawAestheticHead(skinTone, hairCol, eyeCol);
  s.drawMinimalistBody(deepEmerald, beigeChinos, varsityShoes, false);

  s.fillRect(40, 20, 16, 12, ivorySleeves);
  s.fillRect(32, 52, 16, 12, ivorySleeves);
  s.fillRect(44, 30, 4, 1, deepEmerald);
  s.fillRect(36, 62, 4, 1, deepEmerald);
  s.fillRect(21, 36, 6, 1, ivorySleeves);

  s.drawFrontKB(ivorySleeves, 23);
  s.drawBackSpineKBL(ivorySleeves, 35, 20);

  return s;
}

// 7. KBL Graphite Minimal
function makeMinSkin07() {
  const s = new SkinCanvas(64, 64);
  const skinTone = oklch(0.80, 0.05, 50);
  const hairCol = oklch(0.68, 0.02, 260);
  const eyeCol = oklch(0.70, 0.18, 55);
  const graphite = oklch(0.30, 0.01, 260);
  const flameOrange = oklch(0.74, 0.22, 50); // Vibrant pure orange, high pop!
  const blackCargo = oklch(0.18, 0.01, 270);
  const runners = oklch(0.22, 0.01, 270);

  s.drawAestheticHead(skinTone, hairCol, eyeCol);
  s.drawMinimalistBody(graphite, blackCargo, runners);

  s.drawFrontKB(flameOrange, 23);
  s.drawBackSpineKBL(flameOrange, 35, 20);

  s.fillRect(36, 60, 4, 1, flameOrange);

  return s;
}

// 8. KB Vintage Denim
function makeMinSkin08() {
  const s = new SkinCanvas(64, 64);
  const skinTone = oklch(0.83, 0.05, 55);
  const hairCol = oklch(0.72, 0.09, 80);
  const eyeCol = oklch(0.50, 0.09, 240);
  const heatherGray = oklch(0.78, 0.01, 260);
  const vintageIndigo = oklch(0.40, 0.10, 250);
  const starkWhite = oklch(0.98, 0.005, 270);
  const blackJeans = oklch(0.24, 0.01, 270);
  const skateShoes = oklch(0.20, 0.01, 270);

  s.drawAestheticHead(skinTone, hairCol, eyeCol);
  s.drawMinimalistBody(heatherGray, blackJeans, skateShoes);

  s.fillRect(20, 36, 3, 11, vintageIndigo);
  s.fillRect(25, 36, 3, 11, vintageIndigo);
  s.fillRect(32, 36, 8, 11, vintageIndigo);
  s.fillRect(16, 36, 4, 11, vintageIndigo);
  s.fillRect(28, 36, 4, 11, vintageIndigo);

  s.drawFrontKB(starkWhite, 23);
  s.drawBackSpineKBL(starkWhite, 35, 20);

  return s;
}

// 9. KB Pastel Breeze
function makeMinSkin09() {
  const s = new SkinCanvas(64, 64);
  const skinTone = oklch(0.85, 0.04, 55);
  const hairCol = oklch(0.38, 0.04, 310);
  const eyeCol = oklch(0.65, 0.08, 175);
  const cloudMint = oklch(0.88, 0.05, 170);
  // High contrast Deep Rose/Magenta (L=0.40 vs Mint L=0.88, ΔL=0.48 - sharp!)
  const deepRose = oklch(0.40, 0.18, 350);
  const whiteSlacks = oklch(0.96, 0.005, 270);
  const pastelSneakers = oklch(0.92, 0.03, 170);

  s.drawAestheticHead(skinTone, hairCol, eyeCol);
  s.drawMinimalistBody(cloudMint, whiteSlacks, pastelSneakers);

  s.drawFrontKB(deepRose, 23);
  s.drawBackSpineKBL(deepRose, 35, 20);

  return s;
}

// 10. KBL 24K Gold Minimal
function makeMinSkin10() {
  const s = new SkinCanvas(64, 64);
  const skinTone = oklch(0.82, 0.05, 55);
  const hairCol = oklch(0.20, 0.02, 50);
  const eyeCol = oklch(0.78, 0.15, 85);
  const pitchBlack = oklch(0.15, 0.01, 270);
  const pureGold = oklch(0.84, 0.18, 85); // Brilliant 24K Gold, L=0.84 vs L=0.15, ΔL=0.69!
  const blackTrousers = oklch(0.18, 0.01, 270);
  const polishedShoes = oklch(0.12, 0.01, 270);

  s.drawAestheticHead(skinTone, hairCol, eyeCol);
  s.drawMinimalistBody(pitchBlack, blackTrousers, polishedShoes);

  s.drawFrontKB(pureGold, 23);
  s.drawDrawstrings(pureGold);
  s.drawBackSpineKBL(pureGold, 35, 20);

  s.fillRect(44, 29, 4, 1, pureGold);
  s.fillRect(36, 61, 4, 1, pureGold);

  return s;
}

// -------------------------------------------------------------
// EXECUTE GENERATION
// -------------------------------------------------------------
const catalogDir = path.resolve(__dirname, '../skins_catalog/kbl_minimal');
if (!fs.existsSync(catalogDir)) {
  fs.mkdirSync(catalogDir, { recursive: true });
}

const MINIMAL_VARIANTS = [
  { id: 'kbl_min_01_onyx_hoodie', name: 'KB Onyx Hoodie', tag: 'Черный Оверсайз', branding: 'KB + KBL', desc: 'Черный матовый худи с четким белым лого KB спереди и вертикальным KBL на спине', fn: makeMinSkin01 },
  { id: 'kbl_min_02_oat_sweatshirt', name: 'KB Oat Sweatshirt', tag: 'Скандинавский Крем', branding: 'KB + KBL', desc: 'Кремовый свитшот с контрастным глубоким фиолетовым KB спереди и KBL на спине', fn: makeMinSkin02 },
  { id: 'kbl_min_03_midnight_stealth', name: 'KB Midnight Stealth', tag: 'Полуночный Циан', branding: 'KB + KBL', desc: 'Темно-индиго худи с ярким неоновым электрик-циановым логотипом KB и KBL', fn: makeMinSkin03 },
  { id: 'kbl_min_04_white_streetwear', name: 'KB White Streetwear', tag: 'Чистый Стритвир', branding: 'KB + KBL', desc: 'Белая оверсайз-футболка с контрастным черным лого KB спереди и KBL на спине', fn: makeMinSkin04 },
  { id: 'kbl_min_05_sand_dune_knit', name: '⭐ KB Sand Dune Knit', tag: 'Песочный Вязаный', branding: 'KB', desc: 'Любимый скин: песочный свитер фактурной вязки, темные волосы-шторки, брюки айвори с ремнем и лоферами', fn: makeMinSkin05 },
  { id: 'kbl_min_06_sand_dune_white', name: '⭐ KB Sand Dune (White Edition)', tag: 'White Edition', branding: 'KB', desc: 'Копия любимого скина: платиново-белые волосы (шторки), сапфировые глаза, белые брюки со складками и 3D-подворотами', fn: makeMinSkin05White },
  { id: 'kbl_min_07_emerald_varsity', name: 'KB Emerald Varsity', tag: 'Изумрудный Бомбер', branding: 'KB + KBL', desc: 'Колледж-бомбер цвета изумруда с айвори рукавами и четкой нашивкой KB', fn: makeMinSkin06 },
  { id: 'kbl_min_08_graphite_minimal', name: 'KB Graphite Minimal', tag: 'Графит & Пламя', branding: 'KB + KBL', desc: 'Графитовый лонгслив с пламенно-оранжевым четким лого KB и KBL на спине', fn: makeMinSkin07 },
  { id: 'kbl_min_09_vintage_denim', name: 'KB Vintage Denim', tag: 'Винтажный Деним', branding: 'KB + KBL', desc: 'Джинсовка поверх серого худи с белым лого KB спереди и KBL на спине джинсовки', fn: makeMinSkin08 },
  { id: 'kbl_min_10_pastel_breeze', name: 'KB Pastel Breeze', tag: 'Мятная Пастель', branding: 'KB + KBL', desc: 'Мятный лонгслив с контрастным ягодно-розовым читаемым лого KB и KBL', fn: makeMinSkin09 },
  { id: 'kbl_min_11_24k_gold', name: 'KB 24K Gold Minimal', tag: 'Черный & Золото', branding: 'KB + KBL', desc: 'Лаконичный черный худи с благородным 24K золотым логотипом KB и KBL на спине', fn: makeMinSkin10 }
];

console.log(`Re-generating ${MINIMAL_VARIANTS.length} skins with 100% readable letters...`);

const manifest = [];

for (let i = 0; i < MINIMAL_VARIANTS.length; i++) {
  const item = MINIMAL_VARIANTS[i];
  const skinCanvas = item.fn();

  const skinFileName = `${item.id}.png`;
  const avatarFileName = `${item.id}_avatar.png`;
  const previewFileName = `${item.id}_preview.png`;

  const skinBuf = skinCanvas.toPngBuffer();
  const avatarBuf = extractAvatar(skinCanvas);
  const previewBuf = renderPreview(skinCanvas);

  fs.writeFileSync(path.join(catalogDir, skinFileName), skinBuf);
  fs.writeFileSync(path.join(catalogDir, avatarFileName), avatarBuf);
  fs.writeFileSync(path.join(catalogDir, previewFileName), previewBuf);

  // Also mirror previews to artifact directory for instant rich markdown rendering
  const artifactPreviewDir = 'C:\\Users\\Anon\\.gemini\\antigravity\\brain\\3b4e9621-5ad9-4fe6-99e0-638e62d645c7\\kbl_minimal_previews';
  if (fs.existsSync(artifactPreviewDir)) {
    fs.writeFileSync(path.join(artifactPreviewDir, previewFileName), previewBuf);
    fs.writeFileSync(path.join(artifactPreviewDir, avatarFileName), avatarBuf);
  }

  // If this is Skin #5 (KB Sand Dune Knit - the user's favorite!), copy directly to launcher assets
  if (item.id === 'kbl_min_05_sand_dune_knit') {
    const assetsDir = path.resolve(__dirname, '../assets');
    fs.writeFileSync(path.join(assetsDir, 'kbl-skin.png'), skinBuf);
    fs.writeFileSync(path.join(assetsDir, 'kbl-avatar.png'), avatarBuf);
    console.log(`  -> Mirrored ${item.name} to assets/kbl-skin.png and assets/kbl-avatar.png`);
  }

  // If this is Skin #6 (KB Sand Dune White Edition - the copy!), copy directly to launcher assets
  if (item.id === 'kbl_min_06_sand_dune_white') {
    const assetsDir = path.resolve(__dirname, '../assets');
    fs.writeFileSync(path.join(assetsDir, 'kbl-white-skin.png'), skinBuf);
    fs.writeFileSync(path.join(assetsDir, 'kbl-white-avatar.png'), avatarBuf);
    console.log(`  -> Mirrored ${item.name} to assets/kbl-white-skin.png and assets/kbl-white-avatar.png`);
  }

  manifest.push({
    index: i + 1,
    id: item.id,
    name: item.name,
    tag: item.tag,
    branding: item.branding,
    desc: item.desc,
    skinFile: skinFileName,
    avatarFile: avatarFileName,
    previewFile: previewFileName
  });

  console.log(`[${i + 1}/${MINIMAL_VARIANTS.length}] Created ${item.name} (${item.branding}) -> ${skinFileName}`);
}

fs.writeFileSync(path.join(catalogDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

console.log('All 10 skins re-generated with 100% readable typography!');
