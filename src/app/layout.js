import { Layout } from "@/common/layout";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/common/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Layout>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            theme="colored"
          />
          <AuthProvider>
            {children}
          </AuthProvider>
        </Layout>
      </body>
    </html>
  );
}
