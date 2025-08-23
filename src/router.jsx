// router.jsx
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import RootLayout from "./layouts/RootLayout";  

import HomePage from "./pages/Home/HomePage";    
import SurveyPage from "./pages/Home/SurveyPage";
import SurveyDetail from "./pages/Home/SurveyDetail";
import WritePage from "./pages/Write/WritePage";
import PostPreview from "./pages/Write/PostPreview";
import MapPage from "./pages/Map/MapPage";
import BoardPage from "./pages/Board/BoardPage";
import NewsPage from "./pages/News/NewsPage";
import AdminPost from "./pages/Write/AdminPost";



const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            { path: "/", element: <HomePage /> },
            { path: "/survey", element: <SurveyPage />},
            { path: "/write/admin", element: <AdminPost />},
            { path: "/survey/:id", element: <SurveyDetail />},
            { path: "/post", element: <WritePage /> },
            { path: "/post/preview", element: <PostPreview /> },
            { path: "/map", element: <MapPage /> },
            { path: "/board", element: <BoardPage /> },
            { path: "/news", element: <NewsPage /> },
        ],
        },
]);

export default router;
