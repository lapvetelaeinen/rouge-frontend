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
      <div className="bg-neutral-900 py-3 px-8 hidden md:flex justify-between items-center">
        <div className="flex gap-6 justify-between items-center font-appareo text-neutral-300 ">
          <Link href="/">
            <a className="hover:text-violet-300">Hem</a>
          </Link>
          <Link href="/#tickets">
            <a className="hover:text-violet-300">Biljetter</a>
          </Link>
        </div>
        <Ticket
          fill="url('#myGradient')"
          width="35px"
          height="35px"
          onClick={() => router.push("/#tickets")}
        />
      </div>
    </>
  );
}

export default MobileNav;
