import { useEffect, useState } from 'react';

interface CoinAnimationProps {
  result: 'heads' | 'tails' | null;
  onAnimationComplete?: () => void;
}

export function CoinAnimation({ result, onAnimationComplete }: CoinAnimationProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (result) {
      setIsSpinning(true);
      setShowResult(false);
      
      const spinDuration = 2000;
      const timer = setTimeout(() => {
        setIsSpinning(false);
        setShowResult(true);
        onAnimationComplete?.();
      }, spinDuration);

      return () => clearTimeout(timer);
    }
  }, [result, onAnimationComplete]);

  if (!result) return null;

  return (
    <div className="coin-animation-container">
      <div className={`coin ${isSpinning ? 'spinning' : ''} ${showResult ? 'landed' : ''}`}>
        <div className="coin-face heads">
          <div className="coin-content">
            <span className="coin-symbol">H</span>
            <span className="coin-text">HEADS</span>
          </div>
        </div>
        <div className="coin-face tails">
          <div className="coin-content">
            <span className="coin-symbol">T</span>
            <span className="coin-text">TAILS</span>
          </div>
        </div>
      </div>
      {showResult && (
        <div className="coin-result">
          <span className="result-text">Landed on {result.toUpperCase()}!</span>
        </div>
      )}
    </div>
  );
}
