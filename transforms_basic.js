// transforms_basic.js
// 50 general transforms operating on pixel data or drawImage.

export const TRANSFORMS_BASIC = [
  { id: "t1",  label: "01 - Horizontal flip", info: "Mirror the image left-right." },
  { id: "t2",  label: "02 - Vertical flip", info: "Flip upside down." },
  { id: "t3",  label: "03 - Rotate 90° CW", info: "Rotate the image 90 degrees clockwise." },
  { id: "t4",  label: "04 - Rotate 180°", info: "Rotate 180 degrees." },
  { id: "t5",  label: "05 - Rotate 270°", info: "Rotate 270 degrees." },
  { id: "t6",  label: "06 - Slight tilt +7°", info: "Small clockwise tilt." },
  { id: "t7",  label: "07 - Slight tilt -7°", info: "Small counter-clockwise tilt." },
  { id: "t8",  label: "08 - Random small rotation", info: "Random angle between -10° and 10°." },
  { id: "t9",  label: "09 - Zoom in", info: "Zoom into the center region." },
  { id: "t10", label: "10 - Zoom out", info: "Shrink inside the frame." },
  { id: "t11", label: "11 - Horizontal half mirror", info: "Mirror left half to right." },
  { id: "t12", label: "12 - Vertical half mirror", info: "Mirror top half to bottom." },
  { id: "t13", label: "13 - 3x3 grid swap", info: "Swap center tile with a corner tile." },
  { id: "t14", label: "14 - Strip shuffle", info: "Shuffle vertical strips." },
  { id: "t15", label: "15 - Strong pixelation", info: "Large blocks, very chunky." },
  { id: "t16", label: "16 - Mild pixelation", info: "Smaller blocks, mild effect." },
  { id: "t17", label: "17 - Invert colors", info: "Invert all color channels." },
  { id: "t18", label: "18 - Grayscale", info: "Remove hue, keep luminance." },
  { id: "t19", label: "19 - Sepia", info: "Old-photo style brownish tone." },
  { id: "t20", label: "20 - Binary threshold", info: "Pure black or white pixels." },
  { id: "t21", label: "21 - High contrast", info: "Increase contrast strongly." },
  { id: "t22", label: "22 - Low contrast", info: "Flatten contrast." },
  { id: "t23", label: "23 - Brightness up", info: "Make everything brighter." },
  { id: "t24", label: "24 - Brightness down", info: "Make everything darker." },
  { id: "t25", label: "25 - Desaturate", info: "Reduce saturation." },
  { id: "t26", label: "26 - Oversaturate", info: "Increase saturation." },
  { id: "t27", label: "27 - Swap R/B channels", info: "Swap red and blue." },
  { id: "t28", label: "28 - Swap R/G channels", info: "Swap red and green." },
  { id: "t29", label: "29 - Swap G/B channels", info: "Swap green and blue." },
  { id: "t30", label: "30 - Add noise", info: "Add random noise (grain)." },
  { id: "t31", label: "31 - Salt & pepper", info: "Random black/white pixels." },
  { id: "t32", label: "32 - Box blur", info: "Simple blur using 3x3 kernel." },
  { id: "t33", label: "33 - Sharpen", info: "Sharpen edges." },
  { id: "t34", label: "34 - Edge detect", info: "Only keep edges." },
  { id: "t35", label: "35 - Vignette", info: "Darken corners." },
  { id: "t36", label: "36 - Scanlines", info: "Alternate darker rows." },
  { id: "t37", label: "37 - Horizontal wave", info: "Sin wave distortion horizontally." },
  { id: "t38", label: "38 - Vertical wave", info: "Sin wave distortion vertically." },
  { id: "t39", label: "39 - Barrel distortion", info: "Bulge center outwards." },
  { id: "t40", label: "40 - Pincushion distortion", info: "Pull center inwards." },
  { id: "t41", label: "41 - Horizontal shear", info: "Shear based on y." },
  { id: "t42", label: "42 - Vertical shear", info: "Shear based on x." },
  { id: "t43", label: "43 - Swap quadrants", info: "Swap diagonal quadrants." },
  { id: "t44", label: "44 - Kaleidoscope", info: "Four-way mirrored view." },
  { id: "t45", label: "45 - 2x2 tile", info: "Shrink and tile 2x2." },
  { id: "t46", label: "46 - Center glow", info: "Brighten center region." },
  { id: "t47", label: "47 - Posterize", info: "Reduce color levels." },
  { id: "t48", label: "48 - Solarize", info: "Invert bright pixels only." },
  { id: "t49", label: "49 - Emboss", info: "Raised relief effect." },
  { id: "t50", label: "50 - Glitch stripes", info: "Random horizontal band shifts." },
  // === New advanced transforms (v2) ===
  { id: "t51", label: "51 - CRT curvature", info: "Old CRT TV curved screen effect." },
  { id: "t52", label: "52 - Slit scan horizontal", info: "Rows sampled at shifting positions." },
  { id: "t53", label: "53 - Checkerboard shift", info: "Every grid tile shifted slightly." },
  { id: "t54", label: "54 - TV rolling", info: "Classic analog TV rolling frame." },
  { id: "t55", label: "55 - Double exposure", info: "Overlays a shifted translucent copy." },
  { id: "t56", label: "56 - RGB desync hardcore", info: "Extreme chromatic separation." },

];

