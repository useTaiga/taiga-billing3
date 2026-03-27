"use client";

import { useState, useEffect, useRef, useCallback } from "react";

function initDna(
  canvas: HTMLCanvasElement,
  densityMultiplier = 1,
  alignment = 0.5,
) {
  const ctx = canvas.getContext("2d")!;
  let width: number,
    height: number,
    t = 0;
  const particles: Particle[] = [];
  const bases = ["A", "T", "C", "G"];
  let animFrameId: number;

  function resize() {
    width = canvas.width = canvas.offsetWidth || window.innerWidth;
    height = canvas.height = canvas.offsetHeight || window.innerHeight;
  }

  window.addEventListener("resize", resize);
  resize();

  class Particle {
    y: number;
    offset: number;
    char: string;
    x = 0;
    screenY = 0;
    size = 0;
    alpha = 0;

    constructor(y: number, offset: number, char: string) {
      this.y = y;
      this.offset = offset;
      this.char = char;
    }
    update(time: number) {
      const angle = this.y * 0.05 + time + this.offset;
      const radius = width < 768 ? 80 : 150;
      const x3d = Math.sin(angle) * radius;
      const z3d = Math.cos(angle) * radius;
      const fov = 1000;
      const scale = fov / (fov + z3d);
      this.x = width * alignment + x3d * scale;
      this.screenY = this.y * 15 * scale + height * 0.1;
      this.size = 12 * scale;
      this.alpha = scale > 1 ? 1 : 0.3;
    }
    draw() {
      ctx.font = `bold ${this.size}px Helvetica, sans-serif`;
      ctx.fillStyle = `rgba(0,0,0, ${this.alpha})`;
      ctx.textAlign = "center";
      ctx.fillText(this.char, this.x, this.screenY);
    }
  }

  for (let i = 0; i < 80 * densityMultiplier; i++) {
    const char = bases[i % 4];
    const pairChar =
      char === "A" ? "T" : char === "T" ? "A" : char === "C" ? "G" : "C";
    particles.push(new Particle(i, 0, char));
    particles.push(new Particle(i, Math.PI, pairChar));
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    t += 0.008;
    ctx.strokeStyle = "rgba(0,0,0,0.15)";
    for (let i = 0; i < particles.length; i += 2) {
      const p1 = particles[i];
      const p2 = particles[i + 1];
      p1.update(t);
      p2.update(t);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.screenY);
      ctx.lineTo(p2.x, p2.screenY);
      ctx.stroke();
      p1.draw();
      p2.draw();
    }
    animFrameId = requestAnimationFrame(animate);
  }
  animate();

  return () => {
    window.removeEventListener("resize", resize);
    cancelAnimationFrame(animFrameId);
  };
}

