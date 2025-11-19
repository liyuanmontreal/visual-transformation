// main.js
// 入口：管理主画布 + 选择框 + Gallery + Lightbox + 导出功能

import { TRANSFORMS_BASIC, applyBasicTransform } from "./transforms_basic.js";
import {
  TRANSFORMS_TEXT,
  renderTextBase,
  applyTextTransform,
  clearTextState,
  hasText
} from "./transforms_text.js";
import {
  PROJECTOR_TRANSFORM,
  applyProjectorEffect
} from "./projector_effect.js";

// ===== DOM 引用 =====

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

const galleryEl = document.getElementById("gallery");

const lightboxEl = document.getElementById("lightbox");
const lightboxCanvas = document.getElementById("lightboxCanvas");
const lightboxCloseBtn = document.getElementById("lightboxClose");

const exportZipBtn = document.getElementById("exportZipBtn");

// ===== 全部变换元数据 =====

const ALL_TRANSFORMS = [
  ...TRANSFORMS_BASIC,
  ...TRANSFORMS_TEXT,
  PROJECTOR_TRANSFORM
];

// 默认文本（用于 Lightbox 或某些预览）
const DEFAULT_TEXT = `Projection Demo Text
The quick brown fox jumps over the lazy dog.`;

// 默认缩略图图片（default.jpg），你可以用你的动物图替换这个文件
let DEFAULT_IMAGE = new Image();
let defaultImageLoaded = false;
DEFAULT_IMAGE.src = "default.jpg";
DEFAULT_IMAGE.onload = () => {
  defaultImageLoaded = true;
  generateGallery(); // 图片加载后再生成缩略图
};
DEFAULT_IMAGE.onerror = () => {
  defaultImageLoaded = false;
  generateGallery(); // 即使没有 default.jpg，也生成画廊（用简单底图）
};

// 是否已加载用户图片（主画布用）
let hasImage = false;

// ===== 初始化：填充下拉框 =====

for (const t of ALL_TRANSFORMS) {
  const opt = document.createElement("option");
  opt.value = t.id;
  opt.textContent = t.label;
  transformSelect.appendChild(opt);
}

// ===== 基础绘制工具 =====

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

// ===== 变换调度（主画布） =====

function applyTransform(id) {
  const meta = ALL_TRANSFORMS.find(t => t.id === id);
  if (meta && meta.info) {
    explanationEl.textContent = meta.info;
  } else {
    explanationEl.textContent = "";
  }

  // 文本变换
  if (id.startsWith("txt")) {
    if (hasText()) {
      applyTextTransform(id, octx, originalCanvas, tctx, transformedCanvas);
    } else {
      // 没有文本就图片/图案
      applyBasicTransform("t1", octx, originalCanvas, tctx, transformedCanvas);
    }
    return;
  }

  // 投影仪特效
  if (id === PROJECTOR_TRANSFORM.id) {
    applyProjectorEffect(octx, originalCanvas, tctx, transformedCanvas);
    return;
  }

  // 一般图像变换
  applyBasicTransform(id, octx, originalCanvas, tctx, transformedCanvas);
}

// 给 Gallery 调用（同时同步下拉框）
function applyTransformById(id) {
  transformSelect.value = id;
  applyTransform(id);
}

// ===== Image / Text 输入事件 =====

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

// ===== Gallery: 类型辅助 =====

function getEffectType(tid) {
  if (tid === PROJECTOR_TRANSFORM.id) return "Projector";
  if (tid.startsWith("txt")) return "Text";
  return "Image";
}

