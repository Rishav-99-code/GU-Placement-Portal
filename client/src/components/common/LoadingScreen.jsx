import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999]">
      <DotLottieReact
        src="https://lottie.host/25ff21c9-b290-4899-acd6-45c3f8c34a64/FOlJicnxUD.lottie"
        loop={false}
        autoplay
        className="w-96 h-96 max-w-full max-h-full"
      />
    </div>
  );
};

export default LoadingScreen;