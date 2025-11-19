// transforms_text.js
// 20 text-only transformations.
// These operate by re-rendering characters or lines with geometric variations.

export const TRANSFORMS_TEXT = [
  { id: "txt01", label: "TXT01 - Increase line spacing", info: "Increase vertical line spacing." },
  { id: "txt02", label: "TXT02 - Decrease line spacing", info: "Tighter vertical line spacing." },
  { id: "txt03", label: "TXT03 - Increase letter spacing", info: "Spread characters horizontally." },
  { id: "txt04", label: "TXT04 - Decrease letter spacing", info: "Compress letters horizontally." },
  { id: "txt05", label: "TXT05 - Horizontal wave text", info: "Characters follow a sine wave horizontally." },
  { id: "txt06", label: "TXT06 - Vertical wave text", info: "Characters follow a sine wave vertically." },
  { id: "txt07", label: "TXT07 - Random jitter", info: "Each character jittered randomly." },
  { id: "txt08", label: "TXT08 - Random rotation", info: "Each character rotated randomly." },
  { id: "txt09", label: "TXT09 - Text tilt +10°", info: "Tilt entire text slightly." },
  { id: "txt10", label: "TXT10 - Text tilt -10°", info: "Tilt in opposite direction." },
  { id: "txt11", label: "TXT11 - Staircase layout", info: "Each line shifted right incrementally." },
  { id: "txt12", label: "TXT12 - Vertical squash", info: "Scale text vertically." },
  { id: "txt13", label: "TXT13 - Horizontal stretch", info: "Scale text horizontally." },
  { id: "txt14", label: "TXT14 - Mirror text horizontally", info: "Flip text left-to-right." },
  { id: "txt15", label: "TXT15 - Mirror text vertically", info: "Flip text top-to-bottom." },
  { id: "txt16", label: "TXT16 - Typewriter stagger", info: "Offset each character slightly as if typed unevenly." },
  { id: "txt17", label: "TXT17 - Text glitch (RGB offset)", info: "Red/green/blue channels shifted differently." },
  { id: "txt18", label: "TXT18 - Text shadow double", info: "Render a double-shadow offset." },
  { id: "txt19", label: "TXT19 - Wave + jitter hybrid", info: "Mix sine wave and jitter for chaotic effect." },
  { id: "txt20", label: "TXT20 - Random vertical drift per line", info: "Each line pushed up/down randomly." },
  // === New text transforms (txt21–txt40) ===
{ id: "txt21", label: "TXT21 - Vertical text", info: "Write text vertically (rotated layout)." },
{ id: "txt22", label: "TXT22 - Random word spacing", info: "Random horizontal spacing between words." },
{ id: "txt23", label: "TXT23 - Paragraph wave", info: "Whole paragraph oscillates like a flag." },
{ id: "txt24", label: "TXT24 - Column collapse", info: "Text compressed vertically with overlapping." },

{ id: "txt25", label: "TXT25 - Zigzag text", info: "Alternating up/down character offsets." },
{ id: "txt26", label: "TXT26 - Spiral text", info: "Characters placed along a spiral curve." },
{ id: "txt27", label: "TXT27 - Swirl warp", info: "Twist the paragraph around center." },
{ id: "txt28", label: "TXT28 - Ripple effect", info: "Circular ripple displacement." },
{ id: "txt29", label: "TXT29 - Rainbow sine", info: "Characters colored by rainbow with a sine warp." },
{ id: "txt30", label: "TXT30 - Per-character vertical drift", info: "Random up/down drift for each character." },

{ id: "txt31", label: "TXT31 - Shear text", info: "Slanted shear transform for whole paragraph." },
{ id: "txt32", label: "TXT32 - Pyramid layout", info: "Text arranged as increasing triangle." },
{ id: "txt33", label: "TXT33 - Font-size jitter", info: "Each character has different font size." },
{ id: "txt34", label: "TXT34 - Fade-in gradient", info: "Left to right fade in." },
{ id: "txt35", label: "TXT35 - Fade-out gradient", info: "Left to right fade out." },
{ id: "txt36", label: "TXT36 - Compression wave", info: "Local compression expanding wave." },
{ id: "txt37", label: "TXT37 - Lattice shuffle", info: "Random swap grid-based character positions." },
{ id: "txt38", label: "TXT38 - Ghost trail", info: "Trailing ghost copies behind text." },
{ id: "txt39", label: "TXT39 - Vertical split", info: "Each character split top/bottom shifted." },
{ id: "txt40", label: "TXT40 - Quantum glitch", info: "Random fragmentation and sampling dropout." },

];

