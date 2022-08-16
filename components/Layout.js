import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <>
      <MobileNav />
      <DesktopNav />
      {children}
      <Footer />
    </>
  );
}
