/**
 * PROXIMA DIGITAL - INTERACTIVE JAVASCRIPT ENGINE
 * Includes:
 * 1. 2-Second Cinematic Preloader with Real Countdown & Canvas Particles
 * 2. Dark / Light Theme Toggle System with LocalStorage Sync
 * 3. Interactive Background Ambient Starfield / Particle Network
 * 4. Custom Smooth Glowing Cursor with Hover Detection
 * 5. Dynamic Orbit Hub Canvas with Connected Nodes
 * 6. Scroll Reveal Observer for Staggered Animations
 * 7. Navbar Scroll Shrink & Active Link Highlighting
 * 8. Mobile Navigation Drawer Handling
 * 9. Smooth Scroll-To-Top Button
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* ==========================================================================
       1. 5-Second Speeder Preloader
       ========================================================================== */
    const initPreloader = () => {
        const preloader = document.getElementById('preloader');
        const progressBar = document.getElementById('loaderProgressBar');
        const percentText = document.getElementById('loaderPercent');
        const countdownText = document.getElementById('loaderCountdown');
        const statusText = document.getElementById('loaderStatus');
        if (!preloader || !progressBar || !percentText) return;

        // Sequential status milestones over 5000ms (5 seconds)
        const milestones = [
            { at: 0, text: 'INITIALIZING SPEED ENGINE...' },
            { at: 1200, text: 'CONFIGURING ERPNEXT PIPELINES...' },
            { at: 2500, text: 'OPTIMIZING BUSINESS WORKFLOWS...' },
            { at: 3800, text: 'SYNCHRONIZING INTERFACE CLARITY...' },
            { at: 4700, text: 'SYSTEMS ONLINE. WELCOME.' }
        ];

        const TOTAL_DURATION = 1000; // 5 seconds exact
        const startTime = performance.now();

        const updateLoader = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / TOTAL_DURATION, 1);
            const percent = Math.floor(progress * 100);

            progressBar.style.width = `${percent}%`;
            percentText.textContent = `${percent}%`;

            const remainingSeconds = Math.max(0, (TOTAL_DURATION - elapsed) / 1000).toFixed(1);
            if (countdownText) {
                countdownText.textContent = `${remainingSeconds}s`;
            }

            // Update status text based on elapsed time
            for (let i = milestones.length - 1; i >= 0; i--) {
                if (elapsed >= milestones[i].at) {
                    if (statusText && statusText.textContent !== milestones[i].text) {
                        statusText.textContent = milestones[i].text;
                    }
                    break;
                }
            }

            if (progress < 1) {
                requestAnimationFrame(updateLoader);
            } else {
                // Complete 5-second transition
                setTimeout(() => {
                    preloader.classList.add('loaded');
                    document.body.classList.add('custom-cursor-active');
                    triggerInitialHeroAnimations();
                }, 300);
            }
        };

        requestAnimationFrame(updateLoader);
    };

    /* ==========================================================================
       2. Theme Toggle System (Dark / Light)
       ========================================================================== */
    const initThemeToggle = () => {
        const toggleInput = document.getElementById('toggle');
        const storedTheme = localStorage.getItem('proxima_theme') || 'dark';
        
        document.documentElement.setAttribute('data-theme', storedTheme);
        if (toggleInput) {
            toggleInput.checked = storedTheme === 'light';

            toggleInput.addEventListener('change', () => {
                const newTheme = toggleInput.checked ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('proxima_theme', newTheme);
            });
        }
    };

    /* ==========================================================================
       3. Ambient Background Particle Network
       ========================================================================== */
    const initAmbientCanvas = () => {
        const canvas = document.getElementById('ambient-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            createDots();
        });

        let dots = [];
        const mouse = { x: -1000, y: -1000 };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        const createDots = () => {
            dots = [];
            const count = Math.floor((width * height) / 16000);
            for (let i = 0; i < count; i++) {
                dots.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.35,
                    vy: (Math.random() - 0.5) * 0.35,
                    radius: Math.random() * 1.5 + 0.5,
                    alpha: Math.random() * 0.4 + 0.1
                });
            }
        };
        createDots();

        const animateAmbient = () => {
            ctx.clearRect(0, 0, width, height);

            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            const particleColor = isLight ? '124, 179, 5' : '204, 255, 0';

            for (let i = 0; i < dots.length; i++) {
                const d = dots[i];
                d.x += d.vx;
                d.y += d.vy;

                if (d.x < 0) d.x = width;
                if (d.x > width) d.x = 0;
                if (d.y < 0) d.y = height;
                if (d.y > height) d.y = 0;

                // Mouse interaction
                const dx = d.x - mouse.x;
                const dy = d.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 90) {
                    const angle = Math.atan2(dy, dx);
                    const force = (90 - dist) / 90;
                    d.x += Math.cos(angle) * force * 1.5;
                    d.y += Math.sin(angle) * force * 1.5;
                }

                ctx.beginPath();
                ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${particleColor}, ${d.alpha})`;
                ctx.fill();

                // Connect adjacent dots
                for (let j = i + 1; j < dots.length; j++) {
                    const d2 = dots[j];
                    const distDots = Math.hypot(d.x - d2.x, d.y - d2.y);
                    if (distDots < 95) {
                        ctx.beginPath();
                        ctx.moveTo(d.x, d.y);
                        ctx.lineTo(d2.x, d2.y);
                        ctx.strokeStyle = `rgba(${particleColor}, ${(1 - distDots / 95) * 0.12})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animateAmbient);
        };
        animateAmbient();
    };

    /* ==========================================================================
       4. Custom Glowing Cursor
       ========================================================================== */
    const initCustomCursor = () => {
        const dot = document.querySelector('.cursor-dot');
        const ring = document.querySelector('.cursor-ring');
        if (!dot || !ring) return;

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = `${mouseX}px`;
            dot.style.top = `${mouseY}px`;
        });

        const loopCursor = () => {
            ringX += (mouseX - ringX) * 0.16;
            ringY += (mouseY - ringY) * 0.16;
            ring.style.left = `${ringX}px`;
            ring.style.top = `${ringY}px`;
            requestAnimationFrame(loopCursor);
        };
        loopCursor();

        // Hover detection on interactive elements
        const interactiveQuery = 'a, button, input, textarea, .interactive, .service-card, .process-card, .theme-toggle-btn';
        document.querySelectorAll(interactiveQuery).forEach((el) => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    };

    /* ==========================================================================
       5. Hero Visual Canvas (Orbit & Nodes)
       ========================================================================== */
    const initHeroCanvas = () => {
        const canvas = document.getElementById('heroCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        let angleInner = 0;
        let angleOuter = Math.PI / 3;
        let angleThird = Math.PI;

        const animateHeroVisual = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            const lime = isLight ? '#7cb305' : '#ccff00';
            const ringColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.1)';

            const rInner = Math.min(cx, cy) * 0.54;
            const rOuter = Math.min(cx, cy) * 0.78;
            const rMid = (rInner + rOuter) / 2;

            // Outer Dashed Ring
            ctx.beginPath();
            ctx.arc(cx, cy, rOuter, 0, Math.PI * 2);
            ctx.setLineDash([6, 12]);
            ctx.strokeStyle = ringColor;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Inner Ring
            ctx.beginPath();
            ctx.arc(cx, cy, rInner, 0, Math.PI * 2);
            ctx.setLineDash([]);
            ctx.strokeStyle = isLight ? 'rgba(124, 179, 5, 0.25)' : 'rgba(204, 255, 0, 0.25)';
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Middle Subtle Ring
            ctx.beginPath();
            ctx.arc(cx, cy, rMid, 0, Math.PI * 2);
            ctx.setLineDash([3, 8]);
            ctx.strokeStyle = ringColor;
            ctx.lineWidth = 0.8;
            ctx.stroke();
            ctx.setLineDash([]);

            // Helper to draw pulsating orbiting node
            const drawOrbitNode = (angle, radius, size) => {
                const x = cx + Math.cos(angle) * radius;
                const y = cy + Math.sin(angle) * radius;

                // Connection line to center
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(x, y);
                ctx.strokeStyle = isLight ? 'rgba(124, 179, 5, 0.08)' : 'rgba(204, 255, 0, 0.08)';
                ctx.lineWidth = 0.7;
                ctx.stroke();

                // Pulsing dot
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fillStyle = lime;
                ctx.shadowColor = lime;
                ctx.shadowBlur = 12;
                ctx.fill();
                ctx.shadowBlur = 0;

                return { x, y };
            };

            drawOrbitNode(angleInner, rInner, 4.5);
            drawOrbitNode(angleOuter, rOuter, 4);
            drawOrbitNode(angleThird, rMid, 3.5);

            angleInner += 0.007;
            angleOuter -= 0.004;
            angleThird += 0.003;

            requestAnimationFrame(animateHeroVisual);
        };
        animateHeroVisual();

        // Center hub mouse parallax
        const hubContainer = document.querySelector('.hub-container');
        const graphicWrapper = document.querySelector('.graphic-wrapper');
        if (graphicWrapper && hubContainer) {
            graphicWrapper.addEventListener('mousemove', (e) => {
                const rect = graphicWrapper.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.08;
                const y = (e.clientY - rect.top - rect.height / 2) * 0.08;
                hubContainer.style.transform = `translate(${x}px, ${y}px)`;
            });

            graphicWrapper.addEventListener('mouseleave', () => {
                hubContainer.style.transform = 'translate(0px, 0px)';
                hubContainer.style.transition = 'transform 0.5s ease';
            });

            graphicWrapper.addEventListener('mouseenter', () => {
                hubContainer.style.transition = 'none';
            });
        }
    };

    /* ==========================================================================
       6. Scroll Reveal Observer (Smooth Stagger Animations)
       ========================================================================== */
    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-fade');
        if (!revealElements.length) return;

        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        obs.unobserve(entry.target); // Trigger once smoothly
                    }
                });
            },
            {
                threshold: 0.15,
                rootMargin: '0px 0px -40px 0px'
            }
        );

        revealElements.forEach((el) => observer.observe(el));
    };

    const triggerInitialHeroAnimations = () => {
        document.querySelectorAll('.hero-container .reveal-up, .hero-container .reveal-fade').forEach((el) => {
            el.classList.add('in-view');
        });
    };

    /* ==========================================================================
       7. Navbar Scroll Shrink & Active Section Sync
       ========================================================================== */
    const initNavbarScroll = () => {
        const navbar = document.querySelector('.navbar');
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id], div[id="hero"]');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;

            // Shrink navbar on scroll
            if (navbar) {
                if (scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }

            // Sync active link with viewport section
            let current = '';
            sections.forEach((section) => {
                const sectionTop = section.offsetTop - 120;
                const sectionHeight = section.offsetHeight;
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach((link) => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    };

    /* ==========================================================================
       8. Mobile Menu Drawer
       ========================================================================== */
    const initMobileNav = () => {
        const mobileMenu = document.getElementById('mobileMenu');
        const openBtn = document.getElementById('openMenuBtn');
        const closeBtn = document.getElementById('closeMenuBtn');
        const mobileLinks = document.querySelectorAll('.mobile-nav .nav-link');
        if (!mobileMenu || !openBtn || !closeBtn) return;

        openBtn.addEventListener('click', () => {
            mobileMenu.classList.add('open');
            document.body.style.overflow = 'hidden';
        });

        const closeMobileNav = () => {
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        };

        closeBtn.addEventListener('click', closeMobileNav);
        mobileLinks.forEach((link) => link.addEventListener('click', closeMobileNav));
    };

    /* ==========================================================================
       9. Scroll-To-Top Button
       ========================================================================== */
    const initScrollTop = () => {
        const btn = document.getElementById('scrollTopBtn');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });

        btn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };

    /* ==========================================================================
       10. Smooth Scrolling Engine
       ========================================================================== */
    const initSmoothScroll = () => {
        // Smooth scroll for all internal anchor links with custom offset
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#' || targetId === '') return;

                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    const navOffset = 80;
                    const elementPosition = targetEl.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };

    /* ==========================================================================
       Initialize All Systems
       ========================================================================== */
    initPreloader();
    initThemeToggle();
    initAmbientCanvas();
    initCustomCursor();
    initHeroCanvas();
    initScrollReveal();
    initNavbarScroll();
    initMobileNav();
    initScrollTop();
    initSmoothScroll();
});