const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const siteHeader = document.querySelector(".site-header");
const root = document.documentElement;
const year = document.querySelector("#year");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

const updateScrollState = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  root.style.setProperty("--scroll-progress", progress.toFixed(4));
  root.style.setProperty("--hero-shift", `${Math.min(window.scrollY * 0.16, 72)}px`);
  siteHeader?.classList.toggle("is-scrolled", window.scrollY > 18);
};

updateScrollState();
window.addEventListener("scroll", updateScrollState, { passive: true });

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation");
    }
  });
}

const pipelineStages = document.querySelectorAll(".pipeline-stage");
const pipelineTitle = document.querySelector("#pipeline-stage-title");
const pipelineText = document.querySelector("#pipeline-stage-copy");
const pipelineMetrics = document.querySelector(".pipeline-metrics");
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
} else {
  document.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));
}
