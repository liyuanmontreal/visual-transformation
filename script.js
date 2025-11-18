// 50 visual transforms demo
// All comments are in English for easier reading and sharing.

const originalCanvas = document.getElementById("originalCanvas");
const transformedCanvas = document.getElementById("transformedCanvas");
const octx = originalCanvas.getContext("2d");
const tctx = transformedCanvas.getContext("2d");

const imageInput = document.getElementById("imageInput");
const transformSelect = document.getElementById("transformSelect");
const applyBtn = document.getElementById("applyBtn");
const resetBtn = document.getElementById("resetBtn");
const downloadBtn = document.getElementById("downloadBtn");
const explanationEl = document.getElementById("explanation");

let img = new Image();
let hasImage = false;

// List of 50 transforms with id, label and a short explanation.
// The implementation is in applyTransform().
const TRANSFORMS = [
  { id: "t1",  label: "01 - Horizontal flip",                         info: "Mirror the image left-right. This is what happens when a projector is mirrored." },
  { id: "t2",  label: "02 - Vertical flip",                           info: "Flip the image upside down. Very uncommon in everyday life, so the brain struggles." },
  { id: "t3",  label: "03 - Rotate 90° clockwise",                    info: "Rotate the image 90 degrees. Reading becomes vertical instead of horizontal." },
  { id: "t4",  label: "04 - Rotate 180°",                             info: "Rotate the image 180 degrees. Many characters become ambiguous (6/9, p/d, b/q)." },
  { id: "t5",  label: "05 - Rotate 270° (90° CCW)",                   info: "Rotate 270 degrees (or -90). Another orientation that breaks reading habits." },
  { id: "t6",  label: "06 - Slight tilt +7°",                          info: "Apply a small clockwise tilt. The brain constantly tries to straighten it." },
  { id: "t7",  label: "07 - Slight tilt -7°",                          info: "Apply a small counter-clockwise tilt. Visually uncomfortable but simple geometrically." },
  { id: "t8",  label: "08 - Random small rotation",                   info: "Rotate by a random angle between -10° and 10°. Looks almost straight but never quite." },
  { id: "t9",  label: "09 - Zoom in (center crop)",                   info: "Zoom into the center region. Context disappears although the content is the same." },
  { id: "t10", label: "10 - Zoom out (shrink inside frame)",          info: "Shrink the image and surround it with empty space. Composition feels very different." },
  { id: "t11", label: "11 - Horizontal half mirror",                  info: "Copy the left half and mirror it to the right. Creates symmetric but unnatural faces." },
  { id: "t12", label: "12 - Vertical half mirror",                    info: "Copy the top half and mirror it to the bottom. Gravity cues are broken." },
  { id: "t13", label: "13 - 3x3 grid scramble (swap center and corner)", info: "Cut the image into a 3x3 grid and swap the center with a corner tile." },
  { id: "t14", label: "14 - 4x4 grid strip shuffle",                  info: "Shuffle vertical strips of a coarse 4x4 grid. Global structure is broken but local details remain." },
  { id: "t15", label: "15 - Strong pixelation",                       info: "Downsample heavily then upscale. Shapes remain but fine details vanish." },
  { id: "t16", label: "16 - Mild pixelation",                         info: "Gentle pixelation. Just enough to feel lo-fi and slightly confusing." },
  { id: "t17", label: "17 - Invert colors",                           info: "Invert RGB values. Geometry is intact but color expectations are violated." },
  { id: "t18", label: "18 - Grayscale",                               info: "Convert to grayscale. Removes all hue information and changes how we group objects." },
  { id: "t19", label: "19 - Sepia",                                   info: "Apply a warm brown tone, like an old photograph." },
  { id: "t20", label: "20 - Binary threshold",                        info: "Turn pixels either black or white based on brightness. Text may survive, textures do not." },
  { id: "t21", label: "21 - High contrast",                           info: "Increase contrast aggressively. Dark gets darker, bright gets brighter." },
  { id: "t22", label: "22 - Low contrast",                            info: "Flatten contrast. The image becomes foggy and hard to parse." },
  { id: "t23", label: "23 - Brightness up",                           info: "Shift brightness up. Highlights may blow out and details can be lost." },
  { id: "t24", label: "24 - Brightness down",                         info: "Shift brightness down. Everything feels underexposed." },
  { id: "t25", label: "25 - Desaturate",                              info: "Reduce saturation without going full gray. Colors feel tired." },
  { id: "t26", label: "26 - Oversaturate",                            info: "Increase saturation. Colors become almost cartoon-like." },
  { id: "t27", label: "27 - Swap red/blue channels",                  info: "Swap the red and blue channels. Skies and skin tones look alien." },
  { id: "t28", label: "28 - Swap red/green channels",                 info: "Swap the red and green channels. Grass and faces become strange." },
  { id: "t29", label: "29 - Swap green/blue channels",                info: "Swap green and blue. Water and foliage change roles." },
  { id: "t30", label: "30 - Add Gaussian-like noise",                 info: "Add small random noise to each pixel. The image becomes grainy." },
  { id: "t31", label: "31 - Salt-and-pepper noise",                   info: "Randomly flip some pixels to pure black or white." },
  { id: "t32", label: "32 - Box blur",                                info: "Apply a simple blur. Edges soften and text becomes hard to read." },
  { id: "t33", label: "33 - Sharpen",                                 info: "Enhance edges using a convolution kernel. Details pop but noise does too." },
  { id: "t34", label: "34 - Edge detection",                          info: "Highlight strong edges only. The world turns into a line drawing." },
  { id: "t35", label: "35 - Vignette (dark corners)",                 info: "Darken the corners more than the center. Focus is pulled inward." },
  { id: "t36", label: "36 - Scanline effect",                         info: "Darken every other row to mimic old CRT scanlines." },
  { id: "t37", label: "37 - Horizontal wave distortion",              info: "Shift pixels horizontally using a sine wave pattern." },
  { id: "t38", label: "38 - Vertical wave distortion",                info: "Shift pixels vertically using a sine wave pattern." },
  { id: "t39", label: "39 - Barrel distortion (bulge)",               info: "Warp pixels radially so the center bulges outward." },
  { id: "t40", label: "40 - Pincushion distortion (pinch)",           info: "Warp pixels radially so the center is pulled inward." },
  { id: "t41", label: "41 - Horizontal shear",                        info: "Shear the image horizontally so rows are offset by their vertical position." },
  { id: "t42", label: "42 - Vertical shear",                          info: "Shear the image vertically so columns are offset by their horizontal position." },
  { id: "t43", label: "43 - Swap quadrants",                          info: "Cut the image into four quadrants and swap diagonal ones." },
  { id: "t44", label: "44 - 4-way kaleidoscope",                      info: "Mirror one quadrant into the other three. Creates a symmetric kaleidoscope." },
  { id: "t45", label: "45 - 2x2 tiled mini image",                    info: "Shrink the original and tile it 2x2. The global layout changes but content repeats." },
  { id: "t46", label: "46 - Center glow",                             info: "Brighten the center more than the edges. Feels like a spotlight." },
  { id: "t47", label: "47 - Posterize (few color levels)",            info: "Reduce each channel to a small number of levels, like a poster." },
  { id: "t48", label: "48 - Solarize",                                info: "Invert pixels above a brightness threshold. Very surreal look." },
  { id: "t49", label: "49 - Emboss",                                  info: "Simulate a raised, embossed look by offset edge shading." },
  { id: "t50", label: "50 - Horizontal glitch stripes",               info: "Shift random horizontal bands left or right, like a digital glitch." }
];

