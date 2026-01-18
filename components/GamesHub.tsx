
import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from './Icon';

interface GamesHubProps {
  onBack: () => void;
}

type GameView = 'HUB' | 'MEMORY' | 'MATH' | 'SCRAMBLE' | 'PATTERN';
type MemoryDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

// --- Pet Types ---
interface Pet {
    name: string;
    type: 'dog' | 'cat' | 'fish';
    level: number;
    xp: number;
    hunger: number;
    happiness: number;
}

// --- Game Data ---
const MEMORY_ICONS = ['sun', 'heart', 'star', 'moon', 'zap', 'music', 'sprout', 'bell'];

// Scramble words related to app themes: Activities, Medication, Appointments
const SCRAMBLE_WORDS = [
    // Level 1-10: Activities
    { word: 'GARDEN', hint: 'Where flowers grow' },
    { word: 'WALKING', hint: 'Easy exercise' },
    { word: 'CHURCH', hint: 'Place of worship' },
    { word: 'ART', hint: 'Painting or drawing' },
    { word: 'MUSIC', hint: 'Playing an instrument' },
    { word: 'POOL', hint: 'Where you go swimming' },
    { word: 'READING', hint: 'A quiet hobby with books' },
    { word: 'COOKING', hint: 'Preparing a meal' },
    { word: 'DANCE', hint: 'Moving to a rhythm' },
    { word: 'FAMILY', hint: 'People you love' },
    
    // Level 11-20: Medication & Health
    { word: 'PILL', hint: 'Small round medicine' },
    { word: 'DOSAGE', hint: 'The amount of medicine' },
    { word: 'REFILL', hint: 'Ordering more medicine' },
    { word: 'CAPSULE', hint: 'A type of medicine container' },
    { word: 'BOTTLE', hint: 'Holds your vitamins' },
    { word: 'HEALTH', hint: 'Your physical well-being' },
    { word: 'SUPPER', hint: 'Take meds with this meal' },
    { word: 'STOCK', hint: 'The supply you have left' },
    { word: 'VITAMIN', hint: 'Daily health supplement' },
    { word: 'DAILY', hint: 'Every single day' },
    
    // Level 21-30: Appointments & Doctors
    { word: 'DOCTOR', hint: 'Medical professional' },
    { word: 'VISIT', hint: 'A scheduled appointment' },
    { word: 'HOSPITAL', hint: 'Where surgery happens' },
    { word: 'CLINIC', hint: 'A small doctor office' },
    { word: 'CHECKUP', hint: 'Routine medical exam' },
    { word: 'NURSE', hint: 'Healthcare assistant' },
    { word: 'CALENDAR', hint: 'Tracks your dates' },
    { word: 'CLINTON', hint: 'A popular doctor name' },
    { word: 'SURGERY', hint: 'A major operation' },
    { word: 'RECOVERY', hint: 'Getting better after illness' }
];

interface Card {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface Question {
  text: string;
  answer: number;
  options: number[];
}

interface ScramblePoolLetter {
    char: string;
    isUsed: boolean;
}

interface ScrambleAnswerLetter {
    char: string;
    poolIndex: number;
}

interface ScrambleState {
    original: string;
    shuffled: ScramblePoolLetter[];
    current: ScrambleAnswerLetter[];
    hint: string;
}

export const GamesHub: React.FC<GamesHubProps> = ({ onBack }) => {
  const [activeGame, setActiveGame] = useState<GameView>('HUB');
  const [treats, setTreats] = useState(3);
  const [pet, setPet] = useState<Pet>({
      name: 'Sparky',
      type: 'dog',
      level: 1,
      xp: 20,
      hunger: 40,
      happiness: 60
  });
  const [showPetInteraction, setShowPetInteraction] = useState<string | null>(null);

  const triggerInteraction = (text: string) => {
      setShowPetInteraction(text);
      setTimeout(() => setShowPetInteraction(null), 1500);
  };

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

  // --- Memory Game Logic ---
  const [memoryDifficulty, setMemoryDifficulty] = useState<MemoryDifficulty>('EASY');
  const [isMemorySetup, setIsMemorySetup] = useState(true);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const initMemoryGame = (difficulty: MemoryDifficulty) => {
    let numPairs = 3;
    if (difficulty === 'MEDIUM') numPairs = 6;
    if (difficulty === 'HARD') numPairs = 8;

    const selectedIcons = MEMORY_ICONS.slice(0, numPairs);
    const gameIcons = [...selectedIcons, ...selectedIcons];
    const shuffled = gameIcons
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({ id: index, icon, isFlipped: false, isMatched: false }));
    
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMemoryDifficulty(difficulty);
    setIsMemorySetup(false);
  };

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    const newCards = cards.map(c => c.id === id ? { ...c, isFlipped: true } : c);
    setCards(newCards);
    setFlippedCards([...flippedCards, id]);

