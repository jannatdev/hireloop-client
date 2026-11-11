import Image from "next/image"
import Link from "next/link"

import logo from "@/app/asset/logo.png"
import { cn } from "cn"

function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="hireloop home"
      className={cn("flex shrink-0 items-center", className)}
    >
      <Image
        src={logo}
        alt="hireloop"
        loading="eager"
        className="h-8 w-auto sm:h-9"
      />
    </Link>
  )
}

export { Logo }
