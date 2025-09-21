import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import logo from "../../public/OlderCommuLOGO.png";
// ไม่ต้อง import Popover แล้ว

export default function NewNav() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // 👇 **เปลี่ยนมาใช้ State ของเราเอง**
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const [profilePicUrl, setProfilePicUrl] = useState('');
  
  // Ref สำหรับตรวจสอบการคลิกนอก Dropdown
  const dropdownRef = useRef(null);

  // useEffect สำหรับดึงข้อมูลโปรไฟล์ (เหมือนเดิม)
  useEffect(() => {
    const checkUserStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
        try {
          const response = await fetch('http://localhost:5000/api/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setProfilePicUrl(data.profilePicture);
          } else {
             localStorage.removeItem("token");
             setIsLoggedIn(false);
          }
        } catch (error) {
          console.error("Could not fetch profile", error);
        }
      } else {
        setIsLoggedIn(false);
      }
    };
    checkUserStatus();
  }, []);

  // useEffect สำหรับปิดเมนูเมื่อคลิกข้างนอก
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);


  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setProfilePicUrl('');
    navigate("/");
    setIsDropdownOpen(false); // ปิดเมนูหลัง logout
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const menuOpen = isMenuOpen ? "bx-x" : "";

  return (
    <div className="p-0 m-0 box-border list-none no-underline">
      <header className="fixed w-full top-0 right-0 z-[1000] py-[20px] px-[9%] flex items-center justify-between transition-all duration-600 ease-in max-[1820px]:px-[4%] max-[1820px]:py-[22px] max-[1160px]:px-[4%] max-[1160px]:py-0">
        {/* Logo และ Menu เหมือนเดิม */}
        <Link to="/" data-aos="flip-left" data-aos-duration="1500">
          <img src={logo} alt="" className="w-[140px] h-auto transition-all duration-500 ease-in-out hover:scale-120 max-[1210px]:w-[110px]" />
        </Link>
        <ul className={`flex gap-y-[20px] gap-x-[70px] max-[1160px]:absolute max-[1160px]:top-0 max-[1160px]:w-full max-[1160px]:h-screen max-[1160px]:flex-col max-[1160px]:backdrop-blur-[20px] max-[1160px]:flex max-[1160px]:items-center max-[1160px]:justify-center max-[1160px]:transition-all max-[1160px]:duration-500 max-[1160px]:ease-in-out ${ isMenuOpen ? "max-[1160px]:right-0" : "max-[1160px]:right-[-100%]"}`}>
            <li className="max-[1160px]:mt-[130px]"><Link to="/" className="inline-block text-[1.3rem] font-normal text-[#e2e2e2] py-1 uppercase border-b-2 border-b-transparent transition-all duration-300 ease-in-out hover:text-[#ffa500] hover:border-b-2 hover:border-white hover:scale-[1.2] max-[1160px]:block max-[1160px]:text-[2.2rem]">Main</Link></li>
            <li><Link to="/ComingSoon" className="inline-block text-[1.3rem] font-normal text-[#e2e2e2] py-1 uppercase border-b-2 border-b-transparent transition-all duration-300 ease-in-out hover:text-[#ffa500] hover:border-b-2 hover:border-white hover:scale-[1.2] max-[1160px]:text-[2.2rem]">Store</Link></li>
            <li><Link to="/ComingSoon" className="inline-block text-[1.3rem] font-normal text-[#e2e2e2] py-1 uppercase border-b-2 border-b-transparent transition-all duration-300 ease-in-out hover:text-[#ffa500] hover:border-b-2 hover:border-white hover:scale-[1.2] max-[1160px]:text-[2.2rem]">Contact</Link></li>
            <li><Link to="/" className="inline-block text-[1.3rem] font-normal text-[#e2e2e2] py-1 uppercase border-b-2 border-b-transparent transition-all duration-300 ease-in-out hover:text-[#ffa500] hover:border-b-2 hover:border-white hover:scale-[1.2] max-[1160px]:text-[2.2rem] ">About Us</Link></li>
        </ul>
        <div className="flex items-center gap-5" data-aos="flip-left" data-aos-duration="1000">
            <Link to="/"><i className="ri-search-line inline-flex items-center justify-center h-[45px] w-[45px] bg-[#333333] text-white rounded-[10px] text-xl transition-all duration-500 ease-in-out hover:text-[#ffa500] hover:bg-[#1d1d1d] hover:scale-120"></i></Link>
            <Link to="/"><i className="ri-shopping-cart-line inline-flex items-center justify-center h-[45px] w-[45px] bg-[#333333] text-white rounded-[10px] text-xl transition-all duration-500 ease-in-out hover:text-[#ffa500] hover:bg-[#1d1d1d] hover:scale-120"></i></Link>

            {/* 👇 ส่วนแก้ไขปัญหาทั้งหมด: สร้าง Dropdown ของเราเอง */}
            {isLoggedIn ? (
              <div ref={dropdownRef} className="relative">
                {/* ปุ่มโปรไฟล์สำหรับเปิด/ปิด Dropdown */}
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                  className="h-[45px] w-[45px] bg-[#333333] rounded-[10px] overflow-hidden transition-all duration-500 ease-in-out hover:scale-120 flex justify-center items-center"
                >
                  {profilePicUrl ? (
                    <img src={profilePicUrl} alt="profile" className="w-full h-full object-cover" />
                  ) : (
                    <i className="ri-user-fill text-white text-xl"></i>
                  )}
                </button>

                {/* เมนู Dropdown ที่จะแสดง/ซ่อน */}
                {isDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-[#2a2a2a] rounded-lg shadow-lg p-2 z-50">
                    <Link
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block text-white text-left hover:bg-[#444] p-2 rounded-md transition-colors w-full"
                    >
                      ดูโปรไฟล์
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block text-red-500 text-left hover:bg-[#444] p-2 rounded-md transition-colors w-full mt-1"
                    >
                      ออกจากระบบ
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/Register">
                <i className="ri-user-line inline-flex items-center justify-center h-[45px] w-[45px] bg-[#333333] text-white rounded-[10px] text-xl transition-all duration-500 ease-in-out hover:text-[#ffa500] hover:bg-[#1d1d1d] hover:scale-120"></i>
              </Link>
            )}

            <div className={`text-4xl h-[45px] w-[45px] text-white bg-[#333333] items-center justify-center rounded-[10px] ml-2.5 z-[10001] cursor-pointer hidden max-[1160px]:inline-flex`} onClick={toggleMenu}>
                <i className={`bx bx-menu ${menuOpen}`}></i>
            </div>
        </div>
      </header>
    </div>
  );
}