// Utility helpers

function clamp(v, min, max) {
  return v < min ? min : v > max ? max : v;
}

function getImageData(ctx, canvas) {
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function putImageData(ctx, canvas, imageData) {
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ctx.putImageData(imageData, 0, 0);
}

function forEachPixel(imageData, fn) {
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) fn(d, i);
}

function drawImageTo(ctx, dstCanvas, srcCanvas) {
  dstCanvas.width = srcCanvas.width;
  dstCanvas.height = srcCanvas.height;
  ctx.clearRect(0, 0, dstCanvas.width, dstCanvas.height);
  ctx.drawImage(srcCanvas, 0, 0, dstCanvas.width, dstCanvas.height);
}

// === GEOMETRIC TRANSFORMS ===

function flipHorizontal(octx, oc, tctx, tc) {
  const w = oc.width, h = oc.height;
  tc.width = w; tc.height = h;
  tctx.save();
  tctx.clearRect(0, 0, w, h);
  tctx.translate(w, 0);
  tctx.scale(-1, 1);
  tctx.drawImage(oc, 0, 0, w, h);
  tctx.restore();
}

function flipVertical(octx, oc, tctx, tc) {
  const w = oc.width, h = oc.height;
  tc.width = w; tc.height = h;
  tctx.save();
  tctx.clearRect(0, 0, w, h);
  tctx.translate(0, h);
  tctx.scale(1, -1);
  tctx.drawImage(oc, 0, 0, w, h);
  tctx.restore();
}

function rotate(octx, oc, tctx, tc, angleRad) {
  const w = oc.width, h = oc.height;
  tc.width = w; tc.height = h;
  tctx.save();
  tctx.clearRect(0, 0, w, h);
  tctx.translate(w / 2, h / 2);
  tctx.rotate(angleRad);
  tctx.drawImage(oc, -w / 2, -h / 2, w, h);
  tctx.restore();
}

function randomRotate(octx, oc, tctx, tc) {
  const deg = (Math.random() * 20) - 10;
  rotate(octx, oc, tctx, tc, deg * Math.PI / 180);
}

function zoom(octx, oc, tctx, tc, factor) {
  const w = oc.width, h = oc.height;
  tc.width = w; tc.height = h;
  tctx.save();
  tctx.clearRect(0, 0, w, h);
  const dw = w * factor;
  const dh = h * factor;
  const dx = (w - dw) / 2;
  const dy = (h - dh) / 2;
  tctx.drawImage(oc, dx, dy, dw, dh);
  tctx.restore();
}

function halfMirrorH(octx, oc, tctx, tc) {
  const w = oc.width, h = oc.height;
  const half = Math.floor(w / 2);
  tc.width = w; tc.height = h;
  tctx.clearRect(0, 0, w, h);
  tctx.drawImage(oc, 0, 0, half, h, 0, 0, half, h);
  tctx.save();
  tctx.translate(w, 0);
  tctx.scale(-1, 1);
  tctx.drawImage(oc, 0, 0, half, h, 0, 0, half, h);
  tctx.restore();
}

