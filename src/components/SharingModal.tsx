import { useState } from 'react';
import QRCode from 'react-qr-code';
import ActionButton from './ActionButton';

export default function SharingModal({ onClose }: { onClose: () => void }) {
  const [showQR, setShowQR] = useState(false);
  const link = window.location.href;

  const copyLink = async () => {
    await navigator.clipboard.writeText(link);
    alert('Link copiado!');
  };

  const shareNative = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'Participe da Sala', url: link });
    } else {
      copyLink();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4 sm:p-6 w-full max-w-sm sm:w-[350px] shadow-xl text-center text-white">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Convide seu time</h2>

        {!showQR ? (
          <div className="flex flex-col gap-3">
            <ActionButton label="Mostrar QR Code" onClick={() => setShowQR(true)} />
            <ActionButton label="Compartilhar" onClick={shareNative} />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="bg-white p-2 rounded-lg">
              <QRCode value={link} size={140} />
            </div>
            <ActionButton label="Fechar QR Code" onClick={() => setShowQR(false)} variant="default" />
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 text-sm text-white/70 hover:underline transition"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
