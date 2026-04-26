const navLinks = [...document.querySelectorAll(".nav-link")];
const collapsibleNav = document.querySelector(".navbar-collapse");
const navToggle = document.querySelector(".navbar-toggler");
const yearNode = document.querySelector("#current-year");
const revealNodes = document.querySelectorAll("[data-reveal]");
const observedSections = document.querySelectorAll("main section[id], footer[id]");

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (!collapsibleNav || !navToggle) {
      return;
    }

    if (window.innerWidth < 992 && collapsibleNav.classList.contains("show")) {
      navToggle.click();
    }
  });
});

const setActiveLink = (id) => {
  navLinks.forEach((link) => {
    const matches = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("active", matches);
    if (matches) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealNodes.forEach((node) => revealObserver.observe(node));

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visibleEntry?.target?.id) {
        setActiveLink(visibleEntry.target.id);
      }
    },
    {
      threshold: 0.35,
      rootMargin: "-35% 0px -45% 0px",
    }
  );

  observedSections.forEach((section) => sectionObserver.observe(section));
} else {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
}

if (window.location.hash) {
  setActiveLink(window.location.hash.replace("#", ""));
} else if (observedSections[0]?.id) {
  setActiveLink(observedSections[0].id);
}
