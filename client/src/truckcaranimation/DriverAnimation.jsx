import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import truckImg from "../assets/images/truck.png";
import carImg from "../assets/images/car.png"; // Ensure this is your new Ertiga image

gsap.registerPlugin(ScrollTrigger);

// Utility for floating animation
const getRandomFloat = () => ({
  x: gsap.utils.random(-15, 15),
  y: gsap.utils.random(-15, 15),
  rotation: gsap.utils.random(-5, 5),
  duration: 2.5,
  ease: "sine.inOut",
  repeat: -1,
  yoyo: true,
});

export default function DriverAnimation() {
  const containerRef = useRef(null);
  const truck = useRef(null);
  const towingGroup = useRef(null);
  const bubbles = useRef([]);

  const labels = [
    "Driver Face Authentication",
    "Rash Driving Detection",
    "Distraction Detection",
    "Drowsiness Detection",
    "Driver Behaviour Analysis",
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial Setups (Start off-screen)
      gsap.set(truck.current, { x: "-100vw", autoAlpha: 0 });
      gsap.set(towingGroup.current, { x: "-100vw", autoAlpha: 0 });

      // Continuous floating for bubbles (keeps them alive before they drop)
      bubbles.current.forEach((el) => {
        gsap.to(el, getRandomFloat());
      });

      // --- MAIN TIMELINE ---
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          // Offset start slightly to account for a fixed navbar height (adjust if needed)
          start: "top top+=72",
          end: "+=2500",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          // Enable markers temporarily to debug trigger positions in dev/prod if needed
          // Remove markers:true when debugging is finished
          markers: false,
        },
      });

      // Step 1: Bubbles Appear High & Spread
      tl.from(bubbles.current, {
        autoAlpha: 0,
        y: -120,
        scale: 0.5,
        stagger: 0.1,
        duration: 1,
        ease: "back.out(1.2)",
      });

      // Step 2: Truck Enters (Left -> Center-Left)
      // Stops at 5vw so the trolley is visible on the left side
      tl.to(
        truck.current,
        {
          x: "5vw",
          autoAlpha: 1,
          duration: 3,
          ease: "power2.out",
        },
        "-=1"
      );

      // Step 3: Bubbles Drop INTO Truck Trolley (Bed)
      // FIX: Truck is on the LEFT. Bed is at the back of the truck.
      // We move bubbles DOWN (y: 550) and LEFT (x: -400) to go deeper into the bed.
      tl.to(bubbles.current, {
        y: 550, // Move further down into the truck
        x: -400, // Move further left to align deeper with the truck bed
        scale: 0, // Shrink to look like they are entering the volume
        opacity: 0, // Fade out as they enter
        stagger: { each: 0.1, from: "end" }, // "from: end" makes bottom bubbles drop first
        duration: 2,
        ease: "back.in(0.8)", // "back.in" gives a slight anticipation bump before falling
      });

      // Step 4: Truck Exits (Center -> Right)
      tl.to(truck.current, {
        x: "100vw",
        autoAlpha: 0,
        duration: 3,
        ease: "power1.in",
      });

      // Step 5: Car + Trailer Enters (Left -> Center)
      tl.to(
        towingGroup.current,
        {
          x: "15vw",
          autoAlpha: 1,
          duration: 3,
          ease: "power2.out",
        },
        "-=0.5"
      );
    }, containerRef);

    // Ensure ScrollTrigger measurements are correct after layout changes
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen app-bg overflow-hidden flex flex-col items-center justify-center"
      style={{ backgroundColor: 'var(--page-bg, #101015)' }}
    >
      {/* --- BUBBLES LAYER (Z-10) --- 
          Placed Z-10 so they are visible, but the truck (Z-20) will be in front of them
          creating the illusion they fall 'into' the back if positioned correctly. */}
      <div className="absolute top-[20vh] flex flex-col gap-4 z-10 items-center pointer-events-none">
        {labels.map((txt, i) => (
          <div
            key={i}
            ref={(el) => (bubbles.current[i] = el)}
            className="px-6 py-3 font-bold rounded-full text-base tracking-wide whitespace-nowrap"
            style={{
              backgroundColor: 'var(--bubble-bg, rgba(255,255,255,0.95))',
              color: 'var(--bubble-text, #111827)',
              boxShadow: 'var(--bubble-shadow, 0 0 20px rgba(0,0,0,0.12))',
              border: '1px solid var(--glass-border, rgba(0,0,0,0.08))',
            }}
          >
            {txt}
          </div>
        ))}
      </div>

      {/* --- TRUCK LAYER (Z-20) --- */}
      <div ref={truck} className="absolute bottom-[35px] left-0 z-20">
        <img
          src={truckImg}
          alt="Truck"
          className="w-[650px] object-contain"
          style={{
            transform: 'translateX(-50px)',
            filter: 'var(--img-drop, drop-shadow(0 30px 40px rgba(0,0,0,0.6)))',
          }}
        />
      </div>

      {/* --- TOWING GROUP (Car + Rope + Trailer) (Z-30) --- */}
      <div
        ref={towingGroup}
        className="absolute bottom-[130px] left-0 flex items-end z-30"
      >
        {/* 1. AlcoZero Trailer */}
        <div className="relative translate-y-[-12px] mb-3 z-20">
          <span
            className="text-5xl font-black uppercase tracking-wider z-10"
            style={{ color: 'var(--brand, var(--primary-blue, #00A3FF))' }}
          >
            AlcoZero
          </span>
        </div>

        {/* 2. The Rope (Connection) */}
        <div
          className="w-[80px] h-[8px] translate-x-[10px] mx-[-10px] mb-[40px] relative z-10 rounded-full"
          style={{ backgroundColor: 'var(--rope-bg, rgba(128,128,128,0.5))' }}
        ></div>

        {/* 3. The Car */}
        <div className="relative z-20 transform translate-x-[-17px] translate-y-[70px]">
          <img
            src={carImg}
            alt="Car"
            className="w-[500px] object-contain"
            style={{ filter: 'var(--img-drop, drop-shadow(0 30px 40px rgba(0,0,0,0.6)))' }}
          />
        </div>
      </div>

      {/* --- REALISTIC ROAD --- */}
      <div
        className="absolute bottom-0 w-full h-40 border-t z-10 flex items-center justify-center"
        style={{
          backgroundColor: 'var(--road-bg, #151515)',
          borderTopColor: 'var(--road-border, rgba(100,100,100,0.25))',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'var(--road-gradient, linear-gradient(90deg, rgba(0,0,0,1), rgba(26,26,26,1) 50%, rgba(0,0,0,1)))',
            opacity: 0.65,
          }}
        ></div>
        <div
          className="w-full h-0 border-t-[8px] border-dashed"
          style={{
            borderTopColor: 'var(--road-dash, #FFD200)',
            zIndex: 30,
            position: 'relative',
            boxShadow: '0 0 14px rgba(255,210,0,0.45)',
          }}
        ></div>
      </div>
    </div>
  );
}