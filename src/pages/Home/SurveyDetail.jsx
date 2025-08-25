import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FiChevronLeft, FiSend, FiCalendar } from "react-icons/fi"; // ⬅️ 캘린더 아이콘 추가
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

const API_BASE = (import.meta.env.VITE_BASE_URL || "").replace(/\/+$/, "");

/* ---------- 세션 스토리지 helpers ---------- */
const keyOf = (id) => `survey:results:${id}`;
const loadSaved = (id) => {
  try {
    const raw = sessionStorage.getItem(keyOf(id));
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (Number.isFinite(obj?.yes) && Number.isFinite(obj?.no)) return obj;
  } catch {}
  return null;
};
const saveResults = (id, res) => {
  try {
    if (res && Number.isFinite(res.yes) && Number.isFinite(res.no)) {
      sessionStorage.setItem(keyOf(id), JSON.stringify({ yes: res.yes, no: res.no }));
    }
  } catch {}
};

/* ---------- 결과 파싱 ---------- */
function normalizeResults(raw) {
  if (!raw) return { yes: 0, no: 0 };

  const toNum = (v) => {
    if (v === null || v === undefined) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };
  const lowerObj = (obj) =>
    Object.fromEntries(Object.entries(obj).map(([k, v]) => [String(k).toLowerCase(), v]));

  if (typeof raw === "object" && !Array.isArray(raw)) {
    const obj = lowerObj(raw);
    const inner =
      (obj.counts && lowerObj(obj.counts)) ||
      (obj.results && lowerObj(obj.results)) ||
      obj;

    const yes =
      toNum(inner.yes) ??
      toNum(inner.yes_count) ??
      toNum(inner.agree) ??
      toNum(inner.agree_count) ??
      toNum(inner.satisfied) ??
      toNum(inner.satisfied_count) ??
      toNum(inner.good) ??
      toNum(inner.true) ?? 0;

    const no =
      toNum(inner.no) ??
      toNum(inner.no_count) ??
      toNum(inner.disagree) ??
      toNum(inner.disagree_count) ??
      toNum(inner.unsatisfied) ??
      toNum(inner.unsatisfied_count) ??
      toNum(inner.bad) ??
      toNum(inner.false) ?? 0;

    const yRatio =
      toNum(inner.yes_ratio) ??
      toNum(inner.agree_ratio) ??
      toNum(inner.good_ratio);
    const nRatio =
      toNum(inner.no_ratio) ??
      toNum(inner.disagree_ratio) ??
      toNum(inner.bad_ratio);

    if (yes || no) return { yes, no };
    if (Number.isFinite(yRatio) || Number.isFinite(nRatio)) {
      const y = Math.max(0, Math.min(1, yRatio ?? 1 - (nRatio ?? 0)));
      const n = 1 - y;
      return { yes: Math.round(y * 100), no: Math.round(n * 100), isRatioOnly: true };
    }
  }

  if (Array.isArray(raw)) {
    let yes = 0, no = 0;
    for (const it of raw) {
      const item = typeof it === "object" ? it : {};
      const key = (item.key ?? item.name ?? item.option ?? item.label ?? "")
        .toString().toLowerCase();
      const cnt = toNum(item.count ?? item.value ?? item.total ?? item.cnt ?? 0) ?? 0;
      if (["yes","agree","satisfied","good","y","true","만족"].includes(key)) yes += cnt;
      else if (["no","disagree","unsatisfied","bad","n","false","불만족"].includes(key)) no += cnt;
    }
    return { yes, no };
  }

  return { yes: 0, no: 0 };
}

