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
        <p className="text-[var(--text-muted)] text-sm">
          {t('share.description')}
        </p>

        <div className="ui-panel flex flex-col items-center gap-2 rounded-xl py-3">
          <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">{t('share.qr')}</span>
          <div className="bg-white p-2 rounded-lg floating-soft">
            <QRCode value={roomUrl} size={112} fgColor="#333333" bgColor="#ffffff" />
          </div>
        </div>

        {/* Link input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={roomUrl}
            readOnly
            className="flex-1 ui-input rounded-lg px-3 py-2 text-sm"
          />
          <button
            onClick={copyToClipboard}
            className="ui-btn-primary px-4 py-2 rounded-lg text-sm font-medium"
          >
            {copied ? t('common.copied') : t('common.copy')}
          </button>
        </div>

        {/* Share button */}
        {typeof navigator.share === 'function' && (
          <button
            onClick={shareNative}
            className="ui-btn-secondary w-full px-4 py-2 rounded-lg text-sm font-medium"
          >
            {t('common.share')}
          </button>
        )}
      </div>
    </Modal>
  );
}
