interface ToggleSwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}

export function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 text-sm text-[color:var(--text-primary)]"
    >
      <span
        className="relative inline-block h-6 w-11 rounded-full p-0.5 transition-colors"
        style={{
          background: checked
            ? 'linear-gradient(135deg, var(--accent), var(--accent-2))'
            : 'var(--bg-elevated-2)',
          border: '1px solid var(--border)',
        }}
      >
        <span
          className="block h-5 w-5 rounded-full transition-transform"
          style={{
            transform: checked ? 'translateX(20px)' : 'translateX(0)',
            background: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
          }}
        />
      </span>
      <span>{label}</span>
    </button>
  );
}
