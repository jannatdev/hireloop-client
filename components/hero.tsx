"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"
import {
  BriefcaseIcon,
  Building2Icon,
  MapPinIcon,
  PartyPopperIcon,
  SearchIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react"

import globe from "@/app/asset/globe.png"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const trendingPositions = [
  "Product Designer",
  "AI Engineering",
  "Dev-ops Engineer",
] as const

const stats = [
  { icon: BriefcaseIcon, value: "50K", label: "Active Jobs" },
  { icon: Building2Icon, value: "12K", label: "Companies" },
  { icon: UsersIcon, value: "2M", label: "Job Seekers" },
  { icon: StarIcon, value: "97%", label: "Satisfaction Rate" },
] as const

function Hero() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState("")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const params = new URLSearchParams()
    if (query.trim()) params.set("q", query.trim())
    if (location.trim()) params.set("location", location.trim())

    const search = params.toString()
    router.push(`/browse-job${search ? `?${search}` : ""}`)
  }

  return (
    <section className="relative isolate overflow-hidden bg-background">
      {/* Ambient glow behind the headline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(99,102,241,0.22),transparent_70%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pt-16 text-center sm:px-6 sm:pt-28 lg:pt-44">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
          <PartyPopperIcon className="size-4 shrink-0 text-orange-400" />
          <span className="text-sm font-semibold text-white">50,000+</span>
          <span className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
            New Jobs This Month
          </span>
        </div>

        {/* Headline */}
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:mt-7 sm:text-5xl lg:text-6xl">
          Find Your Dream Job Today
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          HireLoop connects top talent with world-class companies. Browse
          thousands of curated opportunities and land your next role — faster.
        </p>

        {/* Search bar */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-10 flex w-full max-w-3xl flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.06] p-2 shadow-[0_20px_60px_-20px_rgba(99,102,241,0.45)] backdrop-blur sm:mt-12 sm:flex-row sm:items-center sm:rounded-xl lg:mt-14"
        >
          <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-1 transition-colors focus-within:bg-white/5 sm:rounded-lg">
            <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
            <Input
              type="search"
              name="q"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Job title, skill or company"
              aria-label="Job title, skill or company"
              className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 dark:bg-transparent md:text-sm"
            />
          </div>

          <Separator
            orientation="vertical"
            className="hidden self-center bg-white/10 sm:block"
          />
          <Separator className="bg-white/10 sm:hidden" />

          <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-1 transition-colors focus-within:bg-white/5 sm:rounded-lg">
            <MapPinIcon className="size-4 shrink-0 text-muted-foreground" />
            <Input
              type="search"
              name="location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Location or Remote"
              aria-label="Location or Remote"
              className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 dark:bg-transparent md:text-sm"
            />
          </div>

          <Button
            type="submit"
            aria-label="Search jobs"
            size="icon"
            className="h-11 w-full shrink-0 rounded-xl sm:h-10 sm:w-10"
          >
            <SearchIcon />
          </Button>
        </form>

        {/* Trending positions */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="mr-1 text-xs text-muted-foreground">
            Trending Position
          </span>
          {trendingPositions.map((position) => (
            <Badge
              key={position}
              variant="outline"
              render={
                <button
                  type="button"
                  onClick={() => setQuery(position)}
                />
              }
              className="h-7 cursor-pointer rounded-full border-white/10 bg-white/[0.06] px-3 text-xs font-normal text-neutral-300 transition-colors hover:border-indigo-400/40 hover:bg-indigo-500/10 hover:text-white"
            >
              {position}
            </Badge>
          ))}
        </div>
      </div>

      {/* Globe visual + stats */}
      <div className="relative z-0 mt-10 sm:mt-14">
        <div className="relative mx-auto h-[420px] w-full max-w-6xl sm:h-[520px] lg:h-[640px]">
          <Image
            src={globe}
            alt=""
            aria-hidden="true"
            fill
            preload
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1152px"
            className="object-cover object-[center_58%]"
          />
          {/* Blend the edges of the globe into the page background */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-background to-transparent"
          />

          <div className="absolute inset-x-0 top-[48%] px-5 text-center sm:top-[46%]">
            <p className="text-lg font-semibold text-white sm:text-2xl lg:text-3xl">
              Assisting over 15,000 job seekers
            </p>
            <p className="mt-1 text-lg font-semibold text-white/55 sm:text-2xl lg:text-3xl">
              find their dream positions.
            </p>
          </div>
        </div>

        <div className="relative z-10 mx-auto -mt-16 w-full max-w-6xl px-4 pb-16 sm:-mt-24 sm:px-6 sm:pb-24 lg:-mt-28">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {stats.map(({ icon: Icon, value, label }) => (
              <Card
                key={label}
                className="group gap-4 rounded-2xl border border-white/10 bg-[#0c0c0c]/85 py-0 ring-0 backdrop-blur transition-all hover:-translate-y-1 hover:border-indigo-400/40 hover:bg-[#111111]/90 [--card-spacing:1.25rem] sm:[--card-spacing:1.5rem]"
              >
                <CardContent className="flex flex-col gap-6">
                  <span className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-neutral-200 transition-colors group-hover:border-indigo-400/40 group-hover:text-indigo-300">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                      {value}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export { Hero }
