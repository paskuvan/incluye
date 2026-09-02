// Gráfico de línea (SVG puro, sin dependencias) de la evolución del puntaje.

export type TrendPoint = { label: string; value: number };

export default function TrendChart({ points }: { points: TrendPoint[] }) {
  const W = 640;
  const H = 220;
  const padX = 40;
  const padY = 24;
  const innerW = W - padX * 2;
  const innerH = H - padY * 2;

  const n = points.length;
  const x = (i: number) =>
    n <= 1 ? padX + innerW / 2 : padX + (i / (n - 1)) * innerW;
  const y = (v: number) => padY + innerH - (v / 100) * innerH;

  const line = points.map((p, i) => `${x(i)},${y(p.value)}`).join(" ");

  // Líneas guía a 0, 50 y 100.
  const gridLevels = [0, 50, 100];

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full min-w-[480px]"
        role="img"
        aria-label="Evolución del puntaje de accesibilidad"
      >
        {/* Grid */}
        {gridLevels.map((lvl) => (
          <g key={lvl}>
            <line
              x1={padX}
              x2={W - padX}
              y1={y(lvl)}
              y2={y(lvl)}
              stroke="currentColor"
              strokeOpacity={0.12}
              strokeDasharray="4 4"
            />
            <text
              x={padX - 8}
              y={y(lvl) + 4}
              textAnchor="end"
              className="fill-slate-400"
              fontSize="11"
            >
              {lvl}
            </text>
          </g>
        ))}

        {/* Línea de la serie */}
        {n > 1 && (
          <polyline
            points={line}
            fill="none"
            stroke="#6366f1"
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {/* Puntos + etiquetas */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(p.value)} r={4} fill="#6366f1" />
            <text
              x={x(i)}
              y={y(p.value) - 10}
              textAnchor="middle"
              className="fill-slate-500 dark:fill-slate-300"
              fontSize="11"
              fontWeight="600"
            >
              {p.value}%
            </text>
            <text
              x={x(i)}
              y={H - 6}
              textAnchor="middle"
              className="fill-slate-400"
              fontSize="10"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
