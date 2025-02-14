"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import {
  Heart,
  Star,
  Music,
  Coffee,
  Camera,
  X,
  Volume2,
  VolumeX,
} from "lucide-react";
import Image from "next/image";

// Move phases outside component
const PHASES = [
  { scale: 1, rotate: 0 },
  { scale: 1.1, rotate: 5 },
  { scale: 0.9, rotate: -5 },
  { scale: 1.2, rotate: 10 },
  { scale: 0.8, rotate: -10 },
];

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
  const [windowWidth, setWindowWidth] = useState(0);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [showMusicPrompt, setShowMusicPrompt] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const messages = [
    "hi do u love me? 🌹",
    "plz love me! ✨",
    "can u not love me? </3333333",
    "i ll let u lick my feet! 🍞",
    "I'll even wear my fancy gaming socks... 🧦",
    "C'mon, I've been practicing my jaw! 🎯",
    "CATCH MY HEARTS YOU LOSER 💖",
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
    // Show GIF immediately for 10 seconds
    setShowGif(true);
    setTimeout(() => {
      setShowGif(false);
      // Then start the countdown for coordinates
      setShowCoordinates(true);
    }, 10000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhase((prev) => (prev + 1) % PHASES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []); // Now this is fine because PHASES is constant

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    audioRef.current = new Audio("/1-01. Doki Doki Literature Club!.mp3");
    audioRef.current.loop = true;
  }, []);

  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsMusicPlaying(true);
      setShowMusicPrompt(false);
    }
  };

  // Only render falling elements on client side
  const renderFallingElements = () => {
    if (!isClient) return null;

    return Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={`falling-${i}`}
        className="fixed pointer-events-none"
        initial={{
          x: `${Math.random() * 100}%`,
          y: -100,
          rotate: 0,
        }}
        animate={{
          y: "120vh",
          rotate: 360,
        }}
        transition={{
          duration: 5 + Math.random() * 5,
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * 5,
        }}
      >
        {i % 3 === 0 ? (
          <Image
            src="/minecraftDirtBlock.png"
            alt="Dirt Block"
            width={40}
            height={40}
            className="minecraft-float"
          />
        ) : i % 3 === 1 ? (
          <div className="text-4xl">❤️</div>
        ) : (
          <div className="text-4xl">⭐</div>
        )}
      </motion.div>
    ));
  };

  const CoordinatesReveal = () => {
    const [showCoords, setShowCoords] = useState(false);
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
      const timer = setTimeout(() => {
        if (countdown > 0) {
          setCountdown(countdown - 1);
        } else {
          setShowCoords(true);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }, [countdown]);

    return (
      <div className="text-center">
        {!showCoords ? (
          <motion.div
            className="text-6xl font-bold text-yellow-500"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            {countdown}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <div className="text-3xl text-[#4ade80]">X: 411</div>
            <div className="text-3xl text-[#4ade80]">Z: 2023</div>
            <div className="text-2xl text-red-500 animate-pulse">GO NOW!!!</div>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="relative h-screen w-full bg-gradient-to-b from-rose-100 via-pink-100 to-rose-200 overflow-hidden flex items-center justify-center">
      {/* Music prompt popup */}
      <AnimatePresence>
        {showMusicPrompt && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-8 rounded-xl text-center space-y-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <h2 className="text-2xl font-bold text-rose-600">
                Enable Music?
              </h2>
              <p className="text-gray-600">
                This experience is better with music!
              </p>
              <button
                onClick={startMusic}
                className="bg-rose-500 text-white px-6 py-2 rounded-full hover:bg-rose-600 transition-colors"
              >
                Turn On Music
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Music toggle button */}
      <motion.button
        className="fixed top-4 right-4 z-50 bg-white/80 p-3 rounded-full shadow-lg hover:bg-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (audioRef.current) {
            if (isMusicPlaying) {
              audioRef.current.pause();
            } else {
              audioRef.current.play();
            }
            setIsMusicPlaying(!isMusicPlaying);
          }
        }}
      >
        {isMusicPlaying ? (
          <Volume2 className="w-6 h-6 text-rose-600" />
        ) : (
          <VolumeX className="w-6 h-6 text-rose-600" />
        )}
      </motion.button>

      {/* Add this near the top of the return statement, after the music toggle button */}
      <AnimatePresence>
        {yesPressed && !showGif && !showCoordinates && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CoordinatesReveal />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Falling elements */}
      {renderFallingElements()}

      {/* Update the Minecraft coordinates overlay */}
      <AnimatePresence>
        {showCoordinates && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={`block-${i}`}
                  className="absolute"
                  initial={{
                    x: Math.random() * 100 + "%",
                    y: -100,
                    rotate: 0,
                  }}
                  animate={{
                    y: "120vh",
                    rotate: 360,
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    ease: "linear",
                    delay: Math.random() * 2,
                  }}
                >
                  <Image
                    src="/minecraftDirtBlock.png"
                    alt="Dirt Block"
                    width={30}
                    height={30}
                  />
                </motion.div>
              ))}
            </div>
            <motion.div
              className="text-center space-y-6 relative"
              initial={{ scale: 0 }}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <motion.div
                className="absolute -inset-4 border-4 border-green-500"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              />
              <h1 className="text-7xl font-minecraft text-green-500 mb-4 pixelated">
                GO TO MINECRAFT
              </h1>
              <div className="text-5xl font-minecraft text-yellow-500 pixelated">
                X: 411
              </div>
              <div className="text-5xl font-minecraft text-yellow-500 pixelated">
                Z: 2023
              </div>
              <motion.div
                className="text-3xl font-minecraft text-red-500 mt-8"
                animate={{
                  scale: [1, 1.2, 1],
                  color: ["#ef4444", "#dc2626", "#ef4444"],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                }}
              >
                GO NOW!!!
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Elements Background */}
      <AnimatePresence>
        {Array.from({ length: 20 }).map((_, i) => {
          // Deterministic emoji selection based on index
          const emoji = i % 3 === 0 ? "🌹" : i % 3 === 1 ? "❤️" : "✨";
          // Deterministic x position based on index
          const xPos = (i / 20) * windowWidth;

          return (
            <motion.div
              key={i}
              className="absolute pointer-events-none"
              initial={{ y: "100vh", x: xPos }}
              animate={{
                y: "-20vh",
                x: xPos,
                rotate: 360,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 5 + (i % 3) * 2, // Deterministic duration
                repeat: Infinity,
                ease: "linear",
                delay: (i % 5) * 0.4, // Deterministic delay
              }}
            >
              {emoji}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Main Card */}
      <motion.div
        className="relative bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-8 m-4 max-w-md w-full border-2 border-rose-200"
        initial={{ scale: 0 }}
        animate={{
          scale: PHASES[currentPhase].scale,
          rotate: PHASES[currentPhase].rotate,
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
                  <div className="text-7xl">WAIT PATIENTLY!!!</div>
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

      {/* Lover image */}
      <AnimatePresence>
        {showCoordinates && (
          <motion.div
            className="absolute bottom-0 left-0 z-10"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ delay: 0.5 }}
          >
            <Image
              src="/lover.png"
              alt="Minecraft Love"
              width={300}
              height={300}
              className="pointer-events-none"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating blocks animation */}
      <AnimatePresence>
        {Array.from({ length: 30 }).map((_, i) => {
          const isBlock = i % 2 === 0;
          const emoji = i % 3 === 0 ? "🌹" : i % 3 === 1 ? "❤️" : "✨";
          const xPos = (i / 30) * windowWidth;

          return (
            <motion.div
              key={i}
              className="absolute pointer-events-none"
              initial={{ y: "100vh", x: xPos }}
              animate={{
                y: "-20vh",
                x: xPos,
                rotate: isBlock ? 360 : 0,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 5 + (i % 3) * 2,
                repeat: Infinity,
                ease: "linear",
                delay: (i % 5) * 0.4,
              }}
            >
              {isBlock ? (
                <Image
                  src="/minecraftDiamondBlock.png"
                  alt="Diamond Block"
                  width={40}
                  height={40}
                  className="pointer-events-none"
                />
              ) : (
                <span className="text-2xl">{emoji}</span>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Steve popups */}
      <AnimatePresence>
        {showCoordinates && (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={`steve-${i}`}
                className="fixed z-50"
                initial={{
                  opacity: 0,
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                  repeatDelay: 1,
                }}
              >
                <Image
                  src="/steve.png"
                  alt="Minecraft Steve"
                  width={100}
                  height={100}
                  className="pointer-events-none"
                />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DateProposalApp;
