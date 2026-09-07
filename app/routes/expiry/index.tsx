import { Link, useLocation } from 'react-router';
import Message from '~/components/Message';
import useExpiry from '~/context/ExpiryContext';

const ExpiryPage = () => {
  const { items } = useExpiry();
  const location = useLocation();
  const message = location.state?.message;

  const sortedExpiry = items.sort(
    (a, b) =>
      new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime(),
  );

  return (
    <div className='p-4 text-white'>
      <div className='grid grid-cols-2'>
        <h1 className='text-3xl font-bold text-white mb-2'>Expiry</h1>
        <Link to='/expiry/edit/new'>
          <button className='bg-blue-600 p-2 mb-2 rounded-xs w-full hover:bg-blue-700 active:scale-95 transition-transform cursor-pointer'>
            Add New Item
          </button>
        </Link>
      </div>

      {message && <Message message={message} />}

      <div className='flex flex-col gap-3'>
        {sortedExpiry.map((w) => (
          <Link key={w.id} to={`/expiry/edit/${w.id}`}>
            <div className='grid grid-cols-2 justify-between text-sm bg-gray-900 p-4 rounded-xs shadow-md hover:bg-gray-800 active:bg-gray-800'>
              <div>
                <div className='text-lg font-medium'>{w.name}</div>
                <div>
                  Model:{' '}
                  <span className='text-xs text-gray-300 block'>{w.model}</span>
                </div>
                <div>Amount: ${w.amount.toFixed(2)}</div>
                <div>
                  Purchase Date:{' '}
                  <span className='text-xs text-gray-300 block'>
                    {new Date(w.purchaseDate).toDateString()}
                  </span>
                </div>
                {w.expiryDate && (
                  <div>
                    Expiry Date:{' '}
                    <span className='text-xs text-red-500 block'>
                      {new Date(w.expiryDate).toDateString()}
                    </span>
                  </div>
                )}
                <div>
                  Notes:{' '}
                  <span className='text-xs text-gray-300 block'>{w.notes}</span>
                </div>
              </div>
              <img
                src={w.photoUrl || `https://placehold.co/400?text=${w.name}`}
                alt={w.name}
                className='bg-gray-300 md:justify-self-end object-cover rounded-lg w-80 h-50 align-end'
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ExpiryPage;
