"use client";

import { useState } from "react";
import {
  BookmarkIcon,
  DollarSignIcon,
  MapPinIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Job } from "../dashboard/manageJobTable";

const SENIOR_TITLE = /\b(senior|lead|principal|staff|head)\b/i;

const EASY_APPLY_CLASS = "bg-emerald-500 text-emerald-950";
const HOT_JOB_CLASS = "bg-amber-400 text-amber-950";
const SENIOR_CLASS = "bg-white/10 text-neutral-200";

function trimNumber(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1);
}

function formatMoney(value: number) {
  if (!Number.isFinite(value) || value <= 0) return null;
  if (value >= 1_000_000) return `$${trimNumber(value / 1_000_000)}M`;
  if (value >= 1_000) return `$${trimNumber(value / 1_000)}k`;
  return `$${trimNumber(value)}`;
}

function salaryLabel(job: Job) {
  const min = formatMoney(job.minSalary);
  const max = formatMoney(job.maxSalary);

  if (min && max) return min === max ? min : `${min} - ${max}`;
  return min ?? max;
}

function isHotJob(deadline?: string) {
  if (!deadline) return false;

  const deadlineTime = new Date(deadline).getTime();
  if (Number.isNaN(deadlineTime)) return false;

  const daysLeft = (deadlineTime - Date.now()) / 86_400_000;
  return daysLeft >= 0 && daysLeft <= 14;
}

type ExtraBadge = { label: string; className: string };

function buildExtraBadges(job: Job) {
  const badges: ExtraBadge[] = [];

  if (job.remote) badges.push({ label: "Easy Apply", className: EASY_APPLY_CLASS });
  if (SENIOR_TITLE.test(job.jobTitle)) badges.push({ label: "Senior", className: SENIOR_CLASS });
  if (isHotJob(job.deadline)) badges.push({ label: "Hot Job", className: HOT_JOB_CLASS });

  return badges.slice(0, 2);
}

function JobCard({ job }: { job: Job }) {
  const [saved, setSaved] = useState(false);

  const salary = salaryLabel(job);
  const extraBadges = buildExtraBadges(job);
  const initial = job.companyName.trim().charAt(0).toUpperCase() || "?";

  return (
    <Card className="gap-0 rounded-xl border border-white/[0.07] bg-[#111113] py-0 ring-0 transition-colors hover:border-white/20 hover:bg-[#161618] [--card-spacing:0px]">
      <div className="flex gap-3.5 p-4 sm:gap-4 sm:p-5">
        <span
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-sm font-semibold text-neutral-300"
        >
          {initial}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-base leading-snug font-semibold text-white">
                {job.jobTitle}
              </h2>

              <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm text-muted-foreground">
                <span className="truncate">{job.companyName}</span>
                <span aria-hidden="true">•</span>
                <span className="inline-flex items-center gap-1">
                  <MapPinIcon className="size-3.5 shrink-0" />
                  {job.location}
                  {job.remote ? " (Remote)" : ""}
                </span>
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={saved ? "Remove saved job" : "Save job"}
              aria-pressed={saved}
              onClick={() => setSaved((value) => !value)}
              className="size-8 shrink-0 rounded-lg text-neutral-500 hover:bg-white/5 hover:text-white dark:hover:bg-white/5"
            >
              <BookmarkIcon
                className={cn("size-4", saved && "fill-indigo-400 text-indigo-400")}
              />
            </Button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {salary && (
              <Badge
                variant="secondary"
                className="h-6 gap-1 rounded-full border border-white/10 bg-white/[0.06] px-2.5 font-normal text-neutral-300"
              >
                <DollarSignIcon className="size-3.5" />
                {salary}
              </Badge>
            )}

            <Badge
              variant="secondary"
              className="h-6 rounded-full border border-white/10 bg-white/[0.06] px-2.5 font-normal text-neutral-300"
            >
              {job.jobType}
            </Badge>

            {extraBadges.map((badge) => (
              <Badge
                key={badge.label}
                variant="secondary"
                className={cn(
                  "h-6 rounded-full px-2.5 font-medium",
                  badge.className
                )}
              >
                {badge.label}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

export { JobCard };
