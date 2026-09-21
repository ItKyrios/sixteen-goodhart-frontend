type HeroProps = {
  userName: string;
  text?: string;
};

const Hero = ({
  userName = '[NAME]',
  text = "Welcome to Sixteen Goodhart App. Hope you're having a productive day.",
}: HeroProps) => {
  return (
    <header className='text-center py-10 px-4 bg-gray-900 text-white transition-colors duration-300'>
      <h2 className='text-xl font-bold mb-4'>Hey, {userName} 👋</h2>
      <p className='text-sm text-gray-300 max-w-2xl mx-auto'>{text}</p>
    </header>
  );
};

export default Hero;
