
import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';

interface GamesHubProps {
  onBack: () => void;
}

type GameView = 'HUB' | 'MEMORY' | 'MATH';
type MemoryDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

// --- Pet Types ---
interface Pet {
    name: string;
    type: 'dog' | 'cat' | 'fish';
    level: number;
    xp: number;
    hunger: number; // 0-100 (100 is Full)
    happiness: number; // 0-100 (100 is Happy)
}

// --- Memory Game Types ---
interface Card {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// Expanded icons to support up to 8 pairs (16 cards)
const MEMORY_ICONS = ['sun', 'heart', 'star', 'moon', 'zap', 'music', 'sprout', 'bell'];

// --- Math Game Types ---
interface Question {
  text: string;
  answer: number;
  options: number[];
}

export const GamesHub: React.FC<GamesHubProps> = ({ onBack }) => {
  const [activeGame, setActiveGame] = useState<GameView>('HUB');
  
  // --- Pet Logic ---
  const [treats, setTreats] = useState(3);
  const [pet, setPet] = useState<Pet>({
      name: 'Sparky',
      type: 'dog',
      level: 1,
      xp: 20,
      hunger: 40, // Starts hungry
      happiness: 60
  });
  const [showPetInteraction, setShowPetInteraction] = useState<string | null>(null);

  const handleFeed = () => {
      if (treats > 0 && pet.hunger < 100) {
          setTreats(prev => prev - 1);
          setPet(prev => ({ 
              ...prev, 
              hunger: Math.min(100, prev.hunger + 30),
              xp: prev.xp + 5 
          }));
          triggerInteraction('Yummy! 🍖');
      }
  };

  const handlePlay = () => {
      if (pet.happiness < 100) {
          setPet(prev => ({ 
              ...prev, 
              happiness: Math.min(100, prev.happiness + 20),
              xp: prev.xp + 2 
          }));
          triggerInteraction('Woof! ❤️');
      }
  };

  const triggerInteraction = (text: string) => {
      setShowPetInteraction(text);
      setTimeout(() => setShowPetInteraction(null), 1500);
  };

  // --- Memory Game Logic ---
  const [memoryDifficulty, setMemoryDifficulty] = useState<MemoryDifficulty>('EASY');
  const [isMemorySetup, setIsMemorySetup] = useState(true); // Show setup screen first
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const initMemoryGame = (difficulty: MemoryDifficulty) => {
    let numPairs = 3;
    if (difficulty === 'MEDIUM') numPairs = 6;
    if (difficulty === 'HARD') numPairs = 8;

    // Slice the icons based on difficulty
    const selectedIcons = MEMORY_ICONS.slice(0, numPairs);
    const gameIcons = [...selectedIcons, ...selectedIcons];
    
    // Shuffle
    const shuffled = gameIcons
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({
        id: index,
        icon,
        isFlipped: false,
        isMatched: false,
      }));
    
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMemoryDifficulty(difficulty);
    setIsMemorySetup(false);
  };

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return; // Prevent clicking > 2
    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    // Flip the card
    const newCards = cards.map(c => c.id === id ? { ...c, isFlipped: true } : c);
    setCards(newCards);
    setFlippedCards([...flippedCards, id]);

    // Check match if this is the second card
    if (flippedCards.length === 1) {
      setMoves(moves + 1);
      const firstId = flippedCards[0];
      const firstCard = newCards.find(c => c.id === firstId);
      
      if (firstCard && firstCard.icon === card.icon) {
        // Match!
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === id ? { ...c, isMatched: true } : c
          ));
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === id ? { ...c, isFlipped: false } : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const isMemoryComplete = cards.length > 0 && cards.every(c => c.isMatched);

  const completeMemoryGame = () => {
      // Reward logic
      const rewardTreats = memoryDifficulty === 'HARD' ? 3 : memoryDifficulty === 'MEDIUM' ? 2 : 1;
      setTreats(prev => prev + rewardTreats);
      setPet(prev => ({ ...prev, xp: prev.xp + (rewardTreats * 10) }));
      initMemoryGame(memoryDifficulty); // Restart or go back? For now restart with new state.
      setActiveGame('HUB'); // Go back to hub to show reward
      triggerInteraction(`Earned ${rewardTreats} Treats!`); // This will show when HUB renders
  };

