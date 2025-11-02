import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticlesBackground = () => {
  const [init, setInit] = useState(false);

  // This initializes the tsParticles engine and is crucial for the component to work.
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // loadSlim loads the smaller set of presets without all the heavy options
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = useMemo(
    () => ({
      fullScreen: {
        enable: true,
        zIndex: -1, // Ensures the particles are behind all other content
      },
      background: {
        color: {
          value: "transparent", // Use transparent to show the existing body gradient background
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "repulse",
          },
        },
        modes: {
          repulse: {
            distance: 100,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: "#8854c8", // Matches the Secondary color
        },
        links: {
          color: "#2868ff", // Matches the Primary color
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        move: {
          enable: true,
          outModes: { default: 'bounce' as const },
          // FIX: Changed random from false to true to satisfy stricter type definitions
          random: true, 
          speed: 2,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: 80,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 5 },
        },
      },
      detectRetina: true,
    }),
    [],
  );

  if (init) {
    return (
      <Particles
        id="tsparticles"
        options={options}
      />
    );
  }

  return null;
};

export default ParticlesBackground;