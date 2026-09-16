import React from 'react';

/**
 * Logotipo oficial de Financia+
 * Recreación vectorial precisa basada en el manual de marca suministrado:
 * - Isotipo dinámico con curva azul petróleo, símbolo +, flecha ascendente esmeralda y semicírculo ámbar.
 * - Wordmark "financia+" en minúsculas sin lema.
 */
export default function FinanciaPlusLogo({ 
  className = "h-9", 
  iconOnly = false,
  textClassName = "text-2xl" 
}) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Isotipo Vectorial */}
      <svg
        viewBox="0 0 130 115"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto shrink-0 drop-shadow-xs"
        aria-label="Isotipo Financia+"
      >
        <defs>
          <linearGradient id="financiaGreenArrow" x1="42" y1="85" x2="98" y2="18" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#16A34A" />
            <stop offset="60%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>

          <linearGradient id="financiaTealCurve" x1="14" y1="50" x2="65" y2="95" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#006584" />
            <stop offset="100%" stopColor="#0A354E" />
          </linearGradient>

          <linearGradient id="financiaAmberArc" x1="65" y1="80" x2="95" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>
        </defs>

        {/* 1. Arco inferior ámbar/dorado de balance */}
        <path
          d="M 68 86 C 84 84 96 68 96 48 C 96 66 84 88 64 96 Z"
          fill="url(#financiaAmberArc)"
        />

        {/* 2. Curva superior protectora izquierda (Cresta azul petróleo) */}
        <path
          d="M 22 68 C 16 36 42 12 78 8 C 62 13 32 30 36 65 Z"
          fill="url(#financiaTealCurve)"
        />

        {/* 3. Símbolo '+' interior en teal */}
        <path
          d="M 44 48 L 54 48 M 49 43 L 49 53"
          stroke="#006E8C"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 4. Curva base inferior en azul petróleo oscuro (trazo 3D en N) */}
        <path
          d="M 16 68 C 18 78 28 88 42 86 C 48 85 54 78 60 68 L 74 46"
          stroke="#0A354E"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 5. Flecha ascendente verde esmeralda */}
        <path
          d="M 38 80 C 44 86 52 82 58 72 L 86 28"
          stroke="url(#financiaGreenArrow)"
          strokeWidth="10.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 6. Cabeza de la flecha */}
        <path
          d="M 82 12 L 102 30 L 76 34 Z"
          fill="#22C55E"
          stroke="#16A34A"
          strokeWidth="1"
          strokeLinejoin="round"
        />

        {/* 7. Pequeños destellos en la punta de la flecha */}
        <line x1="88" y1="9" x2="86" y2="4" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="99" y1="12" x2="104" y2="7" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="104" y1="21" x2="109" y2="21" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" />
      </svg>

      {/* Wordmark "financia+" */}
      {!iconOnly && (
        <div className="flex items-center tracking-tight leading-none">
          <span className={`font-black text-[#0A354E] ${textClassName}`}>
            financia
          </span>
          <span className={`font-black text-emerald-500 ${textClassName} ml-0.5`}>
            +
          </span>
        </div>
      )}
    </div>
  );
}
