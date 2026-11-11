"use client";

import { useState } from "react";
import {  BriefcaseBusiness, CalendarDays, MapPin, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createJob } from "@/lib/actions";


// Section Heading

function SectionHeading({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">

      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#7047ff]/10 text-[10px] font-semibold text-[#8b6cff]">
        {number}
      </div>

      <h2 className="text-sm font-semibold text-gray-200">
        {title}
      </h2>

    </div>
  );
}

// Form Field

function FormField({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">

      <Label className="text-xs font-medium text-gray-300">
        {label}

        {required && (
          <span className="ml-1 text-[#8b6cff]">
            *
          </span>
        )}
      </Label>

      {children}

    </div>
  );
}

export type JobFormData = {
  jobTitle: string;
  companyName: string;
  category:
    | "Engineering & Tech"
    | "Design & Creative"
    | "Marketing"
    | "Human Resources";
  

  jobType:
    | "Full-time"
    | "Part-time"
    | "Contract"
    | "Internship";

  location: string;
  deadline: string;
  minSalary: number;
  maxSalary: number;

  frequency:
    | "Per hour"
    | "Per month"
    | "Per year";

  remote: boolean;
  responsibilities: string;
  requirements: string;
  description: string;
};




const AddNewJobForm = () => {
    const [jobType, setJobType] =useState("Full-time");

  const [isRemote, setIsRemote] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting)return;
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
  
    const jobData: JobFormData = {
      jobTitle: formData.get("jobTitle")?.toString() || "",

      companyName:
        formData.get("companyName")?.toString() || "",

      category:
        formData.get("category")?.toString() as JobFormData["category"],

       jobType:  jobType as JobFormData["jobType"],

      location:
        formData.get("location")?.toString() || "",

      deadline:
        formData.get("deadline")?.toString() || "",

      minSalary:
        Number(formData.get("minSalary")) || 0,

      maxSalary:
        Number(formData.get("maxSalary")) || 0,

      frequency:
        formData.get("frequency")?.toString() as JobFormData["frequency"],

      remote: isRemote,

      responsibilities:
        formData.get("responsibilities")?.toString() || "",

      requirements:
        formData.get("requirements")?.toString() || "",

      description:
        formData.get("description")?.toString() || "",
    };

     

  
 

   try {
      const result = await createJob(jobData);

      console.log("Job created:", result);

      // success toast here
    } catch (error) {
      console.error("Failed to create job:", error);

      // error toast here
    } finally {
      setIsSubmitting(false);
    }
  };



    return (
        <div>
              <form onSubmit={handleSubmit} className="space-y-5">

      {/* ==============================
          1. BASIC INFORMATION
      =============================== */}
      <section className="rounded-xl border border-white/10 bg-[#111113] p-5 sm:p-6">

        <SectionHeading
          number="1"
          title="Basic Information"
        />

        <div className="mt-6 space-y-5">

          {/* Job Title */}
          <FormField label="Job Title" required>
            <Input
              name="jobTitle"
              placeholder="e.g. Frontend Developer"
              className="h-10 border-white/10 bg-white/[0.035] text-sm text-white placeholder:text-gray-600 focus-visible:border-Primary focus-visible:ring-Primary/20"
            />
          </FormField>

          {/* Company + Category */}
          <div className="grid gap-5 md:grid-cols-2">

            <FormField label="Company Name" required>
              <Input
                name="companyName"
                placeholder="e.g. HireLoop"
                className="h-10 border-white/10 bg-white/[0.035] text-sm text-white placeholder:text-gray-600 focus-visible:border-Primary focus-visible:ring-Primary/20"
              />
            </FormField>

            <FormField label="Job Category" required>
              <Select name="category">
                <SelectTrigger className="h-10 border-white/10 bg-white/[0.035] text-sm text-gray-300 focus:border-Primary focus:ring-Primary/20">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent className="border-white/10 bg-[#18181b] text-white">
                  <SelectItem value="engineering">
                    Engineering & Tech
                  </SelectItem>

                  <SelectItem value="design">
                    Design & Creative
                  </SelectItem>

                  <SelectItem value="marketing">
                    Marketing
                  </SelectItem>

                  <SelectItem value="hr">
                    Human Resources
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormField>

          </div>

          {/* Job Type */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-300">
              Job Type <span className="text-primary">*</span>
            </Label>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">

              {[
                "Full-time",
                "Part-time",
                "Contract",
                "Internship",
              ].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setJobType(type)}
                  className={`h-9 rounded-md border text-xs font-medium transition ${
                    jobType === type
                      ? "border-primary/70 bg-primary/15 text-white"
                      : "border-white/[0.07] bg-white/2.5 text-gray-500 hover:border-white/15 hover:text-gray-300"
                  }`}
                >
                  {type}
                </button>
              ))}

            </div>
          </div>

        </div>
      </section>


      {/* ==============================
          2. LOCATION & COMPENSATION
      =============================== */}
      <section className="rounded-xl border border-white/10 bg-[#111113] p-5 sm:p-6">

        <SectionHeading
          number="2"
          title="Location, Compensation & Timeline"
        />

        <div className="mt-6 space-y-5">

          {/* Remote */}
          <div className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-white/2.5 px-4 py-3">

            <div className="flex items-center gap-3">

              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                <BriefcaseBusiness className="h-4 w-4 text-primary" />
              </div>

              <div>
                <p className="text-xs font-medium text-gray-200">
                  Remote Work Allowed
                </p>

                <p className="mt-0.5 text-[10px] text-gray-600">
                  Enable worldwide or distributed applications
                </p>
              </div>

            </div>

            <Switch
              checked={isRemote}
              onCheckedChange={setIsRemote}
              className="data-[state=checked]:bg-primary"
            />

          </div>


          {/* Location + Deadline */}
          <div className="grid gap-5 md:grid-cols-2">

            <FormField label="Job Location" required>
              <div className="relative">

                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />

                <Input
                  name="location"
                  placeholder="e.g. New York, USA"
                  className="h-10 border-white/10 bg-white/[0.035] pl-9 text-sm text-white placeholder:text-gray-600 focus-visible:border-primary focus-visible:ring-primary/20"
                />

              </div>
            </FormField>


            <FormField label="Application Deadline" required>
              <div className="relative">

                <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />

                <Input
                  type="date"
                  name="deadline"
                  className="h-10 border-white/10 bg-white/[0.035] pl-9 text-sm text-gray-300 focus-visible:border-primary focus-visible:ring-primary/20"
                />

              </div>
            </FormField>

          </div>


          {/* Salary */}
          <div className="grid gap-4 md:grid-cols-3">

            <FormField label="Min Salary / Rate">
              <Input
                type="number"
                name="minSalary"
                placeholder="$25"
                className="h-10 border-white/10 bg-white/[0.035] text-sm text-white placeholder:text-gray-600 focus-visible:border-primary focus-visible:ring-primary/20"
              />
            </FormField>


            <FormField label="Max Salary / Rate">
              <Input
                type="number"
                name="maxSalary"
                placeholder="$40"
                className="h-10 border-white/10 bg-white/[0.035] text-sm text-white placeholder:text-gray-600 focus-visible:border-primary focus-visible:ring-primary/20"
              />
            </FormField>


            <FormField label="Frequency">

              <Select name="frequency" defaultValue="hour">

                <SelectTrigger className="h-10 border-white/10 bg-white/[0.035] text-sm text-gray-300">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent className="border-white/10 bg-[#18181b] text-white">

                  <SelectItem value="hour">
                    Per hour
                  </SelectItem>

                  <SelectItem value="month">
                    Per month
                  </SelectItem>

                  <SelectItem value="year">
                    Per year
                  </SelectItem>

                </SelectContent>

              </Select>

            </FormField>

          </div>

        </div>
      </section>


      {/* ==============================
          3. RESPONSIBILITIES
      =============================== */}
      <section className="rounded-xl border border-white/10 bg-[#111113] p-5 sm:p-6">

        <SectionHeading
          number="3"
          title="Responsibilities & Requirements"
        />

        <div className="mt-6 space-y-5">

          <FormField
            label="Key Responsibilities"
            required
          >

            <Textarea
              name="responsibilities"
              placeholder="Describe the responsibilities of this role..."
              className="min-h-32.5 resize-none border-white/10 bg-white/[0.035] text-sm leading-6 text-white placeholder:text-gray-600 focus-visible:border-[#7047ff] focus-visible:ring-[#7047ff]/20"
            />

          </FormField>


          <FormField
            label="Qualifications & Requirements"
            required
          >

            <Textarea
              name="requirements"
              placeholder="Describe the required skills, experience and qualifications..."
              className="min-h-32.5 resize-none border-white/10 bg-white/[0.035] text-sm leading-6 text-white placeholder:text-gray-600 focus-visible:border-[#7047ff] focus-visible:ring-[#7047ff]/20"
            />

          </FormField>

        </div>

      </section>


      {/* ==============================
          4. ADDITIONAL INFORMATION
      =============================== */}
      <section className="rounded-xl border border-white/10 bg-[#111113] p-5 sm:p-6">

        <SectionHeading
          number="4"
          title="Additional Information"
        />

        <div className="mt-6 space-y-5">

          <FormField label="Job Description">

            <Textarea
              name="description"
              placeholder="Add any additional information candidates should know..."
              className="min-h-32.5 resize-none border-white/10 bg-white/[0.035] text-sm leading-6 text-white placeholder:text-gray-600 focus-visible:border-[#7047ff] focus-visible:ring-[#7047ff]/20"
            />

          </FormField>


          {/* <FormField label="Application URL">

            <Input
              type="url"
              name="applicationUrl"
              placeholder="https://example.com/careers"
              className="h-10 border-white/10 bg-white/[0.035] text-sm text-white placeholder:text-gray-600 focus-visible:border-[#7047ff] focus-visible:ring-[#7047ff]/20"
            />

          </FormField> */}

        </div>

      </section>


      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-white/6 pt-6 sm:flex-row sm:items-center sm:justify-end">

          <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          className="border-white/10 bg-white/2 text-gray-300 hover:bg-white/6 hover:text-white"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary px-6 text-white shadow-lg shadow-Primary 7047ff]/20 hover:bg-Primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Publishing...
            </>
          ) : (
            <>
              Publish Job
              <Send className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

      </div>

    </form>
            
        </div>
    );
};


export default AddNewJobForm;