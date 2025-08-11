'use client';

import React, { useEffect, useMemo, useState, useRef } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";



function Header(){
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 flex items-center" style={{ backdropFilter: 'blur(6px)', background: 'rgba(255,255,255,.65)', borderBottom: '1px solid rgba(0,0,0,.06)' }}>
      <div className="mx-auto w-full px-6 flex items-center justify-between">
        <a href="#build" className="font-semibold tracking-tight">데연소</a>
        <nav className="hidden md:flex items-center gap-8 text-sm" style={{ color: 'var(--muted)' }}>
          <a href="#build" className="hover:text-[var(--text)]">Demo</a>
          <a href="#meet" className="hover:text-[var(--text)]">Story</a>
          <a href="#why" className="hover:text-[var(--text)]">Why</a>
          <a href="#persona" className="hover:text-[var(--text)]">Persona</a>
          <a href="#dialog" className="hover:text-[var(--text)]">Dialogue</a>
          <a href="#feedback" className="hover:text-[var(--text)]">Feedback</a>
          <a href="#report" className="hover:text-[var(--text)]">Report</a>
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="rounded-full px-4 py-1.5 text-sm font-medium card"
            aria-label="새로고침"
          >
            새로고침
          </button>
          <a href="/camera" className="rounded-full px-4 py-1.5 text-sm font-medium card">시작하기</a>
        </div>
      </div>
    </header>
  );
}

function Chapter({ id, label, title, subtitle, image, tint }: {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  image: string;
  tint?: string;
}){
  return (
    <section id={id} className="relative min-h-screen flex items-center">
      <div className="hero-media" aria-hidden>
        <motion.div
          className="media-img"
          initial={{ scale: 1.06, opacity: 0 }}
          whileInView={{ scale: 1.01, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0" style={{ background: tint || 'linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,.92) 70%, #fff 100%)' }} />
      </div>
      <div className="relative z-10 mx-auto w-full px-6">
        <div className="max-w-xl card p-6 md:p-8">
          <div className="kicker">{label}</div>
          <h2 className="display mt-2" style={{ fontSize: 'clamp(36px,6vw,72px)', whiteSpace: 'pre-line' }}>{title}</h2>
          <p className="lead mt-4">{subtitle}</p>
        </div>
      </div>
    </section>
  );
}

function DotsNav({ sections }: { sections: Array<{ id: string; label: string }> }){
  const [active, setActive] = useState(sections[0]?.id);
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if(!el) return;
      const obs = new IntersectionObserver(([e]) => {
        if(e.isIntersecting) setActive(id);
      }, { rootMargin: '-40% 0px -40% 0px' });
      obs.observe(el); observers.push(obs);
    });
    return () => observers.forEach(o=>o.disconnect());
  }, [sections]);
  return (
    <div className="dots">
      {sections.map((s) => (
        <a key={s.id} href={`#${s.id}`} aria-label={s.label} className={`dot ${active===s.id? 'active':''}`}></a>
      ))}
    </div>
  );
}

/* 작은 유틸: 타이핑 점 애니메이션 */
function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block h-1.5 w-1.5 rounded-full bg-white/70"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}





