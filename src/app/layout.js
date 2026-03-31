import "./globals.css";
import ClientProviders from "./ClientProviders";

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <ClientProviders>
                    {children}
                </ClientProviders>
            </body>
        </html>
    );
}