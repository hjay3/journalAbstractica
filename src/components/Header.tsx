import React from 'react';
import { useReward } from 'react-rewards';
import { Sparkles } from 'lucide-react';

export function Header() {
  const { reward: confetti } = useReward('headerReward', 'confetti', {
    elementCount: 200,
    spread: 160,
    decay: 0.94,
    lifetime: 200,
    startVelocity: 35,
    colors: ['#b19cd9', '#9f86c0', '#e6c3c3', '#f4e1d2', '#b8e0d2']
  });

  return (
    <div 
      onClick={confetti}
      className="text-center mb-8 cursor-pointer"
    >
      <h1 className="text-4xl md:text-5xl font-light text-white mb-2 flex items-center justify-center gap-3">
        <Sparkles className="w-8 h-8 text-purple-400" />
        My Journal
        <Sparkles className="w-8 h-8 text-purple-400" />
      </h1>
      <span id="headerReward" />
    </div>
  );
}