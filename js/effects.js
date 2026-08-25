// 派手な演出まわり: パーティクル・紙吹雪・花火・フローティングテキスト・SE

const Effects = (() => {
  let canvas, ctx, particles = [];
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function init() {
    canvas = document.getElementById('fx-canvas');
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(loop);
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function loop() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles = particles.filter((p) => p.life > 0);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity || 0;
      p.life -= p.decay;
      p.rot = (p.rot || 0) + (p.vrot || 0);
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      if (p.type === 'rect') {
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      } else if (p.type === 'circle') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'text') {
        ctx.font = `bold ${p.size}px sans-serif`;
        ctx.fillStyle = p.color;
        ctx.textAlign = 'center';
        ctx.fillText(p.text, 0, 0);
      }
      ctx.restore();
    });
    requestAnimationFrame(loop);
  }

  function confetti(x, y, count = 40) {
    const colors = ['#ff6b6b', '#ffd93d', '#6bcB77', '#4d96ff', '#c780fa', '#ff9f43'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      particles.push({
        type: 'rect', x, y,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 3,
        gravity: 0.15, size: 6 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1, decay: 0.01 + Math.random() * 0.01,
        rot: Math.random() * Math.PI, vrot: (Math.random() - 0.5) * 0.3
      });
    }
  }

  function fireworks(x, y) {
    const colors = ['#ff6b6b', '#ffd93d', '#6bcB77', '#4d96ff', '#c780fa', '#ff9f43', '#ffffff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < 60; i++) {
      const angle = (Math.PI * 2 * i) / 60;
      const speed = 3 + Math.random() * 4;
      particles.push({
        type: 'circle', x, y,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        gravity: 0.05, size: 4 + Math.random() * 3,
        color, life: 1, decay: 0.015
      });
    }
  }

  function fireworksShow(n = 5) {
    for (let i = 0; i < n; i++) {
      setTimeout(() => {
        fireworks(
          window.innerWidth * (0.2 + Math.random() * 0.6),
          window.innerHeight * (0.15 + Math.random() * 0.35)
        );
        sound('firework');
      }, i * 280);
    }
  }

  function floatText(x, y, text, color = '#ffd93d', size = 22) {
    particles.push({
      type: 'text', x, y, text, color, size,
      vx: (Math.random() - 0.5) * 1, vy: -1.8,
      gravity: -0.01, life: 1, decay: 0.012
    });
  }

  function screenShake(amount = 8, duration = 300) {
    const el = document.getElementById('app');
    const start = performance.now();
    function shake(t) {
      const elapsed = t - start;
      if (elapsed > duration) { el.style.transform = ''; return; }
      const p = 1 - elapsed / duration;
      const dx = (Math.random() - 0.5) * amount * p;
      const dy = (Math.random() - 0.5) * amount * p;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      requestAnimationFrame(shake);
    }
    requestAnimationFrame(shake);
  }

  function toast(message, icon = '🏆') {
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-text">${message}</span>`;
    container.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 400);
    }, 3600);
  }

  // --- Web Audio 簡易SE ---
  let actx = null;
  let muted = false;
  function setMuted(v) { muted = v; }
  function ensureCtx() {
    if (!actx) {
      try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { actx = null; }
    }
    return actx;
  }
  function sound(kind) {
    if (muted) return;
    const ac = ensureCtx();
    if (!ac) return;
    if (ac.state === 'suspended') ac.resume();
    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    let freq = 440, dur = 0.12, type = 'sine';
    if (kind === 'click') { freq = 520; dur = 0.06; type = 'triangle'; }
    else if (kind === 'buy') { freq = 660; dur = 0.1; type = 'square'; }
    else if (kind === 'achievement') { freq = 880; dur = 0.35; type = 'sine'; }
    else if (kind === 'golden') { freq = 1046; dur = 0.25; type = 'sine'; }
    else if (kind === 'prestige') { freq = 220; dur = 0.6; type = 'sawtooth'; }
    else if (kind === 'firework') { freq = 700 + Math.random() * 400; dur = 0.15; type = 'triangle'; }
    else if (kind === 'error') { freq = 160; dur = 0.15; type = 'square'; }
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (kind === 'achievement' || kind === 'prestige') {
      osc.frequency.exponentialRampToValueAtTime(freq * 1.6, now + dur);
    }
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  }

  return { init, confetti, fireworks, fireworksShow, floatText, screenShake, toast, sound, setMuted };
})();
