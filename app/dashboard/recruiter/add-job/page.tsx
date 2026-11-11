import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import AddNewJobForm from "@/app/component/dashboard/addNewJobForm";

const AddJobPage = () => {
    return (
           <main className="min-h-screen bg-black text-white">

      {/* Background glow */}
      <div className="pointer-events-none fixed left-1/2 top-0 z-0 h-125 w-175 -translate-x-1/2 rounded-full bg-[#7047ff]/8 blur-[160px]" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/6 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto  h-16 max-w-7xl ">

       

          <Link href="/">
            <Button
              variant="ghost"
              className="text-gray-400 hover:bg-white/5 hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

        </div>
      </header>


      {/* Page */}
      <section className="relative z-10 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Page heading */}
        <div className="mb-8 -mt-10">

          {/* <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">

            <Link
              href="/jobs"
              className="hover:text-gray-300"
            >
              Manage Jobs
            </Link>

            <span>/</span>

            <span className="text-gray-400">
              Create New Job
            </span>

          </div> */}


          <h1 className="text-2xl text-[#7047ff] font-semibold tracking-tight sm:text-3xl">
            Post a New Job
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            Fill in the position specifications to attract qualified
            talent across our network.
          </p>

        </div>


        {/* FORM COMPONENT */}
        <AddNewJobForm></AddNewJobForm>
    

      </section>

    </main>
    );
};

export default AddJobPage;