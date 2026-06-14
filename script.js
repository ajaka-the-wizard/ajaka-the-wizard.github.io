import data from "./data.json" with { type: "json" };

const PORTFOLIO = data;

function render() {
  const p = PORTFOLIO;

  // Meta
  document.title = `${p.name.first} ${p.name.last} — ${p.role}`;
  document.getElementById("navLogo").textContent =
    `${p.name.first[0]}${p.name.last[0]}/`;

  // Hero
  document.getElementById("heroName").innerHTML =
    `<span class="ln"><span>${p.name.first}</span></span>` +
    `<span class="ln"><span>${p.name.last}</span></span>`;
  document.getElementById("heroDesc").textContent = p.tagline;
  document.getElementById("heroCta").innerHTML =
    `<a class="btn btn-fill" href="#contact">Get in touch</a>` +
    `<a class="btn btn-ghost" href="${p.github}" target="_blank" rel="noopener">github/${p.githubHandle}</a>`;

  // About
  document.getElementById("aboutBody").innerHTML = p.about
    .map((para) => `<p>${para}</p>`)
    .join("");

  // Skills
  document.getElementById("skillsGrid").innerHTML = p.skills
    .map(
      (g) => `
          <div class="skill-cell">
            <p class="skill-ttl">${g.category}</p>
            <div class="tags">${g.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
          </div>`,
    )
    .join("");

  // Projects
  document.getElementById("projectList").innerHTML = p.projects
    .map(
      (proj) => `
          <div class="pcard">
            <div class="phead">
              <span class="pname">${proj.name}</span>
              <span class="pstack">${proj.stack}</span>
            </div>
            <p class="pdesc">${proj.desc}</p>
            ${
              proj.url
                ? `<a class="plink" href="${proj.url}" target="_blank" rel="noopener">View on GitHub <span>→</span></a>`
                : ""
            }
          </div>`,
    )
    .join("");

  // Also building — terminal block
  document.getElementById("alsoBuilding").innerHTML = `
        <div class="term-head">
          <div class="tdot"></div><div class="tdot"></div><div class="tdot"></div>
          <span class="term-title">also building</span>
        </div>
        <div class="term-body">
          ${p.alsoBuilding
            .map(
              (item) => `
            <div class="tline">
              <span class="tprompt">$</span>
              <span>
                <span class="tcmd">${item.name}</span>
                <span class="tcmt"> // ${item.lang} — ${item.desc}</span>
              </span>
            </div>`,
            )
            .join("")}
        </div>`;

  // Contact
  document.getElementById("contactGrid").innerHTML = p.contact
    .map((c) => {
      const tag = c.href ? "a" : "div";
      const attrs = c.href
        ? `href="${c.href}"${c.target ? ` target="${c.target}" rel="noopener"` : ""}`
        : "";
      return `<${tag} class="ccell" ${attrs}>
            <span class="clbl">${c.label}</span>
            <span class="cval">${c.value}</span>
          </${tag}>`;
    })
    .join("");

  document.getElementById("availabilityRow").innerHTML =
    `<span class="pdot"></span>${p.availability}`;

  // Footer
  document.getElementById("footerText").textContent =
    `${p.name.first} ${p.name.last} — ${p.role}`;
}

// Run render before any other JS touches the DOM
render();

/* ── Custom cursor ─────────────────────────────────────── */
const cDot = document.getElementById("cDot");
const cRing = document.getElementById("cRing");

if (window.matchMedia("(hover: hover)").matches) {
  let mx = 0,
    my = 0,
    rx = 0,
    ry = 0;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    cDot.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
  });

  (function lerpRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    cRing.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
    requestAnimationFrame(lerpRing);
  })();

  // Event delegation so dynamically rendered elements are covered automatically
  document.addEventListener("mouseover", (e) => {
    const on = !!e.target.closest(
      "a, button, .tag, .pcard, .ccell, .skill-cell",
    );
    cDot.classList.toggle("on", on);
    cRing.classList.toggle("on", on);
  });

  document.addEventListener("mouseleave", () => {
    cDot.style.opacity = "0";
    cRing.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    cDot.style.opacity = "1";
    cRing.style.opacity = "1";
  });
}

/* ── Scroll progress + nav frost ──────────────────────── */
const scrollBar = document.getElementById("scrollBar");
const nav = document.getElementById("nav");

