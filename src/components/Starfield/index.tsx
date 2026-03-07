import { useEffect, useRef } from 'react';
import './Starfield.css';

interface Star {
  x: number;
  y: number;
  depth: number;
  baseOpacity: number;
  phaseOffset: number;
}

const NUM_STARS = 280;
const DRIFT_SPEED = 0.06;
const TWINKLE_AMP = 0.18;

const Starfield = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let stars: Star[] = [];
    let frame = 0;

    const initStars = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      stars = Array.from({ length: NUM_STARS }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        depth: Math.random() * 0.85 + 0.15,
        baseOpacity: Math.random() * 0.55 + 0.15,
        phaseOffset: Math.random() * Math.PI * 2,
      }));
    };

    initStars();
    window.addEventListener('resize', initStars);

    const draw = () => {
      frame++;

      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const star of stars) {
        star.y += DRIFT_SPEED * star.depth;
        if (star.y > canvas.height) star.y -= canvas.height;

        const twinkle = Math.sin(frame * 0.018 * star.depth + star.phaseOffset) * TWINKLE_AMP;
        const opacity = Math.max(0, Math.min(1, star.baseOpacity + twinkle));
        const radius = star.depth * 1.5 + 0.2;

        ctx.beginPath();
        ctx.arc(star.x, star.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 235, 255, ${opacity.toFixed(3)})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', initStars);
    };
  }, []);

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />;
};

export default Starfield;