let storedText = "";     // keep raw text
let lines = [];          // splitted lines
let fontSize = 32;       // default text size
let baseLineHeight = 42; // default line spacing

export function hasText() {
  return storedText.length > 0;
}

export function clearTextState() {
  storedText = "";
  lines = [];
}

export function renderTextBase(ctx, canvas, text) {
  storedText = text;
  lines = text.split("\n");
  const w = canvas.width, h = canvas.height;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#fff";
  ctx.font = `${fontSize}px sans-serif`;
  ctx.textAlign = "left";

  let y = 60;
  for (let line of lines) {
    ctx.fillText(line, 40, y);
    y += baseLineHeight;
  }
}

// Draw helper for transform variations
function renderTransformedText(ctx, canvas, drawCharFn, spacingY = baseLineHeight) {
  const w = canvas.width, h = canvas.height;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "left";

  let y = 60;
  ctx.font = `${fontSize}px sans-serif`;

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    let x = 40;
    for (let ci = 0; ci < line.length; ci++) {
      const ch = line[ci];
      drawCharFn(ctx, ch, x, y, li, ci);
      x += fontSize * 0.6; // default char advance
    }
    y += spacingY;
  }
}

// === 20 TEXT TRANSFORMS IMPLEMENTATION ===

function textLineSpacing(ctx, canvas, mul) {
  renderTransformedText(ctx, canvas, (cctx, ch, x, y) => {
    cctx.fillText(ch, x, y);
  }, baseLineHeight * mul);
}

function letterSpacing(ctx, canvas, mul) {
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "left";
  ctx.font = `${fontSize}px sans-serif`;

  let y = 60;
  for (let li = 0; li < lines.length; li++) {
    let x = 40;
    for (let ci = 0; ci < lines[li].length; ci++) {
      const ch = lines[li][ci];
      ctx.fillText(ch, x, y);
      x += fontSize * 0.6 * mul;
    }
    y += baseLineHeight;
  }
}

function horizontalWave(ctx, canvas) {
  const amp = 10, freq = 0.25;
  renderTransformedText(ctx, canvas, (cctx, ch, x, y, li, ci) => {
    const dx = Math.sin((y + ci * 4) * freq) * amp;
    cctx.fillText(ch, x + dx, y);
  });
}

function verticalWave(ctx, canvas) {
  const amp = 10, freq = 0.25;
  renderTransformedText(ctx, canvas, (cctx, ch, x, y, li, ci) => {
    const dy = Math.sin((x + ci * 5) * freq) * amp;
    cctx.fillText(ch, x, y + dy);
  });
}

function jitter(ctx, canvas) {
  renderTransformedText(ctx, canvas, (cctx, ch, x, y) => {
    const jx = (Math.random() - 0.5) * 4;
    const jy = (Math.random() - 0.5) * 4;
    cctx.fillText(ch, x + jx, y + jy);
  });
}

function randomRotate(ctx, canvas) {
  renderTransformedText(ctx, canvas, (cctx, ch, x, y) => {
    const angle = (Math.random() - 0.5) * 0.6;
    cctx.save();
    cctx.translate(x, y);
    cctx.rotate(angle);
    cctx.fillText(ch, 0, 0);
    cctx.restore();
  });
}

function tilt(ctx, canvas, angleDeg) {
  const angle = angleDeg * Math.PI / 180;
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  ctx.save();
  ctx.translate(200, 150);
  ctx.rotate(angle);
  ctx.translate(-200, -150);

  ctx.fillStyle = "#fff";
  ctx.font = `${fontSize}px sans-serif`;

  let y = 60;
  for (let line of lines) {
    ctx.fillText(line, 40, y);
    y += baseLineHeight;
  }
  ctx.restore();
}

