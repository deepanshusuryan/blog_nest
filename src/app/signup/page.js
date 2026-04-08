import { PublicRoute } from "@/common/ProtectedRoutes";
import SignUpForm from "@/views/pages/signup/signUpForm";

const SignUp = () => {
    return (
        <PublicRoute>
            <SignUpForm />
        </PublicRoute>
    );
};

export default SignUp;