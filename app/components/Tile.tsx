import React, { useEffect, useState } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

type TileProps = {
  title: string;
  value?: string | number;
  color?: string; //hex or tailwind color name
  icon?: React.ReactNode; // optional icon to display in the tile
  urgency?: string; // optional that translates to border color to determine urgency
};

const Tile = ({ title, value, color, icon, urgency }: TileProps) => {
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    setFlip(true);
    const timer = setTimeout(() => setFlip(false), 600);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className='prespective-1000'>
      <div
        className={`group relative rounded-r-xs p-2 text-white cursor-pointer flex flex-col justify-between items-center shadow-md active:scale-95 transition-transform ${flip ? 'tile-flip' : ''}`}
        style={{ backgroundColor: color || '#000' }}
      >
        {/* Hover overlay */}
        <div
          className={`absolute inset-0 opacity-0 bg-white/20 group-hover:opacity-100 transition-all duration-500 ease-out group-hover:animate-pulse `}
        />

        {/* Centered Icon */}
        <div className='flex-1 flex items-center justify-center w-full mt-6'>
          <div className='text-5xl mb-2 opacity-90'>{icon}</div>
        </div>

        {/* Bottom Label */}
        <div className='w-full text-left'>
          <span className='text-sm opacity-80'>{title}</span>
          {value && (
            <div className='flex justify-between items-center'>
              <div className={`text-xs font-semibold leading-tight `}>
                {value}
              </div>
              {urgency === 'high' && (
                <FaExclamationTriangle color='yellow' className='inline' />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tile;
