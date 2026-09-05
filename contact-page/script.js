document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const ctaBtn = document.getElementById("cta-btn");

  // Toggle mobile menu
  menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("active");
    const isOpen = navLinks.classList.contains("active");
    menuToggle.setAttribute("aria-expanded", isOpen);
  });

  // Close menu when a nav link is clicked
  document.querySelectorAll("#nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  // Hero CTA smooth scroll
  ctaBtn.addEventListener("click", () => {
    document.getElementById("features").scrollIntoView({
      behavior: "smooth"
    });
  });
});

