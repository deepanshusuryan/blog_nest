import Blog from "@/views/pages/blog/viewBlog";

const page= async ({params})=>{
    const { id } =await params;

    return(
        <div>
            <Blog id={id}/>
        </div>
    )
}

export default page;