// Populate the select element with all 50 transforms.
for (const t of TRANSFORMS) {
  const opt = document.createElement("option");
  opt.value = t.id;
  opt.textContent = t.label;
  transformSelect.appendChild(opt);
}

// Draw a simple default pattern on load so the demo works even without an image.
function drawDefaultPattern() {
  const w = originalCanvas.width;
  const h = originalCanvas.height;
  octx.clearRect(0, 0, w, h);

  const grad = octx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, "#0f172a");
  grad.addColorStop(1, "#1e293b");
  octx.fillStyle = grad;
  octx.fillRect(0, 0, w, h);

  // Draw a grid
  octx.strokeStyle = "rgba(148,163,184,0.4)";
  octx.lineWidth = 1;
  for (let x = 0; x <= w; x += 40) {
    octx.beginPath();
    octx.moveTo(x + 0.5, 0);
    octx.lineTo(x + 0.5, h);
    octx.stroke();
  }
  for (let y = 0; y <= h; y += 40) {
    octx.beginPath();
    octx.moveTo(0, y + 0.5);
    octx.lineTo(w, y + 0.5);
    octx.stroke();
  }

  // Draw center circle
  octx.beginPath();
  octx.arc(w / 2, h / 2, 60, 0, Math.PI * 2);
  octx.closePath();
  octx.fillStyle = "rgba(56,189,248,0.2)";
  octx.fill();
  octx.strokeStyle = "rgba(56,189,248,0.9)";
  octx.lineWidth = 2;
  octx.stroke();

  // Draw some squares
  const colors = ["#f97316", "#22c55e", "#38bdf8", "#e11d48"];
  for (let i = 0; i < 4; i++) {
    octx.fillStyle = colors[i];
    octx.fillRect(30 + i * 40, 30, 26, 26);
  }

  // Label text
  octx.fillStyle = "#e5e7eb";
  octx.font = "bold 20px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  octx.textAlign = "center";
  octx.fillText("Demo", w / 2, h / 2 + 5);
}