  // --- Math Game Logic ---
  const [mathQuestion, setMathQuestion] = useState<Question | null>(null);
  const [mathStreak, setMathStreak] = useState(0);
  const [mathFeedback, setMathFeedback] = useState<'correct' | 'wrong' | null>(null);

  const generateMathQuestion = () => {
    const a = Math.floor(Math.random() * 10) + 1; // 1-10
    const b = Math.floor(Math.random() * 10) + 1; // 1-10
    const answer = a + b;
    
    // Generate distinct options
    const options = new Set<number>([answer]);
    while (options.size < 3) {
      const wrong = answer + Math.floor(Math.random() * 5) - 2; // Close numbers
      if (wrong > 0 && wrong !== answer) options.add(wrong);
    }
    
    setMathQuestion({
      text: `${a} + ${b} = ?`,
      answer,
      options: Array.from(options).sort(() => Math.random() - 0.5)
    });
    setMathFeedback(null);
  };

  const handleMathAnswer = (selected: number) => {
    if (!mathQuestion) return;
    if (selected === mathQuestion.answer) {
      setMathFeedback('correct');
      const newStreak = mathStreak + 1;
      setMathStreak(newStreak);
      
      // Reward every 5
      if (newStreak % 5 === 0) {
          setTreats(prev => prev + 1);
          triggerInteraction('Streak Reward! +1 Treat');
      }

      setTimeout(generateMathQuestion, 1000);
    } else {
      setMathFeedback('wrong');
      setMathStreak(0);
      setTimeout(() => setMathFeedback(null), 1000);
    }
  };


  // --- Render Functions ---

  const renderHub = () => (
    <div className="flex-1 p-6 space-y-6 animate-fade-in overflow-y-auto">
      
      {/* Pet Dashboard Card */}
      <div className="bg-gradient-to-b from-sky-400 to-sky-500 rounded-[2.5rem] p-6 text-white shadow-lg relative overflow-hidden text-center">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
        
        {/* Interaction Pop-up */}
        {showPetInteraction && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white text-sky-600 px-4 py-2 rounded-full font-bold shadow-lg animate-pop z-20 whitespace-nowrap">
                {showPetInteraction}
            </div>
        )}

        {/* Pet Avatar */}
        <div className="relative z-10 flex flex-col items-center">
            <button 
                onClick={handlePlay}
                className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-xl mb-4 border-4 border-white/50 relative group active:scale-95 transition-transform"
            >
                <Icon name={pet.type} size={64} className="text-slate-700 group-hover:scale-110 transition-transform" />
                {/* Level Badge */}
                <div className="absolute -bottom-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-md border-2 border-white">
                    Lvl {pet.level}
                </div>
            </button>
            
            <h2 className="text-3xl font-bold mb-1">{pet.name}</h2>
            <p className="text-sky-100 font-medium text-sm mb-6">{pet.xp} XP / 100 XP</p>

            {/* Stats Bars */}
            <div className="w-full grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black/20 rounded-2xl p-3 backdrop-blur-sm">
                    <div className="flex justify-between text-xs font-bold mb-1.5 opacity-90">
                        <span>Hunger</span>
                        <span>{pet.hunger}%</span>
                    </div>
                    <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all duration-500 ${pet.hunger < 30 ? 'bg-rose-400' : 'bg-green-400'}`} 
                            style={{ width: `${pet.hunger}%` }}
                        ></div>
                    </div>
                </div>
                <div className="bg-black/20 rounded-2xl p-3 backdrop-blur-sm">
                    <div className="flex justify-between text-xs font-bold mb-1.5 opacity-90">
                        <span>Happiness</span>
                        <span>{pet.happiness}%</span>
                    </div>
                    <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-yellow-400 rounded-full transition-all duration-500" 
                            style={{ width: `${pet.happiness}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center w-full">
                <button 
                    onClick={handleFeed}
                    disabled={treats === 0}
                    className="flex-1 bg-white text-sky-600 py-3 rounded-xl font-bold shadow-lg shadow-sky-900/20 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center leading-none gap-1"
                >
                    <div className="flex items-center gap-1.5">
                        <Icon name="bone" size={18} />
                        <span>Feed</span>
                    </div>
                    <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wide">Costs 1 Treat</span>
                </button>
                <button 
                    onClick={handlePlay}
                    className="flex-1 bg-sky-600 text-white border border-sky-400 py-3 rounded-xl font-bold shadow-lg shadow-sky-900/20 active:scale-95 transition-transform flex flex-col items-center leading-none gap-1"
                >
                    <div className="flex items-center gap-1.5">
                        <Icon name="heart" size={18} className="fill-white" />
                        <span>Pet</span>
                    </div>
                    <span className="text-[10px] font-bold text-sky-200 uppercase tracking-wide">Free</span>
                </button>
            </div>
        </div>
      </div>