function LandingView({
  onEnter,
  isActive,
  isHidden,
}: {
  onEnter: () => void;
  isActive: boolean;
  isHidden: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      return initDna(canvasRef.current, 1.5, 0.5);
    }
  }, []);

  if (isHidden) return null;

  return (
    <section
      className="fixed inset-0 z-50 flex flex-col justify-between bg-white p-8 transition-transform duration-1000 ease-[cubic-bezier(0.85,0,0.15,1)] md:p-12"
      style={isActive ? { transform: "translateY(-100%)" } : undefined}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
      />

      <nav className="z-10 flex items-center justify-between text-xs uppercase tracking-widest">
        <div className="font-medium">TAIGA HEALTH</div>
        <div className="hidden text-muted-foreground sm:block">
          AI-POWERED BILLING
        </div>
        <div className="text-muted-foreground">EST. 2026</div>
      </nav>

      <div className="z-10 max-w-xl">
        <h2 className="mb-6 text-4xl font-medium uppercase leading-[0.85] tracking-tight md:text-6xl lg:text-7xl">
          THE FUTURE
          <br />
          OF HEALTHCARE
          <br />
          BILLING
        </h2>
        <p className="max-w-[40ch] text-sm uppercase leading-relaxed text-muted-foreground md:text-base">
          END-TO-END AI THAT ELIMINATES DENIALS, ACCELERATES REIMBURSEMENTS, AND
          LETS PROVIDERS FOCUS ON WHAT MATTERS — PATIENT CARE.
        </p>
      </div>

      <div className="z-10 flex justify-end">
        <button
          className="border-none bg-none text-right font-sans text-[8vw] font-medium uppercase leading-[0.8] transition-opacity"
          style={{ opacity: hovered ? 0.5 : 1 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={onEnter}
        >
          <span className="mb-2 block text-sm font-normal uppercase tracking-widest">
            DISCOVER THE PLATFORM
          </span>
          ENTER —
        </button>
      </div>
    </section>
  );
}

function LabView({ isVisible }: { isVisible: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && isVisible) {
      return initDna(canvasRef.current, 1, 0.75);
    }
  }, [isVisible]);

  return (
    <section
      className="absolute inset-0 overflow-y-auto transition-opacity duration-1000"
      style={{
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? "visible" : "hidden",
      }}
    >
      <canvas className="pointer-events-none fixed top-0 right-0 z-[1] h-screen w-1/2" ref={canvasRef} />

      <main className="relative mx-auto max-w-[1600px] p-6 md:p-8">
        <header className="relative mb-[15vh]">
          <h1 className="text-[12vw] font-medium uppercase leading-[0.9] tracking-tighter md:text-[10vw]">
            TAIGA
            <br />
            HEALTH
            <br />
            —
          </h1>

          <div className="mt-8 flex gap-8 text-sm uppercase md:text-lg">
            <div>
              EST. 2026
              <br />
              SAN FRANCISCO
            </div>
            <div>
              END-TO-END AI
              <br />
              HEALTHCARE BILLING
            </div>
          </div>
        </header>

        <section className="mb-[10vh] grid gap-8 md:grid-cols-[1fr_2fr] md:gap-16">
          <div className="sticky top-8 self-start text-3xl uppercase leading-[0.9] md:text-4xl">
            PLATFORM
            <br />
            CAPABILITIES
          </div>

          <ul className="list-none space-y-12 p-0">
            <li className="grid grid-cols-[60px_1fr] md:grid-cols-[80px_1fr]">
              <div className="text-muted-foreground">01</div>
              <div>
                <h3 className="mb-2 text-base font-normal uppercase italic">
                  AI CLAIMS ENGINE
                </h3>
                <p className="mb-3 max-w-[40ch] text-base uppercase">
                  INTELLIGENT CLAIM SUBMISSION THAT CATCHES ERRORS BEFORE THEY
                  BECOME DENIALS.
                </p>
                <ul className="mt-3 list-none space-y-1 p-0">
                  {[
                    "AUTOMATED CODING VALIDATION",
                    "REAL-TIME PAYER RULE CHECKS",
                    "PREDICTIVE DENIAL PREVENTION",
                  ].map((item) => (
                    <li key={item} className="relative pl-5 uppercase">
                      <span className="absolute left-0">+</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            <li className="grid grid-cols-[60px_1fr] md:grid-cols-[80px_1fr]">
              <div className="text-muted-foreground">02</div>
              <div>
                <h3 className="mb-2 text-base font-normal uppercase italic">
                  REVENUE CYCLE INTELLIGENCE
                </h3>
                <p className="mb-3 max-w-[40ch] text-base uppercase">
                  END-TO-END VISIBILITY INTO YOUR REVENUE CYCLE WITH
                  AI-DRIVEN INSIGHTS.
                </p>
                <ul className="mt-3 list-none space-y-1 p-0">
                  {[
                    "ACCOUNTS RECEIVABLE OPTIMIZATION",
                    "PAYMENT POSTING AUTOMATION",
                    "FINANCIAL PERFORMANCE ANALYTICS",
                  ].map((item) => (
                    <li key={item} className="relative pl-5 uppercase">
                      <span className="absolute left-0">+</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            <li className="grid grid-cols-[60px_1fr] md:grid-cols-[80px_1fr]">
              <div className="text-muted-foreground">03</div>
              <div>
                <h3 className="mb-2 text-base font-normal uppercase italic">
                  PRIOR AUTHORIZATION
                </h3>
                <p className="mb-3 max-w-[40ch] text-base uppercase">
                  AUTOMATED PRIOR AUTH WORKFLOWS THAT REDUCE TURNAROUND FROM
                  DAYS TO MINUTES.
                </p>
                <ul className="mt-3 list-none space-y-1 p-0">
                  {[
                    "INTELLIGENT FORM COMPLETION",
                    "PAYER PORTAL INTEGRATION",
                    "STATUS TRACKING & ESCALATION",
                  ].map((item) => (
                    <li key={item} className="relative pl-5 uppercase">
                      <span className="absolute left-0">+</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            <li className="grid grid-cols-[60px_1fr] md:grid-cols-[80px_1fr]">
              <div className="text-muted-foreground">04</div>
              <div>
                <h3 className="mb-2 text-base font-normal uppercase italic">
                  COMPLIANCE & AUDIT
                </h3>
                <p className="mb-3 max-w-[40ch] text-base uppercase">
                  BUILT-IN COMPLIANCE MONITORING THAT KEEPS YOU AHEAD OF
                  REGULATORY CHANGES.
                </p>
                <ul className="mt-3 list-none space-y-1 p-0">
                  {[
                    "HIPAA-COMPLIANT INFRASTRUCTURE",
                    "AUTOMATED AUDIT TRAILS",
                    "REGULATORY CHANGE DETECTION",
                  ].map((item) => (
                    <li key={item} className="relative pl-5 uppercase">
                      <span className="absolute left-0">+</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </section>

        <footer className="mt-[20vh] pb-20">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <div className="mb-6 text-4xl font-medium leading-[0.8] md:text-5xl">
                READY
                <br />
                TO
                <br />
                TRANSFORM
                <br />
                YOUR RCM?
              </div>
              <a
                href="#"
                className="text-2xl uppercase text-foreground no-underline transition-opacity hover:opacity-50 md:text-3xl"
              >
                GET STARTED
              </a>
            </div>
            <div className="max-w-[60ch] self-end text-xs uppercase text-muted-foreground">
              TAIGA HEALTH, SAN FRANCISCO, CA. HIPAA-COMPLIANT AI PLATFORM FOR
              HEALTHCARE REVENUE CYCLE MANAGEMENT. ALL PATIENT DATA ENCRYPTED
              AND PROCESSED IN ACCORDANCE WITH FEDERAL REGULATIONS.
            </div>
          </div>
        </footer>
      </main>
    </section>
  );
}

export default function Page() {
  const [viewActive, setViewActive] = useState(false);
  const [landingHidden, setLandingHidden] = useState(false);

  const handleEnter = useCallback(() => {
    setViewActive(true);
    setTimeout(() => setLandingHidden(true), 1000);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-white font-sans text-black">
      <LandingView
        onEnter={handleEnter}
        isActive={viewActive}
        isHidden={landingHidden}
      />
      <LabView isVisible={viewActive} />
    </div>
  );
}