function halfMirrorV(octx, oc, tctx, tc) {
  const w = oc.width, h = oc.height;
  const half = Math.floor(h / 2);
  tc.width = w; tc.height = h;
  tctx.clearRect(0, 0, w, h);
  tctx.drawImage(oc, 0, 0, w, half, 0, 0, w, half);
  tctx.save();
  tctx.translate(0, h);
  tctx.scale(1, -1);
  tctx.drawImage(oc, 0, 0, w, half, 0, 0, w, half);
  tctx.restore();
}

function gridSwap(octx, oc, tctx, tc) {
  const w = oc.width, h = oc.height;
  const rows = 3, cols = 3;
  const tw = Math.floor(w / cols), th = Math.floor(h / rows);
  tc.width = w; tc.height = h;
  tctx.clearRect(0, 0, w, h);
  const map = [];
  for (let r = 0; r < rows; r++) {
    map[r] = [];
    for (let c = 0; c < cols; c++) map[r][c] = { r, c };
  }
  map[1][1] = { r: 0, c: 2 };
  map[0][2] = { r: 1, c: 1 };
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const src = map[r][c];
      const sx = src.c * tw, sy = src.r * th;
      const dx = c * tw, dy = r * th;
      tctx.drawImage(oc, sx, sy, tw, th, dx, dy, tw, th);
    }
  }
}

function stripShuffle(octx, oc, tctx, tc) {
  const w = oc.width, h = oc.height;
  const strips = 8;
  const sw = Math.floor(w / strips);
  tc.width = w; tc.height = h;
  tctx.clearRect(0, 0, w, h);
  for (let i = 0; i < strips; i++) {
    let srcIndex = i;
    if (i % 2 === 1) srcIndex = i - 1;
    const sx = srcIndex * sw;
    const dx = i * sw;
    tctx.drawImage(oc, sx, 0, sw, h, dx, 0, sw, h);
  }
}

// === PIXELATION ===

function pixelate(octx, oc, tctx, tc, blockSize) {
  const img = getImageData(octx, oc);
  const w = oc.width, h = oc.height;
  const src = img.data;
  const out = tctx.createImageData(w, h);
  const dst = out.data;
  for (let y = 0; y < h; y += blockSize) {
    for (let x = 0; x < w; x += blockSize) {
      const idx = (y * w + x) * 4;
      const r = src[idx], g = src[idx+1], b = src[idx+2], a = src[idx+3];
      for (let yy = 0; yy < blockSize; yy++) {
        for (let xx = 0; xx < blockSize; xx++) {
          const px = x + xx, py = y + yy;
          if (px >= w || py >= h) continue;
          const di = (py * w + px) * 4;
          dst[di] = r; dst[di+1] = g; dst[di+2] = b; dst[di+3] = a;
        }
      }
    }
  }
  putImageData(tctx, tc, out);
}

// === COLOR TRANSFORMS ===

function invert(octx, oc, tctx, tc) {
  const img = getImageData(octx, oc);
  forEachPixel(img, (d, i) => {
    d[i] = 255 - d[i];
    d[i+1] = 255 - d[i+1];
    d[i+2] = 255 - d[i+2];
  });
  putImageData(tctx, tc, img);
}

function grayscale(octx, oc, tctx, tc) {
  const img = getImageData(octx, oc);
  forEachPixel(img, (d, i) => {
    const v = 0.299*d[i] + 0.587*d[i+1] + 0.114*d[i+2];
    d[i]=d[i+1]=d[i+2]=v;
  });
  putImageData(tctx, tc, img);
}

function sepia(octx, oc, tctx, tc) {
  const img = getImageData(octx, oc);
  forEachPixel(img, (d, i) => {
    const r=d[i], g=d[i+1], b=d[i+2];
    d[i]   = clamp(0.393*r + 0.769*g + 0.189*b, 0, 255);
    d[i+1] = clamp(0.349*r + 0.686*g + 0.168*b, 0, 255);
    d[i+2] = clamp(0.272*r + 0.534*g + 0.131*b, 0, 255);
  });
  putImageData(tctx, tc, img);
}

function threshold(octx, oc, tctx, tc) {
  const img = getImageData(octx, oc);
  forEachPixel(img, (d, i) => {
    const v = 0.299*d[i] + 0.587*d[i+1] + 0.114*d[i+2];
    const b = v > 128 ? 255 : 0;
    d[i]=d[i+1]=d[i+2]=b;
  });
  putImageData(tctx, tc, img);
}

