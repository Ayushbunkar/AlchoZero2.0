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
          start: "top top",
          end: "+=2500",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
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

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-[#101015] overflow-hidden flex flex-col items-center justify-center"
    >
      {/* --- BUBBLES LAYER (Z-10) --- 
          Placed Z-10 so they are visible, but the truck (Z-20) will be in front of them
          creating the illusion they fall 'into' the back if positioned correctly. */}
      <div className="absolute top-[20vh] flex flex-col gap-4 z-10 items-center pointer-events-none">
        {labels.map((txt, i) => (
          <div
            key={i}
            ref={(el) => (bubbles.current[i] = el)}
            className="px-6 py-3 bg-white/95 text-gray-900 font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)]
                        rounded-full text-base border border-gray-300 tracking-wide whitespace-nowrap"
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
          className="w-[650px] object-contain drop-shadow-2xl"
          style={{ transform: "translateX(-50px)" }}
        />
      </div>

      {/* --- TOWING GROUP (Car + Rope + Trailer) (Z-30) --- */}
      <div
        ref={towingGroup}
        className="absolute bottom-[130px] left-0 flex items-end z-30"
      >
        {/* 1. AlcoZero Trailer */}
        <div className="relative translate-y-[-12px] mb-3 z-20">
          <span className="text-5xl font-black text-white uppercase tracking-wider drop-shadow-md z-10">
            AlcoZero
          </span>
        </div>

        {/* 2. The Rope (Connection) */}
        <div className="w-[80px] h-[8px] translate-x-[10px] bg-gray-500 mx-[-10px] mb-[40px] relative z-10 rounded-full shadow-inner"></div>

        {/* 3. The Car */}
        <div className="relative z-20 transform translate-x-[-17px] translate-y-[70px]">
          <img
            src={carImg}
            alt="Car"
            className="w-[500px] object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* --- REALISTIC ROAD --- */}
      <div className="absolute bottom-0 w-full h-40 bg-[#151515] border-t border-gray-700 z-10 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-[#1a1a1a] to-black opacity-90"></div>
        <div className="w-full h-0 border-t-[8px] border-dashed border-yellow-500/80 z-10"></div>
      </div>
    </div>
  );
}