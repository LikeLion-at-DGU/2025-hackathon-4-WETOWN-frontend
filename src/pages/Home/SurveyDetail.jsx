// src/pages/SurveyDetail.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FiChevronLeft, FiSend, FiCalendar } from "react-icons/fi";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import surveyDone from "../../components/assets/surveyDone.svg";

import {
  Wrap,
  TopBar, TopBackBtn, TopTitle,
  MetaRow, MetaAvatar, MetaInfo, MetaName,
  TitleBlock, TitleMain, TitleSub, Divider,
  VoteCard, VoteHeader, VoteBtns, VoteBtn,
  ReasonWrap, ReasonInput, SendBtn,
  DoneWrap, DoneIcon, DoneText,
  PrevBtn,
  ResultCard, ResultHeader, ResultBar, YesSeg, NoSeg,
} from "./surveyDetail.styled";

const API_BASE = (import.meta.env.VITE_BASE_URL || "https://heewon.shop").replace(/\/+$/, "");

/* ------------------------------------------------------------------ */
/* 설문 기간 체크                                                      */
/* ------------------------------------------------------------------ */
function checkSurveyPeriod(detail) {
  if (!detail) return { isValid: false, message: "설문 정보를 불러오는 중입니다." };
  
  const now = new Date();
  const startAt = detail.start_at ? new Date(detail.start_at) : null;
  const endAt = detail.end_at ? new Date(detail.end_at) : null;
  
  // 시작 시간이 있고 아직 시작되지 않은 경우
  if (startAt && now < startAt) {
    return { isValid: false, message: "현재 설문 기간이 아닙니다." };
  }
  
  // 종료 시간이 지난 경우
  if (endAt && now > endAt) {
    return { isValid: false, message: "설문이 종료되었습니다." };
  }
  
  return { isValid: true, message: "" };
}

/* ------------------------------------------------------------------ */
/* 공용 유틸: 에러 설명 + 다중 URL 시도                                */
/* ------------------------------------------------------------------ */

// axios 에러를 사람이 읽기 좋게 변환
const explainAxiosError = (e) => {
  if (e?.response) {
    const { status, statusText, data } = e.response;
    const msg =
      typeof data === "string"
        ? data
        : (data?.detail || data?.message || data?.error || "");
    return `[${status} ${statusText}] ${msg}`;
  }
  if (e?.request) return "네트워크/서버 연결 실패";
  return e?.message || "알 수 없는 오류";
};

