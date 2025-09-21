import React, { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import Newnav from "../components/newNav";

export default function Game2() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [mirror, setMirror] = useState(true);

  // เก็บวัตถุในเกม
  const objectsRef = useRef([]);

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    hands.setOptions({
      selfieMode: true,
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6,
    });

    hands.onResults(onResults);

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });
    camera.start();

    // spawn object ทุก 1.5 วิ
    const spawnInterval = setInterval(() => {
      objectsRef.current.push({
        x: Math.random() * 600 + 20,
        y: -20,
        radius: 20,
        speed: 2 + Math.random() * 2,
      });
    }, 1500);

    return () => {
      clearInterval(spawnInterval);
    };
  }, [mirror]);

  function onResults(results) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = results.image.width;
    canvas.height = results.image.height;

    // 1) วาดพื้นหลังแบบ mirror
    ctx.save();
    if (mirror) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    // 2) อัปเดตตำแหน่ง object
    objectsRef.current.forEach((obj) => {
      obj.y += obj.speed;
    });

    // 3) ตรวจชน landmarks + mirror พิกัด
    if (results.multiHandLandmarks) {
      results.multiHandLandmarks.forEach((landmarks) => {
        drawConnectors(ctx, landmarks, Hands.HAND_CONNECTIONS, {
          color: "#0f0",
          lineWidth: 2,
        });
        drawLandmarks(ctx, landmarks, { color: "#f00", lineWidth: 1 });

        landmarks.forEach((lm) => {
          let lx = lm.x * canvas.width;
          if (mirror) {
            lx = canvas.width - lx; // สลับซ้าย-ขวา
          }
          const ly = lm.y * canvas.height;

          objectsRef.current = objectsRef.current.filter((obj) => {
            const dx = obj.x - lx;
            const dy = obj.y - ly;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < obj.radius + 10) {
              setScore((s) => s + 1);
              return false; // ชน → ลบออก
            }
            return true;
          });
        });
      });
    }

    // 4) วาด object
    ctx.fillStyle = "rgba(255, 255, 0, 0.8)";
    objectsRef.current.forEach((obj) => {
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // ลบ object ที่ตกพ้นจอ
    objectsRef.current = objectsRef.current.filter(
      (obj) => obj.y < canvas.height + obj.radius
    );
  }

  return (
    <>
      <Newnav />
      <div className="flex justify-center items-center h-dvh w-auto flex-col">
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <h2>🎯 Hand Landmarks Game</h2>
          <p>Score: {score}</p>
          <div style={{ position: "relative", display: "inline-block" }}>
            <video
              ref={videoRef}
              style={{ display: "none" }}
              playsInline
              muted
            />
            <canvas
              ref={canvasRef}
              style={{
                width: 640,
                height: 480,
                borderRadius: 8,
                background: "#000",
              }}
            />
          </div>
          <div style={{ marginTop: 8 }}>
            <label>
              <input
                type="checkbox"
                checked={mirror}
                onChange={(e) => setMirror(e.target.checked)}
              />{" "}
              Mirror
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