function brightnessContrast(octx, oc, tctx, tc, brightness, contrast) {
  const img = getImageData(octx, oc);
  forEachPixel(img, (d, i) => {
    let r=d[i], g=d[i+1], b=d[i+2];
    r = clamp(r*contrast + brightness, 0, 255);
    g = clamp(g*contrast + brightness, 0, 255);
    b = clamp(b*contrast + brightness, 0, 255);
    d[i]=r; d[i+1]=g; d[i+2]=b;
  });
  putImageData(tctx, tc, img);
}

function saturation(octx, oc, tctx, tc, factor) {
  const img = getImageData(octx, oc);
  forEachPixel(img, (d, i) => {
    const r=d[i], g=d[i+1], b=d[i+2];
    const gray = 0.299*r + 0.587*g + 0.114*b;
    d[i]   = clamp(gray + (r-gray)*factor, 0, 255);
    d[i+1] = clamp(gray + (g-gray)*factor, 0, 255);
    d[i+2] = clamp(gray + (b-gray)*factor, 0, 255);
  });
  putImageData(tctx, tc, img);
}

function swapChannels(octx, oc, tctx, tc, mode) {
  const img = getImageData(octx, oc);
  forEachPixel(img, (d, i) => {
    let r=d[i], g=d[i+1], b=d[i+2];
    if (mode==="rb") { d[i]=b; d[i+2]=r; }
    else if (mode==="rg") { d[i]=g; d[i+1]=r; }
    else if (mode==="gb") { d[i+1]=b; d[i+2]=g; }
  });
  putImageData(tctx, tc, img);
}

// === NOISE AND BLUR ===

function addNoise(octx, oc, tctx, tc, strength) {
  const img = getImageData(octx, oc);
  forEachPixel(img, (d, i) => {
    const n = (Math.random()*2-1)*strength;
    d[i]   = clamp(d[i]+n,0,255);
    d[i+1] = clamp(d[i+1]+n,0,255);
    d[i+2] = clamp(d[i+2]+n,0,255);
  });
  putImageData(tctx, tc, img);
}

function saltPepper(octx, oc, tctx, tc, prob) {
  const img = getImageData(octx, oc);
  forEachPixel(img, (d, i) => {
    const r = Math.random();
    if (r < prob) {
      const v = Math.random() < 0.5 ? 0 : 255;
      d[i]=d[i+1]=d[i+2]=v;
    }
  });
  putImageData(tctx, tc, img);
}

// Convolution
function convolve(octx, oc, tctx, tc, kernel, divisor, offset) {
  const w = oc.width, h = oc.height;
  const src = getImageData(octx, oc);
  const dst = tctx.createImageData(w, h);
  const sd = src.data, dd = dst.data;
  const kw = 3, kh = 3, half = 1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let r=0,g=0,b=0;
      for (let ky=-half; ky<=half; ky++) {
        for (let kx=-half; kx<=half; kx++) {
          const px = clamp(x+kx,0,w-1);
          const py = clamp(y+ky,0,h-1);
          const si = (py*w+px)*4;
          const kv = kernel[(ky+half)*kw + (kx+half)];
          r += sd[si]*kv;
          g += sd[si+1]*kv;
          b += sd[si+2]*kv;
        }
      }
      const di = (y*w+x)*4;
      dd[di]   = clamp(r/divisor + offset, 0, 255);
      dd[di+1] = clamp(g/divisor + offset, 0, 255);
      dd[di+2] = clamp(b/divisor + offset, 0, 255);
      dd[di+3] = 255;
    }
  }
  putImageData(tctx, tc, dst);
}

function vignette(octx, oc, tctx, tc) {
  const img = getImageData(octx, oc);
  const d = img.data;
  const w = oc.width, h = oc.height;
  const cx = w/2, cy = h/2;
  const maxDist = Math.sqrt(cx*cx + cy*cy);
  for (let y=0;y<h;y++) {
    for (let x=0;x<w;x++) {
      const dx=x-cx, dy=y-cy;
      const dist=Math.sqrt(dx*dx+dy*dy);
      const factor=1-Math.pow(dist/maxDist,2);
      const i=(y*w+x)*4;
      const f=clamp(factor,0.3,1);
      d[i]*=f; d[i+1]*=f; d[i+2]*=f;
    }
  }
  putImageData(tctx, tc, img);
}

