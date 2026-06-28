const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const siteHeader = document.querySelector(".site-header");
const root = document.documentElement;
const year = document.querySelector("#year");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const canvas = document.querySelector(".constellation-canvas");
const pipelineCopy = {
  source: {
    title: "Source intake and profiling",
    copy:
      "I start by understanding where the data originates, what business event it represents, and what quality expectations must be protected downstream.",
    metrics: ["Traceability mapped early", "Controls designed before build", "Support considered from day one"],
  },
  extract: {
    title: "Extraction that respects dependencies",
    copy:
      "Mappings, sessions, schedules, and dependencies are shaped so the pipeline is repeatable, explainable, and easier to support in production.",
    metrics: ["Dependencies visible", "Failure paths documented", "Operational timing clear"],
  },
  transform: {
    title: "Business logic made testable",
    copy:
      "Transformation rules are translated into maintainable logic, with joins, cleansing, lookups, and exceptions handled deliberately instead of hidden in the flow.",
    metrics: ["Rules readable", "Exceptions isolated", "Change impact easier to assess"],
  },
  validate: {
    title: "SQL validation and reconciliation",
    copy:
      "I use SQL checks, reconciliation evidence, and defect analysis to prove that the output is not just loaded, but trustworthy.",
    metrics: ["Counts reconciled", "Defects reproducible", "Evidence handover-ready"],
  },
  publish: {
    title: "Release, monitor, and support",
    copy:
      "The final step is making the data usable for reporting, cloud platforms, or treasury operations while keeping support teams equipped for real-world issues.",
    metrics: ["Release notes clear", "Runbooks usable", "Stakeholders informed"],
  },
};

if (year) {
  year.textContent = new Date().getFullYear();
}

document.body.classList.add("is-loading");

window.setTimeout(() => {
  document.body.classList.remove("is-loading");
}, prefersReducedMotion ? 0 : 1900);

const splitText = (element) => {
  if (!element || element.dataset.splitReady === "true") {
    return;
  }

  const words = element.textContent.trim().split(/\s+/);
  element.textContent = "";
  element.classList.add("split-reveal");
  element.dataset.splitReady = "true";

  words.forEach((word, index) => {
    const outer = document.createElement("span");
    const inner = document.createElement("span");
    outer.className = "word";
    inner.className = "word-inner";
    inner.textContent = word;
    inner.style.setProperty("--word-index", index);
    outer.appendChild(inner);
    element.appendChild(outer);

    if (index < words.length - 1) {
      element.append(" ");
    }
  });
};

document.querySelectorAll("h1, h2").forEach(splitText);

window.setTimeout(() => {
  document.querySelector(".hero h1")?.classList.add("is-text-visible");
}, prefersReducedMotion ? 0 : 520);

const scrollSections = document.querySelectorAll(".section");
const liftedPipelineStages = document.querySelectorAll(".pipeline-stage");

const updateScrollState = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  root.style.setProperty("--scroll-progress", progress.toFixed(4));
  root.style.setProperty("--scroll-y", window.scrollY.toFixed(2));
  root.style.setProperty("--hero-shift", `${Math.min(window.scrollY * 0.16, 72)}px`);
  siteHeader?.classList.toggle("is-scrolled", window.scrollY > 18);

  scrollSections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const centerX = Math.min(Math.max(((window.innerWidth / 2 - rect.left) / Math.max(rect.width, 1)) * 100, 0), 100);
    const centerY = Math.min(Math.max(((window.innerHeight / 2 - rect.top) / Math.max(rect.height, 1)) * 100, 0), 100);
    section.style.setProperty("--section-x", centerX.toFixed(2));
    section.style.setProperty("--section-y", centerY.toFixed(2));
  });

  liftedPipelineStages.forEach((stage) => {
    const rect = stage.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;
    const distance = Math.abs(rect.top + rect.height / 2 - viewportCenter);
    const lift = Math.max(0, 16 - distance / 28);
    stage.style.setProperty("--stage-lift", lift.toFixed(2));
  });
};

