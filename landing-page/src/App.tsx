import { useEffect, useRef, useState } from 'react';

const BG_IMAGE_1 = "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85";
const BG_IMAGE_2 = "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85";
const SPOTLIGHT_R = 260;

const RevealLayer = ({ cursorX, cursorY }: { cursorX: number; cursorY: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [maskUrl, setMaskUrl] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set actual size in memory (scaled to match screen)
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (cursorX === -999) return;

    // Draw the soft radial gradient mask
    const gradient = ctx.createRadialGradient(
      cursorX, cursorY, 0,
      cursorX, cursorY, SPOTLIGHT_R
    );

    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.75)');
    gradient.addColorStop(0.75, 'rgba(255, 255, 255, 0.4)');
    gradient.addColorStop(0.88, 'rgba(255, 255, 255, 0.12)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fill();

    setMaskUrl(canvas.toDataURL());
  }, [cursorX, cursorY]);

  // Handle window resize dynamically to re-trigger mask generation
  useEffect(() => {
    const handleResize = () => setMaskUrl(prev => prev + ' '); // force re-render
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ display: 'none' }} />
      <div 
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
        style={{ 
          backgroundImage: `url(${BG_IMAGE_2})`,
          maskImage: maskUrl ? `url(${maskUrl})` : 'none',
          WebkitMaskImage: maskUrl ? `url(${maskUrl})` : 'none',
          maskSize: '100% 100%',
          WebkitMaskSize: '100% 100%',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat'
        }}
      />
    </>
  );
};

function App() {
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });
  const rawMouse = useRef({ x: -999, y: -999 });
  const smoothMouse = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      rawMouse.current = { x: e.clientX, y: e.clientY };
      // Initialize smooth immediately on first move to prevent weird jumping
      if (smoothMouse.current.x === -999) {
        smoothMouse.current = { x: e.clientX, y: e.clientY };
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    const updateLoop = () => {
      if (smoothMouse.current.x !== -999) {
        // Lerp
        smoothMouse.current.x += (rawMouse.current.x - smoothMouse.current.x) * 0.1;
        smoothMouse.current.y += (rawMouse.current.y - smoothMouse.current.y) * 0.1;
        setCursorPos({ x: smoothMouse.current.x, y: smoothMouse.current.y });
      }
      rafRef.current = requestAnimationFrame(updateLoop);
    };

    rafRef.current = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white tracking-[-0.02em]" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5">
        <div className="flex items-center gap-2">
          {/* SVG Logo */}
          <svg width="26" height="26" viewBox="0 0 256 256" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
            <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
          </svg>
          <span className="text-white text-2xl font-playfair italic">India.Runs</span>
        </div>

        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 items-center gap-1">
          <a href="https://github.com/NISHANTH-KONCHADA/cognitive-triad-ranker/blob/main/landing-page/src/assets/dig.png?raw=true" target="_blank" rel="noreferrer" className="text-white hover:bg-white/20 transition-colors px-4 py-1.5 rounded-full text-sm font-medium">Architecture Diagram</a>
          <a href="https://github.com/NISHANTH-KONCHADA/cognitive-triad-ranker" target="_blank" rel="noreferrer" className="text-white/80 hover:bg-white/20 hover:text-white transition-colors px-4 py-1.5 rounded-full text-sm font-medium">Source Code</a>
        </div>

        <a href="https://github.com/NISHANTH-KONCHADA/cognitive-triad-ranker" target="_blank" rel="noreferrer" className="hidden md:block bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 cursor-pointer">
          View on GitHub
        </a>
      </nav>

      <section className="relative w-full overflow-hidden bg-black" style={{ height: '100dvh' }}>
        
        {/* Base Layer */}
        <div 
          className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom"
          style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
        />

        {/* Reveal Layer */}
        <RevealLayer cursorX={cursorPos.x} cursorY={cursorPos.y} />

        {/* Text Layer */}
        <div className="absolute top-[14%] left-0 right-0 flex flex-col items-center text-center px-5 pointer-events-none z-50">
          <h1 className="text-white leading-[0.95]">
            <span 
              className="block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal" 
              style={{ letterSpacing: '-0.05em', animationDelay: '0.25s' }}>
              Data holds
            </span>
            <span 
              className="block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1 hero-anim hero-reveal" 
              style={{ letterSpacing: '-0.08em', animationDelay: '0.42s' }}>
              tales of talent
            </span>
          </h1>
        </div>

        {/* Bottom Left Context */}
        <div 
          className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[260px] z-50 hero-anim hero-fade"
          style={{ animationDelay: '0.7s' }}
        >
          <p className="text-sm text-white/80 leading-relaxed">
            Every data point records a chapter of a candidate's journey, from complex codebases to behavioral signals, layered across thousands of commits.
          </p>
        </div>

        {/* Bottom Right CTA */}
        <div 
          className="absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] flex flex-col items-start gap-4 sm:gap-5 z-50 hero-anim hero-fade"
          style={{ animationDelay: '0.85s' }}
        >
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Our blazingly fast Cognitive Triad Architecture lets you peel back the noise to trace how raw engineering skills and heuristics combine to find the perfect hire.
          </p>
          <a 
            href="https://colab.research.google.com/drive/1hsgdND3edPTgdujltDK42j_wqRjzZ2tD?usp=sharing"
            target="_blank"
            rel="noreferrer"
            className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30 pointer-events-auto cursor-pointer inline-block"
          >
            Run Sandbox
          </a>
        </div>

      </section>
    </div>
  );
}

export default App;
