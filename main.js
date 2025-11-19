// main.js (ES module entry)
// Wire DOM, import basic transforms, text transforms, projector effect.

import { TRANSFORMS_BASIC, applyBasicTransform } from "./transforms_basic.js";
import { TRANSFORMS_TEXT, renderTextBase, applyTextTransform, clearTextState, hasText } from "./transforms_text.js";
import { PROJECTOR_TRANSFORM, applyProjectorEffect } from "./projector_effect.js";

const originalCanvas = document.getElementById("originalCanvas");
const transformedCanvas = document.getElementById("transformedCanvas");
const octx = originalCanvas.getContext("2d");
const tctx = transformedCanvas.getContext("2d");

const imageInput = document.getElementById("imageInput");
const textInput = document.getElementById("textInput");
const renderTextBtn = document.getElementById("renderTextBtn");
const transformSelect = document.getElementById("transformSelect");
const applyBtn = document.getElementById("applyBtn");
const resetBtn = document.getElementById("resetBtn");
const downloadBtn = document.getElementById("downloadBtn");
const explanationEl = document.getElementById("explanation");

let hasImage = false;

// Merge all transforms into a single list for UI
const ALL_TRANSFORMS = [
  ...TRANSFORMS_BASIC,
  ...TRANSFORMS_TEXT,
  PROJECTOR_TRANSFORM
];

console.log("main.js loaded");


// Populate select
for (const t of ALL_TRANSFORMS) {
  const opt = document.createElement("option");
  opt.value = t.id;
  opt.textContent = t.label;
  transformSelect.appendChild(opt);
}

// Helpers
function drawDefaultPattern() {
  const w = originalCanvas.width;
  const h = originalCanvas.height;
  octx.clearRect(0, 0, w, h);
  const grad = octx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, "#0f172a");
  grad.addColorStop(1, "#1e293b");
  octx.fillStyle = grad;
  octx.fillRect(0, 0, w, h);

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

  octx.fillStyle = "#e5e7eb";
  octx.font = "bold 22px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  octx.textAlign = "center";
  octx.fillText("Demo", w / 2, h / 2);
}

function copyOriginalToTransformed() {
  const w = originalCanvas.width;
  const h = originalCanvas.height;
  transformedCanvas.width = w;
  transformedCanvas.height = h;
  tctx.clearRect(0, 0, w, h);
  tctx.drawImage(originalCanvas, 0, 0, w, h);
}

// Dispatch based on transform id
function applyTransform(id) {
  const meta = ALL_TRANSFORMS.find(t => t.id === id);
  if (meta && meta.info) {
    explanationEl.textContent = meta.info;
  } else {
    explanationEl.textContent = "";
  }

  // text-only transforms start with "txt"
  if (id.startsWith("txt")) {
    if (hasText()) {
      applyTextTransform(id, octx, originalCanvas, tctx, transformedCanvas);
    } else {
      // If no text, fall back to basic transform on image/pattern
      applyBasicTransform("t1", octx, originalCanvas, tctx, transformedCanvas);
    }
    return;
  }

  // projector special id
  if (id === PROJECTOR_TRANSFORM.id) {
    applyProjectorEffect(octx, originalCanvas, tctx, transformedCanvas);
    return;
  }

  // otherwise basic transforms (t1..t50)
  applyBasicTransform(id, octx, originalCanvas, tctx, transformedCanvas);
}

// Events

imageInput.addEventListener("change", e => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => {
      hasImage = true;
      clearTextState();
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
      explanationEl.textContent = "Image loaded. Choose a transform.";
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

renderTextBtn.addEventListener("click", () => {
  const text = textInput.value.trim() || "Hello, projector!";
  hasImage = false;
  renderTextBase(octx, originalCanvas, text);
  copyOriginalToTransformed();
  explanationEl.textContent = "Text rendered. Try text transforms (txtXX) or projector effect.";
});

applyBtn.addEventListener("click", () => {
  const id = transformSelect.value || "t1";
  applyTransform(id);
});

resetBtn.addEventListener("click", () => {
  copyOriginalToTransformed();
  explanationEl.textContent = "Reset to original view.";
});

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = transformedCanvas.toDataURL("image/png");
  link.download = "transformed.png";
  link.click();
});

window.addEventListener("DOMContentLoaded", () => {
  drawDefaultPattern();
  copyOriginalToTransformed();
  explanationEl.textContent = "Upload an image or type text, then pick a transform. txtXX = text-only effects, proj = projector bug.";
});
