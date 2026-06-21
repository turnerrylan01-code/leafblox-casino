export function SolIcon({ size = 14 }: { size?: number }) {
  return (
    <span className="sol-icon" style={{ width: size, height: size }}>
      <span />
      <span />
      <span />
    </span>
  );
}

export function SolAmount({ amount, decimals = 3, className = '' }: { amount: number; decimals?: number; className?: string }) {
  return (
    <span className={`sol-amount ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <SolIcon />
      {amount.toFixed(decimals)}
    </span>
  );
}
