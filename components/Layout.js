import MobileNav from "./MobileNav";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <>
      <MobileNav />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