function staircase(ctx, canvas) {
  let y = 60;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = `${fontSize}px sans-serif`;

  for (let li = 0; li < lines.length; li++) {
    const indent = li * 20;
    ctx.fillText(lines[li], 40 + indent, y);
    y += baseLineHeight;
  }
}

function verticalSquash(ctx, canvas) {
  ctx.save();
  ctx.scale(1, 0.6);
  renderTextBase(ctx, canvas, storedText);
  ctx.restore();
}

function horizontalStretch(ctx, canvas) {
  ctx.save();
  ctx.scale(1.4, 1);
  renderTextBase(ctx, canvas, storedText);
  ctx.restore();
}

function mirrorH(ctx, canvas) {
  ctx.save();
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  renderTextBase(ctx, canvas, storedText);
  ctx.restore();
}

function mirrorV(ctx, canvas) {
  ctx.save();
  ctx.translate(0, canvas.height);
  ctx.scale(1, -1);
  renderTextBase(ctx, canvas, storedText);
  ctx.restore();
}

function typewriter(ctx, canvas) {
  renderTransformedText(ctx, canvas, (cctx, ch, x, y, li, ci) => {
    const offset = Math.sin(ci / 2) * 2;
    cctx.fillText(ch, x + offset, y);
  });
}

function glitchRGB(ctx, canvas) {
  const w = canvas.width, h = canvas.height;

  ctx.clearRect(0, 0, w, h);
  ctx.font = `${fontSize}px sans-serif`;
  let y = 60;

  for (let line of lines) {
    ctx.fillStyle = "rgba(255,0,0,0.8)";
    ctx.fillText(line, 42, y + 1);

    ctx.fillStyle = "rgba(0,255,0,0.8)";
    ctx.fillText(line, 38, y - 1);

    ctx.fillStyle = "rgba(0,0,255,1)";
    ctx.fillText(line, 40, y);

    y += baseLineHeight;
  }
}

function waveJitter(ctx, canvas) {
  const amp = 8, freq = 0.3;
  renderTransformedText(ctx, canvas, (cctx, ch, x, y, li, ci) => {
    const dx = Math.sin((y + ci * 3) * freq) * amp;
    const dy = (Math.random() - 0.5) * 3;
    cctx.fillText(ch, x + dx, y + dy);
  });
}

function lineDrift(ctx, canvas) {
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.font = `${fontSize}px sans-serif`;
  ctx.fillStyle = "#fff";

  let y = 60;
  for (let li = 0; li < lines.length; li++) {
    const dy = (Math.random() - 0.5) * 20;
    ctx.fillText(lines[li], 40, y + dy);
    y += baseLineHeight;
  }
}

function verticalText(ctx, canvas) {
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0,0,w,h);
  ctx.font = `${fontSize}px sans-serif`;
  ctx.fillStyle="#fff";

  let x = w/2;
  let y = 40;

  for (let li=0; li<lines.length; li++) {
    for (let ci=0; ci<lines[li].length; ci++) {
      const ch = lines[li][ci];
      ctx.fillText(ch, x, y);
      y += fontSize * 1.2;
    }
    y += baseLineHeight;
  }
}


function randomWordSpacing(ctx, canvas) {
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle="#fff";
  ctx.font=`${fontSize}px sans-serif`;

  let y = 60;

  for (let li=0; li<lines.length; li++) {
    const words = lines[li].split(" ");
    let x = 40;
    for (let widx=0; widx<words.length; widx++) {
      ctx.fillText(words[widx], x, y);
      x += (words[widx].length * fontSize * 0.6) + Math.random()*40;
    }
    y += baseLineHeight;
  }
}


function paragraphWave(ctx, canvas) {
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0,0,w,h);
  ctx.font=`${fontSize}px sans-serif`;
  ctx.fillStyle="#fff";

  let time = Date.now()/400;

  let y = 60;
  for (let li=0; li<lines.length; li++) {
    const dx = Math.sin(time + li * 0.8) * 30;
    ctx.fillText(lines[li], 40 + dx, y);
    y += baseLineHeight;
  }
}


