import { PublicRoute } from "@/common/ProtectedRoutes";
import LoginForm from "@/views/pages/login";

const Login = () => {
    return (
        <PublicRoute>
            <LoginForm />
        </PublicRoute>
    );
};

export default Login;