// Copy original to transformed as baseline.
function copyOriginalToTransformed() {
  const w = originalCanvas.width;
  const h = originalCanvas.height;
  transformedCanvas.width = w;
  transformedCanvas.height = h;
  tctx.clearRect(0, 0, w, h);
  tctx.drawImage(originalCanvas, 0, 0, w, h);
}

// Utility to get image data from original canvas.
function getOriginalImageData() {
  const w = originalCanvas.width;
  const h = originalCanvas.height;
  return octx.getImageData(0, 0, w, h);
}

// Utility to put image data to transformed canvas (assumes same size).
function putTransformedImageData(imageData) {
  transformedCanvas.width = imageData.width;
  transformedCanvas.height = imageData.height;
  tctx.putImageData(imageData, 0, 0);
}

// Helper: apply a function over pixel data (in-place).
function forEachPixel(imageData, fn) {
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    fn(d, i);
  }
}

// Color helpers
function clamp(v, min, max) {
  return v < min ? min : v > max ? max : v;
}

// ---- Transform implementations ----

// Geometric transforms using drawImage.
function transformFlipHorizontal() {
  const w = originalCanvas.width;
  const h = originalCanvas.height;
  transformedCanvas.width = w;
  transformedCanvas.height = h;
  tctx.save();
  tctx.clearRect(0, 0, w, h);
  tctx.translate(w, 0);
  tctx.scale(-1, 1);
  tctx.drawImage(originalCanvas, 0, 0, w, h);
  tctx.restore();
}

function transformFlipVertical() {
  const w = originalCanvas.width;
  const h = originalCanvas.height;
  transformedCanvas.width = w;
  transformedCanvas.height = h;
  tctx.save();
  tctx.clearRect(0, 0, w, h);
  tctx.translate(0, h);
  tctx.scale(1, -1);
  tctx.drawImage(originalCanvas, 0, 0, w, h);
  tctx.restore();
}

function transformRotate(angleRad) {
  const w = originalCanvas.width;
  const h = originalCanvas.height;
  transformedCanvas.width = w;
  transformedCanvas.height = h;
  tctx.save();
  tctx.clearRect(0, 0, w, h);
  tctx.translate(w / 2, h / 2);
  tctx.rotate(angleRad);
  tctx.drawImage(originalCanvas, -w / 2, -h / 2, w, h);
  tctx.restore();
}

function transformRandomSmallRotation() {
  const angleDeg = (Math.random() * 20) - 10;
  const angleRad = angleDeg * Math.PI / 180;
  transformRotate(angleRad);
}

function transformZoom(factor) {
  const w = originalCanvas.width;
  const h = originalCanvas.height;
  transformedCanvas.width = w;
  transformedCanvas.height = h;
  tctx.save();
  tctx.clearRect(0, 0, w, h);
  const dw = w * factor;
  const dh = h * factor;
  const dx = (w - dw) / 2;
  const dy = (h - dh) / 2;
  tctx.drawImage(originalCanvas, dx, dy, dw, dh);
  tctx.restore();
}

// Half mirror transforms.
function transformHorizontalHalfMirror() {
  const w = originalCanvas.width;
  const h = originalCanvas.height;
  const half = Math.floor(w / 2);
  transformedCanvas.width = w;
  transformedCanvas.height = h;
  tctx.clearRect(0, 0, w, h);
  tctx.drawImage(originalCanvas, 0, 0, half, h, 0, 0, half, h);
  tctx.save();
  tctx.translate(w, 0);
  tctx.scale(-1, 1);
  tctx.drawImage(originalCanvas, 0, 0, half, h, 0, 0, half, h);
  tctx.restore();
}

function transformVerticalHalfMirror() {
  const w = originalCanvas.width;
  const h = originalCanvas.height;
  const half = Math.floor(h / 2);
  transformedCanvas.width = w;
  transformedCanvas.height = h;
  tctx.clearRect(0, 0, w, h);
  tctx.drawImage(originalCanvas, 0, 0, w, half, 0, 0, w, half);
  tctx.save();
  tctx.translate(0, h);
  tctx.scale(1, -1);
  tctx.drawImage(originalCanvas, 0, 0, w, half, 0, 0, w, half);
  tctx.restore();
}

