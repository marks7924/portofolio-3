'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Github, Linkedin, Facebook, Instagram, Twitter, ArrowRight, Play, CheckCircle, Cpu, Loader } from 'lucide-react';

interface HeroProps {
  settings: any;
}

export default function Hero({ settings }: HeroProps) {
  const t = useTranslations('Hero');
  const [roleIndex, setRoleIndex] = useState(0);
  const [pipelineStep, setPipelineStep] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const roles = [
    'Principal Full-Stack Architect',
    'Senior UI/UX Motion Engineer',
    'DevOps Platform Engineer',
    'Database Systems Architect'
  ];

  // Role rotation interval
  useEffect(() => {
    const roleTimer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(roleTimer);
  }, []);

  // DevOps pipeline simulation sequence
  useEffect(() => {
    const pipelineTimer = setInterval(() => {
      setPipelineStep((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(pipelineTimer);
  }, []);

  // Parallax calculations
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePos({ x, y });
  };

  const springConfig = { damping: 25, stiffness: 120 };
  const mouseX = useSpring(useMotionValue(0), springConfig);
  const mouseY = useSpring(useMotionValue(0), springConfig);

  useEffect(() => {
    mouseX.set(mousePos.x);
    mouseY.set(mousePos.y);
  }, [mousePos, mouseX, mouseY]);

  // Transform translations for parallax layers
  const bgTranslateX = useTransform(mouseX, (x) => x * 0.05);
  const bgTranslateY = useTransform(mouseY, (y) => y * 0.05);
  const fgTranslateX = useTransform(mouseX, (x) => x * 0.12);
  const fgTranslateY = useTransform(mouseY, (y) => y * 0.12);

  // Floating particles definitions
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10
  }));

  // Code background lines simulation
  const codeLines = [
    'const portfolio = new DeveloperPortfolio({ name: "Mark" });',
    'portfolio.useFramework("Next.js").useStyles("Tailwind");',
    'await portfolio.render({ speed: "60 FPS", polish: "Apple" });',
    'deployPipeline.run({ test: true, optimize: true }).then(() => {',
    '  console.log("Deployed globally to Vercel production edge.");',
    '});',
    'export default portfolio;'
  ];

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[92vh] flex items-center justify-center overflow-hidden py-16 bg-neutral-950"
      id="home"
    >
      {/* Dynamic Parallax Background Mesh */}
      <motion.div
        style={{ x: bgTranslateX, y: bgTranslateY }}
        className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"
      />

      {/* Floating Particle Layers */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: `${p.y}%`, opacity: 0.1 }}
            animate={{
              y: ['0%', '100%'],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'linear'
            }}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: '50%',
              backgroundColor: '#14b8a6',
            }}
          />
        ))}
      </div>

      {/* Animated Gradient Lights */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-teal-500/10 blur-[100px] pointer-events-none glow-primary" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none glow-secondary" />

      {/* Code Background Layer */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none font-mono text-sm leading-relaxed text-teal-400">
        <div className="max-w-2xl w-full px-8 text-start space-y-2">
          {codeLines.map((line, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.3, duration: 1 }}
            >
              {line}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="relative max-w-7xl w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        {/* Left Side: Text and CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="lg:col-span-7 text-start"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-950/20 text-teal-400 text-sm font-medium mb-6 animate-pulse">
            <Cpu className="w-4 h-4" />
            <span>{t('pipelineRunning')}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
            {t('greeting')}{' '}
            <span className="text-gradient block mt-1">
              {settings?.fullName || 'Mark Developer'}
            </span>
          </h1>

          {/* Rotating Roles with Height/Slide animation */}
          <div className="h-10 sm:h-12 overflow-hidden mb-6">
            <motion.div
              key={roleIndex}
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -25, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="text-xl sm:text-2xl font-semibold text-neutral-300 font-mono"
            >
              {roles[roleIndex]}
            </motion.div>
          </div>

          <p className="text-neutral-400 text-base sm:text-lg max-w-lg mb-8 leading-relaxed">
            {settings?.bio_en || t('description')}
          </p>

          {/* Buttons with Magnetic-style spring physics hover */}
          <div className="flex flex-wrap gap-4 items-center">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-neutral-950 font-bold transition-colors cursor-pointer"
            >
              <span>{t('ctaProjects')}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 text-neutral-200 font-semibold transition-colors cursor-pointer"
            >
              <span>{t('ctaContact')}</span>
            </motion.a>
          </div>

          {/* Social Icons list */}
          <div className="flex items-center gap-4 mt-12 text-neutral-500">
            {settings?.github && (
              <a href={settings.github} target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
            )}
            {settings?.linkedin && (
              <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {settings?.facebook && (
              <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            )}
            {settings?.instagram && (
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {settings?.x && (
              <a href={settings.x} target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            )}
          </div>
        </motion.div>

        {/* Right Side: DevOps Pipeline visual simulation */}
        <motion.div
          style={{ x: fgTranslateX, y: fgTranslateY }}
          className="lg:col-span-5 relative flex items-center justify-center lg:justify-end"
        >
          <div className="w-full max-w-sm glass-card rounded-2xl p-6 relative overflow-hidden">
            {/* Slide glowing bar line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-500 via-purple-500 to-teal-500 opacity-20 overflow-hidden">
              <div className="absolute inset-y-0 w-1/3 bg-teal-400 animate-pipeline" />
            </div>

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
              <span className="font-mono text-xs text-neutral-500">PIPELINE #78A29F</span>
              <span className="flex items-center gap-1.5 text-xs text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                ONLINE
              </span>
            </div>

            {/* Pipeline sequence list */}
            <div className="space-y-6">
              {[
                { label: 'npm run build', msg: t('pipelineSteps.build'), status: 0 },
                { label: 'npm test', msg: t('pipelineSteps.test'), status: 1 },
                { label: 'npm run deploy', msg: t('pipelineSteps.deploy'), status: 2 }
              ].map((step, idx) => {
                const isActive = pipelineStep >= step.status;
                return (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="mt-1">
                      {isActive ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </motion.div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-neutral-800 bg-neutral-900/50 flex items-center justify-center">
                          {pipelineStep === step.status - 1 ? (
                            <Loader className="w-3 h-3 text-neutral-500 animate-spin" />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-start">
                      <p className={`font-mono text-xs font-semibold ${isActive ? 'text-neutral-200' : 'text-neutral-600'}`}>
                        {step.label}
                      </p>
                      <p className={`text-sm mt-0.5 ${isActive ? 'text-neutral-400' : 'text-neutral-700'}`}>
                        {step.msg}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Visual network nodes mock */}
            <div className="mt-8 pt-4 border-t border-neutral-800 flex justify-between items-center text-neutral-500 text-xs">
              <span className="font-mono">MEM: 124MB</span>
              <span className="font-mono">LATENCY: 12ms</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
