import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Subject, Topic, Curriculum, Term } from '../types';
import { GRADES, SUBJECTS } from '../constants';
import { getCurriculum } from '../curriculumData';
import { cn } from '../lib/utils';
import { isSubjectDrillAvailable } from '../utils/drillSchedule';
import Logo from './Logo';
import SubjectMotivation from './SubjectMotivation';

export default function SubjectDetail({ 
  subject, 
  onBack,
  onSelectTopic,
  onStartDrills,
  history
}: { 
  subject: Subject; 
  onBack: () => void;
  onSelectTopic: (topic: Topic) => void;
  onStartDrills: (subject: Subject) => void;
  history: { topicId: string, score: number, date: number }[];
}) {
  const [selectedGrade, setSelectedGrade] = useState(() => {
    if (subject === 'Biology' || subject === 'Etymology') return 8;
    return 1;
  });
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<number>(1);

  const subjectInfo = SUBJECTS.find(s => s.name === subject);
  const displayTitle = subjectInfo?.label || subject;

  useEffect(() => {
    let activeGrade = selectedGrade;
    if (subject === 'Alphabet') {
      activeGrade = 1;
    } else if (subject === 'Biology' || subject === 'Etymology') {
      if (selectedGrade < 8 || selectedGrade > 10) {
        activeGrade = 8;
      }
    }
    if (activeGrade !== selectedGrade) {
      setSelectedGrade(activeGrade);
    }
    setCurriculum(getCurriculum(activeGrade, subject));
  }, [selectedGrade, subject]);

  if (!curriculum) return null;

  const currentTerm = curriculum.terms.find(t => t.id === selectedTerm);

  return (
    <div className="min-h-screen pb-32 relative overflow-x-hidden">
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-sm flex items-center px-6 h-16">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-surface-container active:scale-95 transition-all mr-4">
          <span className="material-symbols-outlined text-primary">arrow_back</span>
        </button>
        <Logo size="sm" className="mr-6 hidden md:flex" />
        <h1 className="font-headline font-bold text-xl text-primary">{displayTitle}</h1>
      </nav>

      <main className="pt-24 px-6 max-w-7xl mx-auto">
        <header className="mb-12 space-y-8">
          <SubjectMotivation subject={subject} grade={selectedGrade} />

          {subject !== 'Alphabet' && (
            <div>
              <h2 className="text-3xl font-extrabold text-on-surface mb-4">1. Select Grade</h2>
              <div className="flex flex-wrap gap-3">
                {GRADES.filter(g => {
                  if (subject === 'Biology' || subject === 'Etymology') return g >= 8 && g <= 10;
                  return true;
                }).map(grade => (
                  <button
                    key={grade}
                    onClick={() => setSelectedGrade(grade)}
                    className={cn(
                      "px-6 py-3 rounded-xl font-headline font-bold text-lg transition-all shadow-sm",
                      selectedGrade === grade 
                        ? "bg-primary text-white scale-105" 
                        : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low"
                    )}
                  >
                    Grade {grade}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-3xl font-extrabold text-on-surface mb-4">
              {subject === 'Alphabet' ? '1. Select Term' : '2. Select Term'}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {curriculum.terms.map(term => (
                <button
                  key={term.id}
                  onClick={() => setSelectedTerm(term.id)}
                  className={cn(
                    "py-4 rounded-xl font-headline font-bold text-xl transition-all shadow-sm border-2 text-center",
                    selectedTerm === term.id 
                      ? "bg-secondary-container border-secondary text-on-secondary-container" 
                      : "bg-surface-container-lowest border-transparent text-on-surface-variant hover:bg-surface-container-low"
                  )}
                >
                  {term.name}
                </button>
              ))}
            </div>
          </div>
        </header>

        {(() => {
          const availableToday = isSubjectDrillAvailable(subject);
          return (
            <section 
              className={cn(
                "mt-12 mb-8 border-4 rounded-[3rem] p-10 text-white relative overflow-hidden group transition-all cursor-pointer",
                availableToday 
                  ? "bg-slate-900 border-primary/20 hover:scale-[1.01]" 
                  : "bg-slate-900/90 border-amber-500/30"
              )} 
              onClick={() => onStartDrills(subject)}
            >
              <div className={cn("absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] -z-0", availableToday ? "bg-primary/10" : "bg-amber-500/10")} />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 text-center md:text-left">
                  <div className={cn(
                    "inline-flex items-center gap-2 px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-full",
                    availableToday ? "bg-primary text-white" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  )}>
                    <span className="material-symbols-outlined text-[14px]">
                      {availableToday ? 'bolt' : 'lock_clock'}
                    </span>
                    {availableToday ? 'Subject Drills Active' : 'Drills Schedule Constraint'}
                  </div>
                  <h2 className="text-4xl font-black tracking-tight">Rapid Mastery Drills</h2>
                  <p className="text-white/70 font-medium max-w-md">
                    {availableToday 
                      ? `Practice ${subject} with a fast-paced timer. Earn bonus points and sharpen your skills!` 
                      : `Biology & Etymology drills run on Mon, Wed, Fri, Sat & Sun. (Locked on Tue & Thu). Click to view schedule or try another subject.`}
                  </p>
                </div>
                <button 
                  className={cn(
                    "px-10 py-5 rounded-2xl font-black text-lg group-hover:scale-105 transition-all flex items-center gap-3",
                    availableToday 
                      ? "bg-primary text-white shadow-[0_0_30px_rgba(var(--color-primary),0.5)]" 
                      : "bg-amber-500 text-slate-950 font-black shadow-lg"
                  )}
                >
                  {availableToday ? 'Start Subject Drills' : 'View Drill Schedule'}
                  <span className="material-symbols-outlined">
                    {availableToday ? 'rocket_launch' : 'calendar_month'}
                  </span>
                </button>
              </div>
            </section>
          );
        })()}

        <section className="space-y-6">
          <h2 className="text-3xl font-extrabold text-on-surface">3. Choose a Topic</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentTerm?.topics.map((topic, idx) => {
              const topicHistory = history.filter(h => h.topicId === topic.id);
              const bestScore = topicHistory.length > 0 ? Math.max(...topicHistory.map(h => h.score)) : null;
              const isCompleted = topicHistory.length > 0;

              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => onSelectTopic(topic)}
                  className={cn(
                    "bg-surface-container-lowest p-8 rounded-3xl shadow-sm cursor-pointer hover:scale-[1.02] transition-all border-4 relative overflow-hidden group",
                    isCompleted ? "border-secondary/20" : "border-transparent hover:border-primary/20"
                  )}
                >
                  <div className="absolute top-0 right-0 p-4 flex flex-col items-end gap-2">
                    <span className="material-symbols-outlined text-primary/10 text-6xl group-hover:scale-110 transition-transform">
                      {subjectInfo?.icon || 'menu_book'}
                    </span>
                    {isCompleted && (
                      <div className="bg-secondary text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                        <span className="material-symbols-outlined text-xs">verified</span>
                        Done
                      </div>
                    )}
                  </div>
                  
                  <div className="relative z-10">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center mb-6",
                      isCompleted ? "bg-secondary-container text-secondary" : "bg-primary-container text-primary"
                    )}>
                      <span className="font-headline font-black text-xl">{idx + 1}</span>
                    </div>
                    <h3 className="font-headline font-black text-2xl text-on-surface mb-3 leading-tight group-hover:text-primary transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-on-surface-variant font-medium text-sm line-clamp-2">
                      {topic.description}
                    </p>
                    
                    <div className="mt-8 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {bestScore !== null ? (
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-outline-variant uppercase tracking-widest">Best Score</span>
                            <span className="text-lg font-black text-secondary">{bestScore}%</span>
                          </div>
                        ) : (
                          <>
                            <div className="flex -space-x-2">
                              {[1, 2, 3].map(i => (
                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-surface-container-high" />
                              ))}
                            </div>
                            <span className="text-[10px] font-bold text-outline-variant uppercase tracking-widest">20 Steps</span>
                          </>
                        )}
                      </div>
                      <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
