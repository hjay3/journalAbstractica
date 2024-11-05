import React, { useEffect, useRef } from 'react';

interface AbstractCanvasProps {
  onAnimationChange: () => void;
}

interface Rectangle {
  x: number;
  y: number;
  baseWidth: number;
  baseHeight: number;
  phase: number;
  speed: number;
  hueOffset: number;
  saturation: number;
  brightness: number;
  brownianX: number;
  brownianY: number;
  targetBrownianX: number;
  targetBrownianY: number;
  lastBrownianUpdate: number;
  widthPhase: number;
  heightPhase: number;
  widthFreq: number;
  heightFreq: number;
}

export function AbstractCanvas({ onAnimationChange }: AbstractCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true })!;
    let time = 0;
    let lastChange = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const rectangles: Rectangle[] = Array.from({ length: 12 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      baseWidth: Math.random() * 120 + 40,
      baseHeight: Math.random() * 120 + 40,
      phase: Math.random() * Math.PI * 2,
      speed: 0.0002 + Math.random() * 0.0004,
      hueOffset: Math.random() * 360,
      saturation: 60 + Math.random() * 20,
      brightness: 30 + Math.random() * 20,
      brownianX: 0,
      brownianY: 0,
      targetBrownianX: 0,
      targetBrownianY: 0,
      lastBrownianUpdate: 0,
      widthPhase: Math.random() * Math.PI * 2,
      heightPhase: Math.random() * Math.PI * 2,
      widthFreq: 0.0001 + Math.random() * 0.0002,
      heightFreq: 0.0002 + Math.random() * 0.0002,
    }));

    const updateRectangle = (rect: Rectangle) => {
      if (time - rect.lastBrownianUpdate > 3000) {
        rect.targetBrownianX = (Math.random() - 0.5) * 30;
        rect.targetBrownianY = (Math.random() - 0.5) * 30;
        rect.lastBrownianUpdate = time;
      }

      rect.brownianX += (rect.targetBrownianX - rect.brownianX) * 0.002;
      rect.brownianY += (rect.targetBrownianY - rect.brownianY) * 0.002;

      const widthScale = Math.sin(time * rect.widthFreq + rect.widthPhase) * 0.2 + 0.8;
      const heightScale = Math.sin(time * rect.heightFreq + rect.heightPhase) * 0.2 + 0.8;
      const baseScale = Math.sin(time * rect.speed + rect.phase) * 0.15 + 0.85;

      const currentWidth = rect.baseWidth * widthScale * baseScale;
      const currentHeight = rect.baseHeight * heightScale * baseScale;
      const hue = (time * 0.01 + rect.hueOffset) % 360;

      const gradient = ctx.createRadialGradient(
        rect.x + rect.brownianX,
        rect.y + rect.brownianY,
        0,
        rect.x + rect.brownianX,
        rect.y + rect.brownianY,
        currentWidth
      );

      gradient.addColorStop(0, `hsla(${hue}, ${rect.saturation}%, ${rect.brightness}%, 0.15)`);
      gradient.addColorStop(1, `hsla(${(hue + 30) % 360}, ${rect.saturation}%, ${rect.brightness}%, 0.02)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(
        rect.x + rect.brownianX,
        rect.y + rect.brownianY,
        currentWidth / 2,
        currentHeight / 2,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
    };

    const draw = (timestamp: number) => {
      time = timestamp;
      
      if (timestamp - lastChange > 5000) {
        lastChange = timestamp;
        onAnimationChange();
      }

      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'screen';
      rectangles.forEach(updateRectangle);
      ctx.globalCompositeOperation = 'source-over';
      
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    animationFrameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [onAnimationChange]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 1 }}
    />
  );
}