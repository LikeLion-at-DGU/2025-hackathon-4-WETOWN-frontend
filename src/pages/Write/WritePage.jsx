import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wrap, Section, LabelRow, ChipGroup, Chip, SubNote,
  MapBox, AddressInput, NextFab,

  Field, Input, TextArea, DangerNote,
  UploadGrid, UploadSlot, CameraBadge, RegisterBtn,
  DoneWrap, DoneIcon, DoneText,
  TopInline, BackBtn,

  ViewPostBtn
} from "./write.styled";
import { FiArrowRight, FiCamera, FiChevronLeft, FiMapPin } from "react-icons/fi";
import reportDone from "../../components/assets/reportDone.svg";

// 훅
import useKakaoAddressPicker from "../../hooks/Map/useKakaoAddressPicker";
// API 인스턴스
import instance from "../../apis/instance";

const CATEGORIES = ["불편/민원", "동네 바람", "정보 공유", "자유 의견"];
const AREAS = ["장충동", "명동", "광희동", "약수동", "을지로동", "필동", "회현동", "청구동", "신당동", "황학동"];

const WritePage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState("select");
  const [cat, setCat] = useState("");
  const [area, setArea] = useState("");
  const [addr, setAddr] = useState("");

  // 지도 좌표 (초기: 충무로역 1번 출구)
  const [mapLat, setMapLat] = useState(37.561243);
  const [mapLng, setMapLng] = useState(126.99428);

  // step2
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [images, setImages] = useState([]); // File[]
  const fileRef = useRef(null);

  const [createdPost, setCreatedPost] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const canNext = !!cat && !!area;
  const canSubmit = Boolean(author.trim() && title.trim() && body.trim());

  // Kakao 지도 hook
  const {
    ready, error,
    query,
    suggestions, onChangeQuery, pickSuggestion,
    searchByAddress, setCenter,
    map,
  } = useKakaoAddressPicker({
    containerId: "kakao-map",
    initialLat: mapLat,
    initialLng: mapLng,
    level: 3,
    active: step === "select",
  });

  useEffect(() => {
    if (ready) setCenter(mapLat, mapLng);
  }, [ready, mapLat, mapLng, setCenter]);

  useEffect(() => {
    if (!map) return;
    window.kakao.maps.event.addListener(map, "idle", () => {
      const center = map.getCenter();
      setMapLat(center.getLat());
      setMapLng(center.getLng());
    });
  }, [map]);

  const handleEnterAddress = async (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const r = await searchByAddress();
    if (r) {
      setMapLat(r.lat);
      setMapLng(r.lng);
      setAddr(r.address);
    }
  };

  const handlePick = (item) => {
    const r = pickSuggestion(item);
    setMapLat(r.lat);
    setMapLng(r.lng);
    setAddr(r.address);
  };

  const onPickFiles = (ev) => {
    const files = Array.from(ev.target.files || []).slice(0, Math.max(0, 10 - images.length));
    if (files.length) setImages((prev) => [...prev, ...files]);
    ev.target.value = "";
  };

  const onRemoveImage = (idx) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const goNext = () => {
    if (!canNext) return;
    setStep("compose");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting || !canSubmit) return;

    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("title", title);
      form.append("content", body);
      form.append("writer", author);
      form.append("category", cat);
      form.append("area", area);
      if (addr) form.append("address", addr);
      form.append("latitude", String(mapLat));
      form.append("longitude", String(mapLng));
      if (images[0]) form.append("image", images[0]);

      const res = await instance.post("/posts/", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newPost = res?.data;
      if (!newPost?.id) throw new Error("생성된 게시글 ID가 응답에 없습니다.");
      setCreatedPost(newPost);
      setStep("done");
    } catch (err) {
      console.error("게시글 등록 실패:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // ===== STEP 3 =====
  if (step === "done") {
    return (
      <Wrap>
        <DoneWrap>
          <DoneIcon>
            <img src={reportDone} alt="등록 완료" />
          </DoneIcon>
          <DoneText>
            <b>[ {cat || "동네 소리"} ]</b> 동네 소리가 등록되었습니다.
            <br />
            당신의 한 마디가 우리 동네를 움직입니다.
          </DoneText>

          <ViewPostBtn
            type="button"
            onClick={() => navigate(`/detail/${createdPost.id}`)}
            disabled={!createdPost}
          >
            작성된 글 보기
          </ViewPostBtn>
        </DoneWrap>
      </Wrap>
    );
  }

  // ===== STEP 2 =====
  if (step === "compose") {
    return (
      <Wrap as="form" onSubmit={onSubmit}>
        <Section>
          <TopInline>
            <BackBtn type="button" aria-label="뒤로가기" onClick={() => setStep("select")}>
              <FiChevronLeft />
            </BackBtn>
          </TopInline>

          <Field>
            <label>작성자</label>
            <Input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="이름 / 별명 입력"
            />
          </Field>

          <Field>
            <label>제목</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력해주세요."
            />
          </Field>

          <Field>
            <label>
              동네 소리를 작성해주세요.{" "}
              <DangerNote as="span">작성 이후 수정은 불가합니다.</DangerNote>
            </label>
            <TextArea
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="작성 이후 수정은 불가합니다."
            />
          </Field>

          <Field>
            <label>사진</label>
            <UploadGrid>
              <UploadSlot as="button" type="button" onClick={() => fileRef.current?.click()}>
                <CameraBadge>
                  <FiCamera />
                  <span>{images.length}/10</span>
                </CameraBadge>
              </UploadSlot>

              {images.map((f, i) => {
                const url = URL.createObjectURL(f);
                return (
                  <UploadSlot key={i} title="클릭해서 삭제" onClick={() => onRemoveImage(i)}>
                    <img src={url} alt={`첨부${i + 1}`} />
                  </UploadSlot>
                );
              })}

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={onPickFiles}
              />
            </UploadGrid>
          </Field>

          <RegisterBtn
            type="submit"
            disabled={!canSubmit || submitting}
            $fabLikeDisabled
            title={
              !canSubmit
                ? "작성자/제목/내용을 모두 입력하면 등록할 수 있어요"
                : (submitting ? "등록 중…" : "등록")
            }
            aria-disabled={!canSubmit || submitting}
          >
            {submitting ? "등록 중…" : "등록"}
          </RegisterBtn>
        </Section>
      </Wrap>
    );
  }

  // ===== STEP 1 =====
  return (
    <Wrap>
      <Section>
        <LabelRow>어떤 종류의 글인가요 ?</LabelRow>
        <ChipGroup>
          {CATEGORIES.map((c) => (
            <Chip
              key={c}
              $active={cat === c}
              onClick={() => setCat(prev => (prev === c ? "" : c))}
            >
              {c}
            </Chip>
          ))}
        </ChipGroup>

        <LabelRow style={{ marginTop: 22 }}>어디서 발생한 소리인가요 ?</LabelRow>
        <ChipGroup>
          {AREAS.map((a) => (
            <Chip
              key={a}
              $active={area === a}
              onClick={() => setArea(prev => (prev === a ? "" : a))}
            >
              {a}
            </Chip>
          ))}
        </ChipGroup>

        <LabelRow style={{ marginTop: 22 }}>정확한 위치를 입력해주세요 (선택 사항)</LabelRow>

        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <AddressInput
              value={query}
              onChange={(e) => onChangeQuery(e.target.value)}
              onKeyDown={handleEnterAddress}
              placeholder="예) 서울 중구 필동로 1길 30 / 남산타워 / 을지로입구역 등"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={async () => {
                const r = await searchByAddress();
                if (r) {
                  setMapLat(r.lat);
                  setMapLng(r.lng);
                  setAddr(r.address);
                }
              }}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #ddd",
                background: "#f6f7f9",
                cursor: "pointer",
                fontWeight: 600,
              }}
              title="주소 검색"
            >
              주소 검색
            </button>
          </div>

          {suggestions.length > 0 && (
            <ul
              style={{
                position: "absolute",
                zIndex: 20,
                top: "44px",
                left: 0,
                right: 0,
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                overflow: "hidden",
              }}
            >
              {suggestions.map((s, i) => (
                <li
                  key={`${s.lat}-${s.lng}-${i}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handlePick(s)}
                  style={{
                    padding: "10px 12px",
                    cursor: "pointer",
                    borderBottom: i === suggestions.length - 1 ? "none" : "1px solid #f2f3f5",
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{s.address}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <MapBox aria-label="지도">
          <div
            id="kakao-map"
            style={{
              width: "100%",
              height: 260,
              borderRadius: 12,
              overflow: "hidden",
              background: "#f4f6f8",
              position: "relative",
            }}
          >
            {/* 고정 마커 */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -100%)",
                zIndex: 10,
                pointerEvents: "none",
              }}
            >
              <FiMapPin size={32} color="#d32f2f" />
            </div>

            {!ready && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  color: "#6b7280",
                }}
              >
                {error
                  ? (error === "NO_APPKEY"
                    ? "카카오 JavaScript 키가 설정되지 않았습니다 (.env 확인)"
                    : "지도를 불러오지 못했습니다. (도메인 허용/키 종류/네트워크 확인)")
                  : "지도를 로드중입니다. 잠시만 기다려주세요."}
              </div>
            )}
          </div>
        </MapBox>

        <NextFab
          type="button"
          aria-label="다음"
          disabled={!canNext}
          onClick={goNext}
          title={canNext ? "다음 단계" : "유형과 장소를 선택해주세요"}
        >
          <FiArrowRight />
        </NextFab>

        <SubNote />
      </Section>
    </Wrap>
  );
};

export default WritePage;