/* IMPACT ChatPanel: 타이핑/스태거 등장 */
function ChatPanel() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const messages = [
    { role: "bot", text: "안녕하세요." },
    { role: "user", text: "안녕하세요. 처음 뵙겠습니다." },
    { role: "bot", text: "네, 처음 뵙겠습니다. 오늘 날씨가 정말 좋네요." },
    { role: "user", text: "네, 맞아요. 이렇게 맑은 날에 만나서 다행이에요." },
    { role: "bot", text: "여기 카페 처음 오시는 건가요?" },
    { role: "user", text: "네, 처음이에요. 분위기가 정말 좋네요." },
    { role: "bot", text: "저도 처음 와봤는데, 커피 맛도 괜찮고 분위기도 좋아서 좋았어요." },
    { role: "user", text: "무엇을 주문하셨나요?" },
    { role: "bot", text: "아메리카노요. 원래 커피를 좋아하시나요?" },
    { role: "user", text: "네, 저도 커피를 좋아해요. 특히 아메리카노를 자주 마셔요." },
    { role: "bot", text: "그렇군요! 저도 아메리카노를 제일 좋아해요. 간단하면서도 맛있잖아요." },
    { role: "user", text: "맞아요. 어떤 일을 하시나요?" },
    { role: "bot", text: "회사에서 일하고 있어요. 혹시 어떤 일을 하시는지 궁금했어요." },
    { role: "user", text: "저도 회사 다니고 있어요. 오늘 퇴근하고 바로 오셨나요?" },
    { role: "bot", text: "네, 맞아요. 조금 급하게 와서 정리도 못 하고 왔네요." },
    { role: "user", text: "괜찮아요. 저도 비슷해요. 오늘 정말 바빴거든요." },
    { role: "bot", text: "그렇군요. 일이 바쁘시군요. 그래도 이렇게 만나서 다행이에요." },
    { role: "user", text: "네, 저도 그래요. 오늘 정말 즐거웠어요." },
    { role: "bot", text: "저도요! 다음에 또 만날 수 있을까요?" },
  ];

  // 채팅창 내부 자동 스크롤 함수
  const scrollToBottom = () => {
    const messagesContainer = messagesEndRef.current?.parentElement;
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  useEffect(() => {
    if (currentMessageIndex < messages.length) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
        setCurrentMessageIndex(prev => prev + 1);
      }, 2000 + Math.random() * 1000); // 2-3초 랜덤 딜레이
      
      return () => clearTimeout(timer);
    }
  }, [currentMessageIndex, messages.length]);

  // 새 메시지가 추가될 때마다 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [currentMessageIndex]);

  return (
    <div className="relative rounded-2xl border border-black/20 bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden h-[600px]">
      {/* 헤더 */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="h-8 w-8 rounded-full bg-black/10" />
        <div className="flex-1">
          <p className="text-sm text-black/90 leading-none">Seoa (AI)</p>
          <p className="text-[11px] text-gray-600 mt-1">
            {isTyping ? "대화 중…" : "온라인"}
          </p>
        </div>
        <button aria-label="설정" className="rounded-md px-2 py-1 text-gray-600 hover:bg-black/5">⋯</button>
      </div>

      {/* 메시지: 스태거 페이드업 */}
      <div 
        className="px-4 py-4 space-y-3 h-[480px] overflow-y-auto"
        style={{ scrollBehavior: 'smooth' }}
      >
        {messages.slice(0, currentMessageIndex).map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className={m.role === "bot" 
              ? "max-w-[85%] rounded-2xl rounded-tl-sm bg-gray-100 border border-gray-200 px-3 py-2 text-sm text-black shadow-sm" 
              : "ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-black/5 border border-gray-200 px-3 py-2 text-sm text-black shadow-sm"
            }
          >
            {m.text}
          </motion.div>
        ))}
        
        {/* 타이핑 버블 */}
        {isTyping && currentMessageIndex < messages.length && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[50%] rounded-2xl rounded-tl-sm bg-gray-100 border border-gray-200 px-3 py-2 text-sm text-gray-600 inline-flex items-center gap-2 shadow-sm"
          >
            <TypingDots />
          </motion.div>
        )}
        
        {/* 스크롤 타겟 */}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 */}
      <div className="flex items-center gap-2 border-t border-gray-200 px-3 py-2 bg-gray-50">
        <input placeholder="메시지 입력…" className="flex-1 bg-transparent outline-none placeholder:text-gray-500 text-black text-sm px-2 py-2" />
        <button aria-label="보내기" className="rounded-lg px-3 py-2 text-sm bg-black/10 hover:bg-black/20 border border-gray-200 text-black">보내기</button>
        <button aria-label="음성 입력" className="rounded-lg p-2 bg-black/10 hover:bg-black/20 border border-gray-200">
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3m5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0zM11 19h2v3h-2z"/></svg>
        </button>
      </div>
    </div>
  );
}

