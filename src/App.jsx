import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Instagram, Mail, MessageCircle, MoveRight } from 'lucide-react';
import papi from "./assets/papi_javasource.jpg";

// --- CUSTOM HOOKS FOR PREMIUM ANIMATIONS ---

// 1. Intersection Observer for Scroll Reveals
const useInView = (options = { threshold: 0.1, triggerOnce: true }) => {
  const [isIntersecting, setIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIntersecting(true);
        if (options.triggerOnce && ref.current) {
          observer.unobserve(ref.current);
        }
      } else if (!options.triggerOnce) {
        setIntersecting(false);
      }
    }, options);

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options.threshold, options.triggerOnce]);

  return [ref, isIntersecting];
};

// 2. Animated Counter for "Why Us" Stats
const useCounter = (end, duration = 2000, start = 0) => {
  const [count, setCount] = useState(start);
  const [ref, inView] = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (!inView) return;
    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * (end - start) + start));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, end, duration, start]);

  return [ref, count];
};

// --- ANIMATION COMPONENTS ---

const FadeIn = ({ children, delay = 0, direction = 'up', className = '' }) => {
  const [ref, isVisible] = useInView({ threshold: 0.1 });
  
  const getTransform = () => {
    switch (direction) {
      case 'up': return 'translate-y-12';
      case 'down': return '-translate-y-12';
      case 'left': return 'translate-x-12';
      case 'right': return '-translate-x-12';
      default: return 'translate-y-12';
    }
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible ? 'opacity-100 translate-y-0 translate-x-0' : `opacity-0 ${getTransform()}`
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const MaskText = ({ children, delay = 0, className = '' }) => {
  const [ref, isVisible] = useInView({ threshold: 0.1 });
  return (
    <div ref={ref} className="overflow-hidden">
      <div
        className={`transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible ? 'translate-y-0' : 'translate-y-[110%]'
        } ${className}`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {children}
      </div>
    </div>
  );
};

const MagneticButton = ({ children, className = '', onClick }) => {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) * 0.3;
    const y = (e.clientY - top - height / 2) * 0.3;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center transition-all duration-300 ease-out ${className}`}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      {children}
    </button>
  );
};

// --- MAIN APPLICATION ---

export default function App() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Custom Cursor Logic
  useEffect(() => {
    const updateCursor = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseOver = (e) => {
      // Check if hovering over clickable elements
      if (['A', 'BUTTON'].includes(e.target.tagName) || e.target.closest('button') || e.target.closest('a')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateCursor);
    window.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('mousemove', updateCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Stats Counters
  const [yearsRef, yearsCount] = useCounter(20, 2500);
  const [containersRef, containersCount] = useCounter(1000, 3000);

  return (
    <div className="font-sans text-[#2D3748] bg-[#FFFFF0] min-h-screen overflow-x-hidden relative selection:bg-[#3D2B1F] selection:text-[#FFFFF0]">
      {/* Global Styles for Fonts, Custom Scrollbar & Noise Texture */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap');
        
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        
        /* Subtle Paper/Wood Noise Overlay */
        .noise-overlay {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          pointer-events: none;
          z-index: 50;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        /* Cinematic Hero Zoom */
        @keyframes cinematicZoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.15); }
        }
        .animate-hero-bg {
          animation: cinematicZoom 20s ease-in-out infinite alternate;
        }

        /* Hide default cursor on desktop to show custom cursor */
        @media (pointer: fine) {
          body { cursor: none; }
          a, button { cursor: none; }
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #FFFFF0; }
        ::-webkit-scrollbar-thumb { background: #D4A373; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #3D2B1F; }
      `}} />

      {/* Noise Texture */}
      <div className="noise-overlay"></div>

      {/* Custom Wood Ring Cursor */}
      <div 
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[100] mix-blend-difference hidden md:block transition-transform duration-150 ease-out"
        style={{
          transform: `translate(${cursorPos.x - 16}px, ${cursorPos.y - 16}px) scale(${isHovering ? 1.5 : 1})`,
          border: '1px solid #FFFFF0',
          backgroundColor: isHovering ? '#FFFFF0' : 'transparent',
          mixBlendMode: 'difference'
        }}
      />
      <div 
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[100] hidden md:block"
        style={{
          transform: `translate(${cursorPos.x - 4}px, ${cursorPos.y - 4}px)`,
          backgroundColor: '#3D2B1F',
          opacity: isHovering ? 0 : 1
        }}
      />

      {/* Navigation */}
      <nav className="fixed w-full top-0 z-40 p-6 md:p-10 flex justify-between items-center mix-blend-difference text-white">
        <div className="font-serif text-xl tracking-widest uppercase font-medium">Java Source</div>
        <div className="text-sm font-sans tracking-widest uppercase hidden md:block">Creative Workshop</div>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-[#3D2B1F]">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {/* Using a high-end macro wood texture */}
          <div 
            className="w-full h-full bg-cover bg-center animate-hero-bg opacity-70 mix-blend-luminosity"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1611080018590-09852f82fc4c?q=80&w=2000&auto=format&fit=crop")' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3D2B1F] via-transparent to-transparent opacity-90" />
        </div>
        
        <div className="relative z-10 text-center px-4 flex flex-col items-center max-w-5xl mx-auto">
          <MaskText className="font-serif text-6xl md:text-8xl lg:text-[9rem] text-[#FFFFF0] leading-none tracking-tight mb-6">
            Crafting Legacy.
          </MaskText>
          <FadeIn delay={400} className="w-full max-w-2xl">
            <p className="text-[#D4A373] text-lg md:text-2xl font-light tracking-wide leading-relaxed">
              Born in Semarang, Indonesia (Est. 2024). A creative workshop turning raw ideas into tailor-made masterpieces.
            </p>
          </FadeIn>
          
          <FadeIn delay={800} className="mt-16">
            <div className="flex flex-col items-center animate-bounce gap-4 text-[#FFFFF0] opacity-70">
              <span className="text-xs tracking-widest uppercase">Scroll to explore</span>
              <div className="w-[1px] h-12 bg-gradient-to-b from-[#FFFFF0] to-transparent" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 2. THE STORY SECTION */}
      <section className="py-32 md:py-48 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 items-center">
          <div className="md:col-span-5 relative h-[60vh] md:h-[80vh] w-full overflow-hidden group">
            <FadeIn className="h-full w-full">
              <div 
                className="w-full h-full bg-cover bg-center transition-transform duration-[2000ms] group-hover:scale-105"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1600&auto=format&fit=crop")' }}
              />
            </FadeIn>
            <div className="absolute bottom-[-10%] left-[-10%] w-3/4 h-3/4 bg-[#D4A373] -z-10 mix-blend-multiply opacity-20" />
          </div>
          
          <div className="md:col-start-7 md:col-span-6 flex flex-col justify-center">
            <FadeIn>
              <h3 className="text-sm tracking-[0.3em] uppercase text-[#D4A373] mb-6 font-semibold">The Origin</h3>
            </FadeIn>
            
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#3D2B1F] leading-[1.1] mb-8">
              <MaskText>We don't just build</MaskText>
              <MaskText delay={100}>furniture. We shape</MaskText>
              <MaskText delay={200}>environments.</MaskText>
            </h2>
            
            <FadeIn delay={300}>
              <p className="text-lg text-[#2D3748] font-light leading-relaxed mb-10 opacity-80">
                Java Source is a premium creative workshop that turns ideas into high-quality, tailor-made furniture for homes and businesses. Rooted in the rich woodworking heritage of Semarang, our process is an intimate dance between raw material and refined vision.
              </p>
            </FadeIn>
            
            <FadeIn delay={400}>
              <MagneticButton className="group flex items-center gap-4 text-[#3D2B1F] border-b border-[#3D2B1F] pb-2 hover:text-[#D4A373] hover:border-[#D4A373]">
                <a href ="https://drive.google.com/file/d/1ItwS1d1cujW8yBZFtWs75OVQaTjpGFZU/view?fbclid=PAb21jcAQQl4RleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA81NjcwNjczNDMzNTI0MjcAAae7lLVm0a1cEA5yB0cMuVjyQ6dbtSQvWIYV1ES9SAxOmLPYyXXlVhkO56vg6Q_aem_gzYfEn5ICG7W9_Kuz9R00Q">
                  <span className="uppercase tracking-widest text-sm font-medium">See our catalog</span>
                </a>
                
                <MoveRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
              </MagneticButton>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 3. THE FOUNDER SECTION */}
      <section className="bg-[#3D2B1F] text-[#FFFFF0] py-32 md:py-48 relative overflow-hidden">
        {/* Parallax Background Texture */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-fixed opacity-10 mix-blend-overlay"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1622372736862-2f3b64c06cfb?q=80&w=2000&auto=format&fit=crop")' }}
        />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 flex flex-col justify-center max-w-xl">
              <FadeIn direction="right">
                <span className="text-[#D4A373] uppercase tracking-[0.2em] text-xs font-semibold mb-8 block">The Founder</span>
              </FadeIn>
              
              <div className="font-serif text-3xl md:text-5xl leading-tight mb-8">
                <MaskText delay={100}>"Craftsmanship is</MaskText>
                <MaskText delay={200}>not just a skill.</MaskText>
                <MaskText delay={300}>It is the belief that</MaskText>
                <MaskText delay={400} className="italic text-[#D4A373]">every single detail matters."</MaskText>
              </div>
              
              <FadeIn delay={500} direction="up">
                <div className="flex items-center gap-6 mt-8">
                  <div className="w-12 h-[1px] bg-[#D4A373]" />
                  <div>
                    <h4 className="font-serif text-2xl">Hapy</h4>
                    <p className="text-sm tracking-widest uppercase text-[#D4A373] opacity-80 mt-1">Master Craftsman</p>
                  </div>
                </div>
              </FadeIn>
            </div>
            
            <div className="order-1 md:order-2">
              <FadeIn direction="left">
                <div className="relative aspect-[3/4] w-full max-w-md mx-auto overflow-hidden">
                  <div className="absolute inset-0 bg-[#3D2B1F] mix-blend-color z-10 opacity-40"></div>
                  <img 
                    src={papi} 
                    alt="Founder Portrait" 
                    className="object-cover w-full h-full grayscale contrast-125"
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY US? (Trust & Experience) */}
      <section className="py-32 md:py-48 px-6 md:px-12 bg-[#FFFFF0]">
        <div className="max-w-6xl mx-auto text-center mb-24">
          <FadeIn>
            <h2 className="font-serif text-4xl md:text-6xl text-[#3D2B1F] mb-6">A Legacy of Trust</h2>
            <p className="text-lg md:text-xl text-[#2D3748] font-light max-w-2xl mx-auto opacity-80">
              An ironclad quality guarantee built upon decades of global expertise.
            </p>
          </FadeIn>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-[#3D2B1F]/20">
          
          <div className="flex flex-col items-center justify-center pt-8 md:pt-0" ref={yearsRef}>
            <div className="text-7xl md:text-[8rem] font-serif text-[#3D2B1F] leading-none mb-4 flex items-baseline">
              {yearsCount}
              <span className="text-5xl md:text-7xl text-[#D4A373]">+</span>
            </div>
            <p className="text-sm tracking-[0.2em] uppercase text-[#2D3748] font-medium">Years of Experience</p>
          </div>

          <div className="flex flex-col items-center justify-center pt-16 md:pt-0" ref={containersRef}>
            <div className="text-7xl md:text-[8rem] font-serif text-[#3D2B1F] leading-none mb-4 flex items-baseline">
              {containersCount}
              <span className="text-5xl md:text-7xl text-[#D4A373]">s</span>
            </div>
            <p className="text-sm tracking-[0.2em] uppercase text-[#2D3748] font-medium">Export Containers Shipped</p>
          </div>

        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="bg-[#D4A373] py-32 md:py-48 px-6 relative overflow-hidden">
        {/* Abstract shapes for premium feel */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFFFF0] opacity-10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#3D2B1F] opacity-5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeIn>
            <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl text-[#3D2B1F] mb-8 leading-tight">
              Let's create <br/> <span className="text-[#FFFFF0] italic">something timeless.</span>
            </h2>
          </FadeIn>
          
          <FadeIn delay={200}>
            <p className="text-xl text-[#3D2B1F] font-light mb-16 opacity-90 max-w-lg mx-auto">
              Interested in collaborating with Java Source? Reach out to discuss your next project.
            </p>
          </FadeIn>
          
          <FadeIn delay={400} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <MagneticButton className="w-full sm:w-auto px-8 py-5 bg-[#3D2B1F] text-[#FFFFF0] rounded-none group hover:bg-[#2A1D15]">
              <a href ="https://wa.me/qr/W74452F4B3L3E1">
                <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5" />
                <span className="tracking-widest uppercase text-sm font-medium">Chat on WhatsApp</span>
              </div>
              </a>
            </MagneticButton>
            
            <MagneticButton className="w-full sm:w-auto px-8 py-5 border border-[#3D2B1F] text-[#3D2B1F] rounded-none group hover:bg-[#3D2B1F] hover:text-[#FFFFF0]">
              <a href ="https://mail.google.com/mail/?view=cm&to=budyantohapy@gmail.com">
                  <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  <span className="tracking-widest uppercase text-sm font-medium">Send an Email</span>
              </div>
              </a>
            </MagneticButton>
          </FadeIn>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-[#3D2B1F] text-[#FFFFF0] py-16 px-6 md:px-12 border-t border-[#FFFFF0]/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="flex flex-col items-center md:items-start">
            <span className="font-serif text-3xl mb-2">Java Source</span>
            <span className="text-[#D4A373] text-sm tracking-widest uppercase opacity-80">Semarang, Indonesia</span>
          </div>
          
          <div className="flex gap-8">
            <a href="https://www.instagram.com/javasource.id?igsh=MWx0ejlhdHkwZDFyNA==" className="text-[#FFFFF0] hover:text-[#D4A373] transition-colors duration-300">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="https://wa.me/qr/W74452F4B3L3E1" className="text-[#FFFFF0] hover:text-[#D4A373] transition-colors duration-300">
              <MessageCircle className="w-6 h-6" />
            </a>
            <a href="https://mail.google.com/mail/?view=cm&to=budyantohapy@gmail.com" className="text-[#FFFFF0] hover:text-[#D4A373] transition-colors duration-300">
              <Mail className="w-6 h-6" />
            </a>
          </div>
          
        </div>
        
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[#FFFFF0]/10 flex flex-col md:flex-row justify-between items-center text-xs text-[#FFFFF0]/50 tracking-widest uppercase">
          <p>&copy; {new Date().getFullYear()} Java Source. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-[#D4A373] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#D4A373] transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}