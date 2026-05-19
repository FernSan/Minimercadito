// src/componentes/Icono.jsx
import React from "react";

export function Icono({ d, tamano = 16, trazo = "currentColor", relleno = "none", grosorTrazo = 1.8 }) {
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 24 24" fill={relleno} stroke={trazo} strokeWidth={grosorTrazo} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}