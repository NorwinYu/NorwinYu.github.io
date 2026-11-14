/* Norwin Yu — minimal site behaviour.
   No analytics, storage, external requests or decorative animation. */

(function () {
  "use strict";

  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $all(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function initHeader() {
    var header = $("[data-header]");
    if (!header) return;

    function update() {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  function initMenu() {
    var toggle = $("[data-menu-toggle]");
    var menu = $("[data-mobile-menu]");
    var close = $("[data-menu-close]");
    if (!toggle || !menu || !close) return;

    var previousFocus = null;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-hidden", String(!open));
      menu.classList.toggle("is-open", open);
      document.body.classList.toggle("is-locked", open);

      if (open) {
        previousFocus = document.activeElement;
        window.setTimeout(function () { close.focus(); }, 40);
      } else if (previousFocus && typeof previousFocus.focus === "function") {
        previousFocus.focus();
      }
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    close.addEventListener("click", function () { setOpen(false); });

    $all("a", menu).forEach(function (link) {
      link.addEventListener("click", function () { setOpen(false); });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menu.classList.contains("is-open")) {
        setOpen(false);
        return;
      }

      if (event.key !== "Tab" || !menu.classList.contains("is-open")) return;

      var focusable = $all("a, button", menu).filter(function (element) {
        return element.offsetParent !== null;
      });
      if (!focusable.length) return;

      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 940 && menu.classList.contains("is-open")) {
        setOpen(false);
      }
    });
  }

  function initActivePage() {
    var page = document.body.getAttribute("data-page");
    if (!page) return;
    $all("[data-nav]").forEach(function (link) {
      if (link.getAttribute("data-nav") === page) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function initSectionNav() {
    if (!("IntersectionObserver" in window)) return;

    var links = $all(".main-nav a").filter(function (link) {
      return link.getAttribute("href") && link.getAttribute("href").charAt(0) === "#";
    });
    var sections = $all("main section[id]");
    if (!links.length || !sections.length) return;

    var byId = {};
    links.forEach(function (link) {
      var href = link.getAttribute("href");
      if (href && href.charAt(0) === "#") byId[href.slice(1)] = link;
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) { link.removeAttribute("aria-current"); });
        var active = byId[entry.target.id];
        if (active) active.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-25% 0px -62% 0px", threshold: 0 });

    sections.forEach(function (section) { observer.observe(section); });
  }

  function prefersReducedMotion() {
    return Boolean(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  /* Elements fade in once, the first time they enter the viewport. The class is
     only added here, so a page without JS (or with reduced motion) shows all. */
  function initReveal() {
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) return;

    var targets = $all("main > section, .home-work-card, .also-card, .coding-home-card, .journal-entry, .comparison-card, .coding-card, .oss-card, .pipeline-step, .home-cap-item, .diagram");
    if (!targets.length) return;

    targets.forEach(function (element) {
      element.setAttribute("data-reveal", "");
    });
    document.documentElement.classList.add("has-motion");

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.03 });

    targets.forEach(function (element) { observer.observe(element); });
  }

  function initReadingProgress() {
    if (!document.body.classList.contains("article-page")) return;

    var bar = document.createElement("div");
    bar.className = "reading-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);

    var ticking = false;

    function update() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.transform = "scaleX(" + progress.toFixed(4) + ")";
      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  function initTocActive() {
    var links = $all(".article-toc a");
    if (!links.length || !("IntersectionObserver" in window)) return;

    var byId = {};
    links.forEach(function (link) {
      var href = link.getAttribute("href") || "";
      if (href.charAt(0) === "#") byId[href.slice(1)] = link;
    });

    var headings = $all(".article-body h2[id]").filter(function (heading) {
      return Boolean(byId[heading.id]);
    });
    if (!headings.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) { link.removeAttribute("aria-current"); });
        byId[entry.target.id].setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-12% 0px -72% 0px", threshold: 0 });

    headings.forEach(function (heading) { observer.observe(heading); });
  }

  /* The rig on the home page leans towards the pointer. Decorative only. */
  function initRig() {
    var rig = $("[data-rig]");
    if (!rig || prefersReducedMotion()) return;

    var tilt = $("[data-rig-tilt]", rig);
    if (!tilt) return;

    function set(rx, ry) {
      tilt.style.transform = "rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
    }

    rig.addEventListener("pointermove", function (event) {
      var rect = rig.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width - 0.5;
      var y = (event.clientY - rect.top) / rect.height - 0.5;
      set((-y * 9).toFixed(2), (x * 12).toFixed(2));
    });

    rig.addEventListener("pointerleave", function () { set(0, 0); });
  }

  /* GitHub Pages serves 404.html at any missing path, so a missing Chinese
     page lands on the English 404. Hand those visitors to the Chinese one. */
  function initNotFound() {
    if (!document.body.hasAttribute("data-notfound")) return;
    if (window.location.pathname.indexOf("/zh/") !== 0) return;
    if (/\/zh\/404\.html$/.test(window.location.pathname)) return;
    window.location.replace("/zh/404.html");
  }

  function init() {
    initHeader();
    initMenu();
    initActivePage();
    initSectionNav();
    initReveal();
    initReadingProgress();
    initTocActive();
    initRig();
    initNotFound();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
