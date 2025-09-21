import React, { useRef, useEffect, useState } from "react";
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import Newnav from '../components/newNav';

export default function Game1() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);

  const scoreRef = useRef(0);
  const targetPosRef = useRef(null); // เก็บตำแหน่งเป้าหมายปัจจุบัน
  const [renderTrigger, setRenderTrigger] = useState(0); // trigger UI re-render

  const width = 640;
  const height = 480;
  const targetRadius = 30;
  const hitThreshold = 40;

  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(onResults);

    if (videoRef.current) {
      videoRef.current.width = width;
      videoRef.current.height = height;
    }
    if (canvasRef.current) {
      canvasRef.current.width = width;
      canvasRef.current.height = height;
    }

    if (videoRef.current) {
      cameraRef.current = new Camera(videoRef.current, {
        onFrame: async () => {
          await pose.send({ image: videoRef.current });
        },
        width,
        height,
      });
      cameraRef.current.start();
    }

    function setTargetFromHip(hip, side) {
      // ตรวจสอบค่าก่อนสร้าง
      if (
        hip &&
        typeof hip.x === "number" &&
        typeof hip.y === "number" &&
        hip.x > 0 &&
        hip.x < 1 &&
        hip.y > 0 &&
        hip.y < 1
      ) {
        targetPosRef.current = {
          x: hip.x * width + (side === "left" ? -100 : 100),
          y: hip.y * height,
          side,
        };
        console.log(`🎯 สร้างเป้าหมายฝั่ง ${side}`, targetPosRef.current);
      }
    }

    function onResults(results) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      // Mirror
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);

      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      if (!results.poseLandmarks) {
        ctx.restore();
        return;
      }

      const landmarks = [...results.poseLandmarks];

      // Swap left-right index
      const swapPairs = [
        [11, 12],
        [13, 14],
        [15, 16],
        [23, 24],
        [25, 26],
        [27, 28],
      ];
      for (const [leftIdx, rightIdx] of swapPairs) {
        const temp = landmarks[leftIdx];
        landmarks[leftIdx] = landmarks[rightIdx];
        landmarks[rightIdx] = temp;
      }

      const leftHip = landmarks[23];
      const rightHip = landmarks[24];

      const leftHipX = leftHip.x * canvas.width;
      const leftHipY = leftHip.y * canvas.height;
      const rightHipX = rightHip.x * canvas.width;
      const rightHipY = rightHip.y * canvas.height;

      // Debug hip position
      console.log("LeftHip:", leftHip, "RightHip:", rightHip);

      // สร้างตำแหน่งครั้งแรกถ้ายังไม่มี
      if (!targetPosRef.current) {
        setTargetFromHip(leftHip, "left");
      }

      const target = targetPosRef.current;

      // วาดวงกลมเป้าหมาย
      if (target) {
        ctx.beginPath();
        ctx.arc(target.x, target.y, targetRadius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
        ctx.fill();
      }

      // วาด landmark เอว
      ctx.beginPath();
      ctx.arc(leftHipX, leftHipY, 8, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(rightHipX, rightHipY, 8, 0, Math.PI * 2);
      ctx.fillStyle = "blue";
      ctx.fill();

      // ตรวจจับการชน
      if (target) {
        const hipToCheck = target.side === "left" ? leftHip : rightHip;
        const hipX = hipToCheck.x * canvas.width;
        const hipY = hipToCheck.y * canvas.height;
        const dist = Math.sqrt((hipX - target.x) ** 2 + (hipY - target.y) ** 2);

        if (dist < hitThreshold) {
          scoreRef.current += 1;
          setRenderTrigger((t) => t + 1); // อัปเดต UI
          console.log(`✅ แตะเป้าหมาย! คะแนน: ${scoreRef.current}`);

          if (target.side === "left") {
            setTargetFromHip(rightHip, "right");
          } else {
            setTargetFromHip(leftHip, "left");
          }
        }
      }

      // วาดคะแนน
      ctx.font = "24px Arial";
      ctx.fillStyle = "yellow";
      ctx.fillText(`Score: ${scoreRef.current}`, 20, 40);

      ctx.restore();
    }

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
    };
  }, []);

  return (
    <div>
    <Newnav />
        <div className="flex justify-center items-center h-dvh w-auto flex-col">
            <video
                ref={videoRef}
                style={{ display: "none" }}
                width={width}
                height={height}
                playsInline
                muted
            />
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                style={{ border: "1px solid black" }}
            />
        </div>
    </div>
  );
}