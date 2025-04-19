import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB6vh2QCsxMHU9rQ99GxSEFDkT7cgnrduQ",
  authDomain: "student-sphere-bb396.firebaseapp.com",
  databaseURL: "https://student-sphere-bb396-default-rtdb.firebaseio.com",
  projectId: "student-sphere-bb396",
  storageBucket: "student-sphere-bb396.firebasestorage.app",
  messagingSenderId: "1059223650747",
  appId: "1:1059223650747:web:36d989ca27354a7bc1449e",
  measurementId: "G-5Q5H5ZJF09"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

signInAnonymously(auth)
  .then(() => {
    console.log("Signed in anonymously");
    loadSkills();
  })
  .catch((error) => {
    console.error("Auth error:", error);
  });

function calculateLevel(xp) {
  if (xp >= 1500) return "Advanced";
  if (xp >= 800) return "Intermediate";
  return "Beginner";
}

function hasReachedGoal(currentLevel, targetLevel) {
  const levelOrder = ["Beginner", "Intermediate", "Advanced"];
  return levelOrder.indexOf(currentLevel) >= levelOrder.indexOf(targetLevel);
}

let earnedBadgesCount = 0;

function showBadgeToast(badge, skill) {
  const toast = document.getElementById("badge-toast");
  toast.innerHTML = `🏅 <b>${badge}</b> badge earned for <b>${skill}</b>!`;
  toast.classList.add("show");
  earnedBadgesCount++;
  updateBadgeCount();
  setTimeout(() => toast.classList.remove("show"), 3500);
}

function updateBadgeCount() {
  const badgeCountElement = document.getElementById("badgeCount");
  badgeCountElement.textContent = `Badges: ${earnedBadgesCount}`;
}

const skillSuggestions = {
  "HTML": "Learn CSS to style your web pages.",
  "CSS": "Advance to JavaScript to add interactivity.",
  "JavaScript": "Explore React.js for modern web development.",
  "Python": "Learn about web frameworks like Flask or Django.",
  "C++": "Dive into Data Structures and Algorithms.",
  "Java": "Try building Android apps using Android Studio.",
  "SQL": "Expand into relational database design and optimization.",
  "React": "Learn Redux or Next.js for advanced front-end development.",
  "Django": "Combine Django with React for full-stack apps."
};

async function loadSkills() {
  const skillListDiv = document.getElementById("skill-list");
  const goalList = document.getElementById("goal-list");
  skillListDiv.innerHTML = '';
  goalList.innerHTML = '';

  const snapshot = await getDocs(collection(db, "skills"));
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const skill = data.skill;
    const xp = data.xp || 0;
    const level = calculateLevel(xp);
    const suggestion = skillSuggestions[skill] || null;
    const goal = data.goal || {};
    const history = data.history || [];

    const isCompleted = hasReachedGoal(level, goal.target);

    if (isCompleted && !data.goalCompleted) {
      let earnedBadges = [...(data.badges || [])];
      const newBadges = [];

      if (level === "Beginner" && !earnedBadges.includes("🎖️ Goal Master")) {
        newBadges.push("🎖️ Goal Master");
      } else if (level === "Intermediate" && !earnedBadges.includes("🏅 Master of Momentum")) {
        newBadges.push("🏅 Master of Momentum");
      } else if (level === "Advanced" && !earnedBadges.includes("🌟 Legendary Sage")) {
        newBadges.push("🌟 Legendary Sage");
      }

      if (newBadges.length > 0) {
        earnedBadges = [...earnedBadges, ...newBadges];

        await updateDoc(doc(db, "skills", docSnap.id), {
          goalCompleted: true,
          badges: earnedBadges
        });

        newBadges.forEach(badge => showBadgeToast(badge, skill));
      }
    }

    const card = document.createElement("div");
    card.className = "skill-card";
    card.innerHTML = `
  <h3>${skill}</h3>
  <div class="progress-container">
    <div class="progress-bar ${isCompleted ? 'complete' : ''}" style="width: ${Math.min((xp / 2000) * 100, 100)}%;" data-progress="${Math.min((xp / 2000) * 100, 100)}"></div>
  </div>
  <p>Level: ${level}</p>
  <p>XP: ${xp}</p>
  ${(data.badges || []).length > 0 
    ? `<p>🏅 Badges: ${data.badges.map(b => `<span class="badge">${b}</span>`).join(" ")}</p>` 
    : ""}
  ${goal.target ? `<p><strong>🎯 Goal:</strong> ${goal.target} by ${goal.deadline}</p>` : ""}
  <button onclick="completeChallenge('${docSnap.id}')" ${isCompleted ? 'disabled' : ''}>
    ${isCompleted ? '✅ Completed' : 'Complete Challenge (+100 XP)'}
  </button>
  ${goal.target ? `<button onclick="deleteGoal('${docSnap.id}')">❌ Delete Goal</button>` : ''}

  ${data.verifiedBy ? `
    <div class="verification">
      <p>✅ Verified by <strong>${data.verifiedBy}</strong></p>
      ${data.verificationNote ? `<p>📝 Note: ${data.verificationNote}</p>` : ''}
      <p><small>🕒 ${new Date(data.verifiedAt).toLocaleString()}</small></p>
    </div>
  ` : `
    <button onclick="verifySkill('${docSnap.id}')">🔒 Verify Skill (Mentor/Admin)</button>
  `}

  ${history.length > 0 ? `
    <div class="history">
      <h4>📜 Skill Timeline</h4>
      <ul>${history.map(h => `
        <li><b>${h.date}</b>: ${h.type === 'updated' ? `XP Update (${h.change})` : h.type.charAt(0).toUpperCase() + h.type.slice(1)} ${h.by ? `by ${h.by}` : ''}</li>
      `).join("")}</ul>
    </div>
  ` : ""}
  
  ${suggestion ? `<div class="suggestion-box">💡 <b>Next up:</b> ${suggestion}</div>` : ""}
  `; 
    skillListDiv.appendChild(card);

    if (goal.target) {
      const li = document.createElement("li");
      li.innerHTML = `<b>${skill}</b>: ${goal.target} by ${goal.deadline}`;
      goalList.appendChild(li);
    }
  }

  document.querySelectorAll(".progress-bar").forEach((bar) => {
    const progress = bar.getAttribute("data-progress");
    bar.style.width = `${progress}%`;
  });
}

