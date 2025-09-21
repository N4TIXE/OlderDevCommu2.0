import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Newnav from '../components/newNav';
import EditModal from '../components/EditModal';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingField, setEditingField] = useState({
        name: '', title: '', initialValue: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) { navigate('/register'); return; }
            try {
                const response = await fetch('http://localhost:5000/api/profile', { headers: { 'Authorization': `Bearer ${token}` } });
                const data = await response.json();
                if (response.ok) {
                    setUserData(data);
                } else {
                    localStorage.removeItem('token');
                    navigate('/register');
                }
            } catch (error) { console.error('Error fetching profile:', error); }
        };
        fetchProfile();
    }, [navigate]);

    const handleEditClick = (field, title, initialValue) => {
        setEditingField({ name: field, title: title, initialValue: initialValue });
        setIsModalOpen(true);
    };

    const handleSave = async (fieldName, newValue, password) => {
        if (!password) { alert('Please enter your password to confirm.'); return; }
        const token = localStorage.getItem('token');
        const updatedData = { [fieldName]: newValue, currentPassword: password };
        try {
            const response = await fetch('http://localhost:5000/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(updatedData)
            });
            const data = await response.json();
            if (response.ok) {
                alert('Profile updated successfully!');
                setUserData(data);
                setIsModalOpen(false);
            } else {
                alert(`Update failed: ${data.msg}`);
            }
        } catch (error) { console.error('Error updating profile:', error); }
    };

    const handleProfilePictureChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const token = localStorage.getItem('token');
        const data = new FormData();
        data.append("file", file);
        
        // ---  ใช้ข้อมูลล่าสุดที่ถูกต้อง ---
        data.append("upload_preset", "OlderDevCommu");
        data.append("cloud_name", "dmzn9kjpa"); // แก้ไข Cloud Name ตรงนี้

        try {
            //  อัปโหลดไป Cloudinary
            const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/dmzn9kjpa/image/upload`, { // แก้ไข URL ตรงนี้ด้วย
                method: "POST",
                body: data,
            });
            if (!uploadRes.ok) throw new Error("Cloudinary upload failed");
            const imageData = await uploadRes.json();
            const newProfilePicUrl = imageData.secure_url;

            //  บันทึก URL ลง Backend
            const response = await fetch('http://localhost:5000/api/profile/picture', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ profilePicture: newProfilePicUrl })
            });
            
            if (response.ok) {
                setUserData(prevData => ({ ...prevData, profilePicture: newProfilePicUrl }));
                alert("Profile picture updated successfully!");
            } else {
                const responseData = await response.json();
                alert(`Update failed: ${responseData.msg}`);
            }

        } catch (error) {
            console.error("Error updating profile picture:", error);
            alert("An error occurred while updating the picture.");
        } finally {
            event.target.value = null;
        }
    };


    if (!userData) return <div>Loading...</div>;

    return (
        <>
            <Newnav />
            <div className="flex justify-center items-center min-h-screen w-full text-white">
                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-2xl">
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative group">
                            <img src={userData.profilePicture || 'https://via.placeholder.com/150'} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500" />
                            <label htmlFor="profilePictureInput" className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-sm opacity-0 group-hover:opacity-100 cursor-pointer rounded-full transition-opacity">
                                Change
                            </label>
                            <input 
                                type="file" 
                                id="profilePictureInput" 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleProfilePictureChange}
                            />
                        </div>
                        <h1 className="text-3xl mt-4 font-bold">{userData.name}</h1>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-gray-700 p-4 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-400">Name</p>
                                <p className="text-lg">{userData.name}</p>
                            </div>
                            <button onClick={() => handleEditClick('name', 'Edit Name', userData.name)} className="text-indigo-400 hover:text-indigo-300">
                                <i className="ri-pencil-fill text-xl"></i>
                            </button>
                        </div>
                        <div className="flex justify-between items-center bg-gray-700 p-4 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-400">Email</p>
                                <p className="text-lg">{userData.email}</p>
                            </div>
                            <button onClick={() => handleEditClick('email', 'Edit Email', userData.email)} className="text-indigo-400 hover:text-indigo-300">
                                <i className="ri-pencil-fill text-xl"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <EditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                title={editingField.title}
                fieldName={editingField.name}
                initialValue={editingField.initialValue}
            />
        </>
    );
};

export default Profile;
