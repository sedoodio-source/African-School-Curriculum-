import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Topic } from '../types';
import { cn } from '../lib/utils';

export default function ActivityView({ topic, resetKey }: { topic: Topic, resetKey?: number }) {
  const [step, setStep] = useState<'intro' | 'project' | 'review'>('intro');
  const [projectText, setProjectText] = useState('');

  React.useEffect(() => {
    setStep('intro');
    setProjectText('');
  }, [resetKey]);

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-surface-container space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-headline font-bold text-on-surface">Creative Project</h3>
          <p className="text-on-surface-variant text-sm">Apply your knowledge to a real-world task!</p>
        </div>
        <span className="bg-secondary-container text-secondary px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">Active Learning</span>
      </div>

      {step === 'intro' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="aspect-video bg-surface-container-low rounded-2xl flex flex-col items-center justify-center text-center p-12 space-y-4 border-4 border-secondary/10">
            <span className="material-symbols-outlined text-7xl text-secondary animate-bounce">explore</span>
            <div>
              <h4 className="text-xl font-headline font-bold text-on-surface">Project Mission</h4>
              <p className="text-on-surface-variant text-sm mt-2 max-w-md mx-auto">
                Your mission is to create a summary poster or a short presentation about <strong>{topic.title}</strong>. 
                Explain the most important thing you learned today!
              </p>
            </div>
            <button 
              onClick={() => setStep('project')}
              className="bg-secondary text-white px-10 py-3 rounded-xl font-headline font-bold shadow-lg active:scale-95 transition-all"
            >
              Start Project
            </button>
          </div>
        </motion.div>
      )}

      {step === 'project' && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label className="font-bold text-on-surface">Your Project Draft</label>
            <textarea 
              value={projectText}
              onChange={(e) => setProjectText(e.target.value)}
              placeholder="Start typing your project summary here..."
              className="w-full h-64 bg-surface-container-low border-2 border-surface-container rounded-2xl p-6 text-on-surface font-medium focus:ring-2 focus:ring-secondary transition-all"
            />
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setStep('intro')}
              className="flex-1 bg-surface-container-high text-on-surface py-3 rounded-xl font-bold"
            >
              Back
            </button>
            <button 
              disabled={!projectText.trim()}
              onClick={() => setStep('review')}
              className="flex-1 bg-secondary text-white py-3 rounded-xl font-bold shadow-lg disabled:opacity-50"
            >
              Submit for Review
            </button>
          </div>
        </motion.div>
      )}

      {step === 'review' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 p-12 bg-secondary/5 rounded-3xl border-2 border-dashed border-secondary/30"
        >
          <span className="material-symbols-outlined text-6xl text-secondary">verified</span>
          <div>
            <h4 className="text-2xl font-headline font-bold text-on-surface">Project Submitted!</h4>
            <p className="text-on-surface-variant mt-2">
              Great job on your {topic.title} project! Your teacher will review your work soon.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl text-left border border-surface-container italic text-on-surface-variant">
            "{projectText}"
          </div>
          <button 
            onClick={() => { setStep('intro'); setProjectText(''); }}
            className="bg-secondary text-white px-8 py-3 rounded-xl font-bold"
          >
            Start New Project
          </button>
        </motion.div>
      )}
    </div>
  );
}
