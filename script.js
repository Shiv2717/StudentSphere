const toggle = document.getElementById('dark-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const currentTheme = localStorage.getItem('theme');
const sun = document.querySelector('.sun');
const moon = document.querySelector('.moon');


function updateThemeIcons(isDark) {
  if (sun && moon) {
    sun.style.opacity = isDark ? 0 : 1;
    sun.style.transform = isDark ? 'rotate(-90deg)' : 'rotate(0deg)';
    moon.style.opacity = isDark ? 1 : 0;
    moon.style.transform = isDark ? 'rotate(0deg)' : 'rotate(90deg)';
  }
}


if (currentTheme === 'dark' || (!currentTheme && prefersDark)) {
  document.body.classList.add('dark');
  toggle.checked = true;
  updateThemeIcons(true);
} else {
  updateThemeIcons(false);
}

// Toggle dark/light mode
if (toggle) {
  toggle.addEventListener('change', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcons(isDark);
  });
}

// Mobile nav toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Load theme on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.remove("light-mode");
  } else {
    document.body.classList.add("light-mode");
  }
});

// Toggle theme
const themeSwitch = document.querySelector("#theme-switch-checkbox");
if (themeSwitch) {
  themeSwitch.addEventListener("change", () => {
    document.body.classList.toggle("light-mode");
    const currentTheme = document.body.classList.contains("light-mode") ? "light" : "dark";
    localStorage.setItem("theme", currentTheme);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const authButtons = document.getElementById("authButtons");
  const profileDropdown = document.getElementById("profileDropdown");

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (isLoggedIn) {
    authButtons.style.display = "none";
    profileDropdown.style.display = "block";
  } else {
    authButtons.style.display = "flex";
    profileDropdown.style.display = "none";
  }
});

// Logout function
function logoutUser() {
  localStorage.setItem("isLoggedIn", "false"); 
  const toast = document.getElementById("toast");
  toast.classList.remove("hidden");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hidden");
    window.location.href = 'login.html'; 
  }, 20000); 
}
window.logoutUser = logoutUser;
const logoutButton = document.getElementById("logoutButton");
if (logoutButton) {
  logoutButton.addEventListener("click", logoutUser);
}

