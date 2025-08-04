'use client';

interface CompletionModalProps {
  isOpen: boolean;
  onGoHome: () => void;
}

export default function CompletionModal({ isOpen, onGoHome }: CompletionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 max-w-md mx-4 text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-white mb-4">모든 에셋을 수집했습니다!</h2>
          <p className="text-gray-300 leading-relaxed">
            당신은 내면의 여정을 완료했습니다. 각 에셋들이 상징하는 의미를 통해 
            자신의 내면을 더 깊이 이해하게 되었습니다.
          </p>
        </div>
        
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">수집한 에셋들:</h3>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• 깨진 거울 - 자아의 균열</li>
            <li>• 중세 목욕통 - 세속의 욕망</li>
            <li>• 나무 사다리 - 정신적 승화</li>
          </ul>
        </div>
        
        <button
          onClick={onGoHome}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-lg"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
} 