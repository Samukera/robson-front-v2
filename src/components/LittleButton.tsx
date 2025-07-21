type Props = {
  label?: string;
  icon: "edit" | "settings" | "share" | "folder";
  onClick: () => void;
};

export default function LittleButton({ label, icon, onClick }: Props) {
  const icons: Record<string, string> = {
    edit: "✏️",
    settings: "⚙️",
    share: "🔗",
    folder: "📁",
  };

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow hover:opacity-70"
    >
      {label && <span>{label}</span>}
      <span>{icons[icon]}</span>
    </button>
  );
}
