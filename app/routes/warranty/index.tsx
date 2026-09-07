import { Link, useLocation } from 'react-router';
import Message from '~/components/Message';
import useWarranty from '~/hooks/useWarranty';

const WarrantyPage = () => {
  const { warranty } = useWarranty();
  const location = useLocation();
  const message = location.state?.message;

  const sortedWarranty = warranty.sort(
    (a, b) =>
      new Date(a.warrantyEnd).getTime() - new Date(b.warrantyEnd).getTime(),
  );

  return (
    <div className='p-4 text-white'>
      <div className='grid grid-cols-2'>
        <h1 className='text-3xl font-bold text-white mb-2'>Warranty</h1>
        <Link to='/warranty/edit/new'>
          <button className='bg-blue-600 p-2 mb-2 rounded-xs w-full hover:bg-blue-700 active:scale-95 transition-transform cursor-pointer'>
            Add New Item
          </button>
        </Link>
      </div>

      {message && <Message message={message} />}

      <div className='flex flex-col gap-3'>
        {sortedWarranty.map((w) => (
          <Link key={w.id} to={`/warranty/edit/${w.id}`}>
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
                {w.warrantyEnd && (
                  <div>
                    Warranty End Date:{' '}
                    <span className='text-xs text-orange-500 block'>
                      {new Date(w.warrantyEnd).toDateString()}
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

export default WarrantyPage;
