"use client"

import { useAuth } from "@/common/AuthContext";

const Profile = () => {
    const {user}=useAuth();
    return (
        <div>
            <div>
                <img
                    src={user?.avatar}
                    alt={user?.name}
                    width={100}
                    height={100}
                />
            </div>

            <div>
                <h2>{user?.name}</h2>
                <p>{user?.email}</p>
                <p>{user?.contact}</p>
            </div>
            <div>
                <button>Edit</button>
            </div>
        </div>
    );
}

export default Profile;