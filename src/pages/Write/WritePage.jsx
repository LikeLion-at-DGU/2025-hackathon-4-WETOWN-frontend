// src/pages/Write/WritePage.jsx
import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wrap, Section, LabelRow, ChipGroup, Chip, SubNote,
  MapBox, MapPin, AddressInput, NextFab,
  Field, Input, TextArea, DangerNote,
  UploadGrid, UploadSlot, CameraBadge, RegisterBtn,
  SuggestTitle, SuggestChips, SuggestChip,
  DoneWrap, DoneIcon, DoneText,
  TopInline, BackBtn,
  ViewPostBtn // 완료 화면의 내가 작성한 글 보기 버튼
} from "./write.styled";
import { FiArrowRight, FiMapPin, FiCamera, FiChevronLeft } from "react-icons/fi";
import reportDone from "../../components/assets/reportDone.svg";

const CATEGORIES = ["불편/민원", "동네 바람", "정보 공유", "자유 의견"];
const AREAS = ["장충동", "명동", "광희동", "약수동", "을지로동", "필동", "회현동", "청구동", "신당동", "황학동"];

const WritePage = () => {
  const navigate = useNavigate();

  // step: select -> compose -> done
  const [step, setStep] = useState("select");

  // 기본 선택 해제 (빈 값으로 시작)
  const [cat, setCat] = useState("");
  const [area, setArea] = useState("");
  const [addr, setAddr] = useState("");

  // step2
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [images, setImages] = useState([]); // File[]
  const fileRef = useRef(null);

  // 등록 완료 후 미리보기로 넘길 데이터 저장
  const [createdPost, setCreatedPost] = useState(null);

  const canNext = !!cat && !!area;

  const aiChips = useMemo(() => {
    if (!cat) return [];
    return cat === "동네 바람"
      ? ["# 가로등이 너무 어두워요", "# 가로등", "# 여기 가로등 꺼졌어요", "# 놀이터가어둡"]
      : ["# 불편 신고", "# 제설 요청", "# 위험 지역"];
  }, [cat]);

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

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: API 전송 위치
    const id = Date.now().toString(); // 데모용 ID
    const imgUrls = images.map((f) => URL.createObjectURL(f));

    // ✅ 작성된 글 데이터 저장 (완료화면 → 미리보기 이동용)
    setCreatedPost({
      id,
      category: cat,
      area,
      addr,
      author,
      title,
      body,
      images: imgUrls,
      createdAt: new Date().toISOString(),
    });

    setStep("done");
  };

  // ===== STEP 3: 등록 완료 =====
  if (step === "done") {
    return (
      <Wrap>
        <DoneWrap>
          <DoneIcon>
            <img src={reportDone} alt="등록 완료" />
          </DoneIcon>
          <DoneText>
            <b>[ {cat || "민원"} ]</b> 민원이 등록되었습니다.
            <br />
            당신의 한 마디가 우리 동네를 움직입니다.
          </DoneText>

          {/* 작성된 글 보기 */}
          <ViewPostBtn
            type="button"
            onClick={() => navigate("/post/preview", { state: { post: createdPost } })}
            disabled={!createdPost}
          >
            작성된 글 보기
          </ViewPostBtn>
        </DoneWrap>
      </Wrap>
    );
  }

  // ===== STEP 2: 작성 =====
  if (step === "compose") {
    return (
      <Wrap as="form" onSubmit={onSubmit}>
        <Section>
          {/* 작성 화면 상단 뒤로가기 (1단계로 복귀) */}
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
              민원을 작성해주세요. <DangerNote as="span">작성 이후 수정은 불가합니다.</DangerNote>
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

          {!!aiChips.length && (
            <>
              <SuggestTitle>AI 추천 태그</SuggestTitle>
              <SuggestChips>
                {aiChips.map((t, idx) => (
                  <SuggestChip key={idx} onClick={() => setTitle((v) => v || t.replace(/^#\s*/, ""))}>
                    {t}
                  </SuggestChip>
                ))}
              </SuggestChips>
            </>
          )}

          <RegisterBtn type="submit">등록</RegisterBtn>
        </Section>
      </Wrap>
    );
  }

  // ===== STEP 1: 유형/장소 선택 =====
  return (
    <Wrap>
      <Section>
        <LabelRow>어떤 종류의 글인가요 ?</LabelRow>
        <ChipGroup>
          {CATEGORIES.map((c) => (
            <Chip key={c} $active={cat === c} onClick={() => setCat(c)}>
              {c}
            </Chip>
          ))}
        </ChipGroup>

        <LabelRow style={{ marginTop: 22 }}>어디서 발생한 민원인가요 ?</LabelRow>
        <ChipGroup>
          {AREAS.map((a) => (
            <Chip key={a} $active={area === a} onClick={() => setArea(a)}>
              {a}
            </Chip>
          ))}
        </ChipGroup>

        <LabelRow style={{ marginTop: 22 }}>
          정확한 위치를 입력해주세요 (선택 사항)
        </LabelRow>
        <AddressInput
          value={addr}
          onChange={(e) => setAddr(e.target.value)}
          placeholder="위치 입력"
        />

        <MapBox aria-label="지도 미리보기">
          {/* 실제 지도가 아니고, 디자인용 프리뷰. 향후 카카오/네이버 지도 연동 예정 */}
          <div className="cross" />
          {addr && (
            <>
              <MapPin><FiMapPin /></MapPin>
              <div className="addr">{addr}</div>
            </>
          )}
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
