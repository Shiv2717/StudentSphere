const calendar = document.getElementById("calendar");
const monthSelect = document.getElementById("monthSelect");
const yearSelect = document.getElementById("yearSelect");
const upcomingList = document.getElementById("upcomingList");

let events = JSON.parse(localStorage.getItem("events")) || [];
let current = new Date();
let selectedTag = "all"; 

function init() {
  for (let m = 0; m < 12; m++) {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = new Date(0, m).toLocaleString("default", { month: "long" });
    monthSelect.appendChild(opt);
  }

  const currentYear = current.getFullYear();
  for (let y = currentYear - 5; y <= currentYear + 5; y++) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  }
  const currentMonth = current.getMonth();
  const currentYearValue = current.getFullYear();
  monthSelect.value = currentMonth;
  yearSelect.value = currentYearValue;
  monthSelect.onchange = () => renderCalendar(+monthSelect.value, +yearSelect.value);
  yearSelect.onchange = () => renderCalendar(+monthSelect.value, +yearSelect.value);

  renderCalendar(currentMonth, currentYearValue);
  startReminderChecker();
}

function renderCalendar(month, year) {
  calendar.innerHTML = "";

  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach(day => {
    const d = document.createElement("div");
    d.className = "day-name";
    d.textContent = day;
    calendar.appendChild(d);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    calendar.appendChild(document.createElement("div"));
  }

  for (let day = 1; day <= totalDays; day++) {
    const cell = document.createElement("div");
    cell.className = "cell";

    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const todayEvents = events.filter(e => e.date === dateStr && (selectedTag === "all" || e.tags.includes(selectedTag)));

    const strong = document.createElement("strong");
    strong.textContent = day;
    cell.appendChild(strong);

    todayEvents.forEach(ev => {
      const evDiv = document.createElement("div");
      evDiv.className = "event";

      const titleSpan = document.createElement("span");
      titleSpan.textContent = `${ev.title} - ${ev.description || ""}`;
      evDiv.appendChild(titleSpan);

      const deleteBtn = document.createElement("span");
      deleteBtn.textContent = "×";
      deleteBtn.className = "delete-icon";
      deleteBtn.title = "Delete";

      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        if (confirm(`Delete event "${ev.title}"?`)) {
          events = events.filter(event => !(event.date === ev.date && event.title === ev.title));
          saveEvents();
          renderCalendar(month, year);
          renderUpcomingEvents();
        }
      };

      evDiv.appendChild(deleteBtn);
      cell.appendChild(evDiv);
    });

    cell.addEventListener("click", () => {
      const title = prompt(`Add title for ${dateStr}:`);
      if (!title) return;
      const description = prompt("Add description (optional):");
      const tags = prompt("Add tags (comma-separated, e.g., tech,cultural):").split(",").map(tag => tag.trim());

      events.push({ date: dateStr, title, description, tags });
      saveEvents();
      renderCalendar(month, year);
      renderUpcomingEvents();
    });

    calendar.appendChild(cell);
  }
}

function saveEvents() {
  localStorage.setItem("events", JSON.stringify(events));
}

function changeMonth(offset) {
  let m = +monthSelect.value + offset;
  let y = +yearSelect.value;

  if (m < 0) {
    m = 11;
    y--;
  } else if (m > 11) {
    m = 0;
    y++;
  }

  monthSelect.value = m;
  yearSelect.value = y;
  renderCalendar(m, y);
}

function renderUpcomingEvents() {
  const upcomingList = document.getElementById("upcomingEventsList");

  const upcoming = events
    .filter(e => (selectedTag === "all" || e.tags.includes(selectedTag)) && new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  upcomingList.innerHTML = "";

  if (upcoming.length === 0) {
    upcomingList.innerHTML = "<li>No upcoming events</li>";
    return;
  }

  upcoming.forEach(e => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${e.title}</strong> (${e.date})<br>
      <small>${e.description || "No description"}</small>
      <small>Tags: ${e.tags.join(", ")}</small>
      <div>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    li.querySelector(".edit-btn").onclick = () => {
      const newTitle = prompt("Edit title:", e.title);
      if (!newTitle) return;
      const newDescription = prompt("Edit description:", e.description || "");
      const newTags = prompt("Edit tags (comma-separated):", e.tags.join(",")).split(",").map(tag => tag.trim());
      const eventIndex = events.findIndex(event => event.date === e.date && event.title === e.title);
      if (eventIndex !== -1) {
        events[eventIndex].title = newTitle;
        events[eventIndex].description = newDescription;
        events[eventIndex].tags = newTags;
        saveEvents();
        renderCalendar(+monthSelect.value, +yearSelect.value);
        renderUpcomingEvents();
      }
    };

    li.querySelector(".delete-btn").onclick = () => {
      if (confirm(`Delete event "${e.title}"?`)) {
        events = events.filter(event => !(event.date === e.date && event.title === e.title));
        saveEvents();
        renderCalendar(+monthSelect.value, +yearSelect.value);
        renderUpcomingEvents();
      }
    };

    upcomingList.appendChild(li);
  });
}

function startReminderChecker() {
  setInterval(() => {
    const now = new Date();
    events.forEach(e => {
      const eventTime = new Date(e.date);
      const oneHourBefore = new Date(eventTime.getTime() - 60 * 60 * 1000);
      const oneDayBefore = new Date(eventTime.getTime() - 24 * 60 * 60 * 1000);

      if (
        Math.abs(now - oneHourBefore) < 60000 ||
        Math.abs(now - oneDayBefore) < 60000
      ) {
        showNotification(`Reminder: "${e.title}" is coming up on ${e.date}`);
      }
    });
  }, 60000); 
}

function showNotification(message) {
  const notif = document.createElement("div");
  notif.className = "toast";
  notif.textContent = message;
  document.body.appendChild(notif);

  setTimeout(() => notif.remove(), 4000);
}

(function applySavedTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
  }
})();

function filterByTag(tag) {
  selectedTag = tag;
  renderCalendar(+monthSelect.value, +yearSelect.value);
  renderUpcomingEvents();
}

init();
renderUpcomingEvents();
