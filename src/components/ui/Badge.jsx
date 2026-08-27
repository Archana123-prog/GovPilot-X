import clsx from 'clsx';

const STATUS_MAP = {
  ACTIVE:      'badge-active',
  PENDING:     'badge-pending',
  IN_PROGRESS: 'badge-review',
  REVIEW:      'badge-review',
  COMPLETED:   'badge-completed',
  REJECTED:    'badge-rejected',
  VERIFIED:    'badge-verified',
  true:        'badge-verified',
  false:       'badge-rejected',
};

const DOT_COLOR = {
  ACTIVE:      'bg-accent-green',
  PENDING:     'bg-accent-amber',
  IN_PROGRESS: 'bg-gov-400',
  REVIEW:      'bg-gov-400',
  COMPLETED:   'bg-cyber-400',
  REJECTED:    'bg-accent-red',
  VERIFIED:    'bg-accent-green',
};

export default function Badge({ status, label, dot = true, className = '' }) {
  const key = String(status);
  const display = label || key.replace('_', ' ');
  return (
    <span className={clsx('badge', STATUS_MAP[key] || 'badge-pending', className)}>
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full', DOT_COLOR[key] || 'bg-white/40')} />}
      {display}
    </span>
  );
}