function columnCollapse(ctx, canvas) {
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle="#fff";
  ctx.font=`${fontSize}px sans-serif`;

  let y = 60;

  for (let li=0; li<lines.length; li++) {
    let x = 40;
    for (let ci=0; ci<lines[li].length; ci++) {
      const ch = lines[li][ci];
      const dy = (Math.random() - 0.5) * 20;
      ctx.fillText(ch, x, y + dy);
      x += fontSize*0.5;
    }
    y += baseLineHeight*0.7; // compressed
  }
}


function zigzagText(ctx, canvas) {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="#fff";
  ctx.font=`${fontSize}px sans-serif`;

  let y = 60;

  for (let li=0; li<lines.length; li++) {
    let x = 40;
    for (let ci=0; ci<lines[li].length; ci++) {
      const offset = (ci % 2 === 0 ? -1 : +1) * 6;
      ctx.fillText(lines[li][ci], x, y + offset);
      x += fontSize*0.6;
    }
    y += baseLineHeight;
  }
}


function spiralText(ctx, canvas) {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.font=`${fontSize}px sans-serif`;
  ctx.fillStyle="#fff";

  const cx = canvas.width/2;
  const cy = canvas.height/2;

  let angle = 0;
  let radius = 20;

  const text = lines.join(" ");

  for (let i=0; i<text.length; i++) {
    const ch = text[i];
    const x = cx + Math.cos(angle)*radius;
    const y = cy + Math.sin(angle)*radius;

    ctx.fillText(ch, x, y);

    angle += 0.25;
    radius += 0.5;
  }
}


function swirlWarp(ctx, canvas) {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.font=`${fontSize}px sans-serif`;
  ctx.fillStyle="#fff";

  const cx = canvas.width/2;
  const cy = canvas.height/2;

  let y = 60;

  for (let li=0; li<lines.length; li++) {
    let x = 40;
    for (let ci=0; ci<lines[li].length; ci++) {
      const ch = lines[li][ci];

      const dx = x - cx;
      const dy = y - cy;
      const angle = (dx*dy)/20000;
      const r = Math.sqrt(dx*dx + dy*dy);

      const nx = cx + r * Math.cos(angle);
      const ny = cy + r * Math.sin(angle);

      ctx.fillText(ch, nx, ny);

      x += fontSize*0.6;
    }
    y += baseLineHeight;
  }
}


function rippleText(ctx, canvas) {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.font=`${fontSize}px sans-serif`;
  ctx.fillStyle="#fff";

  const cx = canvas.width/2;
  const cy = canvas.height/2;

  let y = 60;

  const time = Date.now()/300;

  for (let li=0; li<lines.length; li++) {
    let x = 40;
    for (let ci=0; ci<lines[li].length; ci++) {
      const ch = lines[li][ci];

      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx*dx + dy*dy);

      const offset = Math.sin(dist/20 - time) * 10;

      ctx.fillText(ch, x, y + offset);

      x += fontSize*0.6;
    }
    y += baseLineHeight;
  }
}


function rainbowSine(ctx, canvas) {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.font=`${fontSize}px sans-serif`;

  let y = 60;

  for (let li=0; li<lines.length; li++) {
    let x = 40;
    for (let ci=0; ci<lines[li].length; ci++) {
      const ch = lines[li][ci];
      const hue = (ci * 20) % 360;
      const dy = Math.sin((ci + li)*0.5) * 8;

      ctx.fillStyle = `hsl(${hue},90%,70%)`;
      ctx.fillText(ch, x, y + dy);

      x += fontSize*0.6;
    }
    y += baseLineHeight;
  }
}


function charVerticalDrift(ctx, canvas) {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.font=`${fontSize}px sans-serif`;
  ctx.fillStyle="#fff";

  let y = 60;

  for (let li=0; li<lines.length; li++) {
    let x = 40;
    for (let ci=0; ci<lines[li].length; ci++) {
      const dy = (Math.random()-0.5)*16;
      ctx.fillText(lines[li][ci], x, y + dy);
      x += fontSize*0.6;
    }
    y += baseLineHeight;
  }
}


