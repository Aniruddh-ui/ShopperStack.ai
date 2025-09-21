import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Trends from "./pages/Trends";
import Closet from "./pages/Closet";
import Events from "./pages/Events";
import Chat from "./pages/Chat";
import Test from "./pages/Test";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/upload",
                element: <Upload />,
            },
            {
                path: "/trends",
                element: <Trends />,
            },
            {
                path: "/events",
                element: <Events />,
            },
            {
                path: "/closet",
                element: <Closet />,
            },
            {
                path: "/chat",
                element: <Chat />,
            },
            {
                path: "/test",
                element: <Test />,
            },
        ],
    },
]);

export default router;