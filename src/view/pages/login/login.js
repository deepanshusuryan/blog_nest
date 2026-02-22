"use client"

import api from "@/services/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const router = useRouter();
    const [signUpData, setSignUpData] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });
    const handleSignUpChange = (e) => {
        const { name, value } = e.target;
        setSignUpData((prev) => ({
            ...prev, [name]: value
        }))
    }
    const handleSignUpSubmit = async (e) => {
        try {
            e.preventDefault();
            const response = await api.post("/user/create", signUpData);
            console.log("Create User Api response", response);
            if (response.data.success === true) {
                toast.success(response.data.message);
                setIsLogin(false)
                setSignUpData({
                    name: "",
                    email: "",
                    password: ""
                })
            } else {
                toast.warning(response.data.message);
            }

        } catch (error) {
            console.log("Error while creating user");
        }
    }
    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({
            ...prev, [name]: value
        }))
    }
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const response = await api.post("/user/login", loginData);
        if (response.data.success) {
            toast.success(response.data.message);
            localStorage.setItem("accessToken",JSON.stringify(response.data.accessToken));
            router.push("/note");
        }
        else {
            toast.warning(response.data.message);
        }
    }
    console.log("handle Login", loginData);
    return (
        <div className="container">
            {isLogin ? <div className="left">
                <div className="logo">Blog Nest</div>
                <h1>Resgister with us</h1>
                <p className="subtitle">
                    Sign up to create, read and access your blogs, Give your views on other blogs.
                </p>
                <form onSubmit={handleSignUpSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" placeholder="Enter your name" name="name" value={signUpData.name || ""} onChange={handleSignUpChange} />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="text" placeholder="Enter your email" name="email" value={signUpData.email || ""} onChange={handleSignUpChange} />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" placeholder="Enter your password" name="password" value={signUpData.password || ""} onChange={handleSignUpChange} />
                    </div>
                    <button className="signin-btn" type="submit">Sign Up</button>
                </form>
                <div className="divider">OR</div>
                <button className="social-btn">Continue with Google</button>
                <div className="signup">
                    Already have an Account? <a onClick={() => setIsLogin(!isLogin)}>Sign In</a>
                </div>
            </div> : <div className="left">
                <div className="logo">Blog Nest</div>
                <h1>Welcome Back!</h1>
                <p className="subtitle">
                    Sign in to access your dashboard and continue optimizing your QA process.
                </p>
                <form onSubmit={handleLoginSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={loginData.email} placeholder="Enter your email" onChange={handleLoginChange} />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={loginData.password} placeholder="Enter your password" onChange={handleLoginChange} />
                        <div className="forgot">
                            <a href="#">Forgot Password?</a>
                        </div>
                    </div>
                    <button className="signin-btn" type="submit">Sign In</button>
                </form>
                <div className="divider">OR</div>
                <button className="social-btn">Continue with Google</button>
                <div className="signup">
                    Don’t have an Account? <a onClick={() => setIsLogin(!isLogin)}>Sign up</a>
                </div>
            </div>}

            <div className="right">
                <h2>Insights, Stories & Ideas That Inspire</h2>
                <p className="quote">
                    "This blog has become my go-to resource for practical advice and fresh
                    perspectives. Every article is thoughtful, easy to follow, and packed
                    with real value."
                </p>
                <div className="user">
                    <div className="avatar" />
                    <div className="user-info">
                        Emma Richardson
                        <br />
                        <span>Digital Creator & Avid Reader</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;