function scanlines(octx, oc, tctx, tc) {
  const img = getImageData(octx, oc);
  const d = img.data;
  const w = oc.width, h = oc.height;
  for (let y=0;y<h;y++) {
    if (y%2===1) {
      for (let x=0;x<w;x++) {
        const i=(y*w+x)*4;
        d[i]*=0.6; d[i+1]*=0.6; d[i+2]*=0.6;
      }
    }
  }
  putImageData(tctx, tc, img);
}

// === DISTORTIONS ===

function wave(octx, oc, tctx, tc, horizontal) {
  const w=oc.width,h=oc.height;
  const src = getImageData(octx, oc);
  const dst = tctx.createImageData(w,h);
  const sd=src.data, dd=dst.data;
  const amp=10, freq=0.03;
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      let sx=x, sy=y;
      if(horizontal) sx = x + Math.sin(y*freq)*amp;
      else sy = y + Math.sin(x*freq)*amp;
      sx = Math.round(clamp(sx,0,w-1));
      sy = Math.round(clamp(sy,0,h-1));
      const si=(sy*w+sx)*4, di=(y*w+x)*4;
      dd[di]=sd[si]; dd[di+1]=sd[si+1]; dd[di+2]=sd[si+2]; dd[di+3]=255;
    }
  }
  putImageData(tctx, tc, dst);
}

function radialDistortion(octx, oc, tctx, tc, strength) {
  const w=oc.width,h=oc.height;
  const src = getImageData(octx, oc);
  const dst = tctx.createImageData(w,h);
  const sd=src.data, dd=dst.data;
  const cx=w/2, cy=h/2;
  const maxR=Math.sqrt(cx*cx+cy*cy);
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      const dx=x-cx, dy=y-cy;
      const r=Math.sqrt(dx*dx+dy*dy);
      const nr=r/maxR;
      const f=1+strength*(nr*nr);
      const sx=cx+dx*f, sy=cy+dy*f;
      const sxC=Math.round(clamp(sx,0,w-1));
      const syC=Math.round(clamp(sy,0,h-1));
      const si=(syC*w+sxC)*4, di=(y*w+x)*4;
      dd[di]=sd[si]; dd[di+1]=sd[si+1]; dd[di+2]=sd[si+2]; dd[di+3]=255;
    }
  }
  putImageData(tctx, tc, dst);
}

function shear(octx, oc, tctx, tc, horizontal) {
  const w=oc.width,h=oc.height;
  const src=getImageData(octx, oc);
  const dst=tctx.createImageData(w,h);
  const sd=src.data, dd=dst.data;
  const factor=0.3;
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      let sx=x, sy=y;
      if(horizontal) sx = x + (y-h/2)*factor;
      else sy = y + (x-w/2)*factor;
      sx=Math.round(clamp(sx,0,w-1));
      sy=Math.round(clamp(sy,0,h-1));
      const si=(sy*w+sx)*4, di=(y*w+x)*4;
      dd[di]=sd[si]; dd[di+1]=sd[si+1]; dd[di+2]=sd[si+2]; dd[di+3]=255;
    }
  }
  putImageData(tctx, tc, dst);
}

function swapQuadrants(octx, oc, tctx, tc) {
  const w=oc.width,h=oc.height;
  const hw=Math.floor(w/2), hh=Math.floor(h/2);
  tc.width=w; tc.height=h;
  tctx.clearRect(0,0,w,h);
  // TL->BR
  tctx.drawImage(oc,0,0,hw,hh,hw,hh,hw,hh);
  // TR stays
  tctx.drawImage(oc,hw,0,hw,hh,hw,0,hw,hh);
  // BL stays
  tctx.drawImage(oc,0,hh,hw,hh,0,hh,hw,hh);
  // BR->TL
  tctx.drawImage(oc,hw,hh,hw,hh,0,0,hw,hh);
}

