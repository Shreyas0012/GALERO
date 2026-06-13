import React from 'react';
import { useLottie } from 'lottie-react';
import animationData from '../../assets/9fbeb5fe-1178-11ee-be3f-8ff4cb4e23c2.json';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = ({ isLoading }) => {
  const options = {
    animationData: animationData,
    loop: true
  };
  const { View } = useLottie(options);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#030303] flex items-center justify-center"
        >
          <div className="w-48 h-48 sm:w-64 sm:h-64 opacity-80 mix-blend-screen">
            {View}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