// Grid scramble helpers.
function transformGridSwapCenterCorner() {
  const w = originalCanvas.width;
  const h = originalCanvas.height;
  const rows = 3;
  const cols = 3;
  const tileW = Math.floor(w / cols);
  const tileH = Math.floor(h / rows);

  transformedCanvas.width = w;
  transformedCanvas.height = h;
  tctx.clearRect(0, 0, w, h);

  // Identity mapping
  const map = [];
  for (let r = 0; r < rows; r++) {
    map[r] = [];
    for (let c = 0; c < cols; c++) {
      map[r][c] = { r, c };
    }
  }
  // Swap center (1,1) with (0,2)
  map[1][1] = { r: 0, c: 2 };
  map[0][2] = { r: 1, c: 1 };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const src = map[r][c];
      const sx = src.c * tileW;
      const sy = src.r * tileH;
      const dx = c * tileW;
      const dy = r * tileH;
      tctx.drawImage(originalCanvas, sx, sy, tileW, tileH, dx, dy, tileW, tileH);
    }
  }
}

function transformStripShuffle() {
  const w = originalCanvas.width;
  const h = originalCanvas.height;
  const strips = 8;
  const stripW = Math.floor(w / strips);

  transformedCanvas.width = w;
  transformedCanvas.height = h;
  tctx.clearRect(0, 0, w, h);

  // Simple shuffled order: reverse every other pair.
  for (let i = 0; i < strips; i++) {
    let srcIndex = i;
    if (i % 2 === 1) {
      srcIndex = i - 1;
    }
    const sx = srcIndex * stripW;
    const dx = i * stripW;
    tctx.drawImage(originalCanvas, sx, 0, stripW, h, dx, 0, stripW, h);
  }
}

// Pixelation
function transformPixelate(blockSize) {
  const w = originalCanvas.width;
  const h = originalCanvas.height;
  const src = getOriginalImageData();
  const dst = tctx.createImageData(w, h);
  const sd = src.data;
  const dd = dst.data;

  for (let y = 0; y < h; y += blockSize) {
    for (let x = 0; x < w; x += blockSize) {
      const idx = (y * w + x) * 4;
      const r = sd[idx];
      const g = sd[idx + 1];
      const b = sd[idx + 2];
      const a = sd[idx + 3];
      for (let yy = 0; yy < blockSize; yy++) {
        for (let xx = 0; xx < blockSize; xx++) {
          const px = x + xx;
          const py = y + yy;
          if (px >= w || py >= h) continue;
          const di = (py * w + px) * 4;
          dd[di] = r;
          dd[di + 1] = g;
          dd[di + 2] = b;
          dd[di + 3] = a;
        }
      }
    }
  }
  putTransformedImageData(dst);
}

// Color transforms
function transformInvert() {
  const imgData = getOriginalImageData();
  forEachPixel(imgData, (d, i) => {
    d[i] = 255 - d[i];
    d[i + 1] = 255 - d[i + 1];
    d[i + 2] = 255 - d[i + 2];
  });
  putTransformedImageData(imgData);
}

function transformGrayscale() {
  const imgData = getOriginalImageData();
  forEachPixel(imgData, (d, i) => {
    const r = d[i], g = d[i + 1], b = d[i + 2];
    const v = 0.299 * r + 0.587 * g + 0.114 * b;
    d[i] = d[i + 1] = d[i + 2] = v;
  });
  putTransformedImageData(imgData);
}

function transformSepia() {
  const imgData = getOriginalImageData();
  forEachPixel(imgData, (d, i) => {
    const r = d[i], g = d[i + 1], b = d[i + 2];
    d[i]     = clamp(0.393 * r + 0.769 * g + 0.189 * b, 0, 255);
    d[i + 1] = clamp(0.349 * r + 0.686 * g + 0.168 * b, 0, 255);
    d[i + 2] = clamp(0.272 * r + 0.534 * g + 0.131 * b, 0, 255);
  });
  putTransformedImageData(imgData);
}

function transformThreshold() {
  const imgData = getOriginalImageData();
  forEachPixel(imgData, (d, i) => {
    const v = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    const b = v > 128 ? 255 : 0;
    d[i] = d[i + 1] = d[i + 2] = b;
  });
  putTransformedImageData(imgData);
}

