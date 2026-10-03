"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface GamifiedPopupProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function GamifiedPopup({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: GamifiedPopupProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = () => {
    setIsConfirming(true);
    setTimeout(() => {
      onConfirm();
      setIsConfirming(false); // Reset state
    }, 1200); // 1.2 second yay animation before action
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/80"
          />

          {/* Popup Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full flex justify-center"
          >
            {/* Desktop Scaler Wrapper */}
            <div className="w-full max-w-sm flex flex-col items-center md:scale-125 lg:scale-[1.4] transform-gpu origin-center">
              {/* Mascot Avatar - Bruno Asset */}
            <div className="mb-4 relative w-[132px] h-[118px] overflow-hidden" style={{ pointerEvents: 'none' }}>
              <div className="absolute top-0 left-0 w-[112px] h-[100%]">
                <div 
                  className="absolute top-0 left-0 w-full h-full transition-all duration-300"
                  style={{ 
                    background: `url(${isConfirming ? '/bruno-game/assets/boyYay-DyYK-NEy.png' : '/bruno-game/assets/boyHiBody-DHJ5Gzs3.png'}) no-repeat center/contain`,
                    transform: isConfirming ? 'scale(1.1) translateY(-5px)' : 'scale(1)'
                  }}
                />
                {!isConfirming && (
                  <div 
                    className="absolute bottom-0 right-0 w-[49px] h-[69px]"
                    style={{ 
                      background: 'url(data:image/png;base64,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) no-repeat center/contain',
                      transformOrigin: '30% 90%',
                      animation: 'boyArmWave 3s infinite ease-in-out'
                    }}
                  />
                )}
              </div>
            </div>
              </div>
            </div>

            <style>{`
              @keyframes boyArmWave {
                0% { transform: rotate(0); }
                2.5% { transform: rotate(15deg); }
                7.5% { transform: rotate(-15deg); }
                12.5% { transform: rotate(15deg); }
                17.5% { transform: rotate(-15deg); }
                20% { transform: rotate(0); }
                100% { transform: rotate(0); }
              }
            `}</style>

            {/* Bubble 1: Message */}
            <div className="bg-[#111111] rounded-3xl px-8 py-4 mb-8 shadow-2xl relative border-2 border-[#C9A96E] w-auto inline-block max-w-[95%] break-words">
              <p className="text-white text-center font-bold text-[17px] tracking-wide" style={{ fontFamily: "'Comic Neue', cursive" }}>
                {title && (
                  <>
                    {title}
                    <br />
                  </>
                )}
                {message}
              </p>
              {/* Little triangle pointing to avatar */}
              <div 
                className="absolute w-[16px] h-[12px] -top-[12px] left-1/2 -translate-x-1/2"
                style={{
                  background: `url("data:image/svg+xml,%3Csvg width='16' height='12' viewBox='0 0 16 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L0 12H16L8 0Z' fill='%23C9A96E'/%3E%3Cpath d='M8 3L2.5 12H13.5L8 3Z' fill='%23111111'/%3E%3C/svg%3E") no-repeat center/contain`
                }}
              />
            </div>

            {/* Buttons */}
            <div className="flex w-full gap-3 justify-center">
              <button
                onClick={onCancel}
                className="px-5 py-2 rounded-lg bg-[#111111] border border-[#C9A96E] text-white font-bold hover:bg-[#C9A96E] hover:text-[#18181b] transition-colors text-sm"
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                className="px-5 py-2 rounded-lg bg-[#111111] border border-[#C9A96E] text-[#C9A96E] font-bold hover:bg-[#C9A96E] hover:text-[#18181b] transition-colors shadow-[0_0_15px_rgba(201,169,110,0.2)] text-sm"
              >
                {confirmText}
              </button>
            </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