/* === PersonaBuildScene (Impact ver.) === */
function PersonaBuildScene() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const reduce = useReducedMotion();

  // 페이지 로드 시 자동 시작
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="build" ref={ref} className="relative min-h-screen overflow-hidden">
      {/* 배경 이미지 */}
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-3xl overflow-hidden z-10"
        initial={{ opacity: 0, scale: 1.06 }}
        animate={isLoaded ? { opacity: 1, scale: 0.7 } : { opacity: 0, scale: 1.06 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{
          backgroundImage: "url('/bg_cafe.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* 흰색 배경 */}
      <div aria-hidden className="absolute inset-0 bg-white z-5" />

      {/* 네모 그리기 선 애니메이션 - 2줄로 나누어 빠르게 */}
      <motion.svg
        className="absolute inset-0 w-full h-full z-30 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* 첫 번째 줄: 상단 가로선 + 우측 세로선 */}
        <motion.path
          d="M 10 10 L 90 10"
          stroke="rgba(0,0,0,0.8)"
          strokeWidth="0.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={isLoaded ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: 1.0,
            ease: "easeInOut"
          }}
        />
        <motion.path
          d="M 90 10 L 90 90"
          stroke="rgba(0,0,0,0.8)"
          strokeWidth="0.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={isLoaded ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: 1.8,
            ease: "easeInOut"
          }}
        />
        
        {/* 두 번째 줄: 하단 가로선 + 좌측 세로선 */}
        <motion.path
          d="M 90 90 L 10 90"
          stroke="rgba(0,0,0,0.8)"
          strokeWidth="0.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={isLoaded ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: 2.6,
            ease: "easeInOut"
          }}
        />
        <motion.path
          d="M 10 90 L 10 10"
          stroke="rgba(0,0,0,0.8)"
          strokeWidth="0.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={isLoaded ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: 3.4,
            ease: "easeInOut"
          }}
        />
      </motion.svg>

      {/* 상단 문구 */}
      <motion.div
        className="absolute top-20 left-1/2 -translate-x-1/2 z-40 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 2.5, ease: "easeOut" }}
      >
        <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">
          데연소
        </h1>
        <p className="text-xl text-black/80 max-w-2xl mx-auto">
          AI와 함께하는 데이트연습소
        </p>
      </motion.div>

      {/* 중앙 마이크 + 펄스 링 */}
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 z-10">
        {/* 펄스 링 두 겹 */}
        {!reduce && (
          <>
            <motion.div
              className="absolute inset-0 -z-10 rounded-full"
              style={{ boxShadow: "0 0 0 2px rgba(255,255,255,.12)" }}
              initial={{ scale: 1, opacity: 0.6 }}
              animate={isLoaded ? { scale: [1, 1.6], opacity: [0.6, 0] } : { scale: 1, opacity: 0 }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut", delay: 3.0 }}
            />
            <motion.div
              className="absolute inset-0 -z-10 rounded-full"
              style={{ boxShadow: "0 0 0 2px rgba(255,255,255,.10)" }}
              initial={{ scale: 1, opacity: 0.45 }}
              animate={isLoaded ? { scale: [1, 2.1], opacity: [0.45, 0] } : { scale: 1, opacity: 0 }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 3.4 }}
            />
          </>
        )}
        <motion.button
          type="button"
          aria-label="녹음 시작"
          className="h-24 w-24 rounded-full border border-white/15 bg-white/10 backdrop-blur shadow-xl hover:bg-white/15 active:scale-95 transition grid place-items-center"
          initial={{ opacity: 0, scale: 1.2 }}
          animate={isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.5, delay: 3.2, ease: "easeOut" }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" className="text-white">
            <path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3m5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0zM11 19h2v3h-2z"/>
          </svg>
        </motion.button>
      </div>

      {/* 좌측 피드백 - 하단에 배치 */}
      <motion.div
        className="absolute left-[12%] bottom-[15%] z-20 w-[320px] max-w-[28vw]"
        initial={{ opacity: 0, x: -100 }}
        animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
        transition={{ duration: 0.8, delay: 3.5, ease: "easeOut" }}
      >
        <FeedbackPanel />
      </motion.div>

      {/* 우측 채팅 - 하단에 배치 */}
      <motion.div
        className="absolute right-[12%] bottom-[15%] z-20 w-[480px] max-w-[42vw]"
        initial={{ opacity: 0, x: 100 }}
        animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
        transition={{ duration: 0.8, delay: 3.7, ease: "easeOut" }}
      >
        <ChatPanel />
      </motion.div>

      <div className="h-[12vh]" />
    </section>
  );
}