function transformBrightnessContrast(brightness, contrast) {
  const imgData = getOriginalImageData();
  const c = contrast;
  const b = brightness;
  forEachPixel(imgData, (d, i) => {
    let r = d[i], g = d[i + 1], bch = d[i + 2];
    r = clamp(r * c + b, 0, 255);
    g = clamp(g * c + b, 0, 255);
    bch = clamp(bch * c + b, 0, 255);
    d[i] = r; d[i + 1] = g; d[i + 2] = bch;
  });
  putTransformedImageData(imgData);
}

function transformSaturation(factor) {
  const imgData = getOriginalImageData();
  forEachPixel(imgData, (d, i) => {
    const r = d[i], g = d[i + 1], b = d[i + 2];
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    d[i]     = clamp(gray + (r - gray) * factor, 0, 255);
    d[i + 1] = clamp(gray + (g - gray) * factor, 0, 255);
    d[i + 2] = clamp(gray + (b - gray) * factor, 0, 255);
  });
  putTransformedImageData(imgData);
}

function transformSwapChannels(mode) {
  const imgData = getOriginalImageData();
  forEachPixel(imgData, (d, i) => {
    let r = d[i], g = d[i + 1], b = d[i + 2];
    if (mode === "rb") {
      d[i] = b; d[i + 2] = r;
    } else if (mode === "rg") {
      d[i] = g; d[i + 1] = r;
    } else if (mode === "gb") {
      d[i + 1] = b; d[i + 2] = g;
    }
  });
  putTransformedImageData(imgData);
}

// Noise and blur
function transformGaussianNoise(strength) {
  const imgData = getOriginalImageData();
  forEachPixel(imgData, (d, i) => {
    const n = (Math.random() * 2 - 1) * strength;
    d[i]     = clamp(d[i] + n, 0, 255);
    d[i + 1] = clamp(d[i + 1] + n, 0, 255);
    d[i + 2] = clamp(d[i + 2] + n, 0, 255);
  });
  putTransformedImageData(imgData);
}

function transformSaltPepper(prob) {
  const imgData = getOriginalImageData();
  forEachPixel(imgData, (d, i) => {
    const r = Math.random();
    if (r < prob) {
      const val = Math.random() < 0.5 ? 0 : 255;
      d[i] = d[i + 1] = d[i + 2] = val;
    }
  });
  putTransformedImageData(imgData);
}

// Convolution helper
function convolve(kernel, divisor, offset) {
  const w = originalCanvas.width;
  const h = originalCanvas.height;
  const src = getOriginalImageData();
  const dst = tctx.createImageData(w, h);
  const sd = src.data;
  const dd = dst.data;
  const kw = 3, kh = 3;
  const half = 1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let r = 0, g = 0, b = 0;
      for (let ky = -half; ky <= half; ky++) {
        for (let kx = -half; kx <= half; kx++) {
          const px = clamp(x + kx, 0, w - 1);
          const py = clamp(y + ky, 0, h - 1);
          const si = (py * w + px) * 4;
          const kv = kernel[(ky + half) * kw + (kx + half)];
          r += sd[si] * kv;
          g += sd[si + 1] * kv;
          b += sd[si + 2] * kv;
        }
      }
      const di = (y * w + x) * 4;
      dd[di]     = clamp(r / divisor + offset, 0, 255);
      dd[di + 1] = clamp(g / divisor + offset, 0, 255);
      dd[di + 2] = clamp(b / divisor + offset, 0, 255);
      dd[di + 3] = 255;
    }
  }
  putTransformedImageData(dst);
}

function transformBoxBlur() {
  const kernel = [
    1, 1, 1,
    1, 1, 1,
    1, 1, 1
  ];
  convolve(kernel, 9, 0);
}

function transformSharpen() {
  const kernel = [
     0, -1,  0,
    -1,  5, -1,
     0, -1,  0
  ];
  convolve(kernel, 1, 0);
}

function transformEdgeDetect() {
  const kernel = [
    -1, -1, -1,
    -1,  8, -1,
    -1, -1, -1
  ];
  convolve(kernel, 1, 128);
}

// Vignette and scanlines
function transformVignette() {
  const w = originalCanvas.width;
  const h = originalCanvas.height;
  const imgData = getOriginalImageData();
  const d = imgData.data;
  const cx = w / 2;
  const cy = h / 2;
  const maxDist = Math.sqrt(cx * cx + cy * cy);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const factor = 1 - Math.pow(dist / maxDist, 2);
      const i = (y * w + x) * 4;
      const dim = clamp(factor, 0.3, 1);
      d[i]     *= dim;
      d[i + 1] *= dim;
      d[i + 2] *= dim;
    }
  }
  putTransformedImageData(imgData);
}

