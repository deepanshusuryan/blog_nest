import Blog from "@/views/pages/blog/view/index";

const page= async ({params})=>{
    const { id } =await params;

    return(
        <div>
            <Blog id={id}/>
        </div>
    )
}

export default page;