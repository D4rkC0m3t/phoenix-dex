import { motion } from 'framer-motion';

const HardwareDevice: React.FC = () => {
  return (
    <motion.div
      className="relative w-full max-w-[300px] mx-auto my-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {/* Main device body */}
      <motion.div
        className="w-full aspect-[4/3] rounded-xl bg-black shadow-2xl"
        style={{
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* RGB Light strip at bottom */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1.5 rounded-b-xl overflow-hidden"
          style={{
            background: 'linear-gradient(90deg, #FF56F6, #42A6E3, #FFD166)',
            backgroundSize: '200% 100%'
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'linear'
          }}
        />

        {/* RGB Light strip at right side */}
        <motion.div
          className="absolute top-0 bottom-0 right-0 w-1.5 rounded-r-xl overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #FF56F6, #42A6E3, #FFD166)',
            backgroundSize: '100% 200%'
          }}
          animate={{
            backgroundPosition: ['0% 0%', '0% 100%', '0% 0%'],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'linear',
            delay: 0.5
          }}
        />

        {/* Screen reflection */}
        <motion.div
          className="absolute top-[10%] left-[10%] right-[10%] bottom-[30%] rounded-md opacity-20"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 50%)'
          }}
        />

        {/* Logo on device */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/20 text-xl font-bold">
          PHOENIX
        </div>
      </motion.div>

      {/* Shadow beneath device */}
      <div
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-[80%] h-4 rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 70%)'
        }}
      />

      {/* Floating particles */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-2 h-2 rounded-full bg-[#FF56F6]/50"
        animate={{
          y: [0, -15, 0],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      <motion.div
        className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 rounded-full bg-[#42A6E3]/50"
        animate={{
          y: [0, -10, 0],
          opacity: [0.3, 0.8, 0.3]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5
        }}
      />

      <motion.div
        className="absolute top-1/3 left-1/5 w-1 h-1 rounded-full bg-[#FFD166]/50"
        animate={{
          y: [0, -8, 0],
          opacity: [0.2, 0.6, 0.2]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1
        }}
      />
    </motion.div>
  );
};

export default HardwareDevice;
