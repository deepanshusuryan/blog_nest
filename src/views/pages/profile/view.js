"use client"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "@/redux/slice/profileSlice";

const Profile = ({ id }) => {
    const dispatch = useDispatch();
    const { data: profile, loading, error } = useSelector((state) => state.profile);

    useEffect(() => {
        if (id) dispatch(fetchProfile(id));
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!profile) return <div>No profile found</div>;

    return (
        <div>
            <div>
                <img
                    src={profile?.avatar || "/default-avatar.png"}
                    alt={profile?.name}
                    width={100}
                    height={100}
                />
            </div>

            <div>
                <h2>{profile?.name}</h2>
                <p>{profile?.email}</p>
                <p>{profile?.contact}</p>
                <p>{profile?.bio}</p>
            </div>
        </div>
    );
}

export default Profile;