'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'; // 랜폿서버 연결

interface AnalysisData {
  scores?: {
    total: number;
    A: number; // 집중도
    S: number; // 안정성
    R: number; // 이완도
    P: number; // 자세
    W: number; // 따뜻함
  };
  gaze_direction?: string;
  gaze_ratios?: { h: number; v: number };
  gaze_zone?: { h: string; v: string };
  blink_rate?: number;
  ear_value?: number;
  eye_size?: string;
  stability?: string;
  jump_distance?: number;
  focus_timer?: number;
  offscreen_timer?: number;
  velocity?: number;
  variance?: number;
  posture_status?: string;
  shoulder_tilt?: string;
  forward_head?: string;
  warmth_label?: string;
  smile_score?: number;
  coaching_message?: string;
}

export default function CameraPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData>({});
  const [config, setConfig] = useState({
    process_interval_sec: 1.0,
    stream_fps: 20,
    debug_overlay: true
  });
  const [calibStatus, setCalibStatus] = useState('대기 중…');
  const [history, setHistory] = useState<string[]>([]);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 설정 초기화
  useEffect(() => {
    initConfig();
  }, []);

  const initConfig = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/config`);
      if (response.ok) {
        const cfg = await response.json();
        setConfig(cfg);
      }
    } catch (error) {
      console.warn('설정 초기화 실패:', error);
    }
  };

  // 분석 시작
  const startAnalysis = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/start`, { method: 'POST' });
      if (response.ok) {
        setIsRunning(true);
        startPolling();
      }
    } catch (error) {
      console.error('분석 시작 실패:', error);
    }
  };

  // 분석 중지
  const stopAnalysis = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/stop`, { method: 'POST' });
      setIsRunning(false);
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    } catch (error) {
      console.error('분석 중지 실패:', error);
    }
  };

  // 데이터 폴링
  const startPolling = () => {
    const pollData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/data`);
        if (response.ok) {
          const data = await response.json();
          setAnalysisData(data);
          
          // 히스토리 업데이트
          const timestamp = new Date().toLocaleTimeString();
          const logEntry = `[${timestamp}] gaze=${data.gaze_direction} | blink=${data.blink_rate} | EAR=${data.ear_value} | jump=${data.jump_distance} | focus=${data.focus_timer}s | smile=${data.smile_score}`;
          setHistory(prev => {
            const newHistory = [...prev, logEntry];
            return newHistory.slice(-12); // 최근 12개만 유지
          });
        }
      } catch (error) {
        console.error('데이터 폴링 실패:', error);
      }
    };

    pollData(); // 즉시 실행
    pollIntervalRef.current = setInterval(pollData, Math.max(100, Math.round(config.process_interval_sec * 1000)));
  };

  // 분석 주기 변경
  const updateInterval = async (seconds: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/config/interval?seconds=${seconds}`, { method: 'POST' });
      if (response.ok) {
        setConfig(prev => ({ ...prev, process_interval_sec: seconds }));
        // 폴링 재시작
        if (isRunning) {
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
          }
          startPolling();
        }
      }
    } catch (error) {
      console.error('주기 변경 실패:', error);
    }
  };

  // 디버그 오버레이 토글
  const toggleDebug = async (enabled: boolean) => {
    try {
      await fetch(`${BACKEND_URL}/api/config/debug?enable=${enabled ? 1 : 0}`, { method: 'POST' });
      setConfig(prev => ({ ...prev, debug_overlay: enabled }));
    } catch (error) {
      console.error('디버그 토글 실패:', error);
    }
  };

  // 캘리브레이션 시작
  const startCalibration = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/calibrate/start?seconds=5`, { method: 'POST' });
      setCalibStatus('수집 중… 0%');
      pollCalibrationStatus();
    } catch (error) {
      console.error('캘리브레이션 시작 실패:', error);
    }
  };

  // 캘리브레이션 상태 폴링
  const pollCalibrationStatus = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/calibrate/status`);
      if (response.ok) {
        const data = await response.json();
        if (data.collecting) {
          setCalibStatus(`수집 중… ${(data.progress * 100).toFixed(0)}%`);
          setTimeout(pollCalibrationStatus, 300);
        } else {
          setCalibStatus('완료 또는 대기 중');
        }
      }
    } catch (error) {
      console.error('캘리브레이션 상태 확인 실패:', error);
    }
  };

  const scores = analysisData.scores || { total: 0, A: 0, S: 0, R: 0, P: 0, W: 0 };
  const pct = (x: number) => Math.round(x * 100);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-sky-500 to-indigo-500 p-3 rounded-xl mb-4 flex justify-between items-center"
        >
          <h1 className="text-lg font-semibold text-white">데연소 - 실시간 피드백</h1>
          <div className="flex gap-2">
            <button
              onClick={isRunning ? stopAnalysis : startAnalysis}
              className="bg-slate-800 text-white border border-white/15 px-3 py-2 rounded-lg text-sm hover:bg-slate-700 transition-colors"
            >
              {isRunning ? '분석 중지' : '분석 시작'}
            </button>
            <button
              onClick={() => setShowVideo(!showVideo)}
              className="bg-slate-800 text-white border border-white/15 px-3 py-2 rounded-lg text-sm hover:bg-slate-700 transition-colors"
            >
              {showVideo ? '영상 숨기기' : '영상 보기'}
            </button>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* 좌측: 종합 점수 및 설정 */}
          <div className="lg:col-span-3 space-y-4">
            {/* 종합 점수 카드 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-800 border border-white/6 rounded-xl p-4"
            >
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-white mb-2">{pct(scores.total)}</div>
                <div className="text-slate-400 text-sm">
                  {scores.total >= 0.85 ? '매우 좋음' : scores.total >= 0.7 ? '좋음' : scores.total >= 0.5 ? '보통' : '개선 필요'}
                  {' · 실시간 종합 코칭'}
                </div>
              </div>

              {/* 설정 패널 */}
              <div className="bg-slate-700 border border-white/6 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <label className="text-sm text-slate-300">분석 주기</label>
                  <input
                    type="range"
                    min="0.2"
                    max="5"
                    step="0.1"
                    value={config.process_interval_sec}
                    onChange={(e) => updateInterval(parseFloat(e.target.value))}
                    className="w-48"
                  />
                  <span className="text-sm text-slate-400">{config.process_interval_sec.toFixed(1)}s</span>
                  <label className="text-sm">
                    <input
                      type="checkbox"
                      checked={config.debug_overlay}
                      onChange={(e) => toggleDebug(e.target.checked)}
                      className="mr-2"
                    />
                    디버그 오버레이
                  </label>
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  슬라이더를 움직여 분석 빈도를 조절하세요 (0.2~5초/회)
                </div>
              </div>

              {/* 캘리브레이션 */}
              <div className="bg-slate-700 border border-white/6 rounded-lg p-3 mb-4">
                <button
                  onClick={startCalibration}
                  className="bg-slate-600 text-white border border-white/15 px-3 py-2 rounded-lg text-sm hover:bg-slate-500 transition-colors"
                >
                  캘리브레이션 시작(5s)
                </button>
                <span className="ml-3 text-sm text-slate-400">{calibStatus}</span>
              </div>

              {/* 메트릭 그리드 */}
              <div className="grid grid-cols-2 gap-3">
                <MetricCard
                  title="집중도(시선)"
                  score={scores.A}
                  subtitle={`focus=${analysisData.focus_timer}s · gaze=${analysisData.gaze_direction}`}
                  coaching={scores.A >= 0.85 ? "좋아요! 2–3초 리듬 응시 유지." : 
                    (analysisData.focus_timer && analysisData.focus_timer >= 3) ? "시선 이탈 길어요. 얼굴 삼각형에 2–3초." : 
                    "시선을 얼굴 중심으로 천천히 복귀."}
                />
                <MetricCard
                  title="시선 안정성"
                  score={scores.S}
                  subtitle={`stability=${analysisData.stability} · jump=${Number(analysisData.jump_distance || 0).toFixed(3)}`}
                  coaching={scores.S >= 0.85 ? "안정적인 시선!" : 
                    analysisData.stability === "불안정" ? "문장 단위로 시선 고정 후 전환." : 
                    "시선을 조금 더 천천히 움직이세요."}
                />
                <MetricCard
                  title="이완도(깜빡임/눈)"
                  score={scores.R}
                  subtitle={`blink/min=${analysisData.blink_rate} · eye=${analysisData.eye_size} · EAR=${analysisData.ear_value}`}
                  coaching={scores.R >= 0.85 ? "눈 이완 좋음." : 
                    (analysisData.blink_rate && analysisData.blink_rate < 10) ? "깜빡임이 적어요. 자연 깜빡임." :
                    (analysisData.blink_rate && analysisData.blink_rate > 25) ? "깜빡임 많음. 속도 낮추고 호흡." :
                    analysisData.eye_size === "실눈" ? "실눈 경향, 눈가 이완+미소." :
                    analysisData.eye_size === "너무큼" ? "눈 과확대, 부드럽게." : "미소 살짝 곁들이기."}
                />
                <MetricCard
                  title="자세"
                  score={scores.P}
                  subtitle={`shoulder_tilt=${analysisData.shoulder_tilt} · forward_head=${analysisData.forward_head} · status=${analysisData.posture_status}`}
                  coaching={scores.P >= 0.9 ? "자세 좋습니다." : "어깨 열고 상체를 약간 전방으로."}
                />
                <MetricCard
                  title="표정 따뜻함(미소)"
                  score={scores.W}
                  subtitle={`smile=${analysisData.smile_score} · ${analysisData.warmth_label}`}
                  coaching={scores.W >= 0.75 ? "따뜻한 미소 좋아요." : "입꼬리를 살짝 올려 부드럽게."}
                />
              </div>

              {/* 코칭 메시지 */}
              {analysisData.coaching_message && (
                <div className="mt-4 p-3 bg-slate-700 border border-white/6 rounded-lg">
                  <div className="text-sm text-slate-300">{analysisData.coaching_message}</div>
                </div>
              )}

              {/* 비디오 스트림 */}
              {showVideo && (
                <div className="mt-4">
                  <img
                    src={`${BACKEND_URL}/video?debug=${config.debug_overlay ? 1 : 0}`}
                    alt="실시간 분석"
                    className="w-full rounded-lg border border-white/8"
                  />
                </div>
              )}
            </motion.div>
          </div>

          {/* 우측: 로그 및 상세 정보 */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-800 border border-white/6 rounded-xl p-4"
            >
              <h3 className="text-lg font-semibold mb-4">실시간 로그</h3>
              
              {/* 키-값 정보 */}
              <div className="grid grid-cols-[140px_1fr] gap-2 text-sm mb-4">
                <div className="text-slate-400">gaze_direction</div>
                <div>{analysisData.gaze_direction || '-'}</div>
                <div className="text-slate-400">gaze_ratios</div>
                <div>h={analysisData.gaze_ratios?.h || '-'}, v={analysisData.gaze_ratios?.v || '-'}</div>
                <div className="text-slate-400">gaze_zone</div>
                <div>h={analysisData.gaze_zone?.h || '-'}, v={analysisData.gaze_zone?.v || '-'}</div>
                <div className="text-slate-400">blink_rate</div>
                <div>{analysisData.blink_rate || '-'} /min</div>
                <div className="text-slate-400">EAR</div>
                <div>{analysisData.ear_value || '-'}</div>
                <div className="text-slate-400">eye_size</div>
                <div>{analysisData.eye_size || '-'}</div>
                <div className="text-slate-400">stability</div>
                <div>{analysisData.stability || '-'}</div>
                <div className="text-slate-400">jump_distance</div>
                <div>{Number(analysisData.jump_distance || 0).toFixed(4)}</div>
                <div className="text-slate-400">focus_timer</div>
                <div>{analysisData.focus_timer || '-'}s</div>
                <div className="text-slate-400">offscreen_timer</div>
                <div>{Number(analysisData.offscreen_timer || 0).toFixed(2)} s</div>
                <div className="text-slate-400">velocity / variance</div>
                <div>{Number(analysisData.velocity || 0).toFixed(3)} / {Number(analysisData.variance || 0).toFixed(4)}</div>
                <div className="text-slate-400">posture</div>
                <div>{analysisData.posture_status || '-'} (tilt={analysisData.shoulder_tilt || '-'}, head={analysisData.forward_head || '-'})</div>
                <div className="text-slate-400">warmth</div>
                <div>{analysisData.warmth_label || '-'} (smile={analysisData.smile_score || '-'})</div>
                <div className="text-slate-400">coaching_message</div>
                <div>{analysisData.coaching_message || '-'}</div>
              </div>

              {/* 로그 박스 */}
              <div className="bg-slate-900 border border-white/6 rounded-lg p-3 max-h-60 overflow-auto">
                <div className="text-xs font-mono space-y-1">
                  {history.map((entry, index) => (
                    <div key={index} className="text-slate-300">{entry}</div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 메트릭 카드 컴포넌트
function MetricCard({ title, score, subtitle, coaching }: {
  title: string;
  score: number;
  subtitle: string;
  coaching: string;
}) {
  const pct = (x: number) => Math.round(x * 100);
  
  return (
    <div className="bg-slate-700 border border-white/6 rounded-lg p-3">
      <h3 className="text-sm font-semibold mb-2">{title}</h3>
      <div className="h-2.5 bg-white/8 rounded-full overflow-hidden mb-2">
        <motion.div
          className="h-full bg-gradient-to-r from-green-500 to-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${pct(score)}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <div className="text-xs text-slate-400 mb-1">{subtitle}</div>
      <div className="text-xs text-slate-300">{coaching}</div>
    </div>
  );
}