/* --- 좌측 피드백 패널 --- */
function FeedbackPanel() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  
  // 채팅 메시지가 추가될 때마다 피드백 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(prev => Math.min(prev + 1, 15));
    }, 3000); // 3초마다 업데이트
    
    return () => clearInterval(interval);
  }, []);

  // 메시지 인덱스에 따른 동적 값들
  const getDynamicValues = () => {
    const baseValues = {
      호감도: 82,
      대화주도권: 85,
      시선: 70,
      자세: 85,
      미소: 75,
      말투: 90
    };
    
    const variation = Math.sin(currentMessageIndex * 0.5) * 5; // -5 ~ +5 변화
    
    return {
      호감도: Math.max(60, Math.min(95, baseValues.호감도 + variation)),
      대화주도권: Math.max(70, Math.min(95, baseValues.대화주도권 + variation * 0.8)),
      시선: Math.max(60, Math.min(90, baseValues.시선 + variation * 0.6)),
      자세: Math.max(75, Math.min(95, baseValues.자세 + variation * 0.4)),
      미소: Math.max(65, Math.min(85, baseValues.미소 + variation * 0.7)),
      말투: Math.max(80, Math.min(95, baseValues.말투 + variation * 0.5))
    };
  };

  const values = getDynamicValues();

  return (
    <div className="rounded-2xl border border-black/20 bg-white/95 backdrop-blur-xl shadow-xl p-6">
      {/* 호감도 섹션 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-600 mb-1">호감도</p>
          <motion.p 
            className="text-3xl font-bold text-black"
            key={currentMessageIndex}
            initial={{ scale: 1.2, color: "#3b82f6" }}
            animate={{ scale: 1, color: "#000000" }}
            transition={{ duration: 0.5 }}
          >
            {Math.round(values.호감도)}%
          </motion.p>
        </div>
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-200"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <motion.path
              className="text-black"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${values.호감도}, 100`}
              strokeLinecap="round"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              initial={{ strokeDasharray: "0, 100" }}
              animate={{ strokeDasharray: `${values.호감도}, 100` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
        </div>
      </div>

      {/* 대화 주도권 */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-2">대화 주도권</p>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-black"
            animate={{ width: `${values.대화주도권}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* 메트릭 그리드 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div>
          <MetricCard label="시선" progress={Math.round(values.시선)} />
        </div>
        <div>
          <MetricCard label="자세" progress={Math.round(values.자세)} />
        </div>
        <div>
          <MetricCard label="미소" progress={Math.round(values.미소)} />
        </div>
        <div>
          <MetricCard label="말투" progress={Math.round(values.말투)} />
        </div>
      </div>

      {/* 추천 팁 */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <p className="text-sm font-semibold text-black mb-3">추천 팁</p>
        <ul className="space-y-2 text-sm text-gray-700">
          <motion.li 
            className="flex items-start gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="text-black mt-0.5">•</span>
            <span>시선은 2-3초마다 자연스럽게 교차하세요</span>
          </motion.li>
          <motion.li 
            className="flex items-start gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-black mt-0.5">•</span>
            <span>대답은 짧게, 질문은 구체적으로</span>
          </motion.li>
          <motion.li 
            className="flex items-start gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span className="text-black mt-0.5">•</span>
            <span>웃음은 억지보다 가벼운 미소가 좋아요</span>
          </motion.li>
        </ul>
      </div>
    </div>
  );
}

/* --- 작은 UI 조각들 --- */
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <p className="text-[11px] text-white/55">{label}</p>
      <p className="mt-1 text-sm text-white font-medium">{value}</p>
    </div>
  );
}

function MetricCard({ label, progress }: { label: string; progress: number }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <p className="text-xs text-gray-600 mb-2">{label}</p>
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-black"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
function BotBubble({ text }: { text: string }) {
  return (
    <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white/10 px-3 py-2 text-sm text-white">
      {text}
    </div>
  );
}
function UserBubble({ text }: { text: string }) {
  return (
    <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-white/5 px-3 py-2 text-sm text-white/90">
      {text}
    </div>
  );
}

function MeetDreamScene(){
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // 애니메이션 완료 후 상태 변경
          setTimeout(() => setIsAnimationComplete(true), 3000);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="meet" ref={sectionRef} className="relative min-h-screen">
      <div className="sticky scroll-container" style={{ background: 'radial-gradient(120% 100% at 50% 0%, #050507 0%, #0b0c10 45%, #000 100%)' }}>
        <div className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(60% 40% at 20% 20%, rgba(255,107,107,0.10), transparent 60%), radial-gradient(50% 35% at 80% 60%, rgba(138,183,255,0.12), transparent 60%)' }} />

        {/* 남자 이미지 - 좌측에서 다가옴 */}
        <AnimatePresence>
          {!isAnimationComplete && (
            <motion.div 
              key="man"
              initial={{ x: '-100%', opacity: 0 }}
              animate={isVisible ? { x: '15%', opacity: 1 } : { x: '-100%', opacity: 0 }}
              exit={{ x: '50%', opacity: 0 }}
              transition={{ 
                duration: 2.0, 
                ease: "easeInOut",
                exit: { duration: 1.5, ease: "easeInOut" }
              }}
              className="absolute bottom-0 left-0 h-[80vh] w-[50vw] max-w-[600px] flex items-end justify-center" 
              aria-hidden
            >
              <img 
                src="/right_man.png" 
                alt="남자" 
                className="h-full w-auto object-contain transform scale-x-[-1]" // 좌우 반전
                style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* 여자 이미지 - 우측에서 다가옴 */}
        <AnimatePresence>
          {!isAnimationComplete && (
            <motion.div 
              key="woman"
              initial={{ x: '100%', opacity: 0 }}
              animate={isVisible ? { x: '-15%', opacity: 1 } : { x: '100%', opacity: 0 }}
              exit={{ x: '-50%', opacity: 0 }}
              transition={{ 
                duration: 2.0, 
                ease: "easeInOut",
                exit: { duration: 1.5, ease: "easeInOut" }
              }}
              className="absolute bottom-0 right-0 h-[80vh] w-[50vw] max-w-[600px] flex items-end justify-center" 
              aria-hidden
            >
              <img 
                src="/right_woman.png" 
                alt="여자" 
                className="h-full w-auto object-contain"
                style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 배경 이미지들 */}
        <motion.div 
          style={{ opacity: isVisible ? 0.6 : 0 }}
          transition={{ delay: 1.0, duration: 1.0 }}
          className="absolute inset-0 pointer-events-none" 
          aria-hidden
        >
          <div className="h-full w-full" style={{ backgroundImage: 'url(/bg_cafe.png)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(24px)', opacity: 0.32 }} />
        </motion.div>

        {/* 텍스트 */}
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={isAnimationComplete ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }}
          transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
          className="absolute left-1/2 top-1/2 z-10 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 px-6 text-center text-white"
        >
          <h3 className="text-3xl md:text-5xl font-semibold leading-tight">좋은 사람을 만났더라도…<br />놓친 경험이 있으신가요?</h3>
          <p className="mt-6 text-xl text-white/80 leading-relaxed">그 순간, 더 잘할 수 있었다면—<br />준비가 되었더라면 결과는 달라졌을 겁니다.</p>
        </motion.div>
      </div>
    </section>
  );
}

function Why(){
  return (
    <section id="why" className="relative py-24 sm:py-32">
      <div className="mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div className="card p-6 md:p-8">
          <div className="kicker">Why Deyonso</div>
          <h3 className="h2 mt-2">왜 지금, 데연소인가</h3>
          <ul className="mt-5 space-y-3 sub">
            <li>• 실전에서 <strong>놓친 순간</strong>을 연습으로 메꿉니다.</li>
            <li>• 만나고 싶은 상대와 <strong>유사한 페르소나</strong>로 리얼하게 준비합니다.</li>
            <li>• 대화 중 <strong>실시간 피드백</strong>이 보이니 다음 한 마디가 달라집니다.</li>
          </ul>
          <div className="mt-6 flex gap-2 flex-wrap">
            <span className="chip">AI 코칭</span>
            <span className="chip">시선·표정 분석</span>
            <span className="chip">목소리 톤</span>
            <span className="chip">시나리오 연습</span>
          </div>
        </div>
        <div className="card p-6 md:p-8">
          <div className="kicker">For Whom</div>
          <h3 className="h2 mt-2">이런 분께 추천해요</h3>
          <ul className="mt-5 space-y-3 sub">
            <li>• <strong>좋은 사람을 만나도</strong> 대화가 자연스럽게 이어지지 않는다.</li>
            <li>• 소개/미팅 전, <strong>워밍업</strong>이 필요하다.</li>
            <li>• <strong>표정/시선</strong>이 어색하다는 말을 듣는다.</li>
      </ul>
          <div className="mt-6 flex items-center gap-3">
            <a href="#persona" className="rounded-full px-5 py-2 text-sm font-semibold card">빠른 체험</a>
            <a href="/camera" className="rounded-full px-5 py-2 text-sm font-semibold" style={{ background: '#111', color: '#fff' }}>시작하기</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const sections = useMemo(() => ([
    { id: 'build', label: 'Demo' },
    { id: 'meet', label: 'Story' },
    { id: 'why', label: 'Why' },
    { id: 'persona', label: 'Persona' },
    { id: 'dialog', label: 'Dialogue' },
    { id: 'feedback', label: 'Feedback' },
    { id: 'report', label: 'Report' },
  ]), []);

  return (
    <>
      <Header />
      <DotsNav sections={sections} />
      <main>
        <PersonaBuildScene />
        <MeetDreamScene />
        <Why />
        <Chapter id="persona" label="Persona" title={`당신이 만나고 싶은 상대를\n정확히 그려냅니다`} subtitle={"성별·나이·직업·키워드·MBTI까지. 원하는 조건으로 AI 페르소나를 생성해 실제와 가까운 반응을 경험하세요."}
          image="/bg_park.png"
          tint="linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.9) 70%, #fff 100%)" />
        <Chapter id="dialog" label="Dialogue" title={`실제 데이트처럼\n자연스럽게 대화합니다`} subtitle={"표정과 말투, 맥락을 이해하는 대화 모델로 몰입감을 높였습니다. 음성/웹캠 옵션은 추후 연결."}
          image="/bg_city.png"
          tint="linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.9) 70%, #fff 100%)" />
        <Chapter id="feedback" label="Feedback" title={`대화 중 실시간으로\n지표가 움직입니다`} subtitle={"호감도·시선·미소·발화비율을 즉시 시각화합니다. 지금의 한 마디가 어떤 인상을 남기는지 바로 확인하세요."}
          image="/bg_cafe.png"
          tint="linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.92) 60%, #fff 100%)" />
        <Chapter id="report" label="Report" title={`끝나면 바로 리포트로\n다음 연습을 제안합니다`} subtitle={"요약 리포트와 세부 지표, 개선 포인트별 추천 시나리오까지 한 번에 정리합니다."}
          image="/bg_park.png"
          tint="linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.9) 70%, #fff 100%)" />
        <footer className="border-t" style={{ borderColor: "rgba(0,0,0,.06)" }}>
          <div className="mx-auto w-full px-6 py-12 flex items-center justify-between text-sm" style={{ color: "var(--muted)" }}>
            <span>© {new Date().getFullYear()} 데연소</span>
            <a href="/login" className="rounded-full px-4 py-1.5 font-medium" style={{ background: "#111", color: "#fff" }}>시작하기</a>
          </div>
        </footer>
      </main>
    </>
  );
}
