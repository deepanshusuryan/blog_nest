"use client";

import { AppBar, Toolbar, Typography, Button } from "@mui/material";

export default function AdminHeader() {

    return (
        <AppBar
            position="static"
            sx={{ background: "#111827" }}
        >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">Admin Dashboard</Typography>
            </Toolbar>
        </AppBar>
    );
}