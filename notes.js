document.querySelectorAll("details").forEach((detail) => {
    const summary = detail.querySelector("summary");
    const icon = document.createElement("span");
    icon.textContent = "➕ ";
    icon.style.marginRight = "8px";
    summary.prepend(icon);
  
    detail.addEventListener("toggle", () => {
      icon.textContent = detail.open ? "➖ " : "➕ ";
  
      if (detail.open) {
        detail.classList.add("highlight");
        setTimeout(() => detail.classList.remove("highlight"), 500);
      }
    });
  });
  