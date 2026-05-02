import UserBlogs from "@/views/pages/profile/userBlogs";

const page=async({params})=>{
    const {id}=await params;
    return(
        <div>
            <UserBlogs id={id}/>
        </div>
    )
}

export default page;