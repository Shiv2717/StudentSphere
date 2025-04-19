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
      document.querySelector('.user-name').textContent = profileData.name || 'John Doe';
      document.querySelector('.user-headline').textContent = profileData.headline || 'ECE Student | Web Developer';
      document.getElementById('about').textContent = profileData.about || 'Passionate about technology and building real-world projects.';
  
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
          console.log("No profile data found for this user.");
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
    }
  });
  
  document.getElementById('edit-profile-form').addEventListener('submit', function (event) {
    event.preventDefault();
  
    // Collect form data
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
  
    // Save data to Firebase
    db.ref('users/profile').set({
      name,
      headline,
      about,
      skills,
      email,
      phone,
      linkedin,
      github,
      projects,
      achievements,
    })
      .then(() => {
        alert('Profile updated successfully!');
        closeModal();
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            loadProfileData(user.uid);
          }
        });
      })
      .catch(error => {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
      });
  });
  
  // Profile Picture Upload
  const picInput = document.getElementById("pic-input");
  const profilePic = document.getElementById("profile-pic");
  
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
  
      const userId = firebase.auth().currentUser.uid; 
      db.ref(`profiles/${userId}`).update({ profilePic: profilePicUrl })
        .then(() => {
          alert('Profile picture updated successfully!');
        })
        .catch((error) => {
          console.error('Error updating profile picture:', error);
          alert('Failed to update profile picture. Please try again.');
        });
    };
  
    reader.readAsDataURL(file); 
  });

  document.getElementById('edit-pic-input').addEventListener('change', function (event) {
    const file = event.target.files[0]; 
    if (!file) {
      alert('No file selected!');
      return;
    }
  
    const reader = new FileReader();
    reader.onload = function (e) {
      const profilePicUrl = e.target.result; 
  
      document.getElementById('profile-pic').src = profilePicUrl;
  
      const userId = firebase.auth().currentUser.uid; 
      db.ref(`profiles/${userId}`).update({ profilePic: profilePicUrl })
        .then(() => {
          alert('Profile picture updated successfully!');
        })
        .catch((error) => {
          console.error('Error updating profile picture:', error);
          alert('Failed to update profile picture. Please try again.');
        });
    };
  
    reader.readAsDataURL(file); 
  });
  
  // Reset Profile Picture
  function resetProfilePic() {
    profilePic.src = "default-avatar.png";
    picInput.value = "";
    picInput.style.display = "block";
  }
  
  // Logout function
  function logoutUser() {
    alert('You have been logged out.');
    window.location.href = '/login.html';
  }

  function saveProfileData(uid, profileData) {
  const profileRef = db.ref(`profiles/${uid}`);
  profileRef.set(profileData)
    .then(() => {
      console.log("Profile data saved successfully!");
      loadProfileData(uid); 
    })
    .catch((error) => {
      console.error("Error saving profile data:", error);
    });
}

  const profileData = {
    name: "John Doe",
    headline: "ECE Student | Web Developer",
    about: "Passionate about technology and building real-world projects.",
    skills: ["HTML", "CSS", "JavaScript", "Python"],
    projects: [
      "Resume Builder – A tool to create resumes with live preview.",
      "Portfolio Website – A personal website showcasing my projects."
    ],
    achievements: [
      "Completed AI Internship at XYZ Institute",
      "Won 1st place in Hackathon 2023"
    ],
    contact: {
      email: "johndoe@example.com",
      phone: "+91-9876543210",
      linkedin: "https://www.linkedin.com/in/your-profile",
      github: "https://github.com/your-username"
    }
  };

  saveProfileData(firebase.auth().currentUser.uid, profileData);