      {/* Treats Counter */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                  <Icon name="bone" size={20} />
              </div>
              <div>
                  <h3 className="font-bold text-slate-800">Your Treats</h3>
                  <p className="text-xs text-slate-500">Play games to earn more!</p>
              </div>
          </div>
          <span className="text-2xl font-bold text-slate-900">{treats}</span>
      </div>

      {/* Games List */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4 ml-1">Earn Treats</h3>
        <div className="grid grid-cols-1 gap-4">
          
          {/* Memory Game Card */}
          <button 
            onClick={() => {
              setIsMemorySetup(true); // Always show setup first
              setActiveGame('MEMORY');
            }}
            className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all group text-left relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">EARN 3 TREATS</div>
             <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                <Icon name="puzzle" size={32} />
             </div>
             <div className="flex-1">
                <h4 className="text-xl font-bold text-slate-900">Memory Match</h4>
                <p className="text-slate-500 text-sm mt-1">Find the matching pairs.</p>
             </div>
             <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <Icon name="chevron-right" size={24} />
             </div>
          </button>

          {/* Math Game Card */}
          <button 
             onClick={() => {
               generateMathQuestion();
               setActiveGame('MATH');
             }}
             className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all group text-left relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">EARN 1 / 5 STREAK</div>
             <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                <Icon name="calculator" size={32} />
             </div>
             <div className="flex-1">
                <h4 className="text-xl font-bold text-slate-900">Quick Math</h4>
                <p className="text-slate-500 text-sm mt-1">Simple arithmetic practice.</p>
             </div>
             <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <Icon name="chevron-right" size={24} />
             </div>
          </button>

          {/* Locked/Coming Soon */}
          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 flex items-center gap-5 opacity-60">
             <div className="w-16 h-16 bg-slate-200 rounded-2xl flex items-center justify-center text-slate-400">
                <Icon name="lightbulb" size={32} />
             </div>
             <div className="flex-1">
                <h4 className="text-xl font-bold text-slate-600">Word Association</h4>
                <p className="text-slate-400 text-sm mt-1">Coming soon...</p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );

  const renderMemorySetup = () => (
    <div className="flex-1 p-6 flex flex-col items-center justify-center animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Select Difficulty</h2>
        <p className="text-slate-500 text-center mb-8 max-w-xs">Choose a level to earn treats for {pet.name}.</p>

        <div className="w-full space-y-4 max-w-sm">
            <button 
                onClick={() => initMemoryGame('EASY')}
                className="w-full bg-white p-6 rounded-3xl border-2 border-green-100 shadow-sm hover:border-green-400 hover:bg-green-50 transition-all flex items-center gap-5 group"
            >
                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon name="smile" size={32} />
                </div>
                <div className="text-left">
                    <h3 className="text-lg font-bold text-slate-900">Easy</h3>
                    <p className="text-green-600 font-bold text-sm">+1 Treat</p>
                </div>
            </button>

            <button 
                onClick={() => initMemoryGame('MEDIUM')}
                className="w-full bg-white p-6 rounded-3xl border-2 border-blue-100 shadow-sm hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center gap-5 group"
            >
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon name="puzzle" size={32} />
                </div>
                <div className="text-left">
                    <h3 className="text-lg font-bold text-slate-900">Medium</h3>
                    <p className="text-blue-600 font-bold text-sm">+2 Treats</p>
                </div>
            </button>

            <button 
                onClick={() => initMemoryGame('HARD')}
                className="w-full bg-white p-6 rounded-3xl border-2 border-purple-100 shadow-sm hover:border-purple-400 hover:bg-purple-50 transition-all flex items-center gap-5 group"
            >
                <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon name="zap" size={32} />
                </div>
                <div className="text-left">
                    <h3 className="text-lg font-bold text-slate-900">Hard</h3>
                    <p className="text-purple-600 font-bold text-sm">+3 Treats</p>
                </div>
            </button>
        </div>
    </div>
  );

  const renderMemoryGame = () => {
    // Dynamic grid classes based on difficulty
    let gridClass = 'grid-cols-3'; // Default Medium
    if (memoryDifficulty === 'EASY') gridClass = 'grid-cols-2'; // 2x3
    if (memoryDifficulty === 'HARD') gridClass = 'grid-cols-4'; // 4x4

    return (
        <div className="flex-1 flex flex-col p-6 animate-fade-in overflow-hidden">
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400 uppercase">Moves</span>
            <span className="text-2xl font-bold text-slate-900">{moves}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded-md text-slate-500">{memoryDifficulty}</span>
                <button 
                    onClick={() => initMemoryGame(memoryDifficulty)}
                    className="p-3 bg-brand-50 text-brand-600 rounded-xl hover:bg-brand-100 transition-colors"
                    aria-label="Restart Game"
                >
                    <Icon name="restart" size={24} />
                </button>
            </div>
        </div>

        <div className={`flex-1 grid ${gridClass} gap-3 content-start`}>
            {cards.map(card => (
            <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={card.isFlipped || card.isMatched}
                className={`aspect-square rounded-2xl flex items-center justify-center shadow-sm transition-all duration-300 transform ${
                card.isFlipped || card.isMatched 
                    ? 'bg-brand-500 text-white scale-[0.95]' 
                    : 'bg-white border-2 border-slate-200 hover:border-brand-200'
                }`}
            >
                {(card.isFlipped || card.isMatched) ? (
                <Icon name={card.icon} size={memoryDifficulty === 'HARD' ? 24 : 32} className="animate-pop" />
                ) : (
                <span className="text-brand-300 font-bold text-3xl select-none">?</span>
                )}
            </button>
            ))}
        </div>

        {isMemoryComplete && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-8 text-center m-6 shadow-2xl animate-scale-up max-w-sm w-full">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <Icon name="bone" size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Treats Earned!</h2>
                <p className="text-slate-500 mb-6">You got a snack for {pet.name}!</p>
                <div className="space-y-3">
                    <button 
                        onClick={completeMemoryGame}
                        className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 shadow-lg shadow-brand-200"
                    >
                        Collect & Feed Sparky
                    </button>
                </div>
            </div>
            </div>
        )}
        </div>
    );
  };