function transformScanlines() {
  const w = originalCanvas.width;
  const h = originalCanvas.height;
  const imgData = getOriginalImageData();
  const d = imgData.data;
  for (let y = 0; y < h; y++) {
    if (y % 2 === 1) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        d[i] *= 0.6;
        d[i + 1] *= 0.6;
        d[i + 2] *= 0.6;
      }
    }
  }
  putTransformedImageData(imgData);
}

// Wave and radial distortions
function transformWave(horizontal) {
  const w = originalCanvas.width;
  const h = originalCanvas.height;
  const src = getOriginalImageData();
  const dst = tctx.createImageData(w, h);
  const sd = src.data;
  const dd = dst.data;

  const amplitude = 10;
  const frequency = 0.03;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sx = x;
      let sy = y;
      if (horizontal) {
        sx = x + Math.sin(y * frequency) * amplitude;
      } else {
        sy = y + Math.sin(x * frequency) * amplitude;
      }
      sx = Math.round(clamp(sx, 0, w - 1));
      sy = Math.round(clamp(sy, 0, h - 1));
      const si = (sy * w + sx) * 4;
      const di = (y * w + x) * 4;
      dd[di]     = sd[si];
      dd[di + 1] = sd[si + 1];
      dd[di + 2] = sd[si + 2];
      dd[di + 3] = 255;
    }
  }
  putTransformedImageData(dst);
}

function transformRadialDistortion(strength) {
  const w = originalCanvas.width;
  const h = originalCanvas.height;
  const src = getOriginalImageData();
  const dst = tctx.createImageData(w, h);
  const sd = src.data;
  const dd = dst.data;

  const cx = w / 2;
  const cy = h / 2;
  const maxR = Math.sqrt(cx * cx + cy * cy);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const r = Math.sqrt(dx * dx + dy * dy);
      const nr = r / maxR;
      const factor = 1 + strength * (nr * nr);
      const sx = cx + dx * factor;
      const sy = cy + dy * factor;
      const sxClamped = Math.round(clamp(sx, 0, w - 1));
      const syClamped = Math.round(clamp(sy, 0, h - 1));
      const si = (syClamped * w + sxClamped) * 4;
      const di = (y * w + x) * 4;
      dd[di]     = sd[si];
      dd[di + 1] = sd[si + 1];
      dd[di + 2] = sd[si + 2];
      dd[di + 3] = 255;
    }
  }
  putTransformedImageData(dst);
}

// Shear transforms
function transformShear(horizontal) {
  const w = originalCanvas.width;
  const h = originalCanvas.height;
  const src = getOriginalImageData();
  const dst = tctx.createImageData(w, h);
  const sd = src.data;
  const dd = dst.data;

  const factor = 0.3;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sx = x;
      let sy = y;
      if (horizontal) {
        sx = x + (y - h / 2) * factor;
      } else {
        sy = y + (x - w / 2) * factor;
      }
      sx = Math.round(clamp(sx, 0, w - 1));
      sy = Math.round(clamp(sy, 0, h - 1));
      const si = (sy * w + sx) * 4;
      const di = (y * w + x) * 4;
      dd[di]     = sd[si];
      dd[di + 1] = sd[si + 1];
      dd[di + 2] = sd[si + 2];
      dd[di + 3] = 255;
    }
  }
  putTransformedImageData(dst);
}

// Quadrants and kaleidoscope
function transformSwapQuadrants() {
  const w = originalCanvas.width;
  const h = originalCanvas.height;
  const hw = Math.floor(w / 2);
  const hh = Math.floor(h / 2);
  transformedCanvas.width = w;
  transformedCanvas.height = h;
  tctx.clearRect(0, 0, w, h);

  // TL -> BR, BR -> TL, TR and BL stay.
  // TL
  tctx.drawImage(originalCanvas, 0, 0, hw, hh, hw, hh, hw, hh);
  // TR
  tctx.drawImage(originalCanvas, hw, 0, hw, hh, hw, 0, hw, hh);
  // BL
  tctx.drawImage(originalCanvas, 0, hh, hw, hh, 0, hh, hw, hh);
  // BR
  tctx.drawImage(originalCanvas, hw, hh, hw, hh, 0, 0, hw, hh);
}

