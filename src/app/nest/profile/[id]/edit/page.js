// src/app/nest/profile/[id]/edit/page.js
import ProfileEdit from "@/views/pages/profile/edit"

const page =async ({ params }) => {
    const {id}=await params;

    return <ProfileEdit id={id} />
}

export default page;