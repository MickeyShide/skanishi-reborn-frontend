export function Emblem({ size = 84, glow = true }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {glow && (
        <div
          className="absolute rounded-full blur-md"
          style={{
            inset: -size * 0.32,
            background: 'radial-gradient(circle, rgba(139,108,255,0.55), rgba(59,224,255,0.15) 50%, transparent 72%)',
          }}
        />
      )}
      <div
        className="holo absolute inset-0"
        style={{
          clipPath: 'polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%)',
          background: 'var(--gradient-holo)',
          backgroundSize: '180% 180%',
        }}
      />
      <div
        className="absolute bg-sk-bg"
        style={{
          inset: size * 0.07,
          clipPath: 'polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%)',
        }}
      />
      <div
        className="absolute"
        style={{
          inset: size * 0.13,
          clipPath: 'polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%)',
          background: 'linear-gradient(135deg, rgba(139,108,255,0.22), rgba(59,224,255,0.10))',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="rounded"
          style={{
            width: size * 0.3,
            height: size * 0.3,
            border: '2px solid rgb(var(--color-cyan))',
            boxShadow: '0 0 12px rgb(var(--color-cyan))',
          }}
        />
        <div className="absolute bg-sk-cyan/50" style={{ width: size * 0.5, height: 1.5 }} />
        <div className="absolute bg-sk-cyan/50" style={{ width: 1.5, height: size * 0.5 }} />
      </div>
    </div>
  );
}

export function Wordmark({ size = 26, sub }) {
  return (
    <div className="text-center">
      <div
        className="font-ui font-bold text-sk-text"
        style={{ fontSize: size, letterSpacing: size * 0.18, paddingLeft: size * 0.18 }}
      >
        SKANSHI
      </div>
      {sub && <div className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[3px] text-sk-text3">{sub}</div>}
    </div>
  );
}

export default function Brand({ className = '', size = 84 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 84 84"
      role="img"
      aria-label="Skanshi"
    >
      <polygon points="42,2 78,23 78,61 42,82 6,61 6,23" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M25 42h34M42 25v34" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
