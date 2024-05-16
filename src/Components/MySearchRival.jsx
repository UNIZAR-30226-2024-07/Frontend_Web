import { useState, useEffect } from 'react';
import "./MyLoading.css"
import { MyNav } from './MyNav';

const progressBarClasses = 'w-full bg-zinc-300 rounded-full h-4 dark:bg-zinc-700';
const progressFillClasses = 'bg-zinc-600 h-4 rounded-full';

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + 5; // Incremento fijo en lugar de usar la variable 'increment'
        return newProgress >= 95 ? 95 : newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-6/12 p-4 bg-white rounded-lg shadow-lg">
      <div className="font-semibold mb-2">Buscando Rival</div>
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

const MySearchRival = () => {
  return (
    <div>
      <MyNav></MyNav>
      <div className='loading'>
        <div className="flex items-center justify-center min-h-screen">
          <ProgressBar />
        </div>
      </div>
    </div>
  );
};

export default MySearchRival;
