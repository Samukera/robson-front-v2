import { useState } from 'react';
import Modal from './Modal';
import QRCode from 'react-qr-code';
import { useI18n } from '../context/I18nContext';

interface SharingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SharingModal({ isOpen, onClose }: SharingModalProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  
  const roomUrl = window.location.href;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(roomUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareNative = async () => {
    try {
      await navigator.share({
        title: 'Robson - Planning Poker',
        text: 'Participe da minha sala de planning poker!',
        url: roomUrl,
      });
    } catch (err) {
      console.error('Failed to share:', err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('share.title')}>
      <div className="space-y-4">
        <p className="text-slate-300 text-sm">
          {t('share.description')}
        </p>

        <div className="flex flex-col items-center gap-2 bg-slate-900/45 border border-slate-700/70 rounded-xl py-3">
          <span className="text-xs text-slate-300 uppercase tracking-wider">{t('share.qr')}</span>
          <div className="bg-white p-2 rounded-lg">
            <QRCode value={roomUrl} size={112} fgColor="#0f172a" bgColor="#ffffff" />
          </div>
        </div>

        {/* Link input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={roomUrl}
            readOnly
            className="
              flex-1 bg-slate-950/70 border border-slate-600/70 rounded-lg
              px-3 py-2 text-sm text-white placeholder:text-slate-500
              focus:outline-none focus:border-amber-400/80
            "
          />
          <button
            onClick={copyToClipboard}
            className="
              bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500
              text-white px-4 py-2 rounded-lg text-sm font-medium
              border border-amber-200/70 shadow-[0_8px_18px_rgba(245,158,11,0.35)]
              transition-all
            "
          >
            {copied ? t('common.copied') : t('common.copy')}
          </button>
        </div>

        {/* Share button */}
        {typeof navigator.share === 'function' && (
          <button
            onClick={shareNative}
            className="
              w-full bg-slate-700/90 hover:bg-slate-600
              text-white px-4 py-2 rounded-lg text-sm font-medium
              border border-slate-500/60
              transition-all
            "
          >
            {t('common.share')}
          </button>
        )}
      </div>
    </Modal>
  );
}
