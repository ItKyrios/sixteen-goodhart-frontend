import { Link } from 'react-router';
import { FaHouseUser } from 'react-icons/fa';

const Header = () => {
  return (
    <header className='bg-gray-800 border-b border-gray-700 shadow-md sticky top-0 z-50'>
      <div className='max-w-6xl mx-auto px-6 py-4 flex justify-between items-center'>
        <Link
          to='/'
          className='flex items-center gap-2 text-lg font-bold text-blue-300'
        >
          <FaHouseUser className='text-blue-400 text-xl' />
          <span>Sixteen Goodhart</span>
        </Link>
        <div className='flex items-center gap-6'>
          <div className='space-x-4 text-sm text-gray-300'>
            <span>{new Date().toDateString()}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