  const renderMathGame = () => (
    <div className="flex-1 flex flex-col p-6 animate-fade-in relative">
      <div className="flex justify-between items-center mb-10">
         <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg border border-orange-100">
            <Icon name="trophy" size={16} />
            <span className="font-bold">Streak: {mathStreak}</span>
         </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center -mt-10">
        {mathQuestion && (
          <div className="w-full max-w-xs">
            <div className={`bg-white rounded-3xl p-10 text-center shadow-lg border-2 mb-8 transition-colors duration-300 ${
              mathFeedback === 'correct' ? 'border-green-400 bg-green-50' : 
              mathFeedback === 'wrong' ? 'border-rose-400 bg-rose-50' : 'border-slate-100'
            }`}>
              <h2 className="text-5xl font-bold text-slate-800 tracking-wider">{mathQuestion.text}</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {mathQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleMathAnswer(opt)}
                  disabled={mathFeedback !== null}
                  className="bg-white border-2 border-slate-100 text-slate-700 py-4 rounded-2xl text-2xl font-bold shadow-sm hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50 transition-all active:scale-[0.98]"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {mathFeedback === 'correct' && (
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-green-500 text-white px-6 py-3 rounded-full font-bold shadow-lg animate-pop flex items-center gap-2">
               <Icon name="check" size={24} />
               Great Job!
            </div>
         </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
       {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 flex items-center justify-between border-b border-slate-100 sticky top-0 z-20">
        <button 
          onClick={() => {
              if (activeGame === 'MEMORY' && !isMemorySetup) {
                  setIsMemorySetup(true); // Back to setup first
              } else if (activeGame !== 'HUB') {
                  setActiveGame('HUB');
              } else {
                  onBack();
              }
          }} 
          className="p-2 -ml-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors"
        >
          <Icon name="back" size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900">
           {activeGame === 'HUB' ? 'My Companion' : activeGame === 'MEMORY' ? 'Memory Match' : 'Quick Math'}
        </h1>
        <div className="w-10" />
      </div>

      {activeGame === 'HUB' && renderHub()}
      {activeGame === 'MEMORY' && (isMemorySetup ? renderMemorySetup() : renderMemoryGame())}
      {activeGame === 'MATH' && renderMathGame()}
    </div>
  );
};
