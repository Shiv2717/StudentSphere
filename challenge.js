function openCategory(category) {
    window.location.href = `${category}-challenges.html`;
    switch (category) {
      case 'math':
        window.location.href = "Math-Puzzles.html";
        break;
      case 'logic':
        window.location.href = "Logic-Challenges.html"; 
        break;
      case 'programming':
        window.location.href = "programming-challenges.html";
        break;
      case 'typing':
        window.location.href = "typing-challenges.html";
        break;
      case 'memory':
        window.location.href = "memory-challenges.html";
        break;
      default:
        alert(`Opening ${category} challenges...`);
    }
  }

  const challenges = [
    { title: "Solve 5 Quick Math Problems", skill: "Math", difficulty: "Easy", type: "daily" },
    { title: "Complete 3 Logic Grids", skill: "Logic", difficulty: "Medium", type: "daily" },
    { title: "Type 40 WPM for 60 seconds", skill: "Typing", difficulty: "Easy", type: "weekly" },
    { title: "Score 5/5 in Python Quiz", skill: "Programming", difficulty: "Hard", type: "weekly" },
    { title: "Remember 10 Emoji Sequences", skill: "Memory", difficulty: "Medium", type: "daily" },
    { title: "JavaScript Syntax Challenge", skill: "Programming", difficulty: "Medium", type: "daily" },
    { title: "Typing Test: Hit 50 WPM", skill: "Typing", difficulty: "Hard", type: "weekly" },
  ];

  let logicGamesCompleted = parseInt(localStorage.getItem("logicGamesCompleted")) || 0;
  let typingUnder30 = localStorage.getItem("typingUnder30") === "true";
  
  let streak = parseInt(localStorage.getItem('streak')) || 0;
  let bonusXP = 0;
  let selectedDifficulty = "All";
  
  function loadChallengeFeed() {
    const feedEl = document.getElementById("challengeFeed");
    const searchText = document.getElementById("searchInput")?.value.toLowerCase() || "";
    const today = new Date().getDate();
    const currentType = today % 2 === 0 ? "daily" : "weekly";
  
    let filtered = challenges.filter(c => c.type === currentType);
  
    if (selectedDifficulty !== "All") {
      filtered = filtered.filter(c => c.difficulty === selectedDifficulty);
    }
  
    if (searchText) {
      filtered = filtered.filter(
        c =>
          c.title.toLowerCase().includes(searchText) ||
          c.skill.toLowerCase().includes(searchText)
      );
    }
  
    feedEl.innerHTML = "";
    filtered.forEach(ch => {
      const item = document.createElement("div");
      item.className = "feed-item";
      item.innerHTML = `
        <strong>${ch.title}</strong>
        <br><span class="skill-tag">${ch.skill}</span>
        <br><small>🎯 Difficulty: ${ch.difficulty}</small>
      `;
      item.onclick = () => completeChallenge(ch.skill);
      feedEl.appendChild(item);
    });
  
    updateStreakDisplay();
  }
  
  function completeChallenge(skill) {
    const user = auth.currentUser; 
    if (!user) {
      alert("You must be logged in to complete challenges.");
      return;
    }

    const userId = user.uid;

    alert(`✅ Challenge for ${skill} completed!`);
    streak++;
    localStorage.setItem("streak", streak);
    if (streak >= 3) bonusXP += 50;
    if (skill === "Logic") {
      logicGamesCompleted++;
      localStorage.setItem("logicGamesCompleted", logicGamesCompleted);
    }

    if (skill === "Typing") {
      const under30 = confirm("Did you complete it under 30 seconds?");
      if (under30) {
        typingUnder30 = true;
        localStorage.setItem("typingUnder30", "true");
      }
    }
    db.ref(`users/${userId}/scores`).set({
      streak,
      bonusXP,
      logicGamesCompleted,
      typingUnder30,
      badges: {
        brainiac: logicGamesCompleted >= 5,
        speedster: typingUnder30,
        streakMaster: streak >= 5
      }
    });

    db.ref(`leaderboard/${userId}`).set({
      name: user.displayName || "Anonymous",
      streak,
      bonusXP
    });

    updateStreakDisplay();
    checkBadgeUnlocks();
    displayLeaderboard();
  }

  function checkBadgeUnlocks() {
    if (logicGamesCompleted >= 5) {
      unlockBadge("brainiac");
    }
    if (typingUnder30) {
      unlockBadge("speedster");
    }
    if (streak >= 5) {
      unlockBadge("streakMaster");
    }
  }
  
  function unlockBadge(id) {
    const badge = document.getElementById(id);
    badge.classList.remove("locked");
    badge.classList.add("unlocked");
  }
  
  function loadUserData() {
    const user = auth.currentUser; 
    if (!user) {
      alert("You must be logged in to view your data.");
      return;
    }
  
    const userId = user.uid;
  
    db.ref(`users/${userId}/scores`).once("value").then((snapshot) => {
      const data = snapshot.val();
      if (data) {
        streak = data.streak || 0;
        bonusXP = data.bonusXP || 0;
        logicGamesCompleted = data.logicGamesCompleted || 0;
        typingUnder30 = data.typingUnder30 || false;
  
        // Update badges
        if (data.badges) {
          for (const badge in data.badges) {
            if (data.badges[badge]) {
              unlockBadge(badge);
            }
          }
        }
  
        updateStreakDisplay();
      }
    });
  }
  
  function updateStreakDisplay() {
    document.getElementById("streakCount").innerText = streak;
    document.getElementById("bonusXP").innerText = bonusXP;
  }
  
  function filterByDifficulty(level) {
    selectedDifficulty = level;
    loadChallengeFeed();
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    loadChallengeFeed();
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.addEventListener("input", loadChallengeFeed);
    }
    checkBadgeUnlocks();
    displayLeaderboard();
  });

  document.getElementById("leaderboardToggle").addEventListener("click", () => {
    const panel = document.getElementById("leaderboardPanel");
    panel.classList.toggle("hidden");
  });