// 自动裁剪默认图片到缩略图比例
function drawAutoCrop(img, ctx, w, h) {
  const aspect = w / h;
  const imgAspect = img.width / img.height;

  let sx, sy, sw, sh;
  if (imgAspect > aspect) {
    // 太宽 → 裁左右
    sh = img.height;
    sw = sh * aspect;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    // 太高 → 裁上下
    sw = img.width;
    sh = sw / aspect;
    sx = 0;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
}

// 根据 id 生成缩略图图像
function generateThumbnailForTransform(id, ctx, canvas) {
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  // baseCanvas = 原图（默认动物图或简单底图）
  const baseCanvas = document.createElement("canvas");
  baseCanvas.width = w;
  baseCanvas.height = h;
  const baseCtx = baseCanvas.getContext("2d");

  if (id.startsWith("txt")) {
    // 文本类：直接用文本作为底
    renderTextBase(baseCtx, baseCanvas, DEFAULT_TEXT);
    applyTextTransform(id, baseCtx, baseCanvas, ctx, canvas);
    return;
  }

  if (defaultImageLoaded) {
    drawAutoCrop(DEFAULT_IMAGE, baseCtx, w, h);
  } else {
    // 没有默认图片时，用一个简单渐变底图
    const grad = baseCtx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#111827");
    grad.addColorStop(1, "#1f2937");
    baseCtx.fillStyle = grad;
    baseCtx.fillRect(0, 0, w, h);
  }

  if (id === PROJECTOR_TRANSFORM.id) {
    applyProjectorEffect(baseCtx, baseCanvas, ctx, canvas);
  } else {
    applyBasicTransform(id, baseCtx, baseCanvas, ctx, canvas);
  }
}

// 生成整个 Gallery
function generateGallery() {
  if (!galleryEl) return;
  galleryEl.innerHTML = "";

  ALL_TRANSFORMS.forEach(t => {
    const wrap = document.createElement("div");
    wrap.className = "gallery-item";
    wrap.dataset.tid = t.id;
    wrap.dataset.type = getEffectType(t.id);

    const c = document.createElement("canvas");
    c.width = 200;
    c.height = 140;

    const gctx = c.getContext("2d");
    generateThumbnailForTransform(t.id, gctx, c);

    const label = document.createElement("div");
    label.className = "gallery-label";
    label.textContent = t.label;

    const tag = document.createElement("div");
    tag.className = "effect-tag";
    tag.textContent = getEffectType(t.id);

    wrap.appendChild(c);
    wrap.appendChild(label);
    wrap.appendChild(tag);

    // 单击：应用变换
    wrap.onclick = () => {
      document
        .querySelectorAll(".gallery-item")
        .forEach(n => n.classList.remove("selected"));
      wrap.classList.add("selected");
      applyTransformById(t.id);
    };

    // 双击：打开大图预览
    wrap.ondblclick = (e) => {
      e.stopPropagation();
      openLightbox(t.id);
    };

    galleryEl.appendChild(wrap);
  });
}

// Filter 按钮
function setupFilterButtons() {
  const btns = document.querySelectorAll(".filter-btn[data-filter]");
  btns.forEach(btn => {
    btn.addEventListener("click", () => {
      btns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter; // "all" | "Image" | "Text" | "Projector"

      document.querySelectorAll(".gallery-item").forEach(item => {
        const type = item.dataset.type;
        if (filter === "all" || filter === type) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });
}

// Lightbox 大图预览：对 originalCanvas 上的内容应用同样的变换
function openLightbox(tid) {
  if (!lightboxEl || !lightboxCanvas) return;
  const ctx = lightboxCanvas.getContext("2d");

  // Lightbox 尺寸
  const W = 800;
  const H = 560;
  lightboxCanvas.width = W;
  lightboxCanvas.height = H;

  // 准备底图（与缩略图一致）
  const baseCanvas = document.createElement("canvas");
  baseCanvas.width = W;
  baseCanvas.height = H;
  const bctx = baseCanvas.getContext("2d");

  // 文本类效果
  if (tid.startsWith("txt")) {
    renderTextBase(bctx, baseCanvas, DEFAULT_TEXT);
    applyTextTransform(tid, bctx, baseCanvas, ctx, lightboxCanvas);
    lightboxEl.style.display = "flex";
    return;
  }

  // 使用 default.jpg，自动裁剪
  if (defaultImageLoaded) {
    drawAutoCrop(DEFAULT_IMAGE, bctx, W, H);
  } else {
    // 若没有 default.jpg，则画默认渐变
    const grad = bctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#111827");
    grad.addColorStop(1, "#1f2937");
    bctx.fillStyle = grad;
    bctx.fillRect(0, 0, W, H);
  }

  // 投影仪特效
  if (tid === PROJECTOR_TRANSFORM.id) {
    applyProjectorEffect(bctx, baseCanvas, ctx, lightboxCanvas);
    lightboxEl.style.display = "flex";
    return;
  }

  // 图片类效果
  applyBasicTransform(tid, bctx, baseCanvas, ctx, lightboxCanvas);

  // 显示 Lightbox
  lightboxEl.style.display = "flex";
}


// 关闭 Lightbox
if (lightboxCloseBtn && lightboxEl) {
  lightboxCloseBtn.onclick = () => {
    lightboxEl.style.display = "none";
  };
  // 点击遮罩关闭
  lightboxEl.addEventListener("click", (e) => {
    if (e.target === lightboxEl) {
      lightboxEl.style.display = "none";
    }
  });
}

// 导出所有缩略图为 ZIP
if (exportZipBtn) {
  exportZipBtn.onclick = exportThumbnails;
}

async function exportThumbnails() {
  if (typeof JSZip === "undefined") {
    alert("JSZip not loaded.");
    return;
  }

  const zip = new JSZip();
  const canvases = document.querySelectorAll(".gallery-item canvas");
  const labels = document.querySelectorAll(".gallery-item .gallery-label");

  for (let i = 0; i < canvases.length; i++) {
    const canvas = canvases[i];
    const label = labels[i].textContent.replace(/[^a-zA-Z0-9_-]+/g, "_");
    const dataUrl = canvas.toDataURL("image/png");
    const base64 = dataUrl.split(",")[1];
    zip.file(`${label || ("effect_" + i)}.png`, base64, { base64: true });
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "all_effect_thumbnails.zip";
  a.click();
}

// ===== 页面初始化 =====

window.addEventListener("DOMContentLoaded", () => {
  // 主画布默认图案
  drawDefaultPattern();
  copyOriginalToTransformed();
  explanationEl.textContent = "Upload an image or type text, then pick a transform. txtXX = text-only effects, proj = projector bug.";

  setupFilterButtons();

  // 如果 default.jpg 还没加载完，generateGallery 会在 onload / onerror 中调用
  if (defaultImageLoaded === false) {
    // 尝试先生成一个简单的空画廊（没有默认图片也可以）
    generateGallery();
  }
});
