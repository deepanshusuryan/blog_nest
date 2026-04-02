"use client";
import { AuthProvider } from "@/common/AuthContext";
import { Layout } from "@/common/layout";
import store from "@/redux/store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

const ClientProviders = ({ children }) => {
    return (
        <Provider store={store}>
            <AuthProvider>
                <Layout>
                    <ToastContainer position="top-right" autoClose={3000} theme="colored" />
                    {children}
                </Layout>
            </AuthProvider>
        </Provider>
    );
};

export default ClientProviders;