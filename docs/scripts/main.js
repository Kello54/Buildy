/* ===== DARK MODE TOGGLE ===== */
const darkToggle = document.getElementById("darkToggle");
if(localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  darkToggle.textContent = "☀️";
} else {
  darkToggle.textContent = "🌙";
}

darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  if(document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    darkToggle.textContent = "☀️";
  } else {
    localStorage.setItem("theme", "light");
    darkToggle.textContent = "🌙";
  }
});

/* ===== NAVBAR SHRINK & BACK TO TOP BUTTON ===== */
const navbar = document.querySelector(".navbar");
const backTop = document.getElementById("backTop");

window.addEventListener("scroll", () => {
  // Shrink navbar
  if(window.scrollY > 50) navbar.classList.add("shrink");
  else navbar.classList.remove("shrink");

  // Show/hide back-to-top button
  backTop.style.display = window.scrollY > 300 ? "block" : "none";
});

/* ===== BACK TO TOP CLICK ===== */
backTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ===== MOBILE MENU TOGGLE ===== */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

// Close menu on link click
navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

/* ===== TABS FUNCTIONALITY ===== */
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tabButtons.forEach(b => b.classList.remove("active"));
    tabContents.forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

/* ===== FADE-IN ON SCROLL ===== */
const faders = document.querySelectorAll("#hero h1,#hero p,.card,#multi-tool table");

const appearOptions = {
  threshold: 0.2
};

const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.classList.add("visible");
      observer.unobserve(entry);
    }
  });
}, appearOptions);

faders.forEach(fader => appearOnScroll.observe(fader));

/* ===== SCROLLSPY NAVIGATION ===== */
const sectionIds = ["hero","features","multi-tool","tabs"];
const sections = sectionIds.map(id => document.getElementById(id));
const navItems = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let scrollPosition = window.scrollY + 100; // Offset for navbar
  sections.forEach((section, idx) => {
    if(section.offsetTop <= scrollPosition && (section.offsetTop + section.offsetHeight) > scrollPosition){
      navItems.forEach(link => link.classList.remove("active"));
      const currentLink = document.querySelector(`.nav-links a[href="#${sectionIds[idx]}"]`);
      if(currentLink) currentLink.classList.add("active");
    }
  });
});
 
