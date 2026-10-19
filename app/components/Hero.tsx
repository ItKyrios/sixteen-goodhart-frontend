import { useEffect, useRef, useState } from 'react';
import { MdExpandCircleDown } from 'react-icons/md';

type HeroProps = {
  userName: string;
  text?: string;
  collapsed: boolean;
  onCollapse: () => void;
  onExpand: () => void;
};

const Hero = ({
  userName = '[NAME]',
  text = "Welcome to Sixteen Goodhart App. Hope you're having a productive day.",
  collapsed,
  onCollapse,
  onExpand,
}: HeroProps) => {
  const [dragAmount, setDragAmount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging && collapsed) {
      setDragAmount(0);
    }
  }, [isDragging, collapsed]);

  const dragRef = useRef(0);

  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);

    const startY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const onMove = (ev: any) => {
      const currentY = 'touches' in ev ? ev.touches[0].clientY : ev.clientY;
      const diff = startY - currentY;

      if (diff > 0) {
        const amount = Math.min(diff, 120);
        dragRef.current = amount;
        setDragAmount(amount);
      }
    };

    const onEnd = () => {
      setIsDragging(false);

      if (dragRef.current > 5) {
        onCollapse();
      }

      dragRef.current = 0;
      setDragAmount(0);

      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchend', onEnd);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (collapsed) {
    return (
      <div
        className='bg-gray-900 flex justify-between text-xs text-white rounded-b-lg mb-4 px-4 py-3 cursor-pointer transition-all duration-300 ease-out translate-y-[-4px] opacity-90'
        onClick={onExpand}
      >
        <span className='text-sm opacity-80'>
          {getGreeting()},{' '}
          {userName.slice(0, 1).toUpperCase() + userName.slice(1).toLowerCase()}
          !
        </span>
        <MdExpandCircleDown className='inline' size={20} />
      </div>
    );
  }

  return (
    <header
      className={`relative text-center px-4 bg-gray-900 text-white transition-all duration-200 ease-out ${isDragging ? 'duration-0' : ''} `}
      style={{ transform: `translateY(-${dragAmount}px)`, userSelect: 'none' }}
    >
      <div className='py-8'>
        <h2 className='text-xl font-bold mb-4'>
          Hey,{' '}
          {userName.slice(0, 1).toUpperCase() + userName.slice(1).toLowerCase()}{' '}
          👋
        </h2>
        <p className='text-sm text-gray-300 max-w-2xl mx-auto'>{text}</p>
      </div>
      {/* Drag handle */}
      <div
        className='w-full h-10 flex justify-center items-center cursor-grab active:cursor-grabbing'
        onMouseDown={onDragStart}
        onTouchStart={onDragStart}
      >
        <div
          className={`
      w-14 h-2 rounded-full transition-all
      ${isDragging ? 'bg-gray-300 scale-110' : 'bg-gray-600'}
    `}
        ></div>
      </div>
    </header>
  );
};

export default Hero;
