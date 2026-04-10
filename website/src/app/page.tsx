"use client";

import { useRef, useCallback, Suspense } from "react";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Brain,
  ArrowDown,
  Palmtree,
  Puzzle,
  TrendingDown,
  Bot,
  CloudOff,
  Gamepad2,
  ArrowRight,
  Smartphone,
  Home,
  Users,
  Zap,
  ShieldCheck,
  Rocket,
  AlertTriangle,
} from "lucide-react";

// Lazy-load the 3D brain to avoid SSR issues with Three.js
const Brain3D = dynamic(() => import("@/components/Brain3D").then((m) => ({ default: m.Brain3D })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <Brain className="w-20 h-20 text-primary/30 animate-pulse" />
    </div>
  ),
});

/* ───── Mouse-reactive pixel grid background ───── */


/* ───── HERO SECTION ───── */
function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Update ref for 3D
    mouse.current.x = (x / rect.width) * 2 - 1;
    mouse.current.y = -(y / rect.height) * 2 + 1;

    // Set CSS variables for the grid
    sectionRef.current.style.setProperty("--mouse-x", `${x}px`);
    sectionRef.current.style.setProperty("--mouse-y", `${y}px`);
    sectionRef.current.style.setProperty("--mouse-px", `${mouse.current.x}`);
    sectionRef.current.style.setProperty("--mouse-py", `${-mouse.current.y}`);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden [--mouse-x:50%] [--mouse-y:50%] [--mouse-px:0] [--mouse-py:0]"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Base grid */}
        <div
          className="absolute inset-[-10%] opacity-[0.06] transition-transform duration-300 ease-out"
          style={{
            backgroundImage:
              "linear-gradient(var(--rose-accent) 1px, transparent 1px), linear-gradient(90deg, var(--rose-accent) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            transform: "translate(calc(var(--mouse-px) * -20px), calc(var(--mouse-py) * -20px))",
          }}
        />

        {/* Mouse-reactive highlight ring */}
        <div
          className="absolute w-[800px] h-[800px] rounded-full pointer-events-none blur-[100px] opacity-50"
          style={{
            left: "var(--mouse-x)",
            top: "var(--mouse-y)",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, var(--rose-accent) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />


      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-20 flex flex-col lg:flex-row items-center gap-8">
        {/* Left: Text content */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 bg-secondary text-primary font-pixel text-[10px] px-4 py-2 rounded-full border border-rose-line tracking-wider">
              <Brain className="w-4 h-4" /> BRAIN CHECKPOINT
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-pixel text-2xl sm:text-3xl md:text-4xl text-foreground leading-relaxed mb-6"
          >
            Think <span className="text-primary">First</span>,
            <br />
            <span className="text-accent">Then</span> Use AI.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground max-w-lg mb-10 leading-relaxed"
          >
            Your brain is a muscle. AI is making it lazy. ThinkFirst forces you
            to warm up with fun cognitive games before accessing AI tools —
            keeping your mind sharp, one puzzle at a time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <a
              href="#dangers"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-pixel text-[10px] px-6 py-3 rounded-lg hover:bg-accent transition-colors shadow-lg shadow-primary/20"
            >
              LEARN MORE <ArrowDown className="w-3 h-3" />
            </a>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-card border border-rose-line text-foreground font-pixel text-[10px] px-6 py-3 rounded-lg hover:bg-secondary transition-colors"
            >
              <Palmtree className="w-4 h-4" /> VISIT SHOP
            </Link>
          </motion.div>
        </div>

        {/* Right: 3D Brain */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex-1 w-full h-[350px] md:h-[450px] lg:h-[500px]"
        >
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <Brain className="w-20 h-20 text-primary/30 animate-pulse" />
              </div>
            }
          >
            <Brain3D />
          </Suspense>
        </motion.div>
      </div>
    </section>
  );
}

/* ───── DANGERS SECTION ───── */
function DangersSection() {
  const dangers = [
    {
      icon: <Puzzle className="w-8 h-8" />,
      title: "Problem Solving Decline",
      desc: "Relying on AI for answers means your brain never struggles — and struggle is how neural pathways grow stronger.",
    },
    {
      icon: <TrendingDown className="w-8 h-8" />,
      title: "Memory Loss",
      desc: "When you stop memorizing and recalling information, your working memory weakens over time.",
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: "Creative Atrophy",
      desc: "AI-generated content replaces your own creative thinking, leading to a dependency that stifles imagination.",
    },
    {
      icon: <CloudOff className="w-8 h-8" />,
      title: "Reduced Critical Thinking",
      desc: "Accepting AI responses without questioning them erodes your ability to evaluate and reason independently.",
    },
  ];

  return (
    <AnimatedSection className="min-h-screen flex items-center py-24" delay={0}>
      <div id="dangers" className="max-w-6xl mx-auto px-4 scroll-mt-20">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-red-50 text-red-500 font-pixel text-[10px] px-4 py-2 rounded-full border border-red-200 tracking-wider mb-4"
          >
            <AlertTriangle className="w-4 h-4" /> THE DANGER IS REAL
          </motion.span>
          <h2 className="font-pixel text-xl md:text-2xl text-foreground mb-4">
            What Reckless AI Use
            <br />
            <span className="text-primary">Does to Your Brain</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Science shows that cognitive abilities decline when not exercised.
            Here&apos;s what&apos;s at stake.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {dangers.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-card rounded-xl border border-rose-line p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all group"
            >
              <div className="text-primary mb-3 group-hover:scale-110 transition-transform inline-block">
                {d.icon}
              </div>
              <h3 className="font-pixel text-[11px] text-foreground mb-2 tracking-wide">
                {d.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {d.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <a
            href="#download"
            className="inline-flex items-center gap-3 bg-primary text-primary-foreground font-pixel text-[11px] px-8 py-4 rounded-xl hover:bg-accent transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            <Gamepad2 className="w-5 h-5" />
            TEST YOUR BRAIN ROT LEVEL
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

/* ───── DOWNLOAD SECTION ───── */
function DownloadSection() {
  return (
    <AnimatedSection className="min-h-screen flex items-center py-24 bg-secondary/30">
      <div id="download" className="max-w-4xl mx-auto px-4 text-center scroll-mt-20">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 bg-green-50 text-green-600 font-pixel text-[10px] px-4 py-2 rounded-full border border-green-200 tracking-wider mb-4"
        >
          <Rocket className="w-4 h-4" /> GET STARTED
        </motion.span>

        <h2 className="font-pixel text-xl md:text-2xl text-foreground mb-4">
          Take Back Control
          <br />
          <span className="text-primary">Of Your Mind</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-12">
          Available on mobile and as a browser extension. Pick your platform and
          start training your brain today.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          {/* Google Play */}
          <motion.a
            href="https://play.google.com"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-4 bg-card border-2 border-rose-line rounded-2xl px-8 py-5 hover:border-primary/40 transition-all shadow-md hover:shadow-xl group w-full sm:w-auto"
          >
            <Smartphone className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="text-[10px] text-muted-foreground font-pixel tracking-wider">
                GET IT ON
              </p>
              <p className="text-lg font-semibold text-foreground">Google Play</p>
            </div>
          </motion.a>

          {/* Chrome Extension */}
          <motion.a
            href="https://chrome.google.com/webstore"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-4 bg-primary text-primary-foreground rounded-2xl px-8 py-5 shadow-lg shadow-primary/20 hover:shadow-xl transition-all group w-full sm:w-auto"
          >
            <Home className="w-10 h-10 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="text-[10px] font-pixel tracking-wider opacity-80">
                INSTALL ON
              </p>
              <p className="text-lg font-semibold">Chrome</p>
            </div>
          </motion.a>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 grid grid-cols-3 gap-4 max-w-md mx-auto"
        >
          {[
            { val: "1K+", label: "Users", icon: <Users className="w-5 h-5 mx-auto mb-1 text-primary" /> },
            { val: "50K+", label: "Games Played", icon: <Zap className="w-5 h-5 mx-auto mb-1 text-primary" /> },
            { val: "98%", label: "Brain Saved", icon: <ShieldCheck className="w-5 h-5 mx-auto mb-1 text-primary" /> },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              {stat.icon}
              <p className="font-pixel text-lg text-primary">{stat.val}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

/* ───── PAGE ───── */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <DangersSection />
      <DownloadSection />
    </>
  );
}