// 여러 URL 후보를 순차 시도해서 첫 성공을 반환
async function tryGet(urls, config) {
  let lastErr;
  for (const u of urls) {
    try {
      const { data } = await axios.get(u, config);
      return data;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

/* ------------------------------------------------------------------ */
/* 결과 파싱 - 동적 옵션에 맞게 수정                                   */
/* ------------------------------------------------------------------ */
function normalizeResults(raw, surveyOptions = []) {
  if (!raw) return {};
  
  // 백엔드에서 { survey_id, total_votes, options: [{option_id, label, count, percent}] } 형태로 반환
  const options = raw.options || [];
  const results = {};
  
  // 각 옵션별로 결과 매핑
  for (const option of options) {
    const optionId = option.option_id || option.id;
    const count = Number(option.count) || 0;
    const percent = Number(option.percent) || 0;
    
    results[optionId] = {
      count,
      percent,
      label: option.label
    };
  }
  
  return {
    total: raw.total_votes || 0,
    options: results
  };
}

/* ------------------------------------------------------------------ */
/* 서버 통신 helpers                                                  */
/* ------------------------------------------------------------------ */
async function fetchDetail(id) {
  const data = await tryGet(
    [
      `${API_BASE}/surveys/${id}`,
    ],
    { withCredentials: true }
  );
  return data;
}

async function fetchResults(id) {
  const data = await tryGet(
    [
      `${API_BASE}/surveys/${id}/results`,
    ],
    { withCredentials: true }
  );
  return data;
}

// 투표 제출
async function postVote(id, optionId, reason) {
  const body = {
    option_id: optionId,
    ...(reason ? { opinion_text: reason } : {})
  };

  try {
    const res = await axios.post(`${API_BASE}/surveys/${id}/vote`, body, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    if (res.status >= 200 && res.status < 300) return;
  } catch (e) {
    throw e;
  }
}

/* ------------------------------------------------------------------ */
/* 날짜/필드 유틸                                                      */
/* ------------------------------------------------------------------ */
const formatDT = (v) => {
  if (!v) return "";
  const iso = String(v).replace(" ", "T");
  const [d, tRaw] = iso.split("T");
  if (!d) return v;
  const [y, m, dd] = d.split("-");
  const hhmm = (tRaw || "").slice(0, 5);
  return `${y}.${String(m).padStart(2, "0")}.${String(dd).padStart(2, "0")} ${hhmm}`;
};

const pick = (obj, keys) =>
  keys.find((k) => obj?.[k] != null) ? obj[keys.find((k) => obj?.[k] != null)] : undefined;

/* ------------------------------------------------------------------ */
/* 컴포넌트                                                           */
/* ------------------------------------------------------------------ */
export default function SurveyDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [step, setStep] = useState(location.state?.mode === "result" ? "result" : "choose");
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [reason, setReason] = useState("");

  const [detail, setDetail] = useState(null);
  const [results, setResults] = useState({ total: 0, options: {} });

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // 초기 로드(상세 + 결과)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const d = await fetchDetail(id);
        
        // 옵션이 없으면 추가로 가져오기 시도
        if (!d.options || d.options.length === 0) {
          try {
            // 옵션을 별도로 가져와보기
            const optionsData = await tryGet([`${API_BASE}/surveys/${id}/options`], { withCredentials: true });
            if (optionsData && Array.isArray(optionsData)) {
              d.options = optionsData;
            }
          } catch (optErr) {
            console.warn("Failed to fetch options separately:", optErr);
          }
        }
        
        const r = await fetchResults(id);
        const normalizedResults = normalizeResults(r, d.options);
        
        if (!alive) return;
        
        console.log("Survey detail loaded:", d);
        console.log("Survey options:", d.options);
        console.log("Survey results:", normalizedResults);
        
        setDetail(d);
        setResults(normalizedResults);
      } catch (e) {
        if (alive) {
          const msg = explainAxiosError(e);
          setErr(`설문 상세/결과를 불러오지 못했습니다. ${msg}`);
          console.error("Survey detail/results failed:", e);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  const handleBack = () => {
    if (step === "reason") { setStep("choose"); return; }
    navigate(-1);
  };

  const pickChoice = (optionId) => { 
    setSelectedOptionId(optionId); 
    setStep("reason"); 
  };

  // 투표 제출
  const onSend = async () => {
    if (!selectedOptionId) return;
    
    // 설문 기간 체크
    const periodCheck = checkSurveyPeriod(detail);
    if (!periodCheck.isValid) {
      alert(periodCheck.message);
      return;
    }
    
    try {
      await postVote(id, selectedOptionId, reason?.trim() || undefined);
      const r = await fetchResults(id); // 투표 직후 최신 누적 결과
      const normalizedResults = normalizeResults(r, detail.options);
      setResults(normalizedResults);
      setStep("done");
    } catch (e) {
      console.error("Vote error:", e);
      alert(`${explainAxiosError(e)}`);
    }
  };

  // 기간 정보 표현
  const startRaw = pick(detail, ["start_at", "startAt", "start_time", "start"]);
  const endRaw   = pick(detail, ["end_at", "endAt", "end_time", "end"]);
  const hasPeriod = !!(startRaw || endRaw);
  const periodText = hasPeriod
    ? `${startRaw ? formatDT(startRaw) : ""}${startRaw && endRaw ? " ~ " : (startRaw ? " ~" : "~ ")}${endRaw ? formatDT(endRaw) : ""}`
    : "";

  // 옵션 정렬 (order_num 기준)
  const sortedOptions = detail?.options ? [...detail.options].sort((a, b) => (a.order_num || 0) - (b.order_num || 0)) : [];

  /* ---------- 완료 화면 ---------- */
  if (step === "done") {
    return (
      <Wrap>
        <TopBar>
          <TopBackBtn onClick={() => navigate(-1)} aria-label="뒤로가기">
            <FiChevronLeft />
          </TopBackBtn>
          <TopTitle>설문하기</TopTitle>
          <div style={{ width: 32 }} />
        </TopBar>

        <DoneWrap>
          <DoneIcon>
            <img src={surveyDone} alt="투표 아이콘" />
          </DoneIcon>
          <DoneText>
            설문 참여가 완료되었습니다. <br />
            오늘의 참여가 내일의 더 나은 동네를 만듭니다.
          </DoneText>
          <PrevBtn
            onClick={async () => {
              try {
                const r = await fetchResults(id);
                const normalizedResults = normalizeResults(r, detail.options);
                setResults(normalizedResults);
              } catch (_) {}
              setStep("result");
            }}
          >
            결과 보기
          </PrevBtn>
        </DoneWrap>
      </Wrap>
    );
  }

  /* ---------- 결과 화면 ---------- */
  if (step === "result") {
    const total = results?.total || 0;

    return (
      <Wrap>
        <TopBar>
          <TopBackBtn onClick={() => navigate(-1)} aria-label="뒤로가기">
            <FiChevronLeft />
          </TopBackBtn>
          <TopTitle>설문하기</TopTitle>
          <div style={{ width: 32 }} />
        </TopBar>

        <MetaRow>
          <MetaAvatar />
          <MetaInfo>
            <MetaName>{detail?.agency_name || "기관"}</MetaName>
          </MetaInfo>
        </MetaRow>

        <Divider />

        <TitleBlock>
          <TitleMain>{detail?.title || "제목"}</TitleMain>
          <TitleSub>{detail?.description || detail?.content || ""}</TitleSub>

          {hasPeriod && (
            <div
              style={{
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                color: "#666",
              }}
            >
              <FiCalendar aria-hidden />
              <span>설문 기한</span>
              <span style={{ fontWeight: 500 }}>{periodText}</span>
            </div>
          )}
        </TitleBlock>

        <ResultCard>
          <ResultHeader>투표현황</ResultHeader>

          {total > 0 ? (
            <>
              <ResultBar aria-label="투표 결과" style={{ minWidth: 0, display: 'flex', height: '40px', borderRadius: '8px', overflow: 'hidden' }}>
                {sortedOptions.map((option, index) => {
                  const optionResult = results.options[option.id] || { count: 0, percent: 0 };
                  const percent = optionResult.percent;
                  
                  if (percent === 0) return null;
                  
                  return (
                    <div
                      key={option.id}
                      style={{
                        flexBasis: `${percent}%`,
                        backgroundColor: index === 0 ? '#4ade80' : '#f87171',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '13px',
                        fontWeight: '500',
                        minWidth: percent > 15 ? 'auto' : '0'
                      }}
                    >
                      {percent > 15 && `${option.label}(${percent}%)`}
                    </div>
                  );
                })}
              </ResultBar>
              
              <div style={{ marginTop: 12, fontSize: 13, color: "#555" }}>
                <div style={{ marginBottom: 4 }}>
                  총 <b>{total}</b>표
                </div>
                {sortedOptions.map((option) => {
                  const optionResult = results.options[option.id] || { count: 0, percent: 0 };
                  return (
                    <div key={option.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span>{option.label}</span>
                      <span><b>{optionResult.count}</b>표 ({optionResult.percent}%)</span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <ResultBar style={{ minWidth: 0, height: '40px', backgroundColor: '#f5f5f5', borderRadius: '8px' }} aria-label="집계 없음" />
              <div style={{ marginTop: 8, color: "#777", fontSize: 14 }}>
                아직 집계된 투표가 없습니다.
              </div>
            </>
          )}
        </ResultCard>
      </Wrap>
    );
  }

  const periodCheck = checkSurveyPeriod(detail);

  /* ---------- 선택/이유 입력 화면 ---------- */
  return (
    <Wrap>
      <TopBar>
        <TopBackBtn onClick={handleBack} aria-label="뒤로가기">
          <FiChevronLeft />
        </TopBackBtn>
        <TopTitle>설문하기</TopTitle>
        <div style={{ width: 32 }} />
      </TopBar>

      {loading && <div style={{ padding: 24, color: "#777" }}>불러오는 중…</div>}
      {err && <div style={{ padding: 24, color: "#c00" }}>{err}</div>}

      {!loading && !err && (
        <>
          <MetaRow>
            <MetaAvatar />
            <MetaInfo>
              <MetaName>{detail?.agency_name || "기관"}</MetaName>
            </MetaInfo>
          </MetaRow>

          <Divider />

          <TitleBlock>
            <TitleMain>{detail?.title || "제목"}</TitleMain>
            <TitleSub>{detail?.description || detail?.content || ""}</TitleSub>

            {hasPeriod && (
              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  color: "#666",
                }}
              >
                <FiCalendar aria-hidden />
                <span>설문 기한</span>
                <span style={{ fontWeight: 500 }}>{periodText}</span>
              </div>
            )}
          </TitleBlock>

          {/* 설문 기간이 아닐 때 경고 메시지 표시 */}
          {!periodCheck.isValid ? (
            <div style={{ 
              padding: 20, 
              margin: "16px 0", 
              backgroundColor: "#fff3cd", 
              border: "1px solid #ffeaa7", 
              borderRadius: 8, 
              color: "#856404",
              textAlign: "center",
              fontSize: 14,
              fontWeight: 500
            }}>
              {periodCheck.message}
            </div>
          ) : (
            <VoteCard>
              <VoteHeader>투표</VoteHeader>
              <VoteBtns>
                {sortedOptions.map((option, index) => (
                  <VoteBtn
                    key={option.id}
                    $active={selectedOptionId === option.id}
                    $kind={index === 0 ? "good" : "bad"} // 첫 번째 옵션을 good, 나머지를 bad로 스타일링
                    onClick={() => pickChoice(option.id)}
                  >
                    {index === 0 ? <AiOutlineLike /> : <AiOutlineDislike />}
                    <span>{option.label}</span>
                  </VoteBtn>
                ))}
              </VoteBtns>

              {step === "reason" && (
                <ReasonWrap>
                  <ReasonInput
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="이유를 작성해주세요. (선택 사항)"
                    rows={3}
                  />
                  <SendBtn onClick={onSend} aria-label="전송">
                    <FiSend />
                  </SendBtn>
                </ReasonWrap>
              )}
            </VoteCard>
          )}
        </>
      )}
    </Wrap>
  );
}