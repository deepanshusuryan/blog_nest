import { PublicRoute } from "@/common/ProtectedRoutes";
import SignUpForm from "@/views/pages/signup";

const SignUp = () => {
    return (
        <PublicRoute>
            <SignUpForm />
        </PublicRoute>
    );
};

export default SignUp;