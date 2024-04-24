import  { useState, useEffect } from 'react';
import "./MyLoading.css"

const progressBarClasses = 'w-full bg-zinc-300 rounded-full h-4 dark:bg-zinc-700';
const progressFillClasses = 'bg-zinc-600 h-4 rounded-full';

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + 5;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-6/12 p-4 bg-white rounded-lg shadow-lg">
      <div className="font-semibold mb-2">LOADING...</div>
      <div className={progressBarClasses} id="progressBar">
        <div
          className={progressFillClasses}
          style={{ width: `${progress}%` }}
          id="progressFill"
        ></div>
      </div>
      <div className="text-right mt-1" id="progressText">{`${progress}%`}</div>
    </div>
  );
};

const MyLoading = () => {
  return (
    <div className='loading'>
        <div className="flex items-center justify-center min-h-screen">
        <ProgressBar />
        </div>
    </div>
  );
};

export default MyLoading;
