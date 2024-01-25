import logo from "assets/logo.svg";

function App() {
  return (
    <div className="h-full bg-black text-white">
      <div>
        <img src={logo} alt="img" style={{ height: "100px" }} />
      </div>
      <div>hello world!</div>
    </div>
  );
}

export default App;
