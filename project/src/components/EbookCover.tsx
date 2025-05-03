import React from 'react';
import { Brain, Clock, Key } from 'lucide-react';
import { motion } from './motion';

const EbookCover: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 p-4">
      <motion.div 
        className="max-w-4xl w-full overflow-hidden rounded-xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Top Banner */}
        <div className="bg-amber-500 text-indigo-950 text-center py-2 px-4 relative overflow-hidden">
          <motion.div
            className="relative z-10 font-medium tracking-wider"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="inline-block mr-2">★</span>
            THE NERVOUS SYSTEM RESET BOOK THERAPISTS RECOMMEND
            <span className="inline-block ml-2">★</span>
          </motion.div>
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 opacity-50"
            animate={{ 
              x: ['0%', '100%', '0%'],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 15, 
              ease: "linear" 
            }}
          />
        </div>

        {/* Main Cover Content */}
        <div className="bg-gradient-to-b from-indigo-950 to-purple-900 text-white p-8 md:p-12 relative">
          {/* Neural Network Background Effect */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <NeuralNetworkEffect />
          </div>

          {/* Main Content */}
          <div className="relative z-10">
            {/* Top Section */}
            <motion.div 
              className="mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-amber-300 mb-2">
                10-MINUTE ROUTINES TO:
              </h1>
              <h2 className="text-xl md:text-2xl lg:text-3xl text-blue-300 font-light">
                Heal Anxiety • Boost Mood • Build Nervous System Strength
              </h2>
            </motion.div>

            {/* Middle Section - Main Statement */}
            <motion.div 
              className="my-12 md:my-16 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white text-center tracking-tight leading-tight">
                <span className="block">YOUR</span>
                <span className="block text-5xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-pink-500 to-amber-300 animate-gradient">ANXIETY</span>
                <span className="block">IS LYING TO YOU</span>
              </h1>

              <motion.div 
                className="absolute -right-4 md:right-0 top-0 md:-top-8 text-amber-400"
                animate={{ 
                  rotate: [0, -5, 0, 5, 0],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 5, 
                  ease: "easeInOut" 
                }}
              >
                <TimeLabel />
              </motion.div>
            </motion.div>

            {/* Visual Elements Row */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {/* Left: Nervous System */}
              <div className="flex flex-col items-center text-center">
                <div className="text-blue-400 mb-4">
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                      filter: [
                        'drop-shadow(0 0 5px rgba(96, 165, 250, 0.7))',
                        'drop-shadow(0 0 15px rgba(96, 165, 250, 0.9))',
                        'drop-shadow(0 0 5px rgba(96, 165, 250, 0.7))'
                      ]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: "easeInOut"
                    }}
                  >
                    <Brain size={80} strokeWidth={1.5} />
                  </motion.div>
                </div>
                <h3 className="text-xl font-semibold text-blue-300">Rewire Your Brain</h3>
                <p className="text-blue-100 mt-2 opacity-90">Science-backed techniques</p>
              </div>

              {/* Center: Key */}
              <div className="flex flex-col items-center text-center">
                <div className="text-amber-400 mb-4">
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      filter: [
                        'drop-shadow(0 0 5px rgba(251, 191, 36, 0.7))',
                        'drop-shadow(0 0 15px rgba(251, 191, 36, 0.9))',
                        'drop-shadow(0 0 5px rgba(251, 191, 36, 0.7))'
                      ]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: "easeInOut"
                    }}
                  >
                    <Key size={80} strokeWidth={1.5} />
                  </motion.div>
                </div>
                <h3 className="text-xl font-semibold text-amber-300">Unlock Calm</h3>
                <p className="text-amber-100 mt-2 opacity-90">Take back control</p>
              </div>

              {/* Right: 10 Minutes */}
              <div className="flex flex-col items-center text-center">
                <div className="text-pink-400 mb-4">
                  <motion.div
                    animate={{
                      rotate: [0, 10, 0, -10, 0],
                      filter: [
                        'drop-shadow(0 0 5px rgba(236, 72, 153, 0.7))',
                        'drop-shadow(0 0 15px rgba(236, 72, 153, 0.9))',
                        'drop-shadow(0 0 5px rgba(236, 72, 153, 0.7))'
                      ]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 4,
                      ease: "easeInOut"
                    }}
                  >
                    <Clock size={80} strokeWidth={1.5} />
                  </motion.div>
                </div>
                <h3 className="text-xl font-semibold text-pink-300">Just 10 Minutes</h3>
                <p className="text-pink-100 mt-2 opacity-90">Quick, effective relief</p>
              </div>
            </motion.div>

            {/* Bottom Section - Results Proof */}
            <motion.div 
              className="mt-8 bg-indigo-900/50 p-6 rounded-lg border border-indigo-700 backdrop-blur-sm"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="text-center mb-4">
                <span className="inline-block px-4 py-1 bg-gradient-to-r from-amber-500 to-pink-600 rounded-full text-sm text-white font-semibold">
                  37 PROVEN TECHNIQUES
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl text-center text-blue-100 font-semibold mb-4">
                Science-Backed Lifelines For:
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-blue-900/30 rounded-lg">
                  <span className="text-amber-300 text-lg">✓</span> Panic Attacks
                </div>
                <div className="p-3 bg-blue-900/30 rounded-lg">
                  <span className="text-amber-300 text-lg">✓</span> 3 AM Anxiety Spirals
                </div>
                <div className="p-3 bg-blue-900/30 rounded-lg">
                  <span className="text-amber-300 text-lg">✓</span> Overwhelming Dread
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer Banner */}
        <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-700 text-white text-center py-3 px-4 relative overflow-hidden">
          <div className="relative z-10 font-medium italic">
            "Works When Meditation Fails"
          </div>
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/30 to-pink-500/0"
            animate={{ 
              x: ['0%', '100%', '0%'],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 8, 
              ease: "linear" 
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default EbookCover;

const TimeLabel: React.FC = () => {
  return (
    <div className="relative">
      <div className="bg-amber-400 text-purple-900 font-bold px-4 py-2 rounded-full transform -rotate-12 shadow-lg">
        <span className="text-lg inline-block">IN JUST</span>
        <span className="text-3xl block font-extrabold tracking-tighter">10 MIN</span>
      </div>
      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-300 rounded-full animate-ping" />
    </div>
  );
};

const NeuralNetworkEffect: React.FC = () => {
  return (
    <div className="w-full h-full relative">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-blue-400 rounded-full"
          style={{
            width: Math.random() * 4 + 1 + 'px',
            height: Math.random() * 4 + 1 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            repeat: Infinity,
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 2,
          }}
        />
      ))}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i + 'line'}
          className="absolute bg-gradient-to-r from-blue-400/0 via-blue-400/30 to-blue-400/0 h-[1px]"
          style={{
            width: Math.random() * 30 + 10 + '%',
            left: Math.random() * 70 + '%',
            top: Math.random() * 100 + '%',
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            width: [`${Math.random() * 30 + 10}%`, `${Math.random() * 30 + 20}%`, `${Math.random() * 30 + 10}%`],
          }}
          transition={{
            repeat: Infinity,
            duration: Math.random() * 5 + 3,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};