function transformKaleidoscope() {
  const w = originalCanvas.width;
  const h = originalCanvas.height;
  const hw = Math.floor(w / 2);
  const hh = Math.floor(h / 2);
  transformedCanvas.width = w;
  transformedCanvas.height = h;
  tctx.clearRect(0, 0, w, h);

  // Use top-left quadrant as source.
  tctx.drawImage(originalCanvas, 0, 0, hw, hh, 0, 0, hw, hh); // TL
  tctx.save();
  tctx.translate(w, 0);
  tctx.scale(-1, 1);
  tctx.drawImage(originalCanvas, 0, 0, hw, hh, 0, 0, hw, hh); // TR
  tctx.restore();
  tctx.save();
  tctx.translate(0, h);
  tctx.scale(1, -1);
  tctx.drawImage(originalCanvas, 0, 0, hw, hh, 0, 0, hw, hh); // BL
  tctx.restore();
  tctx.save();
  tctx.translate(w, h);
  tctx.scale(-1, -1);
  tctx.drawImage(originalCanvas, 0, 0, hw, hh, 0, 0, hw, hh); // BR
  tctx.restore();
}

// Tile mini image
function transformTile2x2() {
  const w = originalCanvas.width;
  const h = originalCanvas.height;
  transformedCanvas.width = w;
  transformedCanvas.height = h;
  tctx.clearRect(0, 0, w, h);
  const halfW = Math.floor(w / 2);
  const halfH = Math.floor(h / 2);
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
      tctx.drawImage(originalCanvas, 0, 0, w, h, col * halfW, row * halfH, halfW, halfH);
    }
  }
}

// Center glow: inverse of vignette
function transformCenterGlow() {
  const w = originalCanvas.width;
  const h = originalCanvas.height;
  const imgData = getOriginalImageData();
  const d = imgData.data;
  const cx = w / 2;
  const cy = h / 2;
  const maxDist = Math.sqrt(cx * cx + cy * cy);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const factor = 1 + 0.6 * (1 - dist / maxDist);
      const i = (y * w + x) * 4;
      const boost = clamp(factor, 1, 1.6);
      d[i]     = clamp(d[i] * boost, 0, 255);
      d[i + 1] = clamp(d[i + 1] * boost, 0, 255);
      d[i + 2] = clamp(d[i + 2] * boost, 0, 255);
    }
  }
  putTransformedImageData(imgData);
}

// Posterize and solarize
function transformPosterize(levels) {
  const imgData = getOriginalImageData();
  const step = 255 / (levels - 1);
  forEachPixel(imgData, (d, i) => {
    d[i]     = Math.round(d[i] / step) * step;
    d[i + 1] = Math.round(d[i + 1] / step) * step;
    d[i + 2] = Math.round(d[i + 2] / step) * step;
  });
  putTransformedImageData(imgData);
}

function transformSolarize() {
  const imgData = getOriginalImageData();
  forEachPixel(imgData, (d, i) => {
    const v = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    if (v > 128) {
      d[i]     = 255 - d[i];
      d[i + 1] = 255 - d[i + 1];
      d[i + 2] = 255 - d[i + 2];
    }
  });
  putTransformedImageData(imgData);
}

// Emboss
function transformEmboss() {
  const w = originalCanvas.width;
  const h = originalCanvas.height;
  const src = getOriginalImageData();
  const dst = tctx.createImageData(w, h);
  const sd = src.data;
  const dd = dst.data;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const nx = clamp(x + 1, 0, w - 1);
      const ny = clamp(y + 1, 0, h - 1);
      const ni = (ny * w + nx) * 4;
      const r = sd[ni] - sd[i] + 128;
      const g = sd[ni + 1] - sd[i + 1] + 128;
      const b = sd[ni + 2] - sd[i + 2] + 128;
      dd[i]     = clamp(r, 0, 255);
      dd[i + 1] = clamp(g, 0, 255);
      dd[i + 2] = clamp(b, 0, 255);
      dd[i + 3] = 255;
    }
  }
  putTransformedImageData(dst);
}

// Glitch stripes
function transformGlitchStripes() {
  const w = originalCanvas.width;
  const h = originalCanvas.height;
  const src = getOriginalImageData();
  const dst = tctx.createImageData(w, h);
  const sd = src.data;
  const dd = dst.data;

  const bandHeight = 5;

  for (let y = 0; y < h; y++) {
    const offset = (Math.random() < 0.2) ? Math.round((Math.random() - 0.5) * 40) : 0;
    for (let x = 0; x < w; x++) {
      const sx = clamp(x + offset, 0, w - 1);
      const sy = y;
      const si = (sy * w + sx) * 4;
      const di = (y * w + x) * 4;
      dd[di]     = sd[si];
      dd[di + 1] = sd[si + 1];
      dd[di + 2] = sd[si + 2];
      dd[di + 3] = 255;
    }
  }
  putTransformedImageData(dst);
}

