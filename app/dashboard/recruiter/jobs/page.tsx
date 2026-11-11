import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import ManageJobTable  from '@/app/component/dashboard/manageJobTable';
import { getJobs } from '@/lib/api/jobs';

const manageJobPage =async () => {

    const jobs = await getJobs()
    return (
        <main className="min-h-screen bg-black text-white">

      <section className="mx-auto w-full max-w-[1450px] px-5 py-7 lg:px-8">

        {/* Page Header */}
        <div className="mb-7 flex items-start justify-between gap-5">

          <div>

            <div className="mb-2 flex items-center gap-2 text-[10px] text-gray-600">
              <span>Manage Jobs</span>
              <span>›</span>
              <span className="text-gray-500">
                Job Listings & Postings
              </span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">
              Manage Job Posts
            </h1>

            <p className="mt-1.5 text-xs text-gray-600">
              Review your job listings and update your
              job posting details.
            </p>

          </div>


          <Link href="/dashboard/add-job">

            <Button
              className="h-9 rounded-lg bg-[#7047ff] px-4 text-[11px] text-white shadow-lg shadow-[#7047ff]/20 hover:bg-[#805bff]"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              New Job Post
            </Button>

          </Link>

        </div>


        {/* Job Table */}
        <ManageJobTable jobs={jobs}  />

      </section>

    </main>
    );
};

export default manageJobPage;