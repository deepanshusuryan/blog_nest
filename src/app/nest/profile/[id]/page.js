import Profile from "@/views/pages/profile/view";

const page =async ({params}) => {
    const {id}=await params
    return (
        <div>
            <Profile id={id}/>
        </div>
    )
}

export default page;