import { JobFormData } from "@/app/component/dashboard/addNewJobForm"


 const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const createJob = async(jobData:JobFormData)=>{
    const res = await fetch(`${BASE_URL}/jobs`,{
        method:"POST",
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify(jobData)
    })
    return  await res.json()
      
    

}