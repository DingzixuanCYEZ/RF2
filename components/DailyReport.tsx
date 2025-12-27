import React from 'react';
import { DailyStats, Deck, Phrase } from '../types';
import { X, Clock, BrainCircuit, Target, ListChecks } from 'lucide-react';

interface DailyReportProps {
  stats: DailyStats;
  decks: Deck[];
  onClose: () => void;
}

export const DailyReport: React.FC<DailyReportProps> = ({ stats, decks, onClose }) => {
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}秒`;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}小时${m}分`;
    return `${m}分`;
  };

  const getPhraseDetails = (id: string): { phrase: Phrase, deckName: string } | null => {
    for (const deck of decks) {
      const found = deck.phrases.find(p => p.id === id);
      if (found) return { phrase: found, deckName: deck.name };
    }
    return null;
  };

  const reviewedItems = stats.reviewedPhraseIds
    .map(id => getPhraseDetails(id))
    .filter(item => item !== null) as { phrase: Phrase, deckName: string }[];

  const accuracy = stats.reviewCount > 0 
    ? Math.round((stats.correctCount / stats.reviewCount) * 100) 
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50 rounded-t-2xl">
           <div>
             <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
               <BrainCircuit className="w-6 h-6 text-indigo-600" />
               每日学习报告
             </h2>
             <p className="text-sm text-slate-500 mt-1">{stats.date} (UTC+8)</p>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-600 transition-colors">
             <X className="w-6 h-6" />
           </button>
        </div>

        {/* Summary Cards */}
        <div className="p-4 sm:p-6 grid grid-cols-3 gap-4 border-b border-slate-100 bg-white">
           <div className="bg-blue-50 p-3 sm:p-4 rounded-xl flex flex-col items-center justify-center text-center border border-blue-100">
             <Clock className="w-6 h-6 text-blue-500 mb-2" />
             <div className="text-xs sm:text-sm text-slate-500 font-medium">学习时长</div>
             <div className="text-lg sm:text-xl font-bold text-slate-800 mt-1">{formatTime(stats.studyTimeSeconds)}</div>
           </div>
           <div className="bg-indigo-50 p-3 sm:p-4 rounded-xl flex flex-col items-center justify-center text-center border border-indigo-100">
             <Target className="w-6 h-6 text-indigo-600 mb-2" />
             <div className="text-xs sm:text-sm text-slate-500 font-medium">复习次数</div>
             <div className="text-lg sm:text-xl font-bold text-slate-800 mt-1">{stats.reviewCount}</div>
             <div className="text-[10px] text-slate-400 mt-1 font-mono">
               <span className="text-emerald-600">✓{stats.correctCount}</span> / <span className="text-red-500">✗{stats.wrongCount}</span>
             </div>
           </div>
           <div className="bg-emerald-50 p-3 sm:p-4 rounded-xl flex flex-col items-center justify-center text-center border border-emerald-100">
             <div className="relative w-10 h-10 flex items-center justify-center mb-1">
               <svg className="w-full h-full transform -rotate-90">
                 <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-emerald-200" />
                 <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={113} strokeDashoffset={113 - (113 * accuracy) / 100} className="text-emerald-500" />
               </svg>
               <span className="absolute text-xs font-bold text-emerald-700">{accuracy}%</span>
             </div>
             <div className="text-xs sm:text-sm text-slate-500 font-medium">今日正确率</div>
           </div>
        </div>

        {/* Detailed List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
           <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
             <ListChecks className="w-4 h-4" />
             今日涉及内容 ({reviewedItems.length})
           </h3>
           
           {reviewedItems.length === 0 ? (
             <div className="text-center py-10 text-slate-400 italic bg-white rounded-xl border border-dashed border-slate-200">
               今天还没有复习任何词组。
             </div>
           ) : (
             <div className="space-y-3">
               {reviewedItems.map(({ phrase, deckName }, idx) => (
                 <div key={phrase.id} className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm gap-2">
                    <div className="flex items-center gap-3 overflow-hidden w-full">
                       <span className="text-xs font-mono text-slate-300 w-6 text-right shrink-0">{idx + 1}.</span>
                       <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-800 text-sm truncate flex items-center gap-2">
                             {phrase.english}
                             <span className="text-[10px] font-normal px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-full truncate max-w-[100px]">{deckName}</span>
                          </div>
                          <div className="text-xs text-slate-500 truncate">{phrase.chinese}</div>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0 pl-9 sm:pl-0 w-full sm:w-auto justify-between sm:justify-end">
                       <div className={`text-xs px-2 py-1 rounded-md font-medium border flex items-center gap-1 w-full sm:w-auto justify-center ${phrase.consecutiveWrong > 0 ? 'bg-red-50 text-red-700 border-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                          {phrase.consecutiveWrong > 0 
                            ? <><span>需加强</span> <span className="font-bold">(连错 {phrase.consecutiveWrong})</span></> 
                            : <><span>已掌握</span> <span className="font-bold">(连对 {phrase.consecutiveCorrect})</span></>
                          }
                       </div>
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>

      </div>
    </div>
  );
};