'use client';

import { useEffect, useRef } from 'react';

interface Neuron {
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: number[];
}

export function NeuronBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const neuronsRef = useRef<Neuron[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize neurons - fewer for subtle effect
    const initNeurons = () => {
      const neurons: Neuron[] = [];
      const count = Math.floor((window.innerWidth * window.innerHeight) / 50000); // Very sparse

      for (let i = 0; i < count; i++) {
        neurons.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.2, // Very slow movement
          vy: (Math.random() - 0.5) * 0.2,
          connections: [],
        });
      }

      neuronsRef.current = neurons;
    };
    initNeurons();

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const neurons = neuronsRef.current;
      const maxDistance = 200;

      // Update positions
      neurons.forEach(neuron => {
        neuron.x += neuron.vx;
        neuron.y += neuron.vy;

        // Bounce off edges
        if (neuron.x < 0 || neuron.x > canvas.width) neuron.vx *= -1;
        if (neuron.y < 0 || neuron.y > canvas.height) neuron.vy *= -1;
      });

      // Draw connections - very subtle
      neurons.forEach((neuron, i) => {
        neurons.slice(i + 1).forEach(other => {
          const dx = neuron.x - other.x;
          const dy = neuron.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.08; // Very faint
            ctx.strokeStyle = `rgba(74, 124, 89, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(neuron.x, neuron.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });

      // Draw neurons - subtle nodes
      neurons.forEach(neuron => {
        ctx.beginPath();
        ctx.arc(neuron.x, neuron.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(74, 124, 89, 0.15)';
        ctx.fill();

        // Subtle glow
        const gradient = ctx.createRadialGradient(neuron.x, neuron.y, 0, neuron.x, neuron.y, 8);
        gradient.addColorStop(0, 'rgba(74, 124, 89, 0.1)');
        gradient.addColorStop(1, 'rgba(74, 124, 89, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(neuron.x, neuron.y, 8, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
