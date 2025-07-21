import classNames from 'classnames';

interface ActionButtonProps {
  label: string | React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'danger' | 'outlied';
  className?: string;
}

const variants = {
  default: 'bg-white/10 hover:bg-white/20 text-white border-white/20',
  primary: 'bg-blue-600 hover:bg-blue-500 text-white',
  danger: 'bg-red-600 hover:bg-red-500 text-white',
  outlied: 'bg-transparent border border-white/20 text-white hover:bg-white/10',
};

export default function ActionButton({
  label,
  onClick,
  variant = 'default',
  className = '',
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        'px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-md font-semibold text-sm sm:text-base transition border backdrop-blur',
        variants[variant],
        className
      )}
    >
      {label}
    </button>
  );
}
