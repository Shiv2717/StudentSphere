import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded in explore.js");
    const profileList = document.getElementById('profile-list');
    const logoutBtn = document.getElementById('logout');

    if (!logoutBtn) {
        console.error("Logout button not found in DOM");
        return;
    }

    onAuthStateChanged(auth, (user) => {
        if (!user) {
            console.log("User not logged in, redirecting to login...");
            window.location.href = 'login.html';
        } else {
            console.log("User logged in:", user.email);
            renderProfiles();
        }
    });

    logoutBtn.addEventListener('click', async () => {
        console.log("Logout button clicked in explore.html");
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

    async function renderProfiles() {
        try {
            const querySnapshot = await getDocs(collection(db, 'profiles'));
            profileList.innerHTML = '';
            querySnapshot.forEach((doc) => {
                const profile = doc.data();
                const profileDiv = document.createElement('div');
                profileDiv.className = 'bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer';
                profileDiv.innerHTML = `
                    <img src="${profile.pic || 'https://via.placeholder.com/150'}" alt="${profile.name}" class="w-24 h-24 rounded-full mx-auto object-cover">
                    <h3 class="text-lg font-bold mt-4 text-center">${profile.name}</h3>
                    <p class="text-gray-600 text-center">${profile.bio}</p>
                `;
                profileDiv.addEventListener('click', () => {
                    window.location.href = `profile.html?uid=${doc.id}`;
                });
                profileList.appendChild(profileDiv);
            });
        } catch (error) {
            console.error("Error fetching profiles:", error);
        }
    }
});