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
  

  function loadProfileData() {
    db.ref('users/profile').once('value')
      .then((snapshot) => {
        const profileData = snapshot.val();
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
  
          document.querySelector('phone-display').textContent = `Phone: ${profileData.phone || ''}`;
          document.querySelector('email-display').textContent = `Email: ${profileData.email || ''}`;
          document.getElementById('linkedin-link').href = profileData.linkedin || '#';
          document.getElementById('linkedin-link').textContent = profileData.linkedin || 'LinkedIn Profile';
          document.getElementById('github-link').href = profileData.github || '#';
          document.getElementById('github-link').textContent = profileData.github || 'GitHub Profile';
          
        }
      })
      .catch((error) => {
        console.error('Error fetching profile data:', error);
      });
  }
  
 
  document.addEventListener('DOMContentLoaded', loadProfileData);
  
 
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
        loadProfileData(); 
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
  
      
      const userId = 'user123'; 
      db.ref(`users/profile`).update({ profilePic: profilePicUrl })
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
  
      // Save the profile picture URL to Firebase
      const userId = 'user123'; 
      db.ref(`users/profile`).update({ profilePic: profilePicUrl })
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
    window.location.href = 'login.html';
  }
function createUser(userData) {
  usersRef.push(userData);
  console.log('User created:', userData);
  
}

createUser({ name: 'User One', email: 'user1@example.com' });
createUser({ name: 'User Two', email: 'user2@example.com' });

