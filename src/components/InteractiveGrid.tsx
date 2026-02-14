"use client";

import { useEffect, useRef } from "react";

/* ─── Tunable Constants ─── */
const DOT_SPACING = 24;
const DOT_RADIUS = 1;
const DOT_COLOR = "rgba(255,255,255,0.07)";
const DOT_ACTIVE_COLOR = "rgba(232, 115, 90, 0.5)";
const INFLUENCE_RADIUS = 60;
const REPULSION_STRENGTH = 2;
const SPRING_STIFFNESS = 0.04;
const DAMPING = 0.9;
const MAX_PIXEL_RATIO = 2;

/* ─── Explosion Constants ─── */
const EXPLOSION_RADIUS = 180;
const EXPLOSION_STRENGTH = 18;

interface Dot {
    homeX: number;
    homeY: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
}

export default function InteractiveGrid() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        let dots: Dot[] = [];
        let mouseX = -9999;
        let mouseY = -9999;
        let width = 0;
        let height = 0;

        /* ── Check for touch device / narrow viewport ── */
        const isMobile = window.matchMedia("(max-width: 600px)").matches;
        const isTouch =
            "ontouchstart" in window || navigator.maxTouchPoints > 0;

        const isStatic = isMobile && isTouch;

        /* ── Resize ── */
        function resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
            width = window.innerWidth;
            height = window.innerHeight;

            canvas!.style.width = `${width}px`;
            canvas!.style.height = `${height}px`;
            canvas!.width = width * dpr;
            canvas!.height = height * dpr;
            ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

            buildGrid();
        }

        /* ── Build dot grid ── */
        function buildGrid() {
            dots = [];
            const cols = Math.ceil(width / DOT_SPACING) + 1;
            const rows = Math.ceil(height / DOT_SPACING) + 1;

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const x = col * DOT_SPACING;
                    const y = row * DOT_SPACING;
                    dots.push({
                        homeX: x,
                        homeY: y,
                        x,
                        y,
                        vx: 0,
                        vy: 0,
                    });
                }
            }
        }

        /* ── Mouse tracking ── */
        function onMouseMove(e: MouseEvent) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }

        function onMouseLeave() {
            mouseX = -9999;
            mouseY = -9999;
        }

        /* ── Click explosion ── */
        function onClick(e: MouseEvent) {
            const clickX = e.clientX;
            const clickY = e.clientY;
            const explosionSq = EXPLOSION_RADIUS * EXPLOSION_RADIUS;

            for (let i = 0; i < dots.length; i++) {
                const dot = dots[i];
                const dx = dot.homeX - clickX;
                const dy = dot.homeY - clickY;
                const distSq = dx * dx + dy * dy;

                if (distSq < explosionSq && distSq > 0) {
                    const dist = Math.sqrt(distSq);
                    const force =
                        ((EXPLOSION_RADIUS - dist) / EXPLOSION_RADIUS) *
                        EXPLOSION_STRENGTH *
                        (0.5 + Math.random() * 1.5);

                    // Add random angle jitter (±45°)
                    const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * Math.PI * 0.5;
                    const nx = Math.cos(angle);
                    const ny = Math.sin(angle);

                    dot.vx += nx * force;
                    dot.vy += ny * force;
                }
            }
        }

        /* ── Animation loop ── */
        function draw() {
            ctx!.clearRect(0, 0, width, height);

            const influenceSq = INFLUENCE_RADIUS * INFLUENCE_RADIUS;

            for (let i = 0; i < dots.length; i++) {
                const dot = dots[i];

                if (!isStatic) {
                    // Compute distance to mouse
                    const dx = dot.homeX - mouseX;
                    const dy = dot.homeY - mouseY;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < influenceSq && distSq > 0) {
                        const dist = Math.sqrt(distSq);
                        const force =
                            ((INFLUENCE_RADIUS - dist) / INFLUENCE_RADIUS) *
                            REPULSION_STRENGTH;
                        const nx = dx / dist;
                        const ny = dy / dist;

                        dot.vx += nx * force;
                        dot.vy += ny * force;
                    }

                    // Spring back to home
                    const springX = (dot.homeX - dot.x) * SPRING_STIFFNESS;
                    const springY = (dot.homeY - dot.y) * SPRING_STIFFNESS;

                    dot.vx = (dot.vx + springX) * DAMPING;
                    dot.vy = (dot.vy + springY) * DAMPING;

                    dot.x += dot.vx;
                    dot.y += dot.vy;
                }

                // Determine if dot is displaced for color
                const displaceX = dot.x - dot.homeX;
                const displaceY = dot.y - dot.homeY;
                const displaceSq =
                    displaceX * displaceX + displaceY * displaceY;

                ctx!.beginPath();
                ctx!.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
                ctx!.fillStyle = displaceSq > 1 ? DOT_ACTIVE_COLOR : DOT_COLOR;
                ctx!.fill();
            }

            animationId = requestAnimationFrame(draw);
        }

        /* ── Static render (mobile / reduced motion) ── */
        function drawStatic() {
            ctx!.clearRect(0, 0, width, height);
            ctx!.fillStyle = DOT_COLOR;

            for (let i = 0; i < dots.length; i++) {
                const dot = dots[i];
                ctx!.beginPath();
                ctx!.arc(dot.homeX, dot.homeY, DOT_RADIUS, 0, Math.PI * 2);
                ctx!.fill();
            }
        }

        /* ── Init ── */
        resize();

        if (isStatic) {
            drawStatic();
        } else {
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseleave", onMouseLeave);
            window.addEventListener("click", onClick);
            animationId = requestAnimationFrame(draw);
        }

        // Resize observer
        const resizeObserver = new ResizeObserver(() => {
            resize();
            if (isStatic) drawStatic();
        });
        resizeObserver.observe(document.documentElement);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseleave", onMouseLeave);
            window.removeEventListener("click", onClick);
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 0,
                pointerEvents: "none",
            }}
        />
    );
}
