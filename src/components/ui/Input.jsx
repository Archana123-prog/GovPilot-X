import clsx from 'clsx';

export default function Input({
  label,
  error,
  hint,
  icon: Icon,
  className = '',
  textArea = false,
  rows = 4,
  ...props
}) {
  const Tag = textArea ? 'textarea' : 'input';
  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      {label && <label className="input-label">{label}</label>}
      <div className="relative">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
            <Icon size={15} />
          </span>
        )}
        <Tag
          className={clsx(
            'input-field',
            Icon && 'pl-9',
            error && 'border-accent-red/60 focus:border-accent-red focus:ring-accent-red/30',
            textArea && 'resize-none leading-relaxed'
          )}
          rows={textArea ? rows : undefined}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-accent-red mt-0.5">{error}</p>}
      {hint && !error && <p className="text-xs text-white/35 mt-0.5">{hint}</p>}
    </div>
  );
}
