// src/hooks/useVantaWaves.js
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function useVantaWaves() {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    if (!vantaEffect && window.VANTA?.WAVES) {
      setVantaEffect(
        window.VANTA.WAVES({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x222255,
          shininess: 20,
          waveHeight: 10,
          waveSpeed: 0.5,
        })
      );
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return vantaRef;
}
