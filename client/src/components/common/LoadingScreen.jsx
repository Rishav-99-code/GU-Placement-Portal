import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
      <DotLottieReact
        src="https://lottie.host/fea6a266-0dbd-4eda-b247-2ef5063c5773/UdqlMCLrz0.lottie"
        loop
        autoplay
        className="w-64 h-64"
      />
    </div>
  );
};

export default LoadingScreen;