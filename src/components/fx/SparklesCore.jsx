import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
SparklesCore.propTypes = {
  className       : PropTypes.string,
  particleDensity : PropTypes.number,
  minSize         : PropTypes.number,
  maxSize         : PropTypes.number,
  particleColor   : PropTypes.string,
  background      : PropTypes.string,
};


export default function SparklesCore({
  className = '',
  particleDensity = 80,
  minSize = 0.4,
  maxSize = 1.2,
  particleColor = '#FFFFFF',
  background = 'transparent',
  ...rest
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    let raf;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: particleDensity }, () => ({
      x : Math.random() * canvas.width,
      y : Math.random() * canvas.height,
      r : Math.random() * (maxSize - minSize) + minSize,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));

    const draw = () => {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = particleColor;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [particleDensity, minSize, maxSize, particleColor, background]);

  return <canvas ref={canvasRef} className={className} {...rest} />;
}