window.addEventListener(
  "scroll",
  () => {
    const pct =
      window.scrollY /
      (document.documentElement.scrollHeight - window.innerHeight);
    scrollBar.style.transform = `scaleX(${pct})`;
    nav.classList.toggle("frosted", window.scrollY > 20);
  },
  { passive: true },
);

/* ── Active nav section ────────────────────────────────── */
const navLinks = document.querySelectorAll(".nav-list a[data-sec]");
const navObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting)
        navLinks.forEach((a) =>
          a.classList.toggle("active", a.dataset.sec === e.target.id),
        );
    });
  },
  { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
);
document.querySelectorAll("section[id]").forEach((s) => navObs.observe(s));

/* ── Scroll reveal — set up after render() ─────────────── */
const revObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        revObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1 },
);
document
  .querySelectorAll(".reveal, .stagger")
  .forEach((el) => revObs.observe(el));

/* ── Hero typewriter — reads from PORTFOLIO.role ───────── */
const roleEl = document.getElementById("roleText");
const blinkEl = document.getElementById("roleBlink");

setTimeout(() => {
  let i = 0;
  const t = setInterval(() => {
    roleEl.textContent += PORTFOLIO.role[i++];
    if (i >= PORTFOLIO.role.length) {
      clearInterval(t);
      setTimeout(() => {
        blinkEl.style.opacity = "0";
        blinkEl.style.transition = "opacity .6s";
      }, 2000);
    }
  }, 42);
}, 480);

/* ── Hero canvas — particle network ────────────────────── */
const canvas = document.getElementById("hero-canvas");
const ctx = canvas.getContext("2d");
const hero = document.getElementById("hero");
const N = 62,
  MAX_D = 148;

let W, H;
function resize() {
  W = canvas.width = hero.clientWidth;
  H = canvas.height = hero.clientHeight;
}
resize();
window.addEventListener("resize", resize, { passive: true });

class Dot {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.32;
    this.vy = (Math.random() - 0.5) * 0.32;
    this.r = Math.random() * 1.1 + 0.4;
    this.a = Math.random() * 0.55 + 0.1;
    this.ta = Math.random() * 0.45 + 0.1;
  }
  tick() {
    this.x += this.vx + nudgeX * 0.18;
    this.y += this.vy + nudgeY * 0.18;
    this.a += (this.ta - this.a) * 0.012;
    if (this.x < -8) this.x = W + 8;
    if (this.x > W + 8) this.x = -8;
    if (this.y < -8) this.y = H + 8;
    if (this.y > H + 8) this.y = -8;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(124,109,255,${this.a})`;
    ctx.fill();
  }
}

const dots = Array.from({ length: N }, () => new Dot());

let nudgeX = 0,
  nudgeY = 0,
  targetNX = 0,
  targetNY = 0;
hero.addEventListener("mousemove", (e) => {
  const r = hero.getBoundingClientRect();
  targetNX = ((e.clientX - r.left) / W - 0.5) * 0.6;
  targetNY = ((e.clientY - r.top) / H - 0.5) * 0.6;
});
hero.addEventListener("mouseleave", () => {
  targetNX = 0;
  targetNY = 0;
});

let running = true;
new IntersectionObserver(
  (es) => {
    running = es[0].isIntersecting;
  },
  { threshold: 0 },
).observe(hero);

function drawFrame() {
  requestAnimationFrame(drawFrame);
  if (!running) return;

  nudgeX += (targetNX - nudgeX) * 0.04;
  nudgeY += (targetNY - nudgeY) * 0.04;

  ctx.clearRect(0, 0, W, H);

  for (let a = 0; a < N; a++) {
    for (let b = a + 1; b < N; b++) {
      const dx = dots[a].x - dots[b].x;
      const dy = dots[a].y - dots[b].y;
      const d2 = dx * dx + dy * dy;
      if (d2 < MAX_D * MAX_D) {
        const alpha = (1 - Math.sqrt(d2) / MAX_D) * 0.11;
        ctx.beginPath();
        ctx.moveTo(dots[a].x, dots[a].y);
        ctx.lineTo(dots[b].x, dots[b].y);
        ctx.strokeStyle = `rgba(124,109,255,${alpha})`;
        ctx.lineWidth = 0.55;
        ctx.stroke();
      }
    }
  }

  dots.forEach((d) => {
    d.tick();
    d.draw();
  });
}
drawFrame();
