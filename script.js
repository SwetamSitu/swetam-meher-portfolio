const root = document.documentElement;
const year = document.querySelector("#year");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const canvas = document.querySelector(".constellation-canvas");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const pipelineCopy = {
  source: {
    title: "Source intake and profiling",
    copy:
      "Understand where data starts, what business event it represents, and which quality expectations must be protected.",
    metrics: ["Traceability mapped", "Controls designed", "Support planned"],
  },
  extract: {
    title: "Extraction with visible dependencies",
    copy:
      "Shape mappings, sessions, schedules, and dependencies so the pipeline is repeatable and easy to operate.",
    metrics: ["Dependencies visible", "Failure paths known", "Timing clear"],
  },
  transform: {
    title: "Business rules made testable",
    copy:
      "Translate joins, cleansing, lookups, and exceptions into readable logic that can be validated confidently.",
    metrics: ["Rules readable", "Exceptions isolated", "Impact clear"],
  },
  validate: {
    title: "SQL validation and reconciliation",
    copy:
      "Use counts, reconciliation evidence, and defect analysis to prove the output is reliable, not only loaded.",
    metrics: ["Counts checked", "Defects reproducible", "Evidence ready"],
  },
  publish: {
    title: "Release, monitor, and support",
    copy:
      "Prepare release notes, runbooks, and handover context so teams can use and support the workflow calmly.",
    metrics: ["Runbooks usable", "Release notes clear", "Teams informed"],
  },
};

if (year) {
  year.textContent = new Date().getFullYear();
}

const updateScrollState = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  root.style.setProperty("--scroll-progress", progress.toFixed(4));
};

updateScrollState();
window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollState, { passive: true });

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      siteNav.classList.remove("is-open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation");
    }
  });
}

const pipelineStages = document.querySelectorAll(".pipeline-stage");
const pipelineTitle = document.querySelector("#pipeline-stage-title");
const pipelineText = document.querySelector("#pipeline-stage-copy");
const pipelineMetrics = document.querySelector(".pipeline-metrics");
const pipelineConsole = document.querySelector(".pipeline-console");
let activePipelineIndex = 0;
let pipelineTouched = false;

