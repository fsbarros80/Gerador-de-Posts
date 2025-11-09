import React, { useEffect } from 'react';

interface ImageFocusModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText: string;
}

const ImageFocusModal: React.FC<ImageFocusModalProps> = ({ isOpen, onClose, imageUrl, altText }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex justify-center items-center p-4 sm:p-8 transition-opacity animate-[fade-in_200ms_ease-out]"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full h-full flex items-center justify-center"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking on the image container
      >
        <button
          onClick={onClose}
          className="absolute top-0 right-0 m-4 text-white/70 hover:text-white transition-colors z-10"
          aria-label="Fechar visualização da imagem"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img
          src={imageUrl}
          alt={altText}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transform transition-all animate-[slide-up_300ms_ease-out]"
        />
      </div>
    </div>
  );
};

export default ImageFocusModal;
