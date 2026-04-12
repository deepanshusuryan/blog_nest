"use client";

import { AppBar, Toolbar, Typography, Button } from "@mui/material";
// import { useContext } from "react";
// import { ThemeContext } from "@/common/layout/ThemeContext";

export default function AdminHeader() {
    // const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <AppBar
            position="static"
            sx={{ background: "#111827" }}
        >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">Admin Dashboard</Typography>

                {/* <Button variant="contained" onClick={toggleTheme}>
                    {theme === "dark" ? "Dark" : "Light"}
                </Button> */}
            </Toolbar>
        </AppBar>
    );
}