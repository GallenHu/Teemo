import Setting from "./Setting";

export default function () {
  return (
    <header className="flex justify-between h-[60px] items-center px-[20px] ">
      <div className="h-full"></div>
      <div className="h-full flex items-center">
        <Setting />
      </div>
    </header>
  );
}
