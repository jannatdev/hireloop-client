"use client";

import { useMemo, useState, type FormEvent } from "react";
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Job } from "../dashboard/manageJobTable";
import { JobCard } from "./job-card";

const PAGE_SIZE = 6;

// Every group is a single-select radio list: at most one active value per group.
const FILTER_GROUPS = [
  { key: "jobType", label: "Job Type" },
  { key: "category", label: "Category" },
  { key: "jobTitle", label: "Job Title" },
] as const;

type FilterKey = (typeof FILTER_GROUPS)[number]["key"];

// Selecting this clears the group's filter.
const ALL_OPTION = "";

const FILTER_FIELD: Record<FilterKey, (job: Job) => string> = {
  jobType: (job) => job.jobType,
  category: (job) => job.category,
  jobTitle: (job) => job.jobTitle,
};

type GroupCounts = { all: number; values: Record<string, number> };

function emptyGroupCounts(): GroupCounts {
  return { all: 0, values: {} };
}

function matchesTerm(job: Job, term: string) {
  if (!term) return true;

  return [
    job.jobTitle,
    job.companyName,
    job.location,
    job.category,
    job.description,
  ].some((field) => field?.toLowerCase().includes(term));
}

// Every option a group offers. Job types and categories are fixed lists so all
// of them stay selectable even while the database has no matching rows; job
// titles are free-form, so that group is built entirely from the data.
// Category values are the raw values the post-job form stores ("engineering").
const STATIC_OPTIONS: Record<FilterKey, { value: string; label: string }[]> = {
  jobType: [
    { value: "Full-time", label: "Full-time" },
    { value: "Part-time", label: "Part-time" },
    { value: "Contract", label: "Contract" },
    { value: "Internship", label: "Internship" },
  ],
  category: [
    { value: "engineering", label: "Engineering & Tech" },
    { value: "design", label: "Design & Creative" },
    { value: "marketing", label: "Marketing" },
    { value: "hr", label: "Human Resources" },
  ],
  jobTitle: [],
};

type FilterOptionValue = { value: string; label: string };

// Structured fields are stored lowercase ("engineering"); job titles are shown
// exactly as authored.
function displayLabel(key: FilterKey, value: string) {
  if (key === "jobTitle") return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildOptions(jobs: Job[], key: FilterKey): FilterOptionValue[] {
  const field = FILTER_FIELD[key];
  const inData = new Map<string, number>();

  for (const job of jobs) {
    const value = field(job);
    if (!value) continue;
    inData.set(value, (inData.get(value) ?? 0) + 1);
  }

  const options = STATIC_OPTIONS[key].map((option) => ({ ...option }));
  const known = new Set(options.map((option) => option.value));

  // A value that exists in the data but not in the static list still needs a
  // row, otherwise those jobs could never be selected.
  const extras = [...inData.entries()]
    .filter(([value]) => !known.has(value))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([value]) => ({ value, label: displayLabel(key, value) }));

  return [...options, ...extras];
}

const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "salary-desc", label: "Salary: High to Low" },
  { value: "salary-asc", label: "Salary: Low to High" },
  { value: "title", label: "Title: A to Z" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["value"];

// Base UI resolves the closed trigger label from the `items` map on Select,
// otherwise it falls back to the raw value ("recent").
const SORT_LABELS: Record<string, string> = Object.fromEntries(
  SORT_OPTIONS.map((option) => [option.value, option.label])
);

function formatCount(count: number) {
  if (count < 1000) return `${count}`;

  const thousands = Math.round((count / 1000) * 10) / 10;
  return Number.isInteger(thousands)
    ? `${thousands}k`
    : `${thousands.toFixed(1)}k`;
}

function pageItems(current: number, total: number): (number | "gap")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const items: (number | "gap")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 2);

  if (start > 2) items.push("gap");
  for (let page = start; page <= end; page++) items.push(page);
  if (end < total - 1) items.push("gap");

  items.push(total);
  return items;
}

