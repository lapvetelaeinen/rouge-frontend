import { useState } from "react";
import { useRouter } from "next/router.js";
import Link from "next/link.js";
import PyramidMask from "./svg/PyramidMask";
import Pyramid from "./svg/Pyramid";
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
            fill="url('#myGradient')"
            width="35px"
            height="35px"
            onClick={() => setIsOpen(false)}
          />
        ) : (
          <Bars
            fill="url('#myGradient')"
            width="35px"
            height="35px"
            onClick={() => setIsOpen(true)}
          />
        )}
        <div className="relative" onClick={() => clickLogo()}>
          <Pyramid width="60px" height="100%" className="relative" />
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
                Hem
              </a>
            </Link>
            <Link href="/">
              <a href="" onClick={() => setIsOpen(!isOpen)} className="p-2">
                Biljetter
              </a>
            </Link>
            <Link href="/">
              <a href="" onClick={() => setIsOpen(!isOpen)} className="p-2">
                Schema
              </a>
            </Link>
            <Link href="/">
              <a href="" onClick={() => setIsOpen(!isOpen)} className="p-2">
                Bokningar
              </a>
            </Link>
            <Link href="/">
              <a href="" onClick={() => setIsOpen(!isOpen)} className="p-2">
                Kontakt
              </a>
            </Link>
          </ul>
        </div>
      ) : null}
    </>
  );
}

export default MobileNav;
