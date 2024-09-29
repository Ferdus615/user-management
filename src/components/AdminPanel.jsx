import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentUserName, setCurrentUserName] = useState("");
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login"); // Redirect to login if user is not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [navigate]);

  // Fetch the logged-in user's details
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setCurrentUserName(userDoc.data().name);
        }
      }
    };

    fetchCurrentUser();
  }, []);

  // Real-time listener for users collection
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);

      const allBlocked = usersList.every((user) => user.status === "blocked");
      if (allBlocked) {
        navigate("/login"); // Redirect to login if all users are blocked
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleSelect = (id) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((userId) => userId !== id)
        : [...prevSelected, id]
    );
  };

  const handleBlock = async () => {
    try {
      const batchUpdate = selectedUsers.map((userId) => {
        const userDoc = doc(db, "users", userId);
        return updateDoc(userDoc, { status: "blocked" });
      });
      await Promise.all(batchUpdate);
      // alert('Selected users blocked successfully.');
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error blocking users:", error);
    }
  };

  const handleUnblock = async () => {
    try {
      const batchUpdate = selectedUsers.map((userId) => {
        const userDoc = doc(db, "users", userId);
        return updateDoc(userDoc, { status: "active" });
      });
      await Promise.all(batchUpdate);
      // alert('Selected users unblocked successfully.');
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error unblocking users:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const batchDelete = selectedUsers.map((userId) => {
        const userDoc = doc(db, "users", userId);
        return deleteDoc(userDoc);
      });
      await Promise.all(batchDelete);
      alert("Selected users deleted successfully.");
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error deleting users:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Admin Panel</h2>
      <div className="d-flex justify-content-between mb-3">
        <div>
          <span>
            Hello, <span style={{ color: "red" }}>{currentUserName}</span>
          </span>
        </div>
        
        <button onClick={handleLogout} className="btn btn-secondary">
          Logout
        </button>
      </div>

      <div className="btn-toolbar">
        <button className="btn btn-primary me-2" onClick={handleBlock}>
          <svg
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            width="30px"
            height="20px"
            viewBox="0 0 40 122.88"
            enable-background="new 0 0 40 20"
            xml:space="preserve"
          >
            <g>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2.892,56.036h8.959v-1.075V37.117c0-10.205,4.177-19.484,10.898-26.207v-0.009 C29.473,4.177,38.754,0,48.966,0C59.17,0,68.449,4.177,75.173,10.901l0.01,0.009c6.721,6.723,10.898,16.002,10.898,26.207v17.844 v1.075h7.136c1.59,0,2.892,1.302,2.892,2.891v61.062c0,1.589-1.302,2.891-2.892,2.891H2.892c-1.59,0-2.892-1.302-2.892-2.891 V58.927C0,57.338,1.302,56.036,2.892,56.036L2.892,56.036z M26.271,56.036h45.387v-1.075V36.911c0-6.24-2.554-11.917-6.662-16.03 l-0.005,0.004c-4.111-4.114-9.787-6.669-16.025-6.669c-6.241,0-11.917,2.554-16.033,6.665c-4.109,4.113-6.662,9.79-6.662,16.03 v18.051V56.036L26.271,56.036z M49.149,89.448l4.581,21.139l-12.557,0.053l3.685-21.423c-3.431-1.1-5.918-4.315-5.918-8.111 c0-4.701,3.81-8.511,8.513-8.511c4.698,0,8.511,3.81,8.511,8.511C55.964,85.226,53.036,88.663,49.149,89.448L49.149,89.448z"
              />
            </g>
          </svg>
          Block
        </button>
        <button className="btn btn-primary me-2" onClick={handleUnblock}>
          <svg
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            width="30px"
            height="20px"
            viewBox="0 0 122.88 109.652"
            enable-background="new 0 0 122.88 109.652"
            xml:space="preserve"
          >
            <g>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2.585,49.871H54.77V34.054v-0.011h0.009c0.002-9.368,3.828-17.878,9.989-24.042 c6.164-6.163,14.679-9.991,24.051-9.991V0h0.005l0,0h0.012v0.009c9.368,0.002,17.878,3.828,24.042,9.989 c6.164,6.164,9.991,14.679,9.991,24.051h0.012v0.004v15.96v2.403h-2.403h-9.811h-2.404v-2.403V33.868v-0.009h0.012 c-0.002-5.332-2.195-10.189-5.722-13.715c-3.528-3.531-8.388-5.721-13.724-5.724v0.009h-0.005l0,0h-0.011V14.42 c-5.334,0.002-10.191,2.19-13.72,5.717l0.005,0.005c-3.529,3.528-5.722,8.388-5.722,13.722h0.009v0.005v16.003h13.987 c1.422,0,2.585,1.164,2.585,2.585v54.613c0,1.422-1.163,2.583-2.585,2.583H2.585c-1.424,0-2.585-1.161-2.585-2.583V52.456 C0,51.035,1.161,49.871,2.585,49.871L2.585,49.871z M43.957,79.753l4.098,18.908l-11.232,0.045l3.297-19.162 c-3.068-0.981-5.295-3.857-5.295-7.252c0-4.202,3.411-7.613,7.614-7.613c4.202,0,7.613,3.411,7.613,7.613 C50.053,75.975,47.433,79.048,43.957,79.753L43.957,79.753z"
              />
            </g>
          </svg>
          {/* Unblock */}
        </button>
        <button className="btn btn-danger" onClick={handleDelete}>
          <svg
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            width="30px"
            height="20px"
            viewBox="0 0 109.484 122.88"
            enable-background="new 0 0 109.484 122.88"
            xml:space="preserve"
          >
            <g>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2.347,9.633h38.297V3.76c0-2.068,1.689-3.76,3.76-3.76h21.144 c2.07,0,3.76,1.691,3.76,3.76v5.874h37.83c1.293,0,2.347,1.057,2.347,2.349v11.514H0V11.982C0,10.69,1.055,9.633,2.347,9.633 L2.347,9.633z M8.69,29.605h92.921c1.937,0,3.696,1.599,3.521,3.524l-7.864,86.229c-0.174,1.926-1.59,3.521-3.523,3.521h-77.3 c-1.934,0-3.352-1.592-3.524-3.521L5.166,33.129C4.994,31.197,6.751,29.605,8.69,29.605L8.69,29.605z M69.077,42.998h9.866v65.314 h-9.866V42.998L69.077,42.998z M30.072,42.998h9.867v65.314h-9.867V42.998L30.072,42.998z M49.572,42.998h9.869v65.314h-9.869 V42.998L49.572,42.998z"
              />
            </g>
          </svg>
          {/* Delete */}
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={(e) => {
                  setSelectedUsers(
                    e.target.checked ? users.map((user) => user.id) : []
                  );
                }}
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Last Login</th>
            <th>Registration Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="7">No users found</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelect(user.id)}
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.lastLogin?.toDate().toLocaleString()}</td>
                <td>{user.registrationTime.toDate().toLocaleString()}</td>
                <td>{user.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;