window.verifySkill = async function(skillId) {
  const verifier = prompt("Enter your name or role:");
  const note = prompt("Add a verification note (optional):");

  if (!verifier) return alert("Verification cancelled.");

  await updateDoc(doc(db, "skills", skillId), {
    verifiedBy: verifier,
    verificationNote: note || "",
    verifiedAt: new Date().toISOString()
  });

  showToast("Skill verified successfully! ✅");
  loadSkills();
};

window.completeChallenge = async function (skillId) {
  const ref = doc(db, "skills", skillId);
  const docSnap = await getDoc(ref);
  const data = docSnap.data();
  const xp = data.xp || 0;
  const history = data.history || [];

  history.push({
    type: "updated",
    date: new Date().toISOString().split("T")[0],
    change: "+100 XP"
  });

  await updateDoc(ref, {
    xp: xp + 100,
    history
  });

  loadSkills();
};

window.addGoal = function () {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    alert("User not logged in!");
    return;
  }

  const skill = document.getElementById("goal-skill").value.trim();
  const target = document.getElementById("goal-target").value.trim();
  const deadline = document.getElementById("goal-deadline").value;

  if (!skill || !target || !deadline) {
    alert("Please fill out all fields.");
    return;
  }

  const goalsRef = db.ref(`skill-tracker/${currentUser}`);
  goalsRef.push({ skill, target, deadline });

  alert("Goal added successfully!");
  document.getElementById("goal-form").reset();
};

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

window.deleteGoal = async function (skillId) {
  const ref = doc(db, "skills", skillId);
  await deleteDoc(ref);
  loadSkills();
  showToast("Goal deleted successfully! ❌");
};

document.addEventListener("DOMContentLoaded", () => {
  const goalList = document.getElementById("goal-list");

  window.addGoal = () => {
    const skill = document.getElementById("goal-skill").value.trim();
    const target = document.getElementById("goal-target").value.trim();
    const deadline = document.getElementById("goal-deadline").value;

    if (!skill || !target || !deadline) {
      alert("Please fill out all fields.");
      return;
    }

    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <span>${skill.toUpperCase()}: ${target} by ${deadline}</span>
      <button onclick="removeGoal(this)">Remove</button>
    `;

    goalList.appendChild(listItem);

    document.getElementById("goal-form").reset();
  };

  window.removeGoal = (button) => {
    const listItem = button.parentElement;
    goalList.removeChild(listItem);
  };
});

document.getElementById("backToMenu").addEventListener("click", () => {
  window.location.href = "index.html";
});