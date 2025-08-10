'use client';

import React, { useEffect, useMemo, useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";



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
          <a href="/login" className="rounded-full px-4 py-1.5 text-sm font-medium card">시작하기</a>
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

/* === 0) Persona → Chat 빌드업 씬 (첫 화면) === */
function PersonaBuildScene(){
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="build" ref={ref} className="relative min-h-screen">
      <div className="sticky scroll-container">
        {/* 배경: 페르소나 풀샷 */}
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.12, opacity: 1 }}
          animate={isVisible ? { 
            scale: [1.12, 1.0, 0.8], 
            opacity: [1, 0.7, 0.5],
            clipPath: [
              'inset(0% 0% 0% 0% round 0px)',
              'inset(10% 10% 10% 10% round 20px)',
              'inset(19vh 21vw 19vh 21vw round 28px)'
            ]
          } : {}}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '28px',
            border: '1px solid rgba(0,0,0,.06)',
            filter: 'drop-shadow(0 40px 120px rgba(16,24,40,.12))'
          }}
        />
        <div className="vignette" />

        {/* 중앙 마이크 버튼 */}
        <motion.button
          type="button"
          aria-label="중앙 마이크"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 rounded-full grid place-items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{ width: 64, height: 64, background: '#fff', boxShadow: '0 14px 40px rgba(16,24,40,.25)', border: '1px solid rgba(0,0,0,.06)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3Z" stroke="#111" strokeWidth="1.5"/><path d="M19 11a7 7 0 1 1-14 0" stroke="#111" strokeWidth="1.5"/><path d="M12 18v3" stroke="#111" strokeWidth="1.5"/></svg>
        </motion.button>

        {/* 채팅 프레임 */}
        <motion.div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[24px] border overflow-hidden"
          initial={{ opacity: 0, scale: 1.06, y: 20, x: 0, width: '92vw', height: '70vh' }}
          animate={isVisible ? { 
            opacity: 1, 
            scale: 1, 
            y: 0, 
            x: 520, 
            width: '420px', 
            height: '82vh' 
          } : {}}
          transition={{ delay: 1, duration: 1.5, ease: "easeInOut" }}
          style={{ borderColor: 'rgba(0,0,0,.06)', boxShadow: '0 40px 120px rgba(16,24,40,.18)', background: '#fff' }}
        >
          {/* 헤더 */}
          <motion.div 
            className="flex items-center gap-3 px-5 py-4 border-b"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ delay: 1.5, duration: 0.5 }}
            style={{ borderColor: 'rgba(0,0,0,.06)' }}
          >
            <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=60" alt="persona" className="w-full h-full object-cover"/>
            </div>
            <div>
              <div className="text-sm font-semibold">AI 페르소나</div>
              <div className="text-xs text-gray-500">온라인 • 응답속도 빠름</div>
            </div>
          </motion.div>
          
          {/* 메시지 영역 */}
          <div className="p-5 space-y-3 h-full overflow-hidden">
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.8, duration: 0.5 }}
              className="flex justify-start"
            >
              <div className="max-w-[90%] rounded-2xl px-4 py-2" style={{ background: 'rgba(0,0,0,.06)' }}>안녕하세요! 오늘 어디서 만나고 싶으세요?</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 2.0, duration: 0.5 }}
              className="flex justify-end"
            >
              <div className="max-w-[90%] rounded-2xl px-4 py-2 text-white" style={{ background: '#111' }}>공원 산책 어때요? 날씨가 좋아요.</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 2.2, duration: 0.5 }}
              className="flex justify-start"
            >
              <div className="max-w-[90%] rounded-2xl px-4 py-2" style={{ background: 'rgba(0,0,0,.06)' }}>좋아요! 그럼 7시에 만나는 걸로 정할게요 :)</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 2.4, duration: 0.5 }}
              className="flex justify-end"
            >
              <div className="max-w-[90%] rounded-2xl px-4 py-2 text-white" style={{ background: '#111' }}>그럼 근처 카페로 이동해요. 위치 보내드릴게요.</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 2.6, duration: 0.5 }}
              className="flex justify-start"
            >
              <div className="max-w-[90%] rounded-2xl px-4 py-2" style={{ background: 'rgba(0,0,0,.06)' }}>좋아요! 저는 라떼 좋아해요 ☕️</div>
            </motion.div>
          </div>
          
          {/* 입력창 */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ delay: 2.8, duration: 0.5 }}
            className="absolute bottom-0 left-0 right-0 px-5 py-3 border-t bg-white/70 backdrop-blur"
            style={{ borderColor: 'rgba(0,0,0,.06)' }}
          >
            <div className="flex items-center gap-2">
              <button className="h-9 w-9 rounded-full border grid place-items-center" aria-label="음성 입력" style={{ borderColor: 'rgba(0,0,0,.08)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3Z" stroke="#111" strokeWidth="1.5"/><path d="M19 11a7 7 0 1 1-14 0" stroke="#111" strokeWidth="1.5"/><path d="M12 18v3" stroke="#111" strokeWidth="1.5"/></svg>
              </button>
              <input className="flex-1 h-10 rounded-full px-3 border" placeholder="메시지를 입력하세요…" style={{ borderColor: 'rgba(0,0,0,.08)' }} />
              <button className="px-4 h-10 rounded-full" style={{ background: '#111', color: '#fff' }}>전송</button>
            </div>
          </motion.div>
        </motion.div>

        {/* 상단 후킹 메시지 */}
        <motion.div 
          className="absolute top-6 left-1/2 -translate-x-1/2 z-30"
          initial={{ opacity: 0, y: 8 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 3.0, duration: 0.5 }}
        >
          <div className="rounded-full px-6 py-3 shadow" style={{ backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,.7)', border: '1px solid rgba(0,0,0,.06)' }}>
            <strong>데연소</strong> — 원하는 상대와 닮은 <strong>AI 페르소나</strong>와 대화하고, <strong>실시간 피드백</strong>과 <strong>리포트</strong>까지 한 번에.
          </div>
        </motion.div>

        {/* 좌측 실시간 피드백 패널 */}
        <motion.div 
          className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:block w-[360px]"
          initial={{ opacity: 0, x: -80 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 2.5, duration: 0.8 }}
        >
          <div className="rounded-[20px] border p-5" style={{ background: '#fff', borderColor: 'rgba(0,0,0,.06)', boxShadow: '0 24px 80px rgba(16,24,40,.12)' }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">호감도</div>
                <div className="mt-1 text-3xl font-bold">82%</div>
              </div>
              <div className="relative h-16 w-16 rounded-full" style={{ background: 'conic-gradient(#111 295deg, rgba(0,0,0,.08) 0deg)' }}>
                <div className="absolute inset-1 rounded-full bg-white border" style={{ borderColor: 'rgba(0,0,0,.08)' }} />
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs text-gray-500">대화 주도권</div>
              <div className="mt-2 h-2 rounded-full bg-gray-200 overflow-hidden">
                <motion.div 
                  className="h-2 bg-black rounded-full"
                  initial={{ width: '12%' }}
                  animate={isVisible ? { width: '68%' } : {}}
                  transition={{ delay: 3.0, duration: 1.0 }}
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-700">
              <div className="rounded-xl border p-3" style={{ borderColor: 'rgba(0,0,0,.06)', background: 'rgba(0,0,0,.02)' }}>
                <div>시선</div>
                <div className="mt-2 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                  <motion.div 
                    className="h-1.5 bg-black rounded-full"
                    initial={{ width: '20%' }}
                    animate={isVisible ? { width: '76%' } : {}}
                    transition={{ delay: 3.2, duration: 1.0 }}
                  />
                </div>
              </div>
              <div className="rounded-xl border p-3" style={{ borderColor: 'rgba(0,0,0,.06)', background: 'rgba(0,0,0,.02)' }}>
                <div>자세</div>
                <div className="mt-2 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                  <motion.div 
                    className="h-1.5 bg-black rounded-full"
                    initial={{ width: '15%' }}
                    animate={isVisible ? { width: '62%' } : {}}
                    transition={{ delay: 3.4, duration: 1.0 }}
                  />
                </div>
              </div>
              <div className="rounded-xl border p-3" style={{ borderColor: 'rgba(0,0,0,.06)', background: 'rgba(0,0,0,.02)' }}>
                <div>미소</div>
                <div className="mt-2 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                  <motion.div 
                    className="h-1.5 bg-black rounded-full"
                    initial={{ width: '10%' }}
                    animate={isVisible ? { width: '70%' } : {}}
                    transition={{ delay: 3.6, duration: 1.0 }}
                  />
                </div>
              </div>
              <div className="rounded-xl border p-3" style={{ borderColor: 'rgba(0,0,0,.06)', background: 'rgba(0,0,0,.02)' }}>
                <div>말투</div>
                <div className="mt-2 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                  <motion.div 
                    className="h-1.5 bg-black rounded-full"
                    initial={{ width: '18%' }}
                    animate={isVisible ? { width: '64%' } : {}}
                    transition={{ delay: 3.8, duration: 1.0 }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 border-t pt-4">
              <div className="text-xs text-gray-500">추천 팁</div>
              <ul className="mt-2 text-xs text-gray-700 list-disc pl-4 space-y-1">
                <li>시선은 2–3초마다 자연스럽게 교차하세요.</li>
                <li>대답은 짧게, 질문은 구체적으로.</li>
                <li>웃음은 억지보다 가벼운 미소가 좋아요.</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MeetDreamScene(){
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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

        <motion.div 
          style={{ x: isVisible ? '0%' : '-46%' }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute bottom-0 left-[8%] h-[70vh] w-[46vw] max-w-[680px] bg-bottom bg-contain bg-no-repeat" 
          aria-hidden
        >
          <div className="h-full w-full" style={{ backgroundImage: 'url(https://placehold.co/640x800/111111/FFFFFF?text=Female)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom' }} />
        </motion.div>
        
        <motion.div 
          style={{ x: isVisible ? '0%' : '46%' }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute bottom-0 right-[8%] h-[70vh] w-[46vw] max-w-[680px] bg-bottom bg-contain bg-no-repeat" 
          aria-hidden
        >
          <div className="h-full w-full" style={{ backgroundImage: 'url(https://placehold.co/640x800/111111/FFFFFF?text=Male)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom' }} />
        </motion.div>

        <motion.div 
          style={{ opacity: isVisible ? 0.6 : 0 }}
          transition={{ delay: 1.0, duration: 1.0 }}
          className="absolute inset-0 pointer-events-none" 
          aria-hidden
        >
          <div className="h-full w-full" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=60)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(24px)', opacity: 0.32 }} />
        </motion.div>

        <motion.div 
          style={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 16 }}
          transition={{ delay: 2.0, duration: 0.8 }}
          className="absolute left-1/2 top-1/2 z-10 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 px-6 text-center text-white"
        >
          <h3 className="text-3xl md:text-5xl font-semibold leading-tight">좋은 사람이 생겼더라도… 놓친 경험이 있으신가요?</h3>
          <p className="mt-4 text-white/70">그 순간, 더 잘할 수 있었다면— 준비가 있었다면 달라졌을 겁니다.</p>
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
            <a href="/login" className="rounded-full px-5 py-2 text-sm font-semibold" style={{ background: '#111', color: '#fff' }}>시작하기</a>
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
          image="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80"
          tint="linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.9) 70%, #fff 100%)" />
        <Chapter id="dialog" label="Dialogue" title={`실제 데이트처럼\n자연스럽게 대화합니다`} subtitle={"표정과 말투, 맥락을 이해하는 대화 모델로 몰입감을 높였습니다. 음성/웹캠 옵션은 추후 연결."}
          image="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1920&q=80"
          tint="linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.9) 70%, #fff 100%)" />
        <Chapter id="feedback" label="Feedback" title={`대화 중 실시간으로\n지표가 움직입니다`} subtitle={"호감도·시선·미소·발화비율을 즉시 시각화합니다. 지금의 한 마디가 어떤 인상을 남기는지 바로 확인하세요."}
          image="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1920&q=80"
          tint="linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.92) 60%, #fff 100%)" />
        <Chapter id="report" label="Report" title={`끝나면 바로 리포트로\n다음 연습을 제안합니다`} subtitle={"요약 리포트와 세부 지표, 개선 포인트별 추천 시나리오까지 한 번에 정리합니다."}
          image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1920&q=80"
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
