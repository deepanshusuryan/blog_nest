"use client";
import { AuthProvider } from "@/common/AuthContext";
import { Layout } from "@/common/layout";
import { ToastContainer } from "react-toastify";

const ClientProviders = ({ children }) => {
    return (
        <AuthProvider>
            <Layout>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    theme="colored"
                />
                {children}
            </Layout>
        </AuthProvider>
    );
};

export default ClientProviders;