"use client";
import React, { useRef, useState } from "react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL as string;

export default function WebcamAnalyzer() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning] = useState(false);
  const [fps, setFps] = useState(4);
  const [result, setResult] = useState<any>(null);

  async function start() {
    if (!BACKEND) return alert("NEXT_PUBLIC_BACKEND_URL 미설정");
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 640 }, height: { ideal: 480 } }, audio: false,
    });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }
    setRunning(true);
    loopSend();
  }

  function stop() {
    setRunning(false);
    const v = videoRef.current;
    const s = v?.srcObject as MediaStream | null;
    s?.getTracks().forEach(t => t.stop());
    if (v) v.srcObject = null;
  }

  async function loopSend() {
    if (!running) return;
    try {
      const video = videoRef.current!;
      const cw = 480, ch = 360; // 업로드 해상도
      const canvas = canvasRef.current || document.createElement("canvas");
      if (!canvasRef.current) canvasRef.current = canvas;
      canvas.width = cw; canvas.height = ch;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(video, 0, 0, cw, ch);
      const blob: Blob = await new Promise(res => canvas.toBlob(b => res(b!), "image/jpeg", 0.7)!);

      const fd = new FormData();
      fd.append("frame", blob, "frame.jpg");

      const r = await fetch(`${BACKEND}/api/frame`, { method: "POST", body: fd });
      if (r.ok) setResult(await r.json());
    } catch (e) {
      console.warn("send fail", e);
    } finally {
      setTimeout(loopSend, Math.max(200, Math.round(1000 / fps)));
    }
  }

  return (
    <div className="p-4 grid gap-4 md:grid-cols-2">
      <div className="space-y-3">
        {!running ? (
          <button onClick={start} className="px-4 py-2 rounded border">Start</button>
        ) : (
          <button onClick={stop} className="px-4 py-2 rounded border">Stop</button>
        )}
        <label className="flex items-center gap-2 text-sm">
          FPS <input type="range" min={2} max={10} value={fps} onChange={(e)=>setFps(+e.target.value)} /> {fps}
        </label>
        <video ref={videoRef} playsInline muted className="w-full rounded border" />
      </div>

      <div className="space-y-3">
        <div className="font-semibold">서버 분석 결과</div>
        <pre className="text-xs p-3 rounded border max-h-[360px] overflow-auto">
{JSON.stringify(result, null, 2)}
        </pre>
        <img
          src={`${BACKEND}/api/overlay.jpg?ts=${Date.now()}`}
          onLoad={(e) => {
            setTimeout(() => {
              (e.target as HTMLImageElement).src = `${BACKEND}/api/overlay.jpg?ts=${Date.now()}`
            }, 1000);
          }}
          alt="overlay"
          className="w-full rounded border"
        />
      </div>
    </div>
  );
}
