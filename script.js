import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, collection, addDoc, setDoc, updateDoc, doc, getDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-storage.js";

const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded in script.js");
    const postBtn = document.getElementById('post-btn');
    const postInput = document.getElementById('post-input');
    const postsDiv = document.getElementById('posts');
    const createEventBtn = document.getElementById('create-event-btn');
    const eventList = document.getElementById('event-list');
    const profilePic = document.getElementById('profile-pic');
    const profilePicUpload = document.getElementById('profile-pic-upload');
    const editProfileBtn = document.getElementById('edit-profile');
    const profileName = document.getElementById('profile-name');
    const profileBio = document.getElementById('profile-bio');
    const logoutBtn = document.getElementById('logout');

    if (!logoutBtn) {
        console.error("Logout button not found in DOM");
    } else {
        // Removed duplicate logout event listener
    }

    onAuthStateChanged(auth, (user) => {
        if (!user) {
            console.log("User not logged in, redirecting to login...");
            window.location.href = 'login.html';
        } else {
            console.log("User logged in:", user.email);
            loadProfile(user);
            loadPosts();
            loadEvents();
        }
    });

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            console.log("Logout button clicked in index.html");
            try {
                const user = auth.currentUser;
                if (user) {
                    console.log("Signing out user:", user.email);
                    await signOut(auth);
                    console.log("Sign-out successful, redirecting to login...");
                    window.location.href = 'login.html';
                } else {
                    console.warn("No user is currently logged in");
                    window.location.href = 'login.html';
                }
            } catch (error) {
                console.error("Logout error:", error.message);
                alert("Logout failed: " + error.message);
            }
        });
    }

    async function loadProfile(user) {
        try {
            const docRef = doc(db, 'profiles', user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                profileName.textContent = data.name || "Anonymous";
                profileBio.textContent = data.bio || "No bio available";
                profilePic.src = data.pic || 'https://via.placeholder.com/150';
            } else {
                console.log("No profile found, setting default values");
                profileName.textContent = "Anonymous";
                profileBio.textContent = "No bio available";
                profilePic.src = 'https://via.placeholder.com/150';
            }
        } catch (error) {
            console.error("Error loading profile:", error);
            alert("Failed to load profile: " + error.message);
        }
    }

    function loadPosts() {
        const q = query(collection(db, 'posts'), orderBy('date', 'desc'));
        onSnapshot(q, (snapshot) => {
            postsDiv.innerHTML = '';
            snapshot.forEach((doc) => {
                const post = doc.data();
                const postDiv = document.createElement('div');
                postDiv.className = 'p-4 bg-white rounded-lg shadow-sm';
                postDiv.innerHTML = `<p>${post.content}</p><small class="text-gray-500">Posted by ${post.author} on ${post.date}</small>`;
                postsDiv.appendChild(postDiv);
            });
        }, (error) => {
            console.error("Error loading posts:", error);
        });
    }

    function loadEvents() {
        const q = query(collection(db, 'events'), orderBy('date', 'desc'));
        onSnapshot(q, (snapshot) => {
            eventList.innerHTML = '';
            snapshot.forEach((doc) => {
                const event = doc.data();
                const eventDiv = document.createElement('div');
                eventDiv.className = 'p-4 bg-white rounded-lg shadow-sm';
                eventDiv.innerHTML = `
                    <h3 class="font-bold">${event.name}</h3>
                    <p>Date: ${event.date} | Location: ${event.location}</p>
                    <button class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">RSVP</button>
                `;
                eventList.appendChild(eventDiv);
            });
        }, (error) => {
            console.error("Error loading events:", error);
        });
    }

    postBtn.addEventListener('click', async () => {
        const content = postInput.value.trim();
        if (content) {
            try {
                await addDoc(collection(db, 'posts'), {
                    content,
                    author: profileName.textContent,
                    date: new Date().toLocaleString()
                });
                postInput.value = '';
            } catch (error) {
                console.error("Error posting:", error);
            }
        }
    });

    createEventBtn.addEventListener('click', async () => {
        const eventName = prompt('Enter event name:');
        const eventDate = prompt('Enter event date (e.g., March 15, 2025):');
        const eventLocation = prompt('Enter event location:');
        if (eventName && eventDate && eventLocation) {
            try {
                await addDoc(collection(db, 'events'), {
                    name: eventName,
                    date: eventDate,
                    location: eventLocation,
                    author: profileName.textContent
                });
            } catch (error) {
                console.error("Error creating event:", error);
            }
        }
    });

    profilePic.addEventListener('click', () => profilePicUpload.click());
    profilePicUpload.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            try {
                const storageRef = ref(storage, `profile_pics/${auth.currentUser.uid}`);
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                profilePic.src = url;
                await updateDoc(doc(db, 'profiles', auth.currentUser.uid), { pic: url });
            } catch (error) {
                console.error("Error uploading profile picture:", error);
            }
        }
    });

    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', async () => {
            const newName = prompt('Enter new name:', profileName.textContent);
            const newBio = prompt('Enter new bio:', profileBio.textContent);
            const studies = prompt('What are you studying?', '');
            const projects = prompt('What projects are you working on?', '');
            const achievements = prompt('List an achievement (or leave blank):', '');
            const certificates = prompt('List a certificate (or leave blank):', '');
            if (newName || newBio) {
                try {
                    const updates = {
                        name: newName || profileName.textContent,
                        bio: newBio || profileBio.textContent,
                        studies: studies || '',
                        projects: projects || '',
                        achievements: achievements ? [achievements] : [],
                        certificates: certificates ? [certificates] : []
                    };
                    await setDoc(doc(db, 'profiles', auth.currentUser.uid), updates, { merge: true });
                    profileName.textContent = updates.name;
                    profileBio.textContent = updates.bio;
                } catch (error) {
                    console.error("Error updating profile:", error);
                }
            }
        });
    }
});