function FilterOption({
  value,
  label,
  count,
}: {
  value: string;
  label: string;
  count: number;
}) {
  return (
    <label
      title={value || undefined}
      className="flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-1.5 text-sm text-neutral-300 transition-colors hover:bg-white/[0.04]"
    >
      <RadioGroupItem value={value} />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <span className="text-xs tabular-nums text-muted-foreground">
        {formatCount(count)}
      </span>
    </label>
  );
}

function BrowseJobsView({
  jobs,
  initialQuery = "",
}: {
  jobs: Job[];
  initialQuery?: string;
}) {
  const [input, setInput] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<Record<FilterKey, string>>({
    jobType: ALL_OPTION,
    category: ALL_OPTION,
    jobTitle: ALL_OPTION,
  });
  const [sort, setSort] = useState<SortKey>("recent");
  const [page, setPage] = useState(1);

  const optionsByGroup = useMemo(() => {
    const options = {} as Record<FilterKey, FilterOptionValue[]>;
    for (const group of FILTER_GROUPS) {
      options[group.key] = buildOptions(jobs, group.key);
    }
    return options;
  }, [jobs]);

  // Faceted counts: each group is counted with the *other* groups' filters
  // applied, so the numbers stay truthful as the results narrow.
  const countsByGroup = useMemo(() => {
    const term = query.trim().toLowerCase();
    const counts: Record<FilterKey, GroupCounts> = {
      jobType: emptyGroupCounts(),
      category: emptyGroupCounts(),
      jobTitle: emptyGroupCounts(),
    };

    for (const job of jobs) {
      for (const group of FILTER_GROUPS) {
        if (
          group.key !== "jobType" &&
          filters.jobType !== ALL_OPTION &&
          job.jobType !== filters.jobType
        ) {
          continue;
        }
        if (
          group.key !== "category" &&
          filters.category !== ALL_OPTION &&
          job.category !== filters.category
        ) {
          continue;
        }
        if (
          group.key !== "jobTitle" &&
          filters.jobTitle !== ALL_OPTION &&
          job.jobTitle !== filters.jobTitle
        ) {
          continue;
        }
        if (!matchesTerm(job, term)) continue;

        const bucket = counts[group.key];
        bucket.all += 1;
        const value = FILTER_FIELD[group.key](job);
        bucket.values[value] = (bucket.values[value] ?? 0) + 1;
      }
    }

    return counts;
  }, [jobs, filters, query]);

  const filteredJobs = useMemo(() => {
    const term = query.trim().toLowerCase();

    const list = jobs.filter((job) => {
      if (filters.jobType !== ALL_OPTION && job.jobType !== filters.jobType) {
        return false;
      }
      if (filters.category !== ALL_OPTION && job.category !== filters.category) {
        return false;
      }
      if (filters.jobTitle !== ALL_OPTION && job.jobTitle !== filters.jobTitle) {
        return false;
      }

      return matchesTerm(job, term);
    });

    list.sort((a, b) => {
      switch (sort) {
        case "salary-desc":
          return b.maxSalary - a.maxSalary;
        case "salary-asc":
          return a.minSalary - b.minSalary;
        case "title":
          return a.jobTitle.localeCompare(b.jobTitle);
        default:
          return b._id.localeCompare(a._id);
      }
    });

    return list;
  }, [jobs, query, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleJobs = filteredJobs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setQuery(input);
    setPage(1);
  }

  function setFilter(key: FilterKey, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-[1450px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 rounded-xl border border-white/[0.07] bg-[#111113] p-3 sm:flex-row sm:items-center sm:gap-4"
        >
          <div className="flex flex-1 items-center gap-2.5 px-2">
            <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
            <Input
              type="search"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Search by job title, keywords..."
              aria-label="Search by job title, keywords"
              className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 dark:bg-transparent md:text-sm"
            />
          </div>

          <Button
            type="submit"
            className="h-10 w-full shrink-0 rounded-lg bg-white px-6 text-neutral-900 hover:bg-white/90 sm:w-auto"
          >
            Search Jobs
          </Button>
        </form>

        <div className="mt-6 grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-6">
          {/* Filters */}
          <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-y-auto">
            <Card className="gap-0 rounded-xl border border-white/[0.07] bg-[#111113] py-0 ring-0 [--card-spacing:0px]">
              <div className="border-b border-white/[0.07] px-4 py-3.5">
                <h2 className="text-base font-semibold">Filters</h2>
              </div>

              {FILTER_GROUPS.map((group, index) => {
                const options = optionsByGroup[group.key];
                const counts = countsByGroup[group.key];

                return (
                  <div
                    key={group.key}
                    className={cn(
                      "px-4 py-4",
                      index > 0 && "border-t border-white/[0.07]"
                    )}
                  >
                    <h3 className="text-sm font-medium text-white">
                      {group.label}
                    </h3>

                    <RadioGroup
                      value={filters[group.key]}
                      onValueChange={(value) => setFilter(group.key, value)}
                      aria-label={group.label}
                      className="mt-2 gap-0"
                    >
                      <FilterOption
                        value={ALL_OPTION}
                        label="All"
                        count={counts.all}
                      />
                      {options.map((option) => (
                        <FilterOption
                          key={option.value}
                          value={option.value}
                          label={option.label}
                          count={counts.values[option.value] ?? 0}
                        />
                      ))}
                    </RadioGroup>
                  </div>
                );
              })}
            </Card>
          </aside>

          {/* Results */}
          <section className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-lg font-semibold tracking-tight">
                Found {filteredJobs.length.toLocaleString("en-US")} Professional{" "}
                {filteredJobs.length === 1 ? "Job" : "Jobs"}
              </h1>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by</span>
                <Select
                  items={SORT_LABELS}
                  value={sort}
                  onValueChange={(value) => {
                    setSort(value as SortKey);
                    setPage(1);
                  }}
                >
                  <SelectTrigger
                    size="sm"
                    className="min-w-[9.5rem] border-white/10 bg-white/[0.04] text-sm dark:bg-white/[0.04] dark:hover:bg-white/[0.06]"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-[#18181b] text-white">
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {visibleJobs.length > 0 ? (
              <div className="mt-4 flex flex-col gap-4">
                {visibleJobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <Card className="mt-4 gap-0 rounded-xl border border-white/[0.07] bg-[#111113] py-0 ring-0 [--card-spacing:0px]">
                <div className="px-6 py-14 text-center">
                  <p className="font-medium text-white">No jobs found</p>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    Try a different search term or clear a filter.
                  </p>
                </div>
              </Card>
            )}

            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      aria-label="Go to previous page"
                      onClick={(event) => {
                        event.preventDefault();
                        setPage((current) => Math.max(1, current - 1));
                      }}
                      className={cn(
                        "border-white/10 text-neutral-300 hover:bg-white/5 hover:text-white dark:hover:bg-white/5",
                        currentPage === 1 && "pointer-events-none opacity-40"
                      )}
                    >
                      <ChevronLeftIcon />
                    </PaginationLink>
                  </PaginationItem>

                  {pageItems(currentPage, totalPages).map((item, index) =>
                    item === "gap" ? (
                      <PaginationItem key={`gap-${index}`}>
                        <span
                          aria-hidden="true"
                          className="flex size-8 items-center justify-center text-sm text-muted-foreground"
                        >
                          …
                        </span>
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={item}>
                        <PaginationLink
                          href="#"
                          isActive={item === currentPage}
                          aria-label={`Go to page ${item}`}
                          onClick={(event) => {
                            event.preventDefault();
                            setPage(item);
                          }}
                          className={cn(
                            "border-white/10 text-neutral-300 hover:bg-white/5 hover:text-white dark:hover:bg-white/5",
                            item === currentPage &&
                              "bg-white text-black hover:bg-white/90 hover:text-black dark:bg-white dark:hover:bg-white/90 dark:hover:text-black"
                          )}
                        >
                          {item}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      aria-label="Go to next page"
                      onClick={(event) => {
                        event.preventDefault();
                        setPage((current) => Math.min(totalPages, current + 1));
                      }}
                      className={cn(
                        "border-white/10 text-neutral-300 hover:bg-white/5 hover:text-white dark:hover:bg-white/5",
                        currentPage === totalPages && "pointer-events-none opacity-40"
                      )}
                    >
                      <ChevronRightIcon />
                    </PaginationLink>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export { BrowseJobsView };