function kaleidoscope(octx, oc, tctx, tc) {
  const w=oc.width,h=oc.height;
  const hw=Math.floor(w/2), hh=Math.floor(h/2);
  tc.width=w; tc.height=h;
  tctx.clearRect(0,0,w,h);
  tctx.drawImage(oc,0,0,hw,hh,0,0,hw,hh);
  tctx.save();
  tctx.translate(w,0); tctx.scale(-1,1);
  tctx.drawImage(oc,0,0,hw,hh,0,0,hw,hh);
  tctx.restore();
  tctx.save();
  tctx.translate(0,h); tctx.scale(1,-1);
  tctx.drawImage(oc,0,0,hw,hh,0,0,hw,hh);
  tctx.restore();
  tctx.save();
  tctx.translate(w,h); tctx.scale(-1,-1);
  tctx.drawImage(oc,0,0,hw,hh,0,0,hw,hh);
  tctx.restore();
}

function tile2x2(octx, oc, tctx, tc) {
  const w=oc.width,h=oc.height;
  tc.width=w; tc.height=h;
  tctx.clearRect(0,0,w,h);
  const hw=Math.floor(w/2), hh=Math.floor(h/2);
  for(let r=0;r<2;r++){
    for(let c=0;c<2;c++){
      tctx.drawImage(oc,0,0,w,h,c*hw,r*hh,hw,hh);
    }
  }
}

function centerGlow(octx, oc, tctx, tc) {
  const img=getImageData(octx, oc);
  const d=img.data;
  const w=oc.width,h=oc.height;
  const cx=w/2, cy=h/2;
  const maxDist=Math.sqrt(cx*cx+cy*cy);
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      const dx=x-cx, dy=y-cy;
      const dist=Math.sqrt(dx*dx+dy*dy);
      const factor=1+0.6*(1-dist/maxDist);
      const i=(y*w+x)*4;
      const f=clamp(factor,1,1.6);
      d[i]=clamp(d[i]*f,0,255);
      d[i+1]=clamp(d[i+1]*f,0,255);
      d[i+2]=clamp(d[i+2]*f,0,255);
    }
  }
  putImageData(tctx, tc, img);
}

function posterize(octx, oc, tctx, tc, levels) {
  const img=getImageData(octx, oc);
  const step=255/(levels-1);
  forEachPixel(img,(d,i)=>{
    d[i]=Math.round(d[i]/step)*step;
    d[i+1]=Math.round(d[i+1]/step)*step;
    d[i+2]=Math.round(d[i+2]/step)*step;
  });
  putImageData(tctx, tc, img);
}

function solarize(octx, oc, tctx, tc) {
  const img=getImageData(octx, oc);
  forEachPixel(img,(d,i)=>{
    const v=0.299*d[i]+0.587*d[i+1]+0.114*d[i+2];
    if(v>128){
      d[i]=255-d[i]; d[i+1]=255-d[i+1]; d[i+2]=255-d[i+2];
    }
  });
  putImageData(tctx, tc, img);
}

function emboss(octx, oc, tctx, tc) {
  const w=oc.width,h=oc.height;
  const src=getImageData(octx, oc);
  const dst=tctx.createImageData(w,h);
  const sd=src.data, dd=dst.data;
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      const i=(y*w+x)*4;
      const nx=clamp(x+1,0,w-1);
      const ny=clamp(y+1,0,h-1);
      const ni=(ny*w+nx)*4;
      const r=sd[ni]-sd[i]+128;
      const g=sd[ni+1]-sd[i+1]+128;
      const b=sd[ni+2]-sd[i+2]+128;
      dd[i]=clamp(r,0,255);
      dd[i+1]=clamp(g,0,255);
      dd[i+2]=clamp(b,0,255);
      dd[i+3]=255;
    }
  }
  putImageData(tctx, tc, dst);
}

function glitchStripes(octx, oc, tctx, tc) {
  const w=oc.width,h=oc.height;
  const src=getImageData(octx, oc);
  const dst=tctx.createImageData(w,h);
  const sd=src.data, dd=dst.data;
  for(let y=0;y<h;y++){
    const offset=(Math.random()<0.25)?Math.round((Math.random()-0.5)*40):0;
    for(let x=0;x<w;x++){
      const sx=clamp(x+offset,0,w-1);
      const sy=y;
      const si=(sy*w+sx)*4, di=(y*w+x)*4;
      dd[di]=sd[si]; dd[di+1]=sd[si+1]; dd[di+2]=sd[si+2]; dd[di+3]=255;
    }
  }
  putImageData(tctx, tc, dst);
}

