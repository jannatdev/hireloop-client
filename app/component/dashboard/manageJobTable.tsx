"use client";

import {
  BriefcaseBusiness,
  
  MapPin,
  
  Pencil,
 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JobFormData } from "./addNewJobForm";
import DeleteJob from "./deleteJob";

// export type JobFormData = {
//   jobTitle: string;

//   companyName: string;

//   category:
//     | "Engineering & Tech"
//     | "Design & Creative"
//     | "Marketing"
//     | "Human Resources";

//   jobType:
//     | "Full-time"
//     | "Part-time"
//     | "Contract"
//     | "Internship";

//   location: string;

//   deadline: string;

//   minSalary: number;

//   maxSalary: number;

//   frequency:
//     | "Per hour"
//     | "Per month"
//     | "Per year";

//   remote: boolean;

//   responsibilities: string;

//   requirements: string;

//   description: string;
// };

export type Job = JobFormData & {
  _id: string;
};

// export type ManageJobTable = {
//   jobs: Job[];
//   onEdit?: (job: Job) => void;
//   onDelete?: (jobId: string) => void;
// };


const manageJobTable = ({
  jobs}:{jobs:Job[]}) => {
    return (
            <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#111113]">

      {/* =================================
          TABLE HEADER
      ================================== */}

      <div className="grid grid-cols-[2fr_1.5fr_1fr_1.2fr_1.3fr_1.2fr_110px] items-center gap-4 border-b border-white/[0.07] bg-white/[0.02] px-4 py-3 text-[9px] font-medium uppercase tracking-wider text-gray-500">

        <span>Job Title</span>

        <span>Company & Location</span>

        <span>Job Type</span>

        <span>Salary</span>

        <span>Category</span>

        <span>Deadline</span>

        <span>Actions</span>

      </div>


      {/* =================================
          JOB ROWS
      ================================== */}

      <div className="divide-y divide-white/6">
       {jobs.map((job) => (
        <div
        key={job._id}
        className="grid grid-cols-[2fr_1.5fr_1fr_1.2fr_1.3fr_1.2fr_110px] items-center gap-4 px-4 py-4 transition-colors hover:bg-white/[0.025]"
        >
        {/* Job Title */}
        <div className="flex min-w-0 items-center gap-2">
            <BriefcaseBusiness className="h-4 w-4 shrink-0 text-[#8b6cff]" />
            <div className="min-w-0">
            <p className="truncate text-xs font-medium text-gray-200">
                {job.jobTitle}
            </p>
            <p className="truncate text-[9px] text-[#8b6cff]">
                {job.category}
            </p>
            </div>
        </div>

        {/* Company & Location */}
        <div className="min-w-0">
            <p className="truncate text-[11px] text-gray-300">
            {job.companyName}
            </p>
            <p className="truncate text-[9px] text-gray-600">
            <MapPin className="mr-1 inline h-3 w-3" />
            {job.location}
            {job.remote && " · Remote"}
            </p>
        </div>

        {/* Job Type */}
        <div className="min-w-0">
            <Badge variant="outline" className="whitespace-nowrap border-white/10 bg-white/[0.04] text-[9px] text-gray-400">
            {job.jobType}
            </Badge>
        </div>

        {/* Salary */}
        <div className="min-w-0">
            <p className="whitespace-nowrap text-[10px] text-gray-300">
            {job.minSalary} – {job.maxSalary}
            </p>
            <p className="text-[9px] text-gray-600">
            {job.frequency}
            </p>
        </div>

        {/* Category */}
        <div className="min-w-0">
            <Badge className="max-w-full truncate border-0 bg-[#7047ff]/10 text-[9px] text-[#a28cff]">
            {job.category}
            </Badge>
        </div>

        {/* Deadline */}
        <div className="min-w-0">
            <p className="whitespace-nowrap text-[10px] text-gray-300">
            {job.deadline}
            </p>
            <p className="text-[9px] text-gray-600">
            {new Date(job.deadline) >= new Date()
                ? "Application open"
                : "Deadline passed"}
            </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
            <Button
            size="icon"
            variant="ghost"
          
            className="h-7 w-7 text-[#a28cff] hover:bg-[#7047ff]/10"
            >
            <Pencil className="h-3.5 w-3.5" />
            </Button>

            <DeleteJob job={job}  ></DeleteJob>

            
        </div>
        </div>
      ))}
     </div>



<div className="w-full overflow-x-auto rounded-xl border border-white/[0.07] bg-[#111113]">
  {/* Table header */}
      <div className="min-w-275">
  {/* Job rows */}
  </div>
</div>

</div>
    );
};

export default manageJobTable;