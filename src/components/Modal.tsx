import { FiX } from 'react-icons/fi';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-enter-scale">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-[#020617]/70 backdrop-blur-[2px]" 
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="modal-surface relative rounded-xl w-full max-w-sm p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white"
          >
            <FiX size={20} />
          </button>
        </div>
        
        {/* Body */}
        {children}
      </div>
    </div>
  );
}