    if (flippedCards.length === 1) {
      setMoves(moves + 1);
      const firstId = flippedCards[0];
      const firstCard = newCards.find(c => c.id === firstId);
      if (firstCard && firstCard.icon === card.icon) {
        setTimeout(() => {
          setCards(prev => prev.map(c => c.id === firstId || c.id === id ? { ...c, isMatched: true } : c));
          setFlippedCards([]);
        }, 400);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => c.id === firstId || c.id === id ? { ...c, isFlipped: false } : c));
          setFlippedCards([]);
        }, 800);
      }
    }
  };

  const isMemoryComplete = cards.length > 0 && cards.every(c => c.isMatched);

  // --- Quick Math Logic ---
  const [mathQuestion, setMathQuestion] = useState<Question | null>(null);
  const [mathStreak, setMathStreak] = useState(0);
  const [mathFeedback, setMathFeedback] = useState<'correct' | 'wrong' | null>(null);

  const generateMathQuestion = () => {
    const a = Math.floor(Math.random() * 12) + 1;
    const b = Math.floor(Math.random() * 12) + 1;
    const answer = a + b;
    const options = new Set<number>([answer]);
    while (options.size < 3) {
      const wrong = answer + Math.floor(Math.random() * 6) - 3;
      if (wrong > 0 && wrong !== answer) options.add(wrong);
    }
    setMathQuestion({ text: `${a} + ${b} = ?`, answer, options: Array.from(options).sort(() => Math.random() - 0.5) });
    setMathFeedback(null);
  };

  const handleMathAnswer = (selected: number) => {
    if (!mathQuestion) return;
    if (selected === mathQuestion.answer) {
      setMathFeedback('correct');
      setMathStreak(s => s + 1);
      if ((mathStreak + 1) % 5 === 0) setTreats(t => t + 1);
      setTimeout(generateMathQuestion, 800);
    } else {
      setMathFeedback('wrong');
      setMathStreak(0);
      setTimeout(() => setMathFeedback(null), 800);
    }
  };

  // --- Word Scramble Logic ---
  const [scramble, setScramble] = useState<ScrambleState | null>(null);
  const [scrambleComplete, setScrambleComplete] = useState(false);
  const [scrambleRound, setScrambleRound] = useState(0);
  const [isCheckpoint, setIsCheckpoint] = useState(false);

  const initScramble = (forceRound?: number) => {
      const targetRound = forceRound !== undefined ? forceRound : scrambleRound;
      // Loop back to start if we run out of words
      const itemIndex = targetRound % SCRAMBLE_WORDS.length;
      const item = SCRAMBLE_WORDS[itemIndex];
      
      setScramble({
          original: item.word,
          shuffled: item.word.split('').sort(() => Math.random() - 0.5).map(char => ({ char, isUsed: false })),
          current: [],
          hint: item.hint
      });
      setScrambleComplete(false);
      setIsCheckpoint(false);
      if (forceRound !== undefined) setScrambleRound(forceRound);
  };

  const handleScramblePick = (letter: ScramblePoolLetter, index: number) => {
      if (!scramble || scrambleComplete || letter.isUsed) return;
      
      const newShuffled = [...scramble.shuffled];
      newShuffled[index] = { ...newShuffled[index], isUsed: true };
      
      const newCurrent = [...scramble.current, { char: letter.char, poolIndex: index }];
      
      setScramble({ ...scramble, shuffled: newShuffled, current: newCurrent });

      if (newCurrent.map(l => l.char).join('') === scramble.original) {
          const currentLevel = scrambleRound + 1;
          const reachedCheckpoint = currentLevel % 10 === 0;
          
          setScrambleComplete(true);
          setIsCheckpoint(reachedCheckpoint);
          
          // Regular treat + bonus for checkpoint
          const bonus = reachedCheckpoint ? 5 : 0;
          setTreats(t => t + 1 + bonus);
          
          if (reachedCheckpoint) {
              triggerInteraction('Checkpoint reached! 🏆');
          }
          
          setPet(p => ({ ...p, xp: p.xp + (reachedCheckpoint ? 50 : 15) }));
      } else if (newCurrent.length === scramble.original.length) {
          triggerInteraction('Not quite! ❌');
      }
  };

  const handleScrambleRemove = (index: number) => {
    if (!scramble || scrambleComplete) return;
    
    const letterToRemove = scramble.current[index];
    const newShuffled = [...scramble.shuffled];
    newShuffled[letterToRemove.poolIndex] = { ...newShuffled[letterToRemove.poolIndex], isUsed: false };
    
    const newCurrent = [...scramble.current];
    newCurrent.splice(index, 1);
    
    setScramble({ ...scramble, shuffled: newShuffled, current: newCurrent });
  };

  const nextScrambleLevel = () => {
      const next = scrambleRound + 1;
      setScrambleRound(next);
      initScramble(next);
  };

  // --- Pattern Master Logic ---
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [isDisplaying, setIsDisplaying] = useState(false);
  const [patternRound, setPatternRound] = useState(0);

  const playSequence = useCallback(async (seq: number[]) => {
      setIsDisplaying(true);
      for (const pad of seq) {
          setActivePad(pad);
          await new Promise(r => setTimeout(r, 600));
          setActivePad(null);
          await new Promise(r => setTimeout(r, 200));
      }
      setIsDisplaying(false);
  }, []);

  const initPattern = () => {
      const first = Math.floor(Math.random() * 4);
      setSequence([first]);
      setUserSequence([]);
      setPatternRound(1);
      playSequence([first]);
  };

  const handlePadClick = (pad: number) => {
      if (isDisplaying) return;
      setActivePad(pad);
      setTimeout(() => setActivePad(null), 200);

      const newUserSeq = [...userSequence, pad];
      setUserSequence(newUserSeq);

      if (pad !== sequence[newUserSeq.length - 1]) {
          // Failure
          triggerInteraction('Try Again! ❌');
          initPattern();
          return;
      }

      if (newUserSeq.length === sequence.length) {
          // Success
          setPatternRound(r => r + 1);
          if ((patternRound + 1) % 3 === 0) setTreats(t => t + 1);
          const next = [...sequence, Math.floor(Math.random() * 4)];
          setSequence(next);
          setUserSequence([]);
          setTimeout(() => playSequence(next), 1000);
      }
  };

  // --- Render Functions ---

  const renderHub = () => (
    <div className="flex-1 p-5 space-y-5 animate-fade-in overflow-y-auto no-scrollbar">
      {/* Pet Dashboard */}
      <div className="bg-white rounded-[2rem] border border-slate-100 p-4 shadow-sm relative overflow-hidden">
        {showPetInteraction && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-brand-600 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-lg animate-pop z-30">
                {showPetInteraction}
            </div>
        )}
        <div className="flex items-center gap-4 relative z-10">
            <button onClick={handlePlay} className="w-20 h-20 bg-brand-50 rounded-[1.75rem] flex items-center justify-center border border-brand-100 shrink-0 shadow-inner active:scale-95 transition-transform">
                <Icon name={pet.type} size={40} className="text-brand-600" />
                <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-0.5 rounded-md border-2 border-white shadow-sm">LVL {pet.level}</div>
            </button>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-black text-slate-900 truncate">{pet.name}</h2>
                    <div className="flex items-center gap-1.5 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">
                        <Icon name="bone" size={14} className="text-orange-600" />
                        <span className="text-xs font-black text-orange-700">{treats}</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-yellow-400" style={{ width: `${pet.happiness}%` }}></div></div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${pet.hunger < 30 ? 'bg-rose-400' : 'bg-brand-500'}`} style={{ width: `${pet.hunger}%` }}></div></div>
                </div>
            </div>
        </div>
        <div className="flex gap-2 mt-4">
            <button onClick={handleFeed} disabled={treats === 0} className="flex-1 py-3 bg-brand-600 text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-brand-100 disabled:opacity-30 active:scale-95 transition-all">Give Treat</button>
            <button onClick={handlePlay} className="flex-1 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-black text-[11px] uppercase tracking-widest active:scale-95 transition-all">Play</button>
        </div>
      </div>

      {/* Game Selection */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] ml-1">Daily Training</h3>
        <div className="grid grid-cols-2 gap-3">
          <GameButton onClick={() => { setIsMemorySetup(true); setActiveGame('MEMORY'); }} icon="puzzle" label="Memory" color="orange" reward="+3 Treats" />
          <GameButton onClick={() => { generateMathQuestion(); setActiveGame('MATH'); }} icon="calculator" label="Quick Math" color="blue" reward="Streak Mode" />
          <GameButton onClick={() => { initScramble(); setActiveGame('SCRAMBLE'); }} icon="type" label="Scramble" color="teal" reward="+1 Treat" />
          <GameButton onClick={() => { initPattern(); setActiveGame('PATTERN'); }} icon="zap" label="Pattern" color="purple" reward="Memory Test" />
        </div>
      </div>
    </div>
  );

  const renderScramble = () => (
    <div className="flex-1 flex flex-col p-6 animate-fade-in justify-center h-full overflow-hidden">
        <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Level {scrambleRound + 1}</p>
                {(scrambleRound + 1) % 10 === 0 && (
                    <div className="bg-yellow-400 text-yellow-900 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">Checkpoint</div>
                )}
            </div>
        </div>
        
        {scramble && (
            <div className="w-full max-w-xs mx-auto space-y-12">
                <div className="text-center">
                    <p className="text-[10px] font-black text-brand-500 uppercase tracking-widest mb-4">Hint: {scramble.hint}</p>
                    <div className="flex justify-center gap-1.5 flex-nowrap w-full min-h-[56px]">
                        {scramble.current.map((l, i) => (
                            <button 
                                key={i} 
                                onClick={() => handleScrambleRemove(i)}
                                className="flex-1 max-w-[40px] aspect-[4/5] bg-brand-600 text-white rounded-xl flex items-center justify-center text-xl font-black shadow-lg animate-pop active:scale-90 transition-transform"
                                aria-label={`Remove letter ${l.char}`}
                            >
                                {l.char}
                            </button>
                        ))}
                        {Array.from({ length: scramble.original.length - scramble.current.length }).map((_, i) => (
                            <div key={i} className="flex-1 max-w-[40px] aspect-[4/5] bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl"></div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 justify-items-center">
                    {scramble.shuffled.map((letter, i) => (
                        <div key={i} className="w-16 h-16 relative">
                            {letter.isUsed ? (
                                <div className="w-full h-full bg-slate-50 border-2 border-dashed border-slate-100 rounded-2xl opacity-40"></div>
                            ) : (
                                <button 
                                    onClick={() => handleScramblePick(letter, i)} 
                                    className="w-full h-full bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center text-2xl font-black text-slate-800 shadow-sm active:scale-90 transition-all"
                                >
                                    {letter.char}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                
                <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Tap letters to build the word
                </p>
            </div>
        )}
        {scrambleComplete && (
            <div className={`fixed inset-0 z-50 flex items-center justify-center ${isCheckpoint ? 'bg-yellow-400/95' : 'bg-brand-600/90'} backdrop-blur-md animate-fade-in p-8`}>
                <div className="text-center text-white space-y-6 animate-pop">
                    <div className="relative inline-block">
                        <Icon name={isCheckpoint ? "trophy" : "check-plain"} size={80} className={`mx-auto ${isCheckpoint ? 'text-yellow-100' : 'text-white'}`} />
                        {isCheckpoint && <div className="absolute inset-0 animate-ping rounded-full border-4 border-white/20"></div>}
                    </div>
                    
                    <div className="space-y-1">
                        <h2 className={`text-4xl font-black ${isCheckpoint ? 'text-yellow-900' : 'text-white'}`}>
                            {isCheckpoint ? 'CHECKPOINT!' : 'PERFECT!'}
                        </h2>
                        <p className={`text-xl font-bold opacity-80 ${isCheckpoint ? 'text-yellow-800' : 'text-white'}`}>
                            Level {scrambleRound + 1} Complete
                        </p>
                    </div>

                    {isCheckpoint && (
                        <div className="bg-white/20 backdrop-blur rounded-2xl p-4 border border-white/30">
                            <div className="flex items-center justify-center gap-2">
                                <Icon name="bone" size={24} className="text-yellow-900" />
                                <span className="text-yellow-900 font-black text-xl">+5 CHECKPOINT BONUS</span>
                            </div>
                        </div>
                    )}

                    <button 
                        onClick={nextScrambleLevel} 
                        className={`px-12 py-4 rounded-2xl font-black text-lg shadow-2xl transition-all active:scale-95 ${
                            isCheckpoint 
                            ? 'bg-yellow-900 text-white' 
                            : 'bg-white text-brand-600'
                        }`}
                    >
                        Next Level
                    </button>
                </div>
            </div>
        )}
    </div>
  );

  const renderPattern = () => {
    const pads = [
        { id: 0, color: 'bg-rose-500', activeColor: 'bg-rose-300 shadow-[0_0_30px_rgba(244,63,94,0.6)]' },
        { id: 1, color: 'bg-blue-500', activeColor: 'bg-blue-300 shadow-[0_0_30px_rgba(59,130,246,0.6)]' },
        { id: 2, color: 'bg-emerald-500', activeColor: 'bg-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.6)]' },
        { id: 3, color: 'bg-amber-500', activeColor: 'bg-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.6)]' }
    ];

    return (
        <div className="flex-1 flex flex-col p-6 animate-fade-in justify-center h-full overflow-hidden">
            <div className="text-center mb-8">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Round</p>
                <h2 className="text-4xl font-black text-slate-900">{patternRound}</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 aspect-square max-w-xs mx-auto w-full">
                {pads.map(pad => (
                    <button 
                        key={pad.id} 
                        disabled={isDisplaying}
                        onClick={() => handlePadClick(pad.id)}
                        className={`rounded-[2rem] transition-all duration-200 transform active:scale-95 ${activePad === pad.id ? pad.activeColor : pad.color} shadow-lg`}
                    />
                ))}
            </div>
            <p className="text-center mt-8 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                {isDisplaying ? 'Watch Closely...' : 'Your Turn!'}
            </p>
        </div>
    );
  };

  const renderMemoryGame = () => {
    let gridClass = 'grid-cols-3';
    if (memoryDifficulty === 'EASY') gridClass = 'grid-cols-2';
    if (memoryDifficulty === 'HARD') gridClass = 'grid-cols-4';

    return (
        <div className="flex-1 flex flex-col p-4 animate-fade-in overflow-hidden h-full">
            <div className="flex justify-between items-center mb-4 bg-white p-3 rounded-[1.5rem] shadow-sm border border-slate-100 shrink-0">
                <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Moves Made</p>
                    <span className="text-xl font-black text-slate-900">{moves}</span>
                </div>
                <button onClick={() => initMemoryGame(memoryDifficulty)} className="w-9 h-9 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center active:scale-90 transition-all"><Icon name="restart" size={18} /></button>
            </div>
            <div className={`flex-1 grid ${gridClass} gap-2 content-center items-center justify-items-center no-scrollbar overflow-hidden pb-4 min-h-0`}>
                {cards.map(card => (
                <button key={card.id} onClick={() => handleCardClick(card.id)} disabled={card.isFlipped || card.isMatched} className={`w-full aspect-square rounded-[1.25rem] flex items-center justify-center shadow-sm transition-all duration-300 transform ${card.isFlipped || card.isMatched ? 'bg-brand-600 text-white scale-[0.98]' : 'bg-white border-2 border-slate-100'}`}>
                    {(card.isFlipped || card.isMatched) ? <Icon name={card.icon} size={memoryDifficulty === 'HARD' ? 24 : 32} className="animate-pop" /> : <div className="w-2 h-2 rounded-full bg-slate-200"></div>}
                </button>
                ))}
            </div>
            {isMemoryComplete && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-md animate-fade-in p-6">
                <div className="bg-white rounded-[2.5rem] p-8 text-center shadow-2xl animate-pop max-w-xs w-full">
                    <Icon name="bone" size={32} className="mx-auto text-green-500 mb-4 animate-bounce" />
                    <h2 className="text-xl font-black text-slate-900">Excellent!</h2>
                    <button onClick={() => { setTreats(t => t + (memoryDifficulty === 'HARD' ? 3 : 1)); setActiveGame('HUB'); }} className="w-full mt-6 py-4 bg-brand-600 text-white rounded-2xl font-black">Collect Rewards</button>
                </div>
                </div>
            )}
        </div>
    );
  };

  const renderMathGame = () => (
    <div className="flex-1 flex flex-col p-4 animate-fade-in justify-center h-full overflow-hidden">
      <div className="flex items-center justify-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-slate-100 shadow-sm w-fit mx-auto mb-6 shrink-0">
         <Icon name="trophy" size={16} className="text-yellow-500" />
         <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Streak: {mathStreak}</span>
      </div>
      <div className="w-full max-w-[280px] mx-auto space-y-4 flex flex-col justify-center flex-1 min-h-0">
        {mathQuestion && (
          <>
            <div className={`bg-white rounded-[2rem] p-8 text-center shadow-soft border-[3px] transition-all duration-300 ${mathFeedback === 'correct' ? 'border-green-400 bg-green-50' : mathFeedback === 'wrong' ? 'border-rose-400 bg-rose-50 animate-shake' : 'border-slate-50'}`}>
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter">{mathQuestion.text}</h2>
            </div>
            <div className="grid grid-cols-1 gap-2 shrink-0 pb-4">
              {mathQuestion.options.map((opt, idx) => (
                <button key={idx} onClick={() => handleMathAnswer(opt)} disabled={mathFeedback !== null} className="bg-white border-2 border-slate-100 text-slate-800 py-4 rounded-xl text-xl font-black shadow-sm active:bg-brand-50 active:scale-[0.98]">{opt}</button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col overflow-hidden h-full">
      <div className="bg-white px-6 pt-12 pb-4 flex items-center justify-between border-b border-slate-100 sticky top-0 z-50 shrink-0">
        <button onClick={() => activeGame === 'HUB' ? onBack() : setActiveGame('HUB')} className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 active:scale-90 transition-all">
          <Icon name="back" size={18} />
        </button>
        <h1 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] truncate">
           {activeGame === 'HUB' ? 'Brain Training' : activeGame === 'MEMORY' ? 'Memory Match' : activeGame === 'MATH' ? 'Quick Math' : activeGame === 'SCRAMBLE' ? `Scramble Lv ${scrambleRound + 1}` : 'Pattern Master'}
        </h1>
        <div className="w-9" />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        {activeGame === 'HUB' && renderHub()}
        {activeGame === 'MEMORY' && (isMemorySetup ? <div className="p-6 flex flex-col items-center justify-center h-full"><button onClick={() => initMemoryGame('EASY')} className="w-full bg-white p-5 rounded-[2rem] border-2 border-slate-100 mb-4 font-black text-slate-800">Start Easy</button><button onClick={() => initMemoryGame('MEDIUM')} className="w-full bg-white p-5 rounded-[2rem] border-2 border-slate-100 mb-4 font-black text-slate-800">Start Medium</button></div> : renderMemoryGame())}
        {activeGame === 'MATH' && renderMathGame()}
        {activeGame === 'SCRAMBLE' && renderScramble()}
        {activeGame === 'PATTERN' && renderPattern()}
      </div>
    </div>
  );
};

const GameButton: React.FC<{ onClick: () => void; icon: string; label: string; color: string; reward: string }> = ({ onClick, icon, label, color, reward }) => {
    const colors: Record<string, string> = {
        orange: 'bg-orange-50 text-orange-500',
        blue: 'bg-blue-50 text-blue-500',
        teal: 'bg-teal-50 text-teal-500',
        purple: 'bg-purple-50 text-purple-500'
    };
    return (
        <button onClick={onClick} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center gap-3 active:scale-95 transition-all group">
            <div className={`w-12 h-12 ${colors[color]} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon name={icon} size={24} />
            </div>
            <div>
                <h4 className="font-black text-slate-900 text-sm leading-tight">{label}</h4>
                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">{reward}</p>
            </div>
        </button>
    );
};
