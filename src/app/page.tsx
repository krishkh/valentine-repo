"use client";
import React, { useState, useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { Heart, Star, Music, Coffee, Camera, X } from "lucide-react";

const DateProposalApp = () => {
  const [yesPressed, setYesPressed] = useState(false);
  const [noAttempts, setNoAttempts] = useState(0);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [collectedHearts, setCollectedHearts] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const noButtonControls = useAnimation();
  const [dateIdeas] = useState([
    { icon: Coffee, text: "Coffee & Pastries ☕" },
    { icon: Camera, text: "Photo Walk Adventure 📸" },
    { icon: Music, text: "Live Music Night 🎵" },
    { icon: Star, text: "Stargazing Picnic ✨" },
  ]);
  const [showGif, setShowGif] = useState(false);

  const messages = [
    "Will you go on a date with me? 🌹",
    "I'd love to get to know you better... ✨",
    "Come on, it'll be fun! 🌟",
    "I promise it'll be amazing! 🎵",
    "Let's create some memories... 💫",
    "Just give me a chance... 🎯",
    "Catch these hearts first! 💖",
  ];

  const handleMouseEnter = async () => {
    setNoAttempts((prev) => {
      if (prev === 4) {
        setShowMiniGame(true);
      }
      return prev + 1;
    });

    // More unpredictable movement
    const angle = Math.random() * Math.PI * 2;
    const distance = 150 + Math.random() * 150;
    const newX = Math.cos(angle) * distance;
    const newY = Math.sin(angle) * distance;

    await noButtonControls.start({
      x: newX,
      y: newY,
      rotate: Math.random() * 360,
      transition: {
        type: "spring",
        duration: 0.4,
        bounce: 0.7,
      },
    });
  };

  const handleHeartCollect = () => {
    setCollectedHearts((prev) => Math.min(prev + 1, 5));
  };

  const handleYesClick = () => {
    setYesPressed(true);
    setTimeout(() => setShowGif(true), 500);
  };

  const phases = [
    { scale: 1, rotate: 0 },
    { scale: 1.1, rotate: 5 },
    { scale: 0.9, rotate: -5 },
    { scale: 1.2, rotate: 10 },
    { scale: 0.8, rotate: -10 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhase((prev) => (prev + 1) % phases.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen w-full bg-gradient-to-b from-rose-100 via-pink-100 to-rose-200 overflow-hidden flex items-center justify-center">
      {/* Floating Elements Background */}
      <AnimatePresence>
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            initial={{ y: "100vh", x: Math.random() * window.innerWidth }}
            animate={{
              y: "-20vh",
              x: Math.random() * window.innerWidth,
              rotate: 360,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 2,
            }}
          >
            {Math.random() > 0.7 ? "🌹" : Math.random() > 0.5 ? "❤️" : "✨"}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main Card */}
      <motion.div
        className="relative bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-8 m-4 max-w-md w-full border-2 border-rose-200"
        initial={{ scale: 0 }}
        animate={{
          scale: phases[currentPhase].scale,
          rotate: phases[currentPhase].rotate,
        }}
        transition={{ type: "spring", bounce: 0.5 }}
      >
        {!yesPressed ? (
          <div className="text-center space-y-8">
            <motion.div
              className="absolute top-2 right-2 text-red-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              Hearts: {collectedHearts}/5
            </motion.div>

            <motion.h1
              className="text-4xl font-bold text-rose-600 mb-6"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {messages[Math.min(noAttempts, messages.length - 1)]}
            </motion.h1>

            {showMiniGame && (
              <motion.div
                className="relative h-40 bg-pink-50 rounded-lg mb-4 overflow-hidden"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 160 }}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={`heart-${i}`}
                    className="absolute cursor-pointer"
                    initial={{
                      x: Math.random() * 300,
                      y: -20,
                    }}
                    animate={{
                      y: 160,
                      x: Math.random() * 300,
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                    onClick={handleHeartCollect}
                  >
                    <Heart className="text-red-500 w-8 h-8" />
                  </motion.div>
                ))}
              </motion.div>
            )}

            <div className="flex flex-col items-center gap-4">
              <motion.button
                className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-full text-xl font-bold shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleYesClick}
                animate={{
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 4px 6px rgba(0,0,0,0.1)",
                    "0 8px 12px rgba(0,0,0,0.2)",
                    "0 4px 6px rgba(0,0,0,0.1)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Yes! 😊
              </motion.button>

              <motion.button
                className="bg-gray-500 text-white px-8 py-3 rounded-full text-xl font-bold"
                animate={noButtonControls}
                onMouseEnter={handleMouseEnter}
                whileHover={{ cursor: "not-allowed" }}
                style={{ position: "relative" }}
              >
                <span className="flex items-center gap-2">
                  No <X className="w-4 h-4" />
                </span>
              </motion.button>
            </div>
          </div>
        ) : (
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {showGif && (
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowGif(false)}
              >
                <motion.div
                  className="relative bg-white rounded-lg p-4 max-w-lg w-full mx-4"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                >
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowGif(false)}
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <div
                    className="tenor-gif-embed"
                    data-postid="5353339"
                    data-share-method="host"
                    data-aspect-ratio="1.665"
                    data-width="100%"
                  >
                    <a href="https://tenor.com/view/vomit-exorcist-gross-gif-5353339">
                      Vomit Exorcist GIF
                    </a>
                    from{" "}
                    <a href="https://tenor.com/search/vomit-gifs">Vomit GIFs</a>
                  </div>{" "}
                  <script
                    type="text/javascript"
                    async
                    src="https://tenor.com/embed.js"
                  ></script>
                </motion.div>
              </motion.div>
            )}
            <h1 className="text-4xl font-bold text-rose-600 mb-4">
              Yay! This will be amazing! 🌹
            </h1>
            <p className="text-xl text-rose-500">
              Let&apos;s make it unforgettable...
            </p>

            <motion.div className="grid grid-cols-2 gap-4 mt-6">
              {dateIdeas.map((idea, index) => (
                <motion.div
                  key={index}
                  className="bg-pink-50 p-4 rounded-lg flex flex-col items-center gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.05, backgroundColor: "#FEE2E2" }}
                >
                  <idea.icon className="w-8 h-8 text-red-500" />
                  <p className="text-sm font-medium">{idea.text}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="text-6xl mt-6"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
            >
              🥰
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default DateProposalApp;
