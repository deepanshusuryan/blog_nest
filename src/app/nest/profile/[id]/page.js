import Profile from "@/views/pages/profile/view";

const page = ({ params }) => {
    const id = params.id;
    return (
        <div>
            <Profile id={id}/>
        </div>
    )
}

export default page;