// ---- Main dispatch ----
function applyTransform(id) {
  if (!hasImage) {
    // If no image, use default pattern as "original".
    drawDefaultPattern();
  }
  explanationEl.textContent = (TRANSFORMS.find(t => t.id === id) || {}).info || "";

  switch (id) {
    case "t1":  transformFlipHorizontal(); break;
    case "t2":  transformFlipVertical(); break;
    case "t3":  transformRotate(Math.PI / 2); break;
    case "t4":  transformRotate(Math.PI); break;
    case "t5":  transformRotate(3 * Math.PI / 2); break;
    case "t6":  transformRotate(7 * Math.PI / 180); break;
    case "t7":  transformRotate(-7 * Math.PI / 180); break;
    case "t8":  transformRandomSmallRotation(); break;
    case "t9":  transformZoom(1.3); break;
    case "t10": transformZoom(0.7); break;
    case "t11": transformHorizontalHalfMirror(); break;
    case "t12": transformVerticalHalfMirror(); break;
    case "t13": transformGridSwapCenterCorner(); break;
    case "t14": transformStripShuffle(); break;
    case "t15": transformPixelate(12); break;
    case "t16": transformPixelate(6); break;
    case "t17": transformInvert(); break;
    case "t18": transformGrayscale(); break;
    case "t19": transformSepia(); break;
    case "t20": transformThreshold(); break;
    case "t21": transformBrightnessContrast(0, 1.4); break;   // high contrast
    case "t22": transformBrightnessContrast(0, 0.6); break;   // low contrast
    case "t23": transformBrightnessContrast(40, 1.0); break;  // brighter
    case "t24": transformBrightnessContrast(-40, 1.0); break; // darker
    case "t25": transformSaturation(0.4); break;              // desaturate
    case "t26": transformSaturation(1.8); break;              // oversaturate
    case "t27": transformSwapChannels("rb"); break;
    case "t28": transformSwapChannels("rg"); break;
    case "t29": transformSwapChannels("gb"); break;
    case "t30": transformGaussianNoise(20); break;
    case "t31": transformSaltPepper(0.03); break;
    case "t32": transformBoxBlur(); break;
    case "t33": transformSharpen(); break;
    case "t34": transformEdgeDetect(); break;
    case "t35": transformVignette(); break;
    case "t36": transformScanlines(); break;
    case "t37": transformWave(true); break;   // horizontal wave
    case "t38": transformWave(false); break;  // vertical wave
    case "t39": transformRadialDistortion(-0.4); break; // barrel (bulge out)
    case "t40": transformRadialDistortion(0.4); break;  // pincushion (pinch in)
    case "t41": transformShear(true); break;   // horizontal shear
    case "t42": transformShear(false); break;  // vertical shear
    case "t43": transformSwapQuadrants(); break;
    case "t44": transformKaleidoscope(); break;
    case "t45": transformTile2x2(); break;
    case "t46": transformCenterGlow(); break;
    case "t47": transformPosterize(4); break;
    case "t48": transformSolarize(); break;
    case "t49": transformEmboss(); break;
    case "t50": transformGlitchStripes(); break;
    default:
      copyOriginalToTransformed();
  }
}

// ---- Event wiring ----

// Load image from file input.
imageInput.addEventListener("change", (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    img = new Image();
    img.onload = () => {
      hasImage = true;
      // Fit image into original canvas while preserving aspect ratio.
      const w = originalCanvas.width;
      const h = originalCanvas.height;
      octx.clearRect(0, 0, w, h);
      const ratio = Math.min(w / img.width, h / img.height);
      const dw = img.width * ratio;
      const dh = img.height * ratio;
      const dx = (w - dw) / 2;
      const dy = (h - dh) / 2;
      octx.drawImage(img, dx, dy, dw, dh);
      copyOriginalToTransformed();
      explanationEl.textContent = "Image loaded. Choose a transform to apply.";
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

// Apply transform button
applyBtn.addEventListener("click", () => {
  const id = transformSelect.value || "t1";
  applyTransform(id);
});

// Reset button: restore original view.
resetBtn.addEventListener("click", () => {
  copyOriginalToTransformed();
  explanationEl.textContent = "Reset to the original view.";
});

// Download button: export transformed canvas as PNG.
downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = transformedCanvas.toDataURL("image/png");
  link.download = "transformed.png";
  link.click();
});

// Initialize on page load.
window.addEventListener("DOMContentLoaded", () => {
  drawDefaultPattern();
  copyOriginalToTransformed();
  explanationEl.textContent = "Use the default pattern or upload your own image, then pick any of the 50 transforms.";
});
