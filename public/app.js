import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { 
    getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCYPiqHhRk3AE-V5Pz4Veu4atZrVSfWeT8",
    authDomain: "crudapp-531b1.firebaseapp.com",
    projectId: "crudapp-531b1",
    storageBucket: "crudapp-531b1.firebasestorage.app",
    messagingSenderId: "216493110768",
    appId: "1:216493110768:web:2422187fe4e1d953f01935"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("addUserBtn").addEventListener("click", addUser);

// Function to Add User
async function addUser() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!name || !email) {
        alert("Both fields are required!");
        return;
    }

    try {
        await addDoc(collection(db, "users"), { name, email });
        alert("User added!");
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        fetchUsers();
    } catch (error) {
        console.error("Error adding user:", error);
        alert("Error adding user. Check console for details.");
    }
}

// Function to Fetch Users
async function fetchUsers() {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userList = document.getElementById("userList");
        userList.innerHTML = "";

        querySnapshot.forEach((docSnap) => {
            const li = document.createElement("li");
            const userData = docSnap.data();
            li.innerHTML = `${userData.name} (${userData.email}) 
                <button onclick="updateUser('${docSnap.id}', '${userData.name}')">Update</button>
                <button onclick="deleteUser('${docSnap.id}')">Delete</button>`;
            userList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

// Function to Update User
window.updateUser = async function(userId, currentName) {
    const newName = prompt("Enter new name:", currentName);
    if (newName && newName.trim() !== "") {
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { name: newName.trim() });
            alert("User updated!");
            fetchUsers();
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Error updating user. Check console for details.");
        }
    }
}

// Function to Delete User
window.deleteUser = async function(userId) {
    if (confirm("Are you sure you want to delete this user?")) {
        try {
            await deleteDoc(doc(db, "users", userId));
            alert("User deleted!");
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Error deleting user. Check console for details.");
        }
    }
}

// Fetch users on page load
fetchUsers();
