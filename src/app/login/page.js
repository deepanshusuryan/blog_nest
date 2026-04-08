import { PublicRoute } from "@/common/ProtectedRoutes";
import LoginForm from "@/views/pages/login/loginForm";

const Login = () => {
    return (
        <PublicRoute>
            <LoginForm />
        </PublicRoute>
    );
};

export default Login;