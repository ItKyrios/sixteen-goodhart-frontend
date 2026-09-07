import { useEffect, useState } from 'react';

type MessageProps = {
  message: string;
};

const Message = ({ message }: MessageProps) => {
  const [visible, setVisible] = useState(true);
  const [hide, setHide] = useState(false);
  const [slide, setSlide] = useState(false);

  useEffect(() => {
    // Start slide-up immediately
    const slideTimer = setTimeout(() => setSlide(true), 50);
    // Start fade-out after 2.5 seconds
    const fadeTimer = setTimeout(() => setHide(true), 2500);
    // Remove component after fade-out completes
    const removeTimer = setTimeout(() => setVisible(false), 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed w-max text-center bottom-28 left-1/2 -translate-x-1/2 px-6 py-2 bg-green-200 border border-green-800 text-green-800 rounded-full shadow-lg z-50 transition-all duration-500 ease-out ${slide ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} ${hide ? 'opacity-0' : ''}`}
    >
      {message}
    </div>
  );
};

export default Message;
