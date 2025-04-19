function openModal() {
  document.getElementById('editModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('editModal').style.display = 'none';
}

function openTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(tabId).style.display = 'block';
  document.querySelector(`.tab-btn[onclick*="${tabId}"]`).classList.add('active');
}

function populateProfile(profileData) {
  if (profileData) {
    document.getElementById('profile-pic').src = profileData.profilePic || 'https://via.placeholder.com/150';
    document.querySelector('.user-name').textContent = profileData.name || 'Your Name';
    document.querySelector('.user-headline').textContent = profileData.headline || 'Your Headline';
    document.getElementById('about').textContent = profileData.about || 'Tell us about yourself.';

    const skillsList = document.getElementById('skills');
    skillsList.innerHTML = '';
    (profileData.skills || []).forEach(skill => {
      const li = document.createElement('li');
      li.textContent = skill;
      skillsList.appendChild(li);
    });

    const projectsList = document.getElementById('projects-list');
    projectsList.innerHTML = '';
    (profileData.projects || []).forEach(project => {
      const li = document.createElement('li');
      li.innerHTML = `<p><strong>${project}</strong></p>`;
      projectsList.appendChild(li);
    });

    const achievementsList = document.getElementById('achievements-list');
    achievementsList.innerHTML = '';
    (profileData.achievements || []).forEach(achievement => {
      const li = document.createElement('li');
      li.textContent = achievement;
      achievementsList.appendChild(li);
    });

    const emailField = document.getElementById('email-display');
    if (emailField) {
      emailField.textContent = profileData.email || 'Not provided';
    }

    const phoneField = document.getElementById('phone-display');
    if (phoneField) {
      phoneField.textContent = profileData.phone || 'Not provided';
    }

    const linkedinField = document.getElementById('linkedin-link');
    if (linkedinField) {
      linkedinField.href = profileData.linkedin || '#';
      linkedinField.textContent = profileData.linkedin || 'Not provided';
    }

    const githubField = document.getElementById('github-link');
    if (githubField) {
      githubField.href = profileData.github || '#';
      githubField.textContent = profileData.github || 'Not provided';
    }
  }
}

function loadProfileData(uid) {
  const profileRef = db.ref(`profiles/${uid}`);
  profileRef.once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        const profileData = snapshot.val();
        populateProfile(profileData);
      } else {
        const defaultProfile = {
          name: '',
          headline: '',
          about: '',
          skills: [],
          projects: [],
          achievements: [],
          email: '',
          phone: '',
          linkedin: '',
          github: '',
          profilePic: 'https://via.placeholder.com/150'
        };
        populateProfile(defaultProfile);
        console.log("No profile data found. Initialized empty profile.");
      }
    })
    .catch((error) => {
      console.error("Error loading profile data:", error);
    });
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    loadProfileData(user.uid);
  } else {
    console.log("No user is logged in.");
    window.location.href = '/login.html';
  }
});

document.getElementById('edit-profile-form').addEventListener('submit', function (event) {
  event.preventDefault();

  const user = firebase.auth().currentUser;
  if (!user) {
    alert('You must be logged in to save your profile.');
    return;
  }

  const name = document.getElementById('edit-name').value;
  const headline = document.getElementById('edit-headline').value;
  const about = document.getElementById('edit-about').value;
  const skills = document.getElementById('edit-skills').value.split(',').map(skill => skill.trim());
  const email = document.getElementById('edit-email').value;
  const phone = document.getElementById('edit-phone').value;
  const linkedin = document.getElementById('edit-linkedin').value;
  const github = document.getElementById('edit-github').value;
  const projects = document.getElementById('edit-projects').value.split('\n').map(project => project.trim());
  const achievements = document.getElementById('edit-achievements').value.split('\n').map(achievement => achievement.trim());

  const profileData = {
    name,
    headline,
    about,
    skills,
    email,
    phone,
    linkedin,
    github,
    projects,
    achievements
  };

  db.ref(`profiles/${user.uid}`).set(profileData)
    .then(() => {
      alert('Profile updated successfully!');
      closeModal();
      loadProfileData(user.uid);
    })
    .catch(error => {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    });
});

const picInput = document.getElementById("pic-input");
picInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) {
    alert('No file selected!');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const profilePicUrl = e.target.result;
    document.getElementById('profile-pic').src = profilePicUrl;

    const user = firebase.auth().currentUser;
    if (user) {
      db.ref(`profiles/${user.uid}`).update({ profilePic: profilePicUrl })
        .then(() => {
          alert('Profile picture updated successfully!');
        })
        .catch((error) => {
          console.error('Error updating profile picture:', error);
          alert('Failed to update profile picture. Please try again.');
        });
    } else {
      alert('You must be logged in to update your profile picture.');
    }
  };
  reader.readAsDataURL(file);
});

const editPicInput = document.getElementById("edit-pic-input");
if (editPicInput) {
  editPicInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) {
      alert('No file selected!');
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const profilePicUrl = e.target.result;
      document.getElementById('profile-pic').src = profilePicUrl;

      const user = firebase.auth().currentUser;
      if (user) {
        db.ref(`profiles/${user.uid}`).update({ profilePic: profilePicUrl })
          .then(() => {
            alert('Profile picture updated successfully!');
          })
          .catch((error) => {
            console.error('Error updating profile picture:', error);
            alert('Failed to update profile picture. Please try again.');
          });
      } else {
        alert('You must be logged in to update your profile picture.');
      }
    };
    reader.readAsDataURL(file);
  });
}

function resetProfilePic() {
  const profilePic = document.getElementById("profile-pic");
  profilePic.src = "https://via.placeholder.com/150";
  picInput.value = "";
  const user = firebase.auth().currentUser;
  if (user) {
    db.ref(`profiles/${user.uid}`).update({ profilePic: 'https://via.placeholder.com/150' })
      .then(() => {
        alert('Profile picture reset successfully!');
      })
      .catch((error) => {
        console.error('Error resetting profile picture:', error);
        alert('Failed to reset profile picture. Please try again.');
      });
  }
}

function logoutUser() {
  firebase.auth().signOut()
    .then(() => {
      alert('You have been logged out.');
      window.location.href = 'login.html';
    })
    .catch((error) => {
      console.error('Error logging out:', error);
      alert('Failed to log out. Please try again.');
    });
}