updateScrollState();

let scrollUpdateQueued = false;

const requestScrollUpdate = () => {
  if (scrollUpdateQueued) {
    return;
  }

  scrollUpdateQueued = true;

  window.requestAnimationFrame(() => {
    updateScrollState();
    scrollUpdateQueued = false;
  });
};

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate, { passive: true });

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
    window.requestAnimationFrame(() => {
      pipelineConsole.classList.add("is-updating");
    });
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
  }, 3600);
}

if (!prefersReducedMotion) {
  const updateCursorMode = () => {
    document.body.classList.toggle("has-futuristic-cursor", supportsFinePointer && window.innerWidth > 780);
  };

  updateCursorMode();
  window.addEventListener("resize", updateCursorMode, { passive: true });

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
    root.style.setProperty("--cursor-x", `${event.clientX}px`);
    root.style.setProperty("--cursor-y", `${event.clientY}px`);
    document.body.classList.add("is-clicking");
    window.setTimeout(() => document.body.classList.remove("is-clicking"), 140);

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

  const revealItems = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.16 }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 42, 260)}ms`;
    revealObserver.observe(item);
  });

  const counters = document.querySelectorAll("[data-count]");
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const target = entry.target;
        const end = Number(target.getAttribute("data-count"));
        const startTime = performance.now();
        const duration = 950;

        const tick = (now) => {
          const elapsed = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - elapsed, 3);
          target.textContent = String(Math.round(end * eased));

          if (elapsed < 1) {
            requestAnimationFrame(tick);
          }
        };

        requestAnimationFrame(tick);
        counterObserver.unobserve(target);
      });
    },
    { threshold: 0.8 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));

  window.addEventListener(
    "pointermove",
    (event) => {
      root.style.setProperty("--cursor-x", `${event.clientX}px`);
      root.style.setProperty("--cursor-y", `${event.clientY}px`);
    },
    { passive: true }
  );

  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--tilt-x", `${x * 5}deg`);
      card.style.setProperty("--tilt-y", `${y * -5}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });

  document.querySelectorAll(".button").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
    });

    button.addEventListener("pointerleave", () => {
      button.style.transform = "";
    });
  });

  if (canvas) {
    const context = canvas.getContext("2d");
    const particles = [];
    const getParticleCount = () => (window.innerWidth < 620 ? 46 : 84);
    let particleCount = getParticleCount();
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    const pointer = { x: 0, y: 0, active: false };

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

      for (let index = 0; index < particleCount; index += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.32,
          vy: (Math.random() - 0.5) * 0.32,
          r: Math.random() * 1.8 + 0.8,
        });
      }
    };

    const drawNetwork = () => {
      context.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        if (pointer.active) {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distance = Math.hypot(dx, dy);

          if (distance > 0 && distance < 170) {
            const force = (170 - distance) / 170;
            particle.x += (dx / distance) * force * 0.58;
            particle.y += (dy / distance) * force * 0.58;
          }
        }

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

          if (distance < 132) {
            context.strokeStyle = `rgba(48, 242, 210, ${0.14 * (1 - distance / 132)})`;
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(a.x, a.y);
            context.lineTo(b.x, b.y);
            context.stroke();
          }
        }
      }

      particles.forEach((particle) => {
        context.fillStyle = "rgba(48, 242, 210, 0.42)";
        context.beginPath();
        context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        context.fill();
      });

      animationFrame = requestAnimationFrame(drawNetwork);
    };

    resizeCanvas();
    createParticles();
    drawNetwork();

    window.addEventListener(
      "pointermove",
      (event) => {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        pointer.active = true;
      },
      { passive: true }
    );

    window.addEventListener(
      "resize",
      () => {
        window.cancelAnimationFrame(animationFrame);
        particleCount = getParticleCount();
        resizeCanvas();
        createParticles();
        drawNetwork();
      },
      { passive: true }
    );
  }
} else {
  document.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));
}
