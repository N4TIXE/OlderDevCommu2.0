import Newnav from "../components/newNav";
import { useState } from "react";
import "../../public/nikeAirShoe.png";
import "../../public/ComingSoon.png";
import "../../public/OlderCommuLOGO.png";

const Main = () => {
  //ส่วนนี้ไว้ Update ค่าที่เลือกเกมเป็นส่วนของการ เข้าถึงรูปเกมเเละการ Reset Animation
  const [imageMenu, setImageMenu] = useState("../../public/OlderCommuLOGO.png");
  const [animationKey, setAnimationKey] = useState(0);
  //ชื่อ Default ของเกมเเรก ถ้ากดเลือกเกมอื่นจะ Update เป็นอีกอันทันที เปลี่ยนทั้ง Name , Info , Price , Status
  const [changeName, useChangeName] = useState("Motest");
  const [changeInfo, useChangeInfo] = useState(
    "ยินดีต้อนรับเข้าสู่ Older World! เราต้องการความช่วยเหลือหน่อยหน่ะ พอดีเราต้องการความช่วยเหลือจากพวกคุณมาช่วยในการค้นหาขุนทรัพย์ในตำนานเเละผจญภัยไปกับเราชาว OlderDevCommu!!"
  );
  const [changePrice, useChangePrice] = useState("$Free");
  const [changeStatus, useChangeStatus] = useState("Start Game");
  
  // เพิ่ม State ใหม่เพื่อเก็บ index ของปุ่มที่ถูกเลือก
  const [activeIndex, setActiveIndex] = useState(0); 

  //ข้อมูลจากที่เลือกมาจะเข้าไปอัพเดตข้อมูลในตัวเเปรที่กำหนดของ useState
  const changeNameGame = (input) => useChangeName(input);
  const changeInfoGame = (input) => useChangeInfo(input);
  const changePriceGame = (price, status) => {
    useChangePrice(price);
    useChangeStatus(status);
  };
  //อันนี้ไว้เปลี่ยนรูป MenuGame เเละไว้ reAnimation
  const slider = (anything) => {
    setImageMenu(anything);
    setAnimationKey((reAnimation) => reAnimation + 1);
  };

  // สร้าง array ของข้อมูลเมนูจะได้ไม่ต้องทำซั้าเยอะๆ
  const menuItems = [
    {
      src: "../../public/OlderCommuLOGO.png",
      name: "Motese",
      price: "$Free",
      status: "Start Game",
      info: "ยินดีต้อนรับเข้าสู่ Older World! เราต้องการความช่วยเหลือหน่อยหน่ะ พอดีเราต้องการความช่วยเหลือจากพวกคุณมาช่วยในการค้นหาขุนทรัพย์ในตำนานเเละผจญภัยไปกับเราชาว OlderDevCommu!!",
    },
    {
      src: "../../public/ComingSoon.png",
      name: "Coming soon...",
      price: "Sold out",
      status: "Coming Soon...",
      info: "ในอนาคตพวกเราจะมีนวัตกรรมใหม่ๆ หรือวิดีโอเกมเจ๋งๆ รอพวกคุณมารอเล่นกันอยู่นะ โปรดติดตามรับชมผลงานในอนาคตของพวกเราทั้ง 3 คนด้วยนะครับ🐤",
    },
    {
      src: "../../public/ComingSoon.png",
      name: "Coming soon...",
      price: "Sold out",
      status: "Coming Soon...",
      info: "ในอนาคตพวกเราจะมีนวัตกรรมใหม่ๆ หรือวิดีโอเกมเจ๋งๆ รอพวกคุณมารอเล่นกันอยู่นะ โปรดติดตามรับชมผลงานในอนาคตของพวกเราทั้ง 3 คนด้วยนะครับ🐤",
    },
  ];

  return (
    <div className="p-0 m-0 box-border list-none no-underline">
      <div className="text-white">
        <Newnav />
        {/* Section */}
        <section
          key={animationKey}
          className="py-0 px-[15%] relative h-screen w-full bg-cover bg-center grid grid-cols-2 items-center gap-[10px] max-[1820px]:py-0 max-[1820px]:px-[10%] max-[1160px]:py-[50px] max-[1160px]:px-[8%] max-[1160px]:h-auto max-[1160px]:grid-cols-1 max-[1160px]:gap-5 max-[620px]:py-5 max-[620px]:px-[4%]"
        >
          <div
            className="max-[1160px]:text-center max-[1160px]:pt-[70px]"
            data-aos="zoom-in"
            data-aos-duration="2000"
          >
            <img
              src={imageMenu}
              alt="Nike Air Force 1"
              className="w-[1280px] h-[720px] object-contain transition-all duration-500 ease-in-out hover:scale-103 max-[2370px]:w-[1000px] max-[2370px]:h-auto max-[2370px]:object-contain max-[1990px]:w-[900px] max-[1990px]:h-auto max-[1990px]:object-contain max-[1600px]:w-[650px] max-[1600px]:h-[600px] max-[1600px]:object-contain max-[1370px]:w-[600px] max-[1370px]:h-[550px] max-[1370px]:object-contain max-[1210px]:w-[600px] max-[1160px]:w-[500px] max-[1160px]:h-auto max-[1160px]:max-w-full"
            />
          </div>
          {/* ส่วนของ Hero */}
          <div className="max-[1160px]:text-center">
            <h1
              className="text-[6rem] leading-[1.1] mb-[15px] uppercase max-[1600px]:text-[5rem] max-[600px]:text-[3.2rem]"
              data-aos="fade-right"
              data-aos-duration="1500"
            >
              {changeName}
            </h1>
            <p
              className="w-[80%] max-w-[500px] text-[1rem] text-[#8e8e8e] leading-[30px] mb-5 max-[1600px]:text-[1rem] max-[1160px]:my-2.5 max-[1160px]:mx-auto max-[1160px]:w-[650px] max-[900px]:w-[600px] max-[680px]:w-[500px] max-[600px]:w-87.5"
              data-aos="fade-right"
              data-aos-duration="1500"
            >
              {changeInfo}
            </p>
            <h5
              className="text-[37px] font-semibold tracking-[2px] mb-[35px] max-[1160px]:text-[24px]"
              data-aos="zoom-in"
              data-aos-duration="1400"
            >
              {changePrice}
            </h5>
            <div
              data-aos="flip-down"
              data-aos-duration="800"
              data-aos-delay="200"
            >
              <a
                href="#"
                className="inline-block px-[35px] py-4 text-white bg-[#333333] text-[18px] rounded-[10px] mr-5 transition-all duration-500 ease-in-out hover:bg-[#fff] hover:text-[#111111] max-[620px]:py-3 max-[620px]:px-6"
              >
                {changeStatus}
              </a>
              <a
                href="#"
                className="inline-block text-[20px] text-white border-b-2 border-white transition-all duration-600 ease-in hover:scale-102 hover:translate-y-[-3px]"
              >
                View details
              </a>
            </div>
          </div>
        </section>
        {/* Menu ซ้าย */}
        <div className="absolute top-[50%] left-[9%] -translate-y-[50%] flex flex-col items-center gap-[3rem] max-[1820px]:left-[4%] max-[600px]:gap-[18px]">
          {menuItems.map((item, index) => (
            <div
              key={index}
              data-aos="zoom-in-right"
              data-aos-duration="1500"
            >
              <li className={`list-none h-[90px] w-[90px] rounded-full inline-flex items-center justify-center bg-[#202020] border border-[#333333] cursor-pointer hover:bg-white hover:scale-[1.2] hover:-translate-y-[7px] hover:transition-all hover:duration-500 hover:ease-in-out max-[1600px]:h-[70px] max-[1600px]:w-[70px] max-[1160px]:h-[60px] max-[1160px]:w-[60px] max-[620px]:h-12.5 max-[620px]:w-12.5 ${activeIndex === index ? 'border-white border-b-3':'border-none'}`}>
                <img
                  src={item.src}
                  alt={item.name}
                  className="h-auto max-w-full"
                  onClick={() => {
                    setActiveIndex(index);
                    slider(item.src);
                    changeNameGame(item.name);
                    changePriceGame(item.price, item.status);
                    changeInfoGame(item.info);
                  }}
                />
              </li>
            </div>
          ))}
        </div>

        <a
          href="#"
          className="absolute bottom-[70px] right-[9%] max-[1820px]:right-[3%] max-[1160px]:hidden"
          data-aos="zoom-in-left"
          data-aos-duration="1500"
        >
          <i className="ri-scroll-to-bottom-line text-[20px] text-white bg-[#333333] p-[10px] rounded-[2rem] transition-all duration-500 ease-in-out hover:bg-white hover:text-[#111111]"></i>
        </a>
      </div>
    </div>
  );
};

export default Main;