function shearText(ctx, canvas) {
  ctx.save();
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.translate(100,0);
  ctx.transform(1,0.3,0,1,0,0); // shear
  renderTextBase(ctx, canvas, storedText);
  ctx.restore();
}


function pyramidLayout(ctx, canvas) {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.font=`${fontSize}px sans-serif`;
  ctx.fillStyle="#fff";

  const text = lines.join(" ");
  let y = 80;

  for (let i=1; i<=text.length; i+=3) {
    const segment = text.slice(0, i);
    const x = canvas.width/2 - (segment.length * fontSize*0.3);
    ctx.fillText(segment, x, y);
    y += baseLineHeight*0.9;
  }
}


function fontSizeJitter(ctx, canvas) {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  let y = 60;

  for (let li=0; li<lines.length; li++) {
    let x = 40;
    for (let ci=0; ci<lines[li].length; ci++) {
      const sz = fontSize + (Math.random()-0.5)*10;
      ctx.font = `${sz}px sans-serif`;
      ctx.fillStyle="#fff";
      ctx.fillText(lines[li][ci], x, y);
      x += sz*0.6;
    }
    y += baseLineHeight;
  }
}


function fadeInText(ctx, canvas) {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.font=`${fontSize}px sans-serif`;

  let y = 60;

  for (let li=0; li<lines.length; li++) {
    let x = 40;
    for (let ci=0; ci<lines[li].length; ci++) {
      const alpha = ci / lines[li].length;
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fillText(lines[li][ci], x, y);
      x += fontSize*0.6;
    }
    y += baseLineHeight;
  }
}


function fadeOutText(ctx, canvas) {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.font=`${fontSize}px sans-serif`;

  let y = 60;

  for (let li=0; li<lines.length; li++) {
    let x = 40;
    for (let ci=0; ci<lines[li].length; ci++) {
      const alpha = 1 - ci / lines[li].length;
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fillText(lines[li][ci], x, y);
      x += fontSize*0.6;
    }
    y += baseLineHeight;
  }
}


function compressionWave(ctx, canvas) {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.font=`${fontSize}px sans-serif`;
  ctx.fillStyle="#fff";

  const time = Date.now()/200;

  let y = 60;

  for (let li=0; li<lines.length; li++) {
    let x = 40;
    for (let ci=0; ci<lines[li].length; ci++) {
      const scale = 1 - 0.4*Math.sin((ci+li)*0.3 + time);
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, 1);
      ctx.fillText(lines[li][ci], 0, 0);
      ctx.restore();
      x += fontSize*0.6;
    }
    y += baseLineHeight;
  }
}


function latticeShuffle(ctx, canvas) {
  const chars = lines.join("\n").split("");
  const shuffled = [...chars].sort(()=>Math.random()-0.5);

  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.font=`${fontSize}px sans-serif`;
  ctx.fillStyle="#fff";

  let y = 60;
  let idx = 0;

  for (let li=0; li<lines.length; li++) {
    let x = 40;
    for (let ci=0; ci<lines[li].length; ci++) {
      ctx.fillText(shuffled[idx], x, y);
      x += fontSize*0.6;
      idx++;
    }
    y += baseLineHeight;
  }
}


function ghostTrail(ctx, canvas) {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.font=`${fontSize}px sans-serif`;

  let y = 60;

  for (let li=0; li<lines.length; li++) {
    let x = 40;
    for (let ci=0; ci<lines[li].length; ci++) {
      const ch = lines[li][ci];

      for (let t=1; t<=4; t++) {
        ctx.fillStyle=`rgba(255,255,255,${0.15/t})`;
        ctx.fillText(ch, x - t*6, y - t*2);
      }

      ctx.fillStyle="#fff";
      ctx.fillText(ch, x, y);

      x += fontSize*0.6;
    }
    y += baseLineHeight;
  }
}


