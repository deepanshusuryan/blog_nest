import "./globals.css";
import ClientProviders from "./ClientProviders";

const themeScript = `
(function() {
  const themes = {
    amber:  { "--color-bg":"#F5F0E8","--color-surface":"#FDFAF5","--color-ink":"#1A1410","--color-ink-light":"#3D2E24","--color-muted":"#7A6F62","--color-border":"#E0D8CC","--color-amber":"#C8871A","--color-amber-soft":"#FFF8EE" },
    green:  { "--color-bg":"#EDF4EE","--color-surface":"#F6FAF6","--color-ink":"#111A12","--color-ink-light":"#243D27","--color-muted":"#607A63","--color-border":"#C9DFC9","--color-amber":"#2E7D52","--color-amber-soft":"#EAF6EE" },
    blue:   { "--color-bg":"#EDF2F8","--color-surface":"#F5F8FD","--color-ink":"#101828","--color-ink-light":"#1E3A5F","--color-muted":"#5A7090","--color-border":"#C8D8EC","--color-amber":"#2563EB","--color-amber-soft":"#EFF4FF" },
    pink:   { "--color-bg":"#FAF0F4","--color-surface":"#FDF6F9","--color-ink":"#1A0F14","--color-ink-light":"#4A2035","--color-muted":"#8A5A6A","--color-border":"#EDDDE5","--color-amber":"#C2185B","--color-amber-soft":"#FEF0F6" },
    white:  { "--color-bg":"#F8F8F8","--color-surface":"#FFFFFF","--color-ink":"#111111","--color-ink-light":"#333333","--color-muted":"#888888","--color-border":"#E2E2E2","--color-amber":"#555555","--color-amber-soft":"#F2F2F2" },
    brown:  { "--color-bg":"#F0E8DF","--color-surface":"#FAF4EE","--color-ink":"#1C1008","--color-ink-light":"#3D2210","--color-muted":"#8A6A50","--color-border":"#DDD0C0","--color-amber":"#8B4513","--color-amber-soft":"#FAF0E6" },
  };
  try {
    const saved = localStorage.getItem("blognest-theme") || "amber";
    const vars = themes[saved] || themes.amber;
    const root = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  } catch(e) {}
})();
`;

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
            <body>
                <ClientProviders>
                    {children}
                </ClientProviders>
            </body>
        </html>
    );
}