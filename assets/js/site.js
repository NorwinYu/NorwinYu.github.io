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

  function init() {
    initHeader();
    initMenu();
    initActivePage();
    initSectionNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
