import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, getDoc, query, orderBy, where, updateDoc, addDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

const urlParams = new URLSearchParams(window.location.search);
const profileUid = urlParams.get('uid');

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded in profile.js");
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
            loadProfile();
        }
    });

    logoutBtn.addEventListener('click', async () => {
        console.log("Logout button clicked in profile.html");
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

    async function loadProfile() {
        if (!profileUid) {
            document.body.innerHTML = '<h1 class="text-center mt-10">Profile not found</h1>';
            return;
        }

        try {
            const docRef = doc(db, 'profiles', profileUid);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                document.body.innerHTML = '<h1 class="text-center mt-10">Profile not found</h1>';
                return;
            }

            const profile = docSnap.data();

            document.getElementById('profile-pic').src = profile.pic || 'https://via.placeholder.com/150';
            document.getElementById('profile-name').textContent = profile.name || "Anonymous";
            document.getElementById('profile-bio').textContent = profile.bio || "No bio available";
            document.getElementById('profile-studies').querySelector('span').textContent = profile.studies || 'Not specified';
            document.getElementById('profile-projects').querySelector('span').textContent = profile.projects || 'Not specified';

            const achievementsList = document.getElementById('achievements');
            const certificatesList = document.getElementById('certificates');
            if (profile.achievements && profile.achievements.length > 0) {
                profile.achievements.forEach(a => achievementsList.innerHTML += `<li>${a}</li>`);
            } else {
                achievementsList.innerHTML = '<p class="text-gray-600">No achievements listed.</p>';
            }
            if (profile.certificates && profile.certificates.length > 0) {
                profile.certificates.forEach(c => certificatesList.innerHTML += `<li>${c}</li>`);
            } else {
                certificatesList.innerHTML = '<p class="text-gray-600">No certificates listed.</p>';
            }

            const userPosts = document.getElementById('user-posts');
            const q = query(collection(db, 'posts'), where('author', '==', profile.name), orderBy('date', 'desc'));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                userPosts.innerHTML = '<p class="text-gray-600">No posts yet.</p>';
            } else {
                querySnapshot.forEach((doc) => {
                    const post = doc.data();
                    const postDiv = document.createElement('div');
                    postDiv.className = 'p-4 bg-white rounded-lg shadow-sm';
                    postDiv.innerHTML = `
                        <p>${post.content}</p>
                        <small class="text-gray-500">Posted on ${post.date}</small>
                        <div class="mt-2 flex space-x-4">
                            <button class="like-btn text-gray-600" data-id="${doc.id}">Like (${post.likes || 0})</button>
                            <button class="comment-btn text-gray-600" data-id="${doc.id}">Comment</button>
                        </div>
                        <div class="comments hidden" data-id="${doc.id}"></div>
                    `;
                    userPosts.appendChild(postDiv);
                });

                document.querySelectorAll('.like-btn').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        const postId = e.target.dataset.id;
                        const postRef = doc(db, 'posts', postId);
                        const postSnap = await getDoc(postRef);
                        const post = postSnap.data();
                        await updateDoc(postRef, { likes: (post.likes || 0) + 1 });
                    });
                });

                document.querySelectorAll('.comment-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const postId = e.target.dataset.id;
                        const commentsDiv = document.querySelector(`.comments[data-id="${postId}"]`);
                        commentsDiv.classList.toggle('hidden');
                        if (!commentsDiv.innerHTML) {
                            const input = document.createElement('input');
                            input.placeholder = 'Add a comment...';
                            input.className = 'w-full p-2 mt-2 border rounded';
                            input.addEventListener('keypress', async (e) => {
                                if (e.key === 'Enter' && input.value.trim()) {
                                    await addDoc(collection(db, 'posts', postId, 'comments'), {
                                        text: input.value,
                                        author: auth.currentUser.email || 'Anonymous',
                                        date: new Date().toLocaleString()
                                    });
                                    input.value = '';
                                }
                            });
                            commentsDiv.appendChild(input);
                        }
                    });
                });
            }

            const userEvents = document.getElementById('user-events');
            const eventQuery = query(collection(db, 'events'), where('author', '==', profile.name), orderBy('date', 'desc'));
            const eventSnapshot = await getDocs(eventQuery);
            if (eventSnapshot.empty) {
                userEvents.innerHTML = '<p class="text-gray-600">No events created.</p>';
            } else {
                eventSnapshot.forEach((doc) => {
                    const event = doc.data();
                    const eventDiv = document.createElement('div');
                    eventDiv.className = 'p-4 bg-white rounded-lg shadow-sm';
                    eventDiv.innerHTML = `
                        <h3 class="font-bold">${event.name}</h3>
                        <p>Date: ${event.date} | Location: ${event.location}</p>
                        <button class="rsvp-btn bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" data-id="${doc.id}">RSVP (${event.rsvps || 0})</button>
                    `;
                    userEvents.appendChild(eventDiv);
                });

                document.querySelectorAll('.rsvp-btn').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        const eventId = e.target.dataset.id;
                        const eventRef = doc(db, 'events', eventId);
                        const eventSnap = await getDoc(eventRef);
                        const event = eventSnap.data();
                        await updateDoc(eventRef, { rsvps: (event.rsvps || 0) + 1 });
                    });
                });
            }
        } catch (error) {
            console.error("Error loading profile:", error);
            document.body.innerHTML = '<h1 class="text-center mt-10">Error loading profile</h1>';
        }
    }

    const tabs = ['about', 'posts', 'events'];
    tabs.forEach(tab => {
        document.getElementById(`tab-${tab}`).addEventListener('click', () => {
            tabs.forEach(t => {
                document.getElementById(`${t}-content`).classList.add('hidden');
                document.getElementById(`tab-${t}`).classList.remove('border-b-2', 'border-[#0a66c2]', 'text-[#0a66c2]');
                document.getElementById(`tab-${t}`).classList.add('text-gray-600');
            });
            document.getElementById(`${tab}-content`).classList.remove('hidden');
            document.getElementById(`tab-${tab}`).classList.add('border-b-2', 'border-[#0a66c2]', 'text-[#0a66c2]');
            document.getElementById(`tab-${tab}`).classList.remove('text-gray-600');
        });
    });
});