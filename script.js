/* ==========================================================
   EnergyOS — Landing Page JS
   ========================================================== */

// ---------- Preloader ----------
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('preloader').classList.add('hidden'), 600);
});

// ---------- Current year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Custom cursor ----------
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px)`; });
function loopCursor(){ rx += (mx - rx) * .18; ry += (my - ry) * .18; ring.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(loopCursor); }
loopCursor();
document.querySelectorAll('a,button,.feature,.ind,.tech,.why-card,.ai-card,.node,.step,.faq-q,.stat,.float-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>ring.classList.add('hover'));
  el.addEventListener('mouseleave',()=>ring.classList.remove('hover'));
});

// ---------- Nav scroll & mobile toggle ----------
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 30));
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// ---------- Active section highlighting ----------
const sections = [...document.querySelectorAll('section[id]')];
const linkMap = new Map([...navLinks.querySelectorAll('a')].map(a => [a.getAttribute('href').slice(1), a]));
const secObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      linkMap.forEach(a => a.classList.remove('active'));
      linkMap.get(e.target.id)?.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => secObserver.observe(s));

// ---------- Reveal on scroll ----------
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); revealObs.unobserve(e.target); }});
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ---------- Animated counters ----------
const counters = document.querySelectorAll('[data-count]');
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.count;
    const dur = 1600;
    const start = performance.now();
    const tick = t => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObs.unobserve(el);
  });
}, { threshold: .5 });
counters.forEach(c => countObs.observe(c));

// ---------- Magnetic buttons ----------
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width/2;
    const y = e.clientY - r.top - r.height/2;
    btn.style.transform = `translate(${x*.25}px,${y*.35}px)`;
  });
  btn.addEventListener('mouseleave', () => btn.style.transform = '');
});

// ---------- Hero parallax ----------
const laptop = document.getElementById('laptop');
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual && laptop){
  heroVisual.addEventListener('mousemove', e => {
    const r = heroVisual.getBoundingClientRect();
    const x = (e.clientX - r.left)/r.width - .5;
    const y = (e.clientY - r.top)/r.height - .5;
    laptop.style.transform = `rotateY(${x*8}deg) rotateX(${-y*6}deg) translateZ(0)`;
  });
  heroVisual.addEventListener('mouseleave', () => laptop.style.transform = '');
}

// ---------- Particle background ----------
(() => {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles;
  function resize(){ w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; }
  resize(); window.addEventListener('resize', resize);
  const COLORS = ['rgba(0,230,118,', 'rgba(0,194,255,', 'rgba(124,77,255,'];
  particles = Array.from({length:60}, () => ({
    x:Math.random()*w, y:Math.random()*h,
    vx:(Math.random()-.5)*.4, vy:(Math.random()-.5)*.4,
    r:Math.random()*2+1,
    c:COLORS[Math.floor(Math.random()*COLORS.length)],
    a:Math.random()*.5+.2
  }));
  function draw(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>w) p.vx*=-1;
      if(p.y<0||p.y>h) p.vy*=-1;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=p.c+p.a+')';
      ctx.shadowColor=p.c+'1)'; ctx.shadowBlur=8;
      ctx.fill();
    });
    ctx.shadowBlur=0;
    // Lines
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const p1=particles[i],p2=particles[j];
        const d=Math.hypot(p1.x-p2.x,p1.y-p2.y);
        if(d<120){
          ctx.beginPath();
          ctx.moveTo(p1.x,p1.y); ctx.lineTo(p2.x,p2.y);
          ctx.strokeStyle=`rgba(0,230,118,${(1-d/120)*.12})`;
          ctx.lineWidth=1; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ---------- Features data + render + modal ----------
const FEATURES = [
  { icon:'gauge-high', title:'Live Energy Monitoring', desc:'Real-time visibility across every parameter of your electrical system.',
    details:['Voltage','Current','Power','Power Factor','Frequency','Energy (kWh)','Reactive Power','Real-time updates']},
  { icon:'industry', title:'Machine Monitoring', desc:'Track each machine individually — from idle time to health.',
    details:['Per-machine consumption','Idle detection','Running hours','Machine comparison','Health score','Efficiency index']},
  { icon:'chart-line', title:'AI Energy Analytics', desc:'Turn raw meter data into actionable, forward-looking intelligence.',
    details:['Pattern learning','Trend analysis','Peak load prediction','Cost estimation','Bill forecasting','AI recommendations']},
  { icon:'triangle-exclamation', title:'Anomaly Detection', desc:'Catch problems before they become failures.',
    details:['Energy spikes','Power factor issues','Voltage fluctuation','Current imbalance','Unexpected machine behaviour']},
  { icon:'wrench', title:'Predictive Maintenance', desc:'ML-driven diagnostics for motors, bearings and drives.',
    details:['Motor degradation','Bearing failure','Vibration analytics','Maintenance scheduling','Remaining useful life']},
  { icon:'bell', title:'Emergency Alert Engine', desc:'The right alert to the right person, instantly.',
    details:['Electrical overload','Fire risk','Machine failure','SMS + WhatsApp + Email','Dashboard notifications','Role-based routing']},
  { icon:'leaf', title:'Carbon Intelligence', desc:'ESG-ready sustainability, built in.',
    details:['CO₂ tracking','Carbon reduction','Equivalent trees','ESG reports','Renewable integration']},
  { icon:'file-lines', title:'Reports', desc:'Beautiful, exportable reports on any schedule.',
    details:['Daily, weekly, monthly','Excel, PDF, CSV','One-click download','Email scheduling','Custom templates']},
  { icon:'user-shield', title:'Employee Management', desc:'Governance from owner to maintenance engineer.',
    details:['Role hierarchy','Plant manager','Engineer','Maintenance','Owner','Granular permissions']},
];

const grid = document.getElementById('featureGrid');
grid.innerHTML = FEATURES.map((f,i) => `
  <article class="feature reveal" data-index="${i}">
    <div class="feature-icon"><i class="fa-solid fa-${f.icon}"></i></div>
    <h3>${f.title}</h3>
    <p>${f.desc}</p>
    <span class="learn">Learn more <i class="fa-solid fa-arrow-right"></i></span>
  </article>
`).join('');
grid.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
grid.querySelectorAll('.feature').forEach(card => {
  card.addEventListener('click', () => {
    const f = FEATURES[+card.dataset.index];
    modalBody.innerHTML = `
      <div class="m-icon"><i class="fa-solid fa-${f.icon}"></i></div>
      <h3>${f.title}</h3>
      <p>${f.desc}</p>
      <ul>${f.details.map(d=>`<li><i class="fa-solid fa-check"></i>${d}</li>`).join('')}</ul>
    `;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});
modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
function closeModal(){ modal.classList.remove('open'); document.body.style.overflow = ''; }

// ---------- FAQ accordion ----------
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  q.addEventListener('click', () => {
    const open = item.classList.toggle('open');
    a.style.maxHeight = open ? a.scrollHeight + 'px' : '0';
  });
});
