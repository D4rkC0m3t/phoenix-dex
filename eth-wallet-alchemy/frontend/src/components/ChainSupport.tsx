import { motion } from 'framer-motion';

interface ChainSupportProps {
  className?: string;
}

const ChainSupport: React.FC<ChainSupportProps> = ({ className = '' }) => {
  // No longer using the chains and animation variants

  return (
    <div className={`${className} w-full max-w-full`}>
      <div className="text-center mb-4">
        <motion.h3
          className="text-heading mb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Phoenix Network Support
        </motion.h3>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side - Phoenix description */}
        <motion.div
          className="md:w-1/2 glass-card p-4 sm:p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4 text-sm leading-relaxed relative overflow-hidden">
            {/* Background glow effect */}
            <motion.div
              className="absolute -inset-10 bg-gradient-to-r from-[#FF5F00]/0 via-[#FF5F00]/10 to-[#FF5F00]/0 rounded-full blur-xl"
              animate={{
                x: ['-100%', '200%'],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Title with animated gradient */}
            <motion.h3
              className="text-xl sm:text-2xl font-bold mb-4 tracking-tight"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block relative">
                <span className="relative z-10 bg-gradient-to-r from-[#FF5F00] via-[#FFD166] to-[#FF5F00] bg-clip-text text-transparent">
                  Behold the rise of the Phoenix Network
                </span>
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#FF5F00] via-[#FFD166] to-[#FF5F00]"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </span>
            </motion.h3>

            {/* First paragraph with animated words */}
            <motion.p
              className="mb-4 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.span
                className="font-medium"
                animate={{
                  textShadow: [
                    "0 0 0px rgba(255, 95, 0, 0)",
                    "0 0 3px rgba(255, 95, 0, 0.5)",
                    "0 0 0px rgba(255, 95, 0, 0)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                A force reborn from the ashes
              </motion.span>
              , burning brighter than ever. Embodying the
              <motion.span
                className="mx-1 text-[#FF5F00] font-medium"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                fire of innovation
              </motion.span>
              and the spirit of decentralization, it soars with the strength of
              <motion.span
                className="mx-1 italic"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              >
                freedom, agility, and speed.
              </motion.span>
            </motion.p>

            {/* Second paragraph with animated highlight */}
            <motion.p
              className="mb-4 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Like a mythical phoenix bleeding flame and crypto, it channels raw energy into a
              <motion.span
                className="relative mx-1"
              >
                <motion.span
                  className="absolute -inset-1 rounded-md bg-[#FF5F00]/10"
                  animate={{ opacity: [0, 0.8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                />
                <span className="relative">thriving network</span>
              </motion.span>
              where digital assets ignite new possibilities. Each spark fuels
              <motion.span
                className="font-medium text-[#FF5F00] mx-1"
                animate={{
                  y: [0, -2, 0],
                  x: [0, 1, 0, -1, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                lightning-fast, secure transactions
              </motion.span>
              and empowers smart contracts and dApps to flourish.
            </motion.p>

            {/* Final statement with dramatic effect */}
            <motion.p
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              The Phoenix doesn't just symbolize rebirth—
              <motion.span
                className="font-bold text-[#FF5F00] mx-1"
                animate={{
                  textShadow: [
                    "0 0 0px rgba(255, 95, 0, 0)",
                    "0 0 5px rgba(255, 95, 0, 0.7)",
                    "0 0 0px rgba(255, 95, 0, 0)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                it is the future
              </motion.span>,
              illuminating the path to financial sovereignty and unchained innovation.
            </motion.p>

            {/* Animated particles */}
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-[#FF5F00]"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -20],
                    x: [0, Math.random() * 10 - 5],
                    opacity: [0, 0.8, 0],
                    scale: [0, 1, 0.5]
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.8,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right side - Phoenix image */}
        <motion.div
          className="md:w-1/2 glass-card p-4 sm:p-6 flex items-center justify-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <img
            src="/phoenix-network.jpeg"
            alt="Phoenix Network Blockchain"
            className="max-w-full rounded-lg shadow-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://placehold.co/600x400/FF5F00/FFFFFF?text=Phoenix+Network";
              target.onerror = null;
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default ChainSupport;
