// projector_effect.js
// Realistic projector simulation:
// - Horizontal mirror (teacher forgot to set correct mode)
// - Keystone distortion
// - Screen wrinkles (sine waves)
// - RGB chromatic aberration
// - Brightness hotspot (center → brighter)
// - Random dust spots
// - Lamp flicker
// - Slight jitter wobble

export const PROJECTOR_TRANSFORM = {
  id: "proj",
  label: "PROJ - Projector mirrored effect",
  info: "Simulates a real projector misconfiguration: mirror flip, keystone, wrinkles, flicker, dust, RGB shift."
};

// Utility
function clamp(v, min, max) {
  return v < min ? min : v > max ? max : v;
}

// (1) Horizontal mirror + slight jitter
function drawMirroredWithJitter(srcCanvas, w, h, ctx) {
  const jitter = (Math.random() - 0.5) * 6;

  ctx.save();
  ctx.translate(w, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(srcCanvas, jitter, 0, w, h);
  ctx.restore();
}

// (2) Keystone distortion — trapezoid perspective
function drawKeystone(ctx, canvas, tempCanvas) {
  const w = canvas.width,
        h = canvas.height;
  const skew = 40; // left side shorter, right side longer

  const img = ctx.getImageData(0, 0, w, h);
  const out = tempCanvas.getContext("2d");
  out.clearRect(0, 0, w, h);

  const src = img.data;
  const dstImg = out.createImageData(w, h);
  const dst = dstImg.data;

  for (let y = 0; y < h; y++) {
    const t = y / h;
    const leftOffset = skew * (1 - t);
    const rightOffset = skew * t;

    for (let x = 0; x < w; x++) {
      const mappedX = clamp(x + leftOffset - rightOffset, 0, w - 1);
      const si = (y * w + Math.round(mappedX)) * 4;
      const di = (y * w + x) * 4;
      dst[di] = src[si];
      dst[di + 1] = src[si + 1];
      dst[di + 2] = src[si + 2];
      dst[di + 3] = 255;
    }
  }

  out.putImageData(dstImg, 0, 0);
}

// (3) Screen wrinkles — horizontal sine-wave distortion
function applyWrinkles(srcCanvas, tempCanvas) {
  const w = srcCanvas.width, h = srcCanvas.height;

  const ctxA = srcCanvas.getContext("2d");
  const ctxB = tempCanvas.getContext("2d");
  const src = ctxA.getImageData(0, 0, w, h);
  const out = ctxB.createImageData(w, h);

  const sd = src.data, dd = out.data;
  const amp = 6, freq = 0.04;

  for (let y = 0; y < h; y++) {
    const dx = Math.sin((y + Math.random()*5) * freq) * amp;
    for (let x = 0; x < w; x++) {
      const sx = clamp(Math.round(x + dx), 0, w - 1);
      const si = (y * w + sx) * 4;
      const di = (y * w + x) * 4;
      dd[di] = sd[si];
      dd[di+1] = sd[si+1];
      dd[di+2] = sd[si+2];
      dd[di+3] = 255;
    }
  }

  ctxB.putImageData(out, 0, 0);
}

// (4) RGB chromatic aberration
function applyChromaticAberration(srcCanvas, dstCtx) {
  const w = srcCanvas.width,
        h = srcCanvas.height;
  dstCtx.clearRect(0, 0, w, h);

  // offsets
  const rx = 2, ry = 0;
  const gx = -2, gy = 1;
  const bx = 1, by = -1;

  dstCtx.globalCompositeOperation = "lighter";

  // Red channel
  dstCtx.filter = "brightness(1)"; 
  dstCtx.drawImage(srcCanvas, rx, ry, w, h);

  // Green
  dstCtx.globalAlpha = 0.8;
  dstCtx.drawImage(srcCanvas, gx, gy, w, h);

  // Blue
  dstCtx.globalAlpha = 0.6;
  dstCtx.drawImage(srcCanvas, bx, by, w, h);

  dstCtx.globalAlpha = 1;
  dstCtx.globalCompositeOperation = "source-over";
}

// (5) Brightness hotspot (old projector lens)
function applyHotspot(ctx, canvas) {
  const w = canvas.width, h = canvas.height;
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  const cx = w / 2, cy = h / 2;
  const maxDist = Math.sqrt(cx * cx + cy * cy);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = x - cx, dy = y - cy;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const f = 1 + 0.4 * (1 - dist / maxDist); // center brighter
      const i = (y * w + x) * 4;
      d[i]   = clamp(d[i] * f, 0, 255);
      d[i+1] = clamp(d[i+1] * f, 0, 255);
      d[i+2] = clamp(d[i+2] * f, 0, 255);
    }
  }

  ctx.putImageData(img, 0, 0);
}

// (6) Dust spots
function applyDust(ctx, canvas) {
  const w = canvas.width, h = canvas.height;
  ctx.fillStyle = "rgba(0,0,0,0.3)";

  for (let i = 0; i < 25; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = Math.random() * 4 + 1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

// (7) Lamp flicker (small random brightness modulation)
function applyFlicker(ctx, canvas) {
  const w = canvas.width, h = canvas.height;
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  const factor = 0.95 + Math.random() * 0.1; // 0.95~1.05

  for (let i = 0; i < d.length; i += 4) {
    d[i]   = clamp(d[i] * factor,     0, 255);
    d[i+1] = clamp(d[i+1] * factor,   0, 255);
    d[i+2] = clamp(d[i+2] * factor,   0, 255);
  }

  ctx.putImageData(img, 0, 0);
}

// ======= MAIN FUNCTION ========

export function applyProjectorEffect(octx, oc, tctx, tc) {
  const w = oc.width, h = oc.height;

  // step 1: draw mirrored version with jitter → temp stage A
  const tempA = document.createElement("canvas");
  tempA.width = w;
  tempA.height = h;
  const ctxA = tempA.getContext("2d");
  drawMirroredWithJitter(oc, w, h, ctxA);

  // step 2: keystone → temp stage B
  const tempB = document.createElement("canvas");
  tempB.width = w;
  tempB.height = h;
  drawKeystone(ctxA, tempA, tempB);

  // step 3: wrinkles → temp stage C
  const tempC = document.createElement("canvas");
  tempC.width = w;
  tempC.height = h;
  applyWrinkles(tempB, tempC);

  // step 4: chromatic aberration → draw to transformedCanvas
  tctx.clearRect(0, 0, w, h);
  applyChromaticAberration(tempC, tctx);

  // step 5: hotspot
  applyHotspot(tctx, tc);

  // step 6: dust
  applyDust(tctx, tc);

  // step 7: flicker last
  applyFlicker(tctx, tc);
}
