'use client';
import { AssetInfo } from '../lib/assetInfo';

interface InteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetInfo: AssetInfo | null;
  onCollect: () => void;
}

export default function InteractionModal({ 
  isOpen, 
  onClose, 
  assetInfo, 
  onCollect 
}: InteractionModalProps) {
  if (!isOpen || !assetInfo) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md mx-4">
        <h2 className="text-2xl font-bold text-white mb-4">{assetInfo.title}</h2>
        
        <div className="mb-4">
          <p className="text-gray-300 text-sm mb-2">상징:</p>
          <p className="text-yellow-400 font-semibold">{assetInfo.symbol}</p>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-300 text-sm mb-2">설명:</p>
          <p className="text-gray-200 leading-relaxed">{assetInfo.description}</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onCollect}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            수집하기
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
} 