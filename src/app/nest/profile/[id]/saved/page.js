import SavedBlogs from "@/views/pages/profile/savedBlogs"

const page=async({params})=>{
    const {id}=await params;
    return(
        <SavedBlogs id={id}/>
    )
}

export default page;