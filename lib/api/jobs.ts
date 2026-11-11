const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const getJobs = async(query="")=>{
    const res = await fetch (`${BASE_URL}/jobs?${query}`,{
        cache:"no-store"
    })
    if (!res.ok) {
  throw new Error("Failed to fetch jobs");
}
    return res.json()
}

export const deleteJob =async (jobId:string)=>{

    const res = await fetch(`${BASE_URL}/jobs/${jobId}`,{
        method:"Delete",
    })
    return res.json();

}