/* ---------- POST / vote ---------- */
async function tryPostVote(id, choice, reason) {
  const endpoints = [
    `${API_BASE}/surveys/${id}/vote/`,
    `${API_BASE}/surveys/${id}/vote`,
  ];
  const yes = choice === "good";
  const bodies = [
    { choice: yes ? "yes" : "no", reason },
    { vote: yes ? "agree" : "disagree", reason },
    { is_agree: yes, reason },
    { satisfied: yes, reason },
    { value: yes ? 1 : 0, reason },
  ];
  for (const url of endpoints) {
    for (const body of bodies) {
      try {
        const res = await axios.post(url, body, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (res.status >= 200 && res.status < 300) return { ok: true };
      } catch {}
    }
  }
  return { ok: false };
}

/* ---------- GET / results ---------- */
async function fetchResultsOnce(id) {
  const urls = [
    `${API_BASE}/surveys/${id}/results/`,
    `${API_BASE}/surveys/${id}/results`,
  ];
  for (const u of urls) {
    try {
      const { data } = await axios.get(u, { withCredentials: true });
      return normalizeResults(data);
    } catch {}
  }
  return null;
}

/* ---------- 기간 포맷 (AdminPost 참고) ---------- */
const formatDT = (v) => {
  if (!v) return "";
  // 허용: "YYYY-MM-DDTHH:mm", "YYYY-MM-DDTHH:mm:ss", "YYYY-MM-DD HH:mm", ISO 등
  const iso = v.replace(" ", "T");
  const [d, tRaw] = iso.split("T");
  if (!d) return v;
  const [y, m, dd] = d.split("-");
  const hhmm = (tRaw || "").slice(0, 5);
  return `${y}.${String(m).padStart(2, "0")}.${String(dd).padStart(2, "0")} ${hhmm}`;
};

// detail에서 다양한 키 이름 지원
const pick = (obj, keys) => keys.find((k) => obj?.[k] != null) ? obj[keys.find((k) => obj?.[k] != null)] : undefined;

export default function SurveyDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [step, setStep] = useState(location.state?.mode === "result" ? "result" : "choose");
  const [choice, setChoice] = useState(null); // 'good' | 'bad'
  const [reason, setReason] = useState("");

  // 세션에 저장된 값으로 초기화(있으면 그대로 사용)
  const [results, setResults] = useState(() => loadSaved(id) || null);
  const [detail, setDetail] = useState(null);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        // 상세
        const detailUrls = [`${API_BASE}/surveys/${id}/`, `${API_BASE}/surveys/${id}`];
        let d = null;
        for (const u of detailUrls) {
          try { const res = await axios.get(u, { withCredentials: true }); d = res.data; break; }
          catch {}
        }
        if (!d) throw new Error("detail fail");
        if (!alive) return;
        setDetail(d);

        // 항상 결과 선조회해서 state 시드 채우기 (세션값이 없을 때만 갱신)
        const r = await fetchResultsOnce(id);
        if (!alive) return;

        if (r && !r.isRatioOnly && (r.yes + r.no) >= 0) {
          setResults((prev) => {
            const next = prev ?? r; // 기존 세션이 있으면 유지
            saveResults(id, next);
            return next;
          });
        } else if (results == null) {
          setResults({ yes: 0, no: 0 });
          saveResults(id, { yes: 0, no: 0 });
        }

        // 결과 모드면 한 번 더 최신화
        if (location.state?.mode === "result") {
          const latest = await fetchResultsOnce(id);
          if (alive && latest && !latest.isRatioOnly && (latest.yes + latest.no) > 0) {
            setResults(latest);
            saveResults(id, latest);
          }
        }
      } catch {
        if (alive) setErr("설문 상세를 불러오지 못했습니다.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, location.state?.mode]);

  const handleBack = () => {
    if (step === "reason") { setStep("choose"); return; }
    navigate(-1);
  };
  const pickChoice = (w) => { setChoice(w); setStep("reason"); };

  /* ---------- 핵심: 낙관적 누적 + 세션 보존, 그리고 완료 화면으로 ---------- */
  const onSend = async () => {
    const ok = await tryPostVote(id, choice, reason?.trim() || undefined);
    if (!ok) {
      alert("투표 전송에 실패했습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    // 서버 결과 재조회 (지연될 수 있음)
    const fresh = await fetchResultsOnce(id);

    if (fresh && !fresh.isRatioOnly && (fresh.yes + fresh.no) > 0) {
      setResults(fresh);
      saveResults(id, fresh);
    } else {
      const base = loadSaved(id) ?? results ?? { yes: 0, no: 0 };
      const optimistic = {
        yes: base.yes + (choice === "good" ? 1 : 0),
        no:  base.no  + (choice === "bad"  ? 1 : 0),
      };
      setResults(optimistic);
      saveResults(id, optimistic);
    }

    setStep("done");
  };

  // 기간 정보 뽑기
  const startRaw = pick(detail, ["start_at", "startAt", "start_time", "start"]);
  const endRaw   = pick(detail, ["end_at", "endAt", "end_time", "end"]);
  const hasPeriod = !!(startRaw || endRaw);
  const periodText = hasPeriod
    ? `${startRaw ? formatDT(startRaw) : ""}${startRaw && endRaw ? " ~ " : (startRaw ? " ~" : "~ ")}${endRaw ? formatDT(endRaw) : ""}`
    : "";

  /* ---------- 완료 화면 (투표 → 완료메시지) ---------- */
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
              const r = await fetchResultsOnce(id);
              setResults((prev) => {
                const serverTotal = r && !r.isRatioOnly ? (r.yes + r.no) : 0;
                const next = serverTotal > 0 ? r : (prev ?? loadSaved(id) ?? { yes: 0, no: 0 });
                saveResults(id, next);
                return next;
              });
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
    const yes = results?.yes ?? 0;
    const no  = results?.no  ?? 0;
    const total = yes + no;
    const yesPct = total > 0 ? Math.round((yes / total) * 100) : 0;
    const noPct  = total > 0 ? 100 - yesPct : 0;

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

          {/* ⬇️ 투표 기한 표시 */}
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
            <ResultBar aria-label={`만족 ${yesPct}%, 불만족 ${noPct}%`} style={{ minWidth: 0 }}>
              {yesPct > 0 && <YesSeg style={{ flexBasis: `${yesPct}%` }}>만족({yesPct}%)</YesSeg>}
              {noPct  > 0 && <NoSeg  style={{ flexBasis: `${noPct }%` }}>불만족({noPct }%)</NoSeg>}
            </ResultBar>
          ) : (
            <ResultBar style={{ minWidth: 0 }} aria-label="집계 없음" />
          )}

          {total > 0 ? (
            <div style={{ marginTop: 8, color: "#555", fontSize: 13 }}>
              총 <b>{total}</b>표 · 만족 <b>{yes}</b> · 불만족 <b>{no}</b>
            </div>
          ) : (
            <div style={{ marginTop: 8, color: "#777", fontSize: 14 }}>
              아직 집계된 투표가 없습니다.
            </div>
          )}
        </ResultCard>
      </Wrap>
    );
  }

  // ---------- 선택/이유 입력 화면 ----------
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

            {/* ⬇️ 투표 기한 표시 */}
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

          <VoteCard>
            <VoteHeader>투표</VoteHeader>
            <VoteBtns>
              <VoteBtn
                $active={choice === "good"}
                $kind="good"
                onClick={() => setStep("reason") || setChoice("good")}
              >
                <AiOutlineLike />
                <span>만족</span>
              </VoteBtn>
              <VoteBtn
                $active={choice === "bad"}
                $kind="bad"
                onClick={() => setStep("reason") || setChoice("bad")}
              >
                <AiOutlineDislike />
                <span>불만족</span>
              </VoteBtn>
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
        </>
      )}
    </Wrap>
  );
}
