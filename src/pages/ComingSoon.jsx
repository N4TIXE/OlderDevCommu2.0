import Newnav from "../components/newNav";

const ComingSoon = () => {
  return (
    <div>
      <Newnav />
      <div className="flex justify-center items-center h-dvh w-auto flex-col">
        <h1 className="text-[4rem] text-white">Coming Soon...</h1>
        <p className="text-[2rem] text-white">โปรดกลับไปหน้าหลัก</p>
      </div>
    </div>
  );
};

export default ComingSoon;
