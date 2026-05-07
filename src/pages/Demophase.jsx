import { motion } from 'framer-motion';

function Demophase() {
  return (
    <div
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-[#05070B]
        px-6
      "
    >

      {/* Ambient Background */}
      <div className="pointer-events-none absolute inset-0">
        
        {/* Main Glow */}
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3B82F6]/10 blur-[140px]" />

        {/* Secondary Glow */}
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#7C3AED]/10 blur-[120px]" />
      </div>

      {/* Content */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.5
        }}
        className="
          relative
          flex
          max-w-xl
          flex-col
          items-center
          text-center
        "
      >

        {/* Logo */}
        <motion.img
          initial={{
            opacity: 0,
            scale: 0.9
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          transition={{
            duration: 0.5,
            delay: 0.1
          }}
          src="/src/assets/images/logo.png"
          alt="Gapian Logo"
          className="
            h-24
            w-auto
            object-contain
            select-none
          "
        />

        

        {/* Heading */}
        <motion.h1
          initial={{
            opacity: 0,
            y: 12
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.45,
            delay: 0.25
          }}
          className="
            mt-8
            text-4xl
            font-semibold
            leading-[1]
            tracking-[-0.05em]
            text-[#F8FAFC]
            sm:text-5xl
          "
        >
          GAPIAN AI is currently
          <span className="block mt-2 text-[#A5C4FF]">
            under development.
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{
            opacity: 0,
            y: 12
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.45,
            delay: 0.34
          }}
          className="
            mt-7
            max-w-md
            text-[15px]
            leading-8
            text-[#94A3B8]
          "
        >
          We are building a premium AI-powered creator
          intelligence platform designed to help digital
          creators discover modern product opportunities,
          trend-aware concepts, and scalable digital ideas.
        </motion.p>

        {/* Footer */}
        <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          transition={{
            duration: 0.5,
            delay: 0.45
          }}
          className="
            mt-10
            text-sm
            text-[#64748B]
          "
        >
          Early access experience coming soon.
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Demophase;