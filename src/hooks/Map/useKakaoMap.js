import { useEffect } from "react";

const useKakaoMap = (containerId, posts, onMarkerClick, lat = 37.5585, lng = 127.0002) => {
    useEffect(() => {
        const initMap = () => {
            const container = document.getElementById(containerId);
            if (!container) return;

            const options = {
                center: new window.kakao.maps.LatLng(lat, lng),
                level: 4,
            };
            const map = new window.kakao.maps.Map(container, options);

            posts.forEach((post) => {
                if (!post.latitude || !post.longitude) return;

                const marker = new window.kakao.maps.Marker({
                    position: new window.kakao.maps.LatLng(post.latitude, post.longitude),
                    map,
                });

                // ✅ InfoWindow 대신 클릭 이벤트로 선택된 post 전달
                window.kakao.maps.event.addListener(marker, "click", () => {
                    onMarkerClick(post);
                });
            });
        };

        if (!document.getElementById("kakao-map-sdk")) {
            const script = document.createElement("script");
            script.id = "kakao-map-sdk";
            script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_KEY
                }&autoload=false`;
            script.async = true;
            document.head.appendChild(script);

            script.onload = () => {
                window.kakao.maps.load(initMap);
            };
        } else {
            if (window.kakao && window.kakao.maps) {
                window.kakao.maps.load(initMap);
            }
        }
    }, [containerId, posts, onMarkerClick, lat, lng]);
};

export default useKakaoMap;
