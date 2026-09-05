document.addEventListener("DOMContentLoaded", function () {
      const menuToggle = document.getElementById("menu-toggle");
      const navLinks = document.getElementById("nav-links");

      menuToggle.addEventListener("click", function () {
        navLinks.classList.toggle("active");
        const isOpen = navLinks.classList.contains("active");
        menuToggle.setAttribute("aria-expanded", isOpen);
      });

      document.querySelectorAll("#nav-links a").forEach(link => {
        link.addEventListener("click", () => {
          navLinks.classList.remove("active");
        });
      });
    });