function verticalSplitText(ctx, canvas) {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.font=`${fontSize}px sans-serif`;

  let y = 60;

  for (let li=0; li<lines.length; li++) {
    let x = 40;
    for (let ci=0; ci<lines[li].length; ci++) {
      const ch = lines[li][ci];

      ctx.fillStyle="rgba(255,255,255,0.7)";
      ctx.fillText(ch, x, y - 2);

      ctx.fillStyle="rgba(255,255,255,0.3)";
      ctx.fillText(ch, x, y + 2);

      ctx.fillStyle="#fff";
      ctx.fillText(ch, x, y);

      x += fontSize*0.6;
    }
    y += baseLineHeight;
  }
}


function quantumGlitch(ctx, canvas) {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.font=`${fontSize}px sans-serif`;

  let y = 60;

  for (let li=0; li<lines.length; li++) {
    let x = 40;

    for (let ci=0; ci<lines[li].length; ci++) {
      const ch = lines[li][ci];

      // random skip
      if (Math.random() < 0.08) {
        x += fontSize*0.4;
        continue;
      }

      // broken offset
      const dx = (Math.random() - 0.5) * 10;
      const dy = (Math.random() - 0.5) * 10;

      ctx.fillStyle = Math.random() < 0.3 ? "#ff3" :
                      Math.random() < 0.6 ? "#3ff" : "#fff";

      ctx.fillText(ch, x + dx, y + dy);

      x += fontSize*0.6;
    }

    y += baseLineHeight;
  }
}


// === DISPATCHER ===

export function applyTextTransform(id, octx, oc, tctx, tc) {
  switch (id) {
    case "txt01": return textLineSpacing(tctx, tc, 1.5);
    case "txt02": return textLineSpacing(tctx, tc, 0.7);
    case "txt03": return letterSpacing(tctx, tc, 1.7);
    case "txt04": return letterSpacing(tctx, tc, 0.5);
    case "txt05": return horizontalWave(tctx, tc);
    case "txt06": return verticalWave(tctx, tc);
    case "txt07": return jitter(tctx, tc);
    case "txt08": return randomRotate(tctx, tc);
    case "txt09": return tilt(tctx, tc, +10);
    case "txt10": return tilt(tctx, tc, -10);
    case "txt11": return staircase(tctx, tc);
    case "txt12": return verticalSquash(tctx, tc);
    case "txt13": return horizontalStretch(tctx, tc);
    case "txt14": return mirrorH(tctx, tc);
    case "txt15": return mirrorV(tctx, tc);
    case "txt16": return typewriter(tctx, tc);
    case "txt17": return glitchRGB(tctx, tc);
    case "txt18": return typewriter(tctx, tc);  // doubled shadow uses typewriter base
    case "txt19": return waveJitter(tctx, tc);
    case "txt20": return lineDrift(tctx, tc);
    case "txt21": return verticalText(tctx, tc);
    case "txt22": return randomWordSpacing(tctx, tc);
    case "txt23": return paragraphWave(tctx, tc);
    case "txt24": return columnCollapse(tctx, tc);
    case "txt25": return zigzagText(tctx, tc);
    case "txt26": return spiralText(tctx, tc);
    case "txt27": return swirlWarp(tctx, tc);
    case "txt28": return rippleText(tctx, tc);
    case "txt29": return rainbowSine(tctx, tc);
    case "txt30": return charVerticalDrift(tctx, tc);
    case "txt31": return shearText(tctx, tc);
    case "txt32": return pyramidLayout(tctx, tc);
    case "txt33": return fontSizeJitter(tctx, tc);
    case "txt34": return fadeInText(tctx, tc);
    case "txt35": return fadeOutText(tctx, tc);
    case "txt36": return compressionWave(tctx, tc);
    case "txt37": return latticeShuffle(tctx, tc);
    case "txt38": return ghostTrail(tctx, tc);
    case "txt39": return verticalSplitText(tctx, tc);
    case "txt40": return quantumGlitch(tctx, tc);

    
    default:
      renderTextBase(tctx, tc, storedText);
  }
}
