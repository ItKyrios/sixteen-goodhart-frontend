import React from 'react';

type TileProps = {
  title: string;
  value?: string | number;
  color?: string; //hex or tailwind color name
  icon?: React.ReactNode; // optional icon to display in the tile
};

const Tile = ({ title, value, color, icon }: TileProps) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-xs p-2 text-white cursor-pointer flex flex-col justify-between items-center shadow-md`}
      style={{ backgroundColor: color || '#000' }}
    >
      {/* Hover overlay */}
      <div className='absolute inset-0 origin-left scale-x-0 bg-white/20 transition-transform duration-500 ease-out group-hover:scale-x-100' />

      {/* Centered Icon */}
      <div className='flex-1 flex items-center justify-center w-full mt-6'>
        <div className='text-5xl mb-2 opacity-90'>{icon}</div>
      </div>

      {/* Bottom Label */}
      <div className='w-full text-left'>
        <span className='text-sm opacity-80'>{title}</span>
        {value && (
          <div className='text-xs font-semibold leading-tight'>{value}</div>
        )}
      </div>
    </div>
  );
};

export default Tile;
