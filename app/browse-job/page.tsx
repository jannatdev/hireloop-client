import { getJobs } from "@/lib/api/jobs";
import React from "react";

import { BrowseJobsView } from "../component/browse-job/browse-jobs-view";
import type { Job } from "../component/dashboard/manageJobTable";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

const BrowseJobPage = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const search = await searchParams;

  // Pre-fill the search box when arriving from the landing page hero.
  const initialQuery = [firstValue(search.q), firstValue(search.location)]
    .filter((value): value is string => Boolean(value))
    .join(" ");

  let jobs: Job[] = [];

  try {
    const data = await getJobs();
    jobs = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to load jobs:", error);
  }

  return <BrowseJobsView jobs={jobs} initialQuery={initialQuery} />;
};

export default BrowseJobPage;
