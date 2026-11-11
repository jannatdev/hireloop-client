
import { Trash2, Trash2Icon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

import { Job } from "./manageJobTable";
import { deleteJob } from "@/lib/api/jobs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";




const DeleteJob = ({job}:{job:Job})  => {
  const [open,setOpen]=useState(false)
  const router =useRouter()

  const handleDeleteJob =async()=>{

     try {
    const res = await deleteJob(job._id);

    if (res.deletedCount > 0) {
      setOpen(false);
      toast.success("Job is successfully deleted!");
      router.refresh();
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to delete job!");
  }
};



  


    return (
           <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={<Button
            size="icon"
            variant="destructive"
           
            className="h-7 w-7 text-red-400"
            >
            <Trash2 className="h-3.5 w-3.5" />
            </Button>}
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete chat?</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to permanently delete this chat conversation. 
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteJob} variant="destructive">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    );
};

export default DeleteJob;