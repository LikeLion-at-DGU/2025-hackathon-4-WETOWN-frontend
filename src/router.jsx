// router.jsx
import { createBrowserRouter } from 'react-router-dom';

import HomePage from "./pages/Home/HomePage";    
import SurveyPage from "./pages/Home/SurveyPage";
import SurveyDetail from "./pages/Home/SurveyDetail";
import WritePage from "./pages/Write/WritePage";
import PostPreview from "./pages/Write/PostPreview";
import MapPage from "./pages/Map/MapPage";
import BoardPage from "./pages/Board/BoardPage";
import NewsPage from "./pages/News/NewsPage";
import AdminPost from "./pages/Write/AdminPost";
import RootLayout from './layouts/RootLayout';
import NewsDetailPage from "./pages/News/NewsDetailPage";
import DetailPage from "./pages/DetailPage/DetailPage";



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
            { path: "/news/:id", element: <NewsDetailPage /> },
            { path: "/detail/:postId", element: <DetailPage /> },
        ],
        },
]);

export default router;
