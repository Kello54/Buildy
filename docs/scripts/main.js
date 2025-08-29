/* ============================
   MAIN.JS for Buildy
   ============================ */

/* ===== Dark Mode Toggle ===== */
const darkToggle = document.getElementById("darkToggle");
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  darkToggle.textContent = "☀️";
} else {
  darkToggle.textContent = "🌙";
}

darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    darkToggle.textContent = "☀️";
  } else {
    localStorage.setItem("theme", "light");
    darkToggle.textContent = "🌙";
  }
});

/* ===== Mobile Hamburger Menu ===== */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

/* ===== Tabs ===== */
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const tab = btn.getAttribute("data-tab");

    tabBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    tabContents.forEach(content => {
      content.classList.remove("active");
      if (content.id === tab) {
        content.classList.add("active");
      }
    });
  });
});

/* ===== Back to Top Button ===== */
const backTop = document.getElementById("backTop");

window.addEventListener("scroll", () => {
  backTop.style.display = window.scrollY > 200 ? "block" : "none";
});

backTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

