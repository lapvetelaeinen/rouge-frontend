import { useState } from "react";
import { useRouter } from "next/router.js";
import Link from "next/link.js";
import PyramidMask from "./svg/PyramidMask";
import Bars from "./svg/Bars";
import Times from "./svg/Times";
import Ticket from "./svg/Ticket";

function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const clickLogo = () => {
    router.push("/");
  };

  return (
    <>
      <div className="bg-neutral-900 flex justify-between items-center py-3 px-4 md:hidden">
        {isOpen ? (
          <Times
            fill="url('#myGradient2')"
            width="35px"
            height="35px"
            onClick={() => setIsOpen(!isOpen)}
          />
        ) : (
          <Bars
            fill="url('#myGradient2')"
            width="35px"
            height="35px"
            onClick={() => setIsOpen(!isOpen)}
          />
        )}
        <div className="relative" onClick={() => clickLogo()}>
          <div className="absolute bg-[url('../assets/img/gradient.png')] w-[58px] h-full text-center animate-blob" />
          <PyramidMask width="60px" height="100%" className="relative" />
        </div>
        <Ticket
          fill="url('#myGradient')"
          width="35px"
          height="35px"
          onClick={() => router.push("/#tickets")}
        />
      </div>
      {isOpen ? (
        <div className="bg-neutral-900 h-[100vh]">
          <ul className="flex flex-col font-appareo text-4xl text-neutral-300 pt-10 pl-4">
            <Link href="/">
              <a href="" onClick={() => setIsOpen(!isOpen)} className="p-2">
                Home
              </a>
            </Link>
            <Link href="/">
              <a href="" onClick={() => setIsOpen(!isOpen)} className="p-2">
                Tickets
              </a>
            </Link>
            <Link href="/">
              <a href="" onClick={() => setIsOpen(!isOpen)} className="p-2">
                Schedule
              </a>
            </Link>
            <Link href="/">
              <a href="" onClick={() => setIsOpen(!isOpen)} className="p-2">
                Contact
              </a>
            </Link>
          </ul>
        </div>
      ) : null}
    </>
  );
}

export default MobileNav;
