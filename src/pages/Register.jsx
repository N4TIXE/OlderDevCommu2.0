import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // เพิ่มเข้ามา
import Newnav from '../components/newNav';

const App = () => {
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate(); // เพิ่มเข้ามา

    // ===== ส่วนที่เพิ่มเข้ามาทั้งหมด: จัดการข้อมูลในฟอร์ม =====
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [loginData, setLoginData] = useState({
        name: '',
        password: ''
    });

    const handleRegisterChange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };
    
    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault(); // ป้องกันหน้าเว็บรีโหลด
        if (registerData.password !== registerData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: registerData.name,
                    email: registerData.email,
                    password: registerData.password,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token); // บันทึก Token
                navigate('/profile'); // ไปยังหน้า Profile
            } else {
                alert(data.msg || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('An error occurred during registration.');
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
         try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: loginData.name,
                    password: loginData.password,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/profile');
            } else {
                alert(data.msg || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login.');
        }
    };
    // ===== จบส่วนที่เพิ่มเข้ามา =====

    const handleToggle = () => {
        setIsActive(!isActive);
    };

    useEffect(() => {
        const link = document.createElement('link');
        link.href = "https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css";
        link.rel = "stylesheet";
        document.head.appendChild(link);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Newnav />
            {/* ... ส่วนของ <style> ยังคงเหมือนเดิม ... */}
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
                    
                    body {
                        font-family: 'Montserrat', sans-serif;
                    }

                    .form-container {
                        position: absolute;
                        top: 0;
                        height: 100%;
                        transition: all 0.6s ease-in-out;
                    }

                    .form-container.sign-up {
                        left: 0;
                        width: 50%;
                        opacity: 0;
                        z-index: 1;
                    }

                    .container.active .form-container.sign-up {
                        transform: translateX(100%);
                        opacity: 1;
                        z-index: 5;
                        animation: move 0.6s;
                    }

                    .form-container.sign-in {
                        left: 0;
                        width: 50%;
                        z-index: 2;
                    }

                    .container.active .form-container.sign-in {
                        transform: translateX(100%);
                    }

                    .toggle-container {
                        position: absolute;
                        top: 0;
                        left: 50%;
                        width: 50%;
                        height: 100%;
                        overflow: hidden;
                        transition: all 0.6s ease-in-out;
                        border-radius: 150px 0 0 100px;
                        z-index: 1000;
                    }

                    .container.active .toggle-container {
                        transform: translateX(-100%);
                        border-radius: 0 150px 100px 0;
                    }

                    .toggle {
                        background: linear-gradient(to right, #5c6bc0, #512da8);
                        color: #fff;
                        position: relative;
                        left: -100%;
                        height: 100%;
                        width: 200%;
                        transform: translateX(0);
                        transition: all 0.6s ease-in-out;
                    }

                    .container.active .toggle {
                        transform: translateX(50%);
                    }

                    .toggle-panel {
                        position: absolute;
                        width: 50%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-direction: column;
                        padding: 0 30px;
                        text-align: center;
                        top: 0;
                        transition: all 0.6s ease-in-out;
                    }

                    .toggle-left {
                        transform: translateX(-200%);
                    }

                    .container.active .toggle-left {
                        transform: translateX(0);
                    }

                    .toggle-right {
                        right: 0;
                        transform: translateX(0);
                    }

                    .container.active .toggle-right {
                        transform: translateX(200%);
                    }
                    
                    @keyframes move {
                        0%, 49.99% {
                            opacity: 0;
                            z-index: 1;
                        }
                        50%, 100% {
                            opacity: 1;
                            z-index: 5;
                        }
                    }
                `}
            </style>
            
            <div
                className={`container bg-white rounded-[30px] shadow-[0_5px_15px_rgba(0,0,0,0.35)] relative overflow-hidden w-[768px] max-w-full min-h-[480px] transition-all duration-600 ease-in-out ${
                    isActive ? "active" : ""
                }`}
            >
                {/* Sign-Up form container */}
                <div className="form-container sign-up">
                    {/* แก้ไข <form> และ <input> */}
                    <form onSubmit={handleRegisterSubmit} className="bg-white flex items-center justify-center flex-col p-[0_40px] h-full text-center">
                        <h1 className="text-[32px] font-bold">Create Account</h1>
                        <div className="social-icons my-5">
                            <a href="#" className="border border-[#ccc] rounded-[20%] inline-flex justify-center items-center mx-[3px] w-[40px] h-[40px] text-[#333] text-[20px] no-underline">
                                <i className="ri-google-fill"></i>
                            </a>
                            {/* ... social icons ... */}
                        </div>
                        <span className="text-[12px]">or use your email for registration</span>
                        <input
                            type="text"
                            placeholder="Name"
                            name="name" // เพิ่ม name
                            value={registerData.name} // เพิ่ม value
                            onChange={handleRegisterChange} // เพิ่ม onChange
                            className="bg-[#eee] border-none my-2 p-[10px_15px] text-[13px] rounded-[8px] w-full outline-none"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            name="email" // เพิ่ม name
                            value={registerData.email} // เพิ่ม value
                            onChange={handleRegisterChange} // เพิ่ม onChange
                            className="bg-[#eee] border-none my-2 p-[10px_15px] text-[13px] rounded-[8px] w-full outline-none"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password" // เพิ่ม name
                            value={registerData.password} // เพิ่ม value
                            onChange={handleRegisterChange} // เพิ่ม onChange
                            className="bg-[#eee] border-none my-2 p-[10px_15px] text-[13px] rounded-[8px] w-full outline-none"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            name="confirmPassword" // เพิ่ม name
                            value={registerData.confirmPassword} // เพิ่ม value
                            onChange={handleRegisterChange} // เพิ่ม onChange
                            className="bg-[#eee] border-none my-2 p-[10px_15px] text-[13px] rounded-[8px] w-full outline-none"
                            required
                        />
                        <button type="submit" className="bg-[#512da8] text-white text-[12px] py-[10px] px-[45px] border border-transparent rounded-[8px] font-semibold tracking-[0.5px] uppercase mt-[10px] cursor-pointer">
                            Sign Up
                        </button>
                    </form>
                </div>

                {/* Sign-In form container */}
                <div className="form-container sign-in">
                    <form onSubmit={handleLoginSubmit} className="bg-white flex items-center justify-center flex-col p-[0_40px] h-full text-center">
                        <h1 className="text-[32px] font-bold">Sign In</h1>
                        <div className="social-icons my-5">
                            {/* ... social icons ... */}
                        </div>
                        <span className="text-[12px]">or use your name password</span>
                        <input
                            type="text"
                            placeholder="Name" //เปลี่ยนจาก Email เป็น Name
                            name="name"
                            value={loginData.name}
                            onChange={handleLoginChange}
                            className="bg-[#eee] border-none my-2 p-[10px_15px] text-[13px] rounded-[8px] w-full outline-none"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={loginData.password}
                            onChange={handleLoginChange}
                            className="bg-[#eee] border-none my-2 p-[10px_15px] text-[13px] rounded-[8px] w-full outline-none"
                            required
                        />
                        <a href="#" className="text-[#333] text-[13px] no-underline my-[15px] mb-[10px]">
                            Forget Your Password?
                        </a>
                        <button type="submit" className="bg-[#512da8] text-white text-[12px] py-[10px] px-[45px] border border-transparent rounded-[8px] font-semibold tracking-[0.5px] uppercase mt-[10px] cursor-pointer">
                            Sign In
                        </button>
                    </form>
                </div>
                
                {/* ... Toggle container ... */}
                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1 className="text-[32px] font-bold">Welcome Back!</h1>
                            <p className="text-[14px] leading-5 tracking-[0.3px] my-5">
                                Enter your personal details to use all of site features
                            </p>
                            <button
                                className="bg-transparent border border-white text-white text-[12px] py-[10px] px-[45px] rounded-[8px] font-semibold tracking-[0.5px] uppercase mt-[10px] cursor-pointer"
                                id="login"
                                onClick={handleToggle}
                            >
                                Sign In
                            </button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1 className="text-[32px] font-bold">Welcome!</h1>
                            <p className="text-[14px] leading-5 tracking-[0.3px] my-5">
                                Register with your personal details to use all of site features
                            </p>
                            <button
                                className="bg-transparent border border-white text-white text-[12px] py-[10px] px-[45px] rounded-[8px] font-semibold tracking-[0.5px] uppercase mt-[10px] cursor-pointer"
                                id="register"
                                onClick={handleToggle}
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;