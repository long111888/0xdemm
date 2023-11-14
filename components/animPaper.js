import React, { useRef, useEffect } from 'react';

const Fireworks = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const papers = [];

    function addPapers(x, y, color) {
      // const amount = 100;
      // for (let i = 0; i < amount; i++) {
        papers.push(new Paper(x, y, color));
      // }
    }

    class Paper {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.width = Math.random() * 10 + 1;
        this.height = Math.random() * 10 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 + 1 ;
      }

      update() {
        this.x += this.speedX - 0.5;
        this.y += this.speedY;

        // if (this.size > 0.1) this.size -= 0.025;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.closePath();
        ctx.fill();
      }
    }

    function createPapers() {
      for (let i = 0; i < 500; i++) {
        const x = Math.random() * canvas.width*2/3 + canvas.width/6;
        const y = Math.random() * (canvas.height/6);
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        addPapers(x, y, color);
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < papers.length; i++) {
        papers[i].update();
        papers[i].draw();

        if (papers[i].size <= 0.1) {
          papers.splice(i, 1);
          i--;
        }
      }
      

      if (papers.length !== 0) {
        requestAnimationFrame(animate);
      }
    }
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    createPapers();
    animate();
  }, []);

  return <canvas ref={canvasRef} />;
};

export default Fireworks;