function crtCurvature(octx, oc, tctx, tc) {
  const w = oc.width, h = oc.height;
  const src = octx.getImageData(0, 0, w, h);
  const dst = tctx.createImageData(w, h);

  const sd = src.data, dd = dst.data;
  const cx = w / 2, cy = h / 2;
  const maxR = Math.sqrt(cx * cx + cy * cy);
  const curve = 0.12;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {

      // distance to center
      const dx = x - cx, dy = y - cy;
      const r = Math.sqrt(dx*dx + dy*dy);

      const factor = 1 + curve * (r / maxR) ** 2;
      const sx = clamp(Math.round(dx / factor + cx), 0, w-1);
      const sy = clamp(Math.round(dy / factor + cy), 0, h-1);

      const si = (sy*w + sx)*4;
      const di = (y*w + x)*4;

      dd[di] = sd[si];
      dd[di+1] = sd[si+1];
      dd[di+2] = sd[si+2];
      dd[di+3] = 255;
    }
  }

  tctx.putImageData(dst, 0, 0);
}

function slitScan(octx, oc, tctx, tc) {
  const w = oc.width, h = oc.height;
  const src = octx.getImageData(0, 0, w, h);
  const dst = tctx.createImageData(w, h);

  const sd = src.data, dd = dst.data;

  for (let y = 0; y < h; y++) {
    const shift = Math.floor((y / h) * 80);  // gradually shifting sample point
    for (let x = 0; x < w; x++) {
      const sx = clamp(x + shift, 0, w - 1);
      const si = (y*w + sx)*4;
      const di = (y*w + x)*4;

      dd[di]=sd[si];
      dd[di+1]=sd[si+1];
      dd[di+2]=sd[si+2];
      dd[di+3]=255;
    }
  }

  tctx.putImageData(dst, 0, 0);
}

function checkerShift(octx, oc, tctx, tc) {
  const w = oc.width, h = oc.height;
  const src = octx.getImageData(0, 0, w, h);
  const dst = tctx.createImageData(w, h);
  const sd = src.data, dd = dst.data;

  const tile = 20;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {

      const tileX = Math.floor(x / tile);
      const tileY = Math.floor(y / tile);
      const offset = ((tileX + tileY) % 2 === 0) ? 6 : -6;

      const sx = clamp(x + offset, 0, w - 1);
      const si = (y*w + sx)*4;
      const di = (y*w + x)*4;

      dd[di] = sd[si];
      dd[di+1] = sd[si+1];
      dd[di+2] = sd[si+2];
      dd[di+3] = 255;
    }
  }

  tctx.putImageData(dst, 0, 0);
}


function tvRolling(octx, oc, tctx, tc) {
  const w = oc.width, h = oc.height;
  const roll = Math.floor(Math.random() * h * 0.6);

  tctx.clearRect(0, 0, w, h);

  // upper part moves up
  tctx.drawImage(oc, 0, roll, w, h - roll, 0, 0, w, h - roll);

  // lower part wraps to bottom
  tctx.drawImage(oc, 0, 0, w, roll, 0, h - roll, w, roll);
}


function doubleExposure(octx, oc, tctx, tc) {
  const w = oc.width, h = oc.height;

  tctx.clearRect(0, 0, w, h);
  tctx.globalAlpha = 1.0;
  tctx.drawImage(oc, 0, 0);

  tctx.globalAlpha = 0.45;
  tctx.drawImage(oc, 10, 10);

  tctx.globalAlpha = 1.0;
}


function rgbDesync(octx, oc, tctx, tc) {
  const w = oc.width, h = oc.height;

  tctx.clearRect(0, 0, w, h);
  tctx.globalCompositeOperation = "lighter";

  // R shifted right
  tctx.globalAlpha = 1;
  tctx.filter = "brightness(1.2)";
  tctx.drawImage(oc, 5, 0, w, h);

  // G shifted left
  tctx.globalAlpha = 0.8;
  tctx.filter = "brightness(1)";
  tctx.drawImage(oc, -5, 0, w, h);

  // B shifted down-right
  tctx.globalAlpha = 0.8;
  tctx.drawImage(oc, 3, 4, w, h);

  tctx.filter = "none";
  tctx.globalCompositeOperation = "source-over";
}






// === Apply dispatcher ===

