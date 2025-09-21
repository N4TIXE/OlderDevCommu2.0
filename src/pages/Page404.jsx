import Newnav from "../components/newNav";

const Page404 = () => {
  return (
    <div>
      <Newnav />
      <div className="flex justify-center items-center h-dvh w-auto flex-col">
        <h1 className="text-[4rem] text-white">404 Not Found</h1>
        <p className="text-[2rem] text-white">โปรดกลับไปหน้าหลัก</p>
      </div>
    </div>
  );
};

export default Page404;
