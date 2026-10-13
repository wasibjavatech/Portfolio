
(() => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  document.body.classList.add("js-motion");

  // Opening loader
  const loader = document.getElementById("pageLoader");

  function finishLoader() {
    if (!loader || loader.dataset.finished === "true") return;

    loader.dataset.finished = "true";
    loader.classList.add("done");

    window.setTimeout(() => loader.remove(), 750);
  }

  if (document.readyState === "complete") {
    finishLoader();
  } else {
    window.addEventListener("load", finishLoader, { once: true });
  }

  // Do not keep the intro visible if an image loads slowly.
  window.setTimeout(finishLoader, 1800);

  // Current year
  const year = document.getElementById("currentYear");
  if (year) year.textContent = new Date().getFullYear();

  // Mobile menu
  const nav = document.getElementById("navbar");
  const menu = document.getElementById("menu");
  const navlinks = document.getElementById("navlinks");
  const links = [...document.querySelectorAll('.navlinks a[href^="#"]')];

  function closeMenu() {
    if (!menu || !navlinks) return;

    navlinks.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    menu.textContent = "☰";
  }

  if (menu && navlinks) {
    menu.addEventListener("click", () => {
      const opened = navlinks.classList.toggle("open");

      menu.setAttribute("aria-expanded", String(opened));
      menu.textContent = opened ? "✕" : "☰";
    });

    links.forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", event => {
      if (nav && !nav.contains(event.target)) closeMenu();
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
  }

  // Sticky navigation style
  function updateNavbar() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 16);
  }

  updateNavbar();
  window.addEventListener("scroll", updateNavbar, { passive: true });

  // Reveal panels and cards while scrolling
  const revealItems = document.querySelectorAll(
    ".panel:not(.hero), .card, .skill, .cert, .section-head"
  );

  revealItems.forEach(item => item.classList.add("reveal"));

  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    });

    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  // Highlight current navigation item
  const sections = links
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        links.forEach(link => {
          const active =
            link.getAttribute("href") === `#${entry.target.id}`;

          link.classList.toggle("active", active);

          if (active) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    }, {
      rootMargin: "-30% 0px -55% 0px",
      threshold: 0
    });

    sections.forEach(section => sectionObserver.observe(section));
  }

  // Animated typing effect
  const typingText = document.getElementById("typingText");
  const words = [
    "Java Development",
    "Web Development",
    "Problem Solving",
    "Generative AI"
  ];

  if (typingText && !reduceMotion) {
    let wordIndex = 0;
    let charIndex = words[0].length;
    let deleting = true;

    function typeEffect() {
      const currentWord = words[wordIndex];

      if (deleting) {
        charIndex--;
      } else {
        charIndex++;
      }

      typingText.textContent = currentWord.substring(0, charIndex);

      let delay = deleting ? 45 : 85;

      if (!deleting && charIndex === currentWord.length) {
        deleting = true;
        delay = 1300;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 350;
      }

      window.setTimeout(typeEffect, delay);
    }

    window.setTimeout(typeEffect, 1500);
  }

  // Subtle pointer-following highlight on cards.
  // It does not transform or animate the profile image.
  document.querySelectorAll(".card, .skill, .cert").forEach(card => {
    card.addEventListener("pointermove", event => {
      const rect = card.getBoundingClientRect();

      card.style.setProperty(
        "--mouse-x",
        `${event.clientX - rect.left}px`
      );

      card.style.setProperty(
        "--mouse-y",
        `${event.clientY - rect.top}px`
      );
    }, { passive: true });
  });

  // Back-to-top button
  const backTop = document.getElementById("backTop");

  if (backTop) {
    window.addEventListener("scroll", () => {
      backTop.classList.toggle("visible", window.scrollY > 450);
    }, { passive: true });

    backTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth"
      });
    });
  }
})();