export function applyBasicTransform(id, octx, oc, tctx, tc) {
  switch(id) {
    case "t1":  return flipHorizontal(octx, oc, tctx, tc);
    case "t2":  return flipVertical(octx, oc, tctx, tc);
    case "t3":  return rotate(octx, oc, tctx, tc, Math.PI/2);
    case "t4":  return rotate(octx, oc, tctx, tc, Math.PI);
    case "t5":  return rotate(octx, oc, tctx, tc, 3*Math.PI/2);
    case "t6":  return rotate(octx, oc, tctx, tc, 7*Math.PI/180);
    case "t7":  return rotate(octx, oc, tctx, tc, -7*Math.PI/180);
    case "t8":  return randomRotate(octx, oc, tctx, tc);
    case "t9":  return zoom(octx, oc, tctx, tc, 1.3);
    case "t10": return zoom(octx, oc, tctx, tc, 0.7);
    case "t11": return halfMirrorH(octx, oc, tctx, tc);
    case "t12": return halfMirrorV(octx, oc, tctx, tc);
    case "t13": return gridSwap(octx, oc, tctx, tc);
    case "t14": return stripShuffle(octx, oc, tctx, tc);
    case "t15": return pixelate(octx, oc, tctx, tc, 12);
    case "t16": return pixelate(octx, oc, tctx, tc, 6);
    case "t17": return invert(octx, oc, tctx, tc);
    case "t18": return grayscale(octx, oc, tctx, tc);
    case "t19": return sepia(octx, oc, tctx, tc);
    case "t20": return threshold(octx, oc, tctx, tc);
    case "t21": return brightnessContrast(octx, oc, tctx, tc, 0, 1.4);
    case "t22": return brightnessContrast(octx, oc, tctx, tc, 0, 0.6);
    case "t23": return brightnessContrast(octx, oc, tctx, tc, 40, 1.0);
    case "t24": return brightnessContrast(octx, oc, tctx, tc, -40, 1.0);
    case "t25": return saturation(octx, oc, tctx, tc, 0.4);
    case "t26": return saturation(octx, oc, tctx, tc, 1.8);
    case "t27": return swapChannels(octx, oc, tctx, tc, "rb");
    case "t28": return swapChannels(octx, oc, tctx, tc, "rg");
    case "t29": return swapChannels(octx, oc, tctx, tc, "gb");
    case "t30": return addNoise(octx, oc, tctx, tc, 20);
    case "t31": return saltPepper(octx, oc, tctx, tc, 0.03);
    case "t32": return convolve(octx, oc, tctx, tc, [1,1,1,1,1,1,1,1,1], 9, 0);
    case "t33": return convolve(octx, oc, tctx, tc, [0,-1,0,-1,5,-1,0,-1,0], 1, 0);
    case "t34": return convolve(octx, oc, tctx, tc, [-1,-1,-1,-1,8,-1,-1,-1,-1], 1, 128);
    case "t35": return vignette(octx, oc, tctx, tc);
    case "t36": return scanlines(octx, oc, tctx, tc);
    case "t37": return wave(octx, oc, tctx, tc, true);
    case "t38": return wave(octx, oc, tctx, tc, false);
    case "t39": return radialDistortion(octx, oc, tctx, tc, -0.4);
    case "t40": return radialDistortion(octx, oc, tctx, tc, 0.4);
    case "t41": return shear(octx, oc, tctx, tc, true);
    case "t42": return shear(octx, oc, tctx, tc, false);
    case "t43": return swapQuadrants(octx, oc, tctx, tc);
    case "t44": return kaleidoscope(octx, oc, tctx, tc);
    case "t45": return tile2x2(octx, oc, tctx, tc);
    case "t46": return centerGlow(octx, oc, tctx, tc);
    case "t47": return posterize(octx, oc, tctx, tc, 4);
    case "t48": return solarize(octx, oc, tctx, tc);
    case "t49": return emboss(octx, oc, tctx, tc);
    case "t50": return glitchStripes(octx, oc, tctx, tc);
    case "t51": return crtCurvature(octx, oc, tctx, tc);
    case "t52": return slitScan(octx, oc, tctx, tc);
    case "t53": return checkerShift(octx, oc, tctx, tc);
    case "t54": return tvRolling(octx, oc, tctx, tc);
    case "t55": return doubleExposure(octx, oc, tctx, tc);
    case "t56": return rgbDesync(octx, oc, tctx, tc);

    
    default:   return drawImageTo(tctx, tc, oc);
  }
}

