import { useState } from "react";
import CategoryButtons from "../../components/CategoryButton";
import KakaoMap from "../../components/KakaoMap"; 

const MapPage = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        console.log("선택된 카테고리:", category);
    };

    return (
        <div style={{ position: "relative", width: "100%", height: "100vh" }}>
            {/* 지도 */}
        <KakaoMap />

        {/* 카테고리 버튼 */}
        <CategoryButtons
            selectedCategory={selectedCategory}
            onClick={handleCategoryClick}
            
        />
        </div>
    );
};


export default MapPage;
