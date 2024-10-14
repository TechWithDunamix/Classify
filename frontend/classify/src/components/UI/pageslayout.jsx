import Navbar from "../widgets/pagesnavbar";
import Footer from "../widgets/footer";

const PagesLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <div className="w-full">
        <Navbar />
      </div>

      {/* Main content */}
      <div className="flex-grow flex flex-col items-center w-full">
        {children}
      </div>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
};

export default PagesLayout;
