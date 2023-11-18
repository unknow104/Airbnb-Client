import Routers from "./Router/Routers";
import "./App.css"
import ScrollToTop from "react-scroll-to-top";
function App() {
  return (
    <div className="w-screen mb:mx-6">
      <Routers />
      <ScrollToTop
        smooth
        top={200}
        height={20}
        width={40}
        className="mb:bottom-[6rem] sm:bottom-[6rem] lg:bottom-[80px]"
      />
    </div>
  );
}

export default App;