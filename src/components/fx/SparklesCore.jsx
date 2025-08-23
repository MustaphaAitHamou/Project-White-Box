import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Effet de particules “sparkles” rendu sur un <canvas>.
 * Je dessine des points qui se déplacent doucement avec rebond sur les bords.
 * Je laisse tout configurable via les props (densité, tailles, couleurs, fond).
 */
SparklesCore.propTypes = {
  className       : PropTypes.string,
  particleDensity : PropTypes.number, // nombre de particules à instancier
  minSize         : PropTypes.number, // rayon minimum
  maxSize         : PropTypes.number, // rayon maximum
  particleColor   : PropTypes.string, // couleur des particules
  background      : PropTypes.string, // couleur de fond (ex: 'transparent')
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
    let raf; // id de la frame pour pouvoir annuler l’animation au cleanup

    // Je cale le canvas sur sa taille affichée pour éviter le flou.
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Je crée un tableau de particules avec position, rayon et petites vitesses.
    const particles = Array.from({ length: particleDensity }, () => ({
      x : Math.random() * canvas.width,
      y : Math.random() * canvas.height,
      r : Math.random() * (maxSize - minSize) + minSize,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));

    // Boucle d’animation : je nettoie le fond puis je dessine chaque particule.
    const draw = () => {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = particleColor;
      particles.forEach(p => {
        // Je déplace la particule…
        p.x += p.vx;
        p.y += p.vy;
        // …et je gère un rebond simple sur les bords.
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    draw();

    // Je nettoie proprement : j’annule l’animation et je retire l’écouteur resize.
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [particleDensity, minSize, maxSize, particleColor, background]);

  // Je laisse passer className et le reste des props (data-*, aria, style…).
  return <canvas ref={canvasRef} className={className} {...rest} />;
}
