import clsx from 'clsx';

export default function Card({ children, className = '', hover = false, glow = false, ...props }) {
  return (
    <div
      className={clsx(
        hover ? 'glass-hover' : 'glass',
        'rounded-2xl p-5',
        glow && 'border-gov-500/30 shadow-glow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={clsx('flex items-start justify-between mb-4', className)}>
      <div>
        <h3 className="text-base font-semibold text-white">{title}</h3>
        {subtitle && <p className="text-xs text-white/50 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