const setPipelineStage = (stageName) => {
  const next = pipelineCopy[stageName];

  if (!next || !pipelineTitle || !pipelineText || !pipelineMetrics) {
    return;
  }

  pipelineStages.forEach((stage, index) => {
    const isActive = stage.getAttribute("data-stage") === stageName;
    stage.classList.toggle("is-active", isActive);
    stage.setAttribute("aria-pressed", String(isActive));

    if (isActive) {
      activePipelineIndex = index;

      if (window.innerWidth <= 780) {
        stage.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  });

  pipelineTitle.textContent = next.title;
  pipelineText.textContent = next.copy;
  pipelineMetrics.innerHTML = next.metrics
    .map((metric) => {
      const [lead, ...rest] = metric.split(" ");
      return `<span><strong>${lead}</strong> ${rest.join(" ")}</span>`;
    })
    .join("");

  if (!prefersReducedMotion && pipelineConsole) {
    pipelineConsole.classList.remove("is-updating");
    window.requestAnimationFrame(() => pipelineConsole.classList.add("is-updating"));
  }
};

pipelineStages.forEach((stage) => {
  stage.setAttribute("aria-pressed", String(stage.classList.contains("is-active")));
  stage.addEventListener("click", () => {
    pipelineTouched = true;
    setPipelineStage(stage.getAttribute("data-stage"));
  });
});

if (pipelineStages.length > 0 && !prefersReducedMotion) {
  window.setInterval(() => {
    if (pipelineTouched) {
      return;
    }

    const nextStage = pipelineStages[(activePipelineIndex + 1) % pipelineStages.length];
    setPipelineStage(nextStage.getAttribute("data-stage"));
  }, 4200);
}

if (!prefersReducedMotion) {
  const revealItems = document.querySelectorAll(".reveal");
  const compactReveal = window.matchMedia("(max-width: 780px)").matches;
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    compactReveal
      ? { rootMargin: "0px 0px 14% 0px", threshold: 0.04 }
      : { rootMargin: "0px 0px -10% 0px", threshold: 0.14 }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = compactReveal
      ? `${Math.min(index * 18, 90)}ms`
      : `${Math.min(index * 32, 220)}ms`;
    revealObserver.observe(item);
  });

  document.querySelectorAll("[data-count]").forEach((counter) => {
    const end = Number(counter.getAttribute("data-count"));
    let started = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || started) {
          return;
        }

        started = true;
        const start = performance.now();
        const duration = 900;

        const tick = (now) => {
          const elapsed = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - elapsed, 3);
          counter.textContent = String(Math.round(end * eased));

          if (elapsed < 1) {
            requestAnimationFrame(tick);
          }
        };

        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.8 }
    );

    observer.observe(counter);
  });

  const updateCursorMode = () => {
    document.body.classList.toggle("has-futuristic-cursor", finePointer && window.innerWidth > 780);
  };

  updateCursorMode();
  window.addEventListener("resize", updateCursorMode, { passive: true });

  window.addEventListener(
    "pointermove",
    (event) => {
      root.style.setProperty("--cursor-x", `${event.clientX}px`);
      root.style.setProperty("--cursor-y", `${event.clientY}px`);
    },
    { passive: true }
  );

  let lastClickBurstAt = 0;

  const createClickBurst = (event) => {
    if (event.button > 0) {
      return;
    }

    const now = Date.now();
    if (now - lastClickBurstAt < 120) {
      return;
    }

    lastClickBurstAt = now;
    document.body.classList.add("is-clicking");
    window.setTimeout(() => document.body.classList.remove("is-clicking"), 120);

    const burst = document.createElement("span");
    burst.className = "click-burst";
    burst.style.setProperty("--click-x", `${event.clientX}px`);
    burst.style.setProperty("--click-y", `${event.clientY}px`);
    document.body.appendChild(burst);

    const removeBurst = () => burst.remove();
    burst.addEventListener("animationend", removeBurst, { once: true });
    window.setTimeout(removeBurst, 900);
  };

  window.addEventListener("pointerdown", createClickBurst, { passive: true });
  window.addEventListener("click", createClickBurst, { passive: true });

  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (!finePointer || window.innerWidth <= 780) {
        return;
      }

      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--tilt-x", `${x * 4.5}deg`);
      card.style.setProperty("--tilt-y", `${y * -4.5}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });
}

if (canvas && !prefersReducedMotion) {
  const context = canvas.getContext("2d");
  const particles = [];
  let width = 0;
  let height = 0;
  let animationFrame = 0;

  const getParticleCount = () => (window.innerWidth < 700 ? 34 : 62);

  const resizeCanvas = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const createParticles = () => {
    particles.length = 0;

    for (let index = 0; index < getParticleCount(); index += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: Math.random() * 1.4 + 0.5,
      });
    }
  };

  const draw = () => {
    context.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < -20) particle.x = width + 20;
      if (particle.x > width + 20) particle.x = -20;
      if (particle.y < -20) particle.y = height + 20;
      if (particle.y > height + 20) particle.y = -20;
    });

    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 150) {
          context.strokeStyle = `rgba(201, 168, 106, ${0.1 * (1 - distance / 150)})`;
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();
        }
      }
    }

    particles.forEach((particle) => {
      context.fillStyle = "rgba(244, 239, 230, 0.34)";
      context.beginPath();
      context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      context.fill();
    });

    animationFrame = requestAnimationFrame(draw);
  };

  resizeCanvas();
  createParticles();
  draw();

  window.addEventListener(
    "resize",
    () => {
      window.cancelAnimationFrame(animationFrame);
      resizeCanvas();
      createParticles();
      draw();
    },
    { passive: true }
  );
} else {
  document.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));
}
