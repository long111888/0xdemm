import React, { useRef, useEffect } from 'react';

const Fireworks = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];

    function addParticles(x, y, color) {
      const amount = 100;
      for (let i = 0; i < amount; i++) {
        particles.push(new Particle(x, y, color));
      }
    }

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > 0.1) this.size -= 0.025;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }

    function createFireworks() {
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        addParticles(x, y, color);
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        if (particles[i].size <= 0.1) {
          particles.splice(i, 1);
          i--;
        }
      }
      

      if (particles.length !== 0) {
        requestAnimationFrame(animate);
      }
    }
     ctx.fillStyle = 'rgba(0, 0, 0, 0)';
     ctx.fillRect(0, 0, canvas.width, canvas.height);


    createFireworks();
    animate();
  }, []);

  return <canvas ref={canvasRef} />;
};

export default Fireworks;