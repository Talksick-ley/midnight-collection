const canvas = document.getElementById("smokeCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

/* -------- MOUSE TRACKING -------- */
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

/* -------- SMOKE PARTICLE -------- */
class Smoke {
  constructor() {
    this.reset();
  }

  reset() {
    // start mostly from bottom
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 100;

    this.baseSize = Math.random() * 120 + 80;

    this.speedY = Math.random() * 0.4 + 0.2;
    this.speedX = Math.random() * 0.3 - 0.15;

    this.opacity = Math.random() * 0.12 + 0.03;

    this.angle = Math.random() * Math.PI * 2;
    this.angleSpeed = Math.random() * 0.003 - 0.0015;
  }

  update() {
    this.y -= this.speedY;
    this.x += this.speedX;

    // swirl motion
    this.angle += this.angleSpeed;
    this.x += Math.sin(this.angle) * 0.4;

    // reset when out
    if (this.y < -200) {
      this.reset();
    }

    /* -------- MOUSE INTERACTION -------- */
    let dx = this.x - mouse.x;
    let dy = this.y - mouse.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    let maxDist = 200;

    if (dist < maxDist) {
      let force = (1 - dist / maxDist);

      // push outward slightly
      this.x += dx * force * 0.05;
      this.y += dy * force * 0.05;

      // brighten + reduce opacity (clear effect)
      this.currentOpacity = this.opacity + force * 0.15;
      this.colorBoost = force; // for white tint
    } else {
      this.currentOpacity = this.opacity;
      this.colorBoost = 0;
    }
  }

  draw() {
    ctx.save();

    // layer-based rendering (BOTTOM HEAVY)
    let heightFactor = this.y / canvas.height;

    // make bottom denser but darker
    let layerOpacity = this.currentOpacity * (1 - heightFactor * 0.7);

    // reduce visibility at bottom (so text readable)
    if (heightFactor > 0.7) {
      layerOpacity *= 0.6;
    }

    // blur for softness
    ctx.filter = "blur(25px)";

    const size = this.baseSize * (1 + (1 - heightFactor) * 0.3);

    // color shifts toward white near cursor
    let purple = `168,85,247`;
    let white = `255,255,255`;

    let color = this.colorBoost > 0.3 ? white : purple;

    const gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      size
    );

    gradient.addColorStop(0, `rgba(${color},${layerOpacity})`);
    gradient.addColorStop(0.4, `rgba(${color},${layerOpacity * 0.3})`);
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = gradient;

    // irregular organic shape
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      let angle = (i / 8) * Math.PI * 2;
      let radius = size * (0.6 + Math.random() * 0.5);

      let x = this.x + Math.cos(angle) * radius;
      let y = this.y + Math.sin(angle) * radius;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}

/* -------- INIT -------- */
function init() {
  particles = [];

  for (let i = 0; i < 60; i++) {
    particles.push(new Smoke());
  }
}

/* -------- ANIMATION LOOP -------- */
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animate);
}

init();
animate();

/* -------- RESIZE -------- */
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});