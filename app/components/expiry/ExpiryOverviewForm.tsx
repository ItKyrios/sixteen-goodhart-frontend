import type { ExpiryItem } from '~/types';

type Props = {
  expiryItem?: ExpiryItem; //optional for new item
};

const ExpiryOverviewForm = ({ expiryItem: w }: Props) => {
  return (
    <div className='grid grid-cols-2 justify-between text-sm bg-gray-900 p-4 rounded-xs shadow-md hover:bg-gray-800 active:bg-gray-800'>
      <div>
        <div className='text-lg font-medium'>{w?.name ?? ''}</div>
        <div>
          Model:{' '}
          <span className='text-xs text-gray-300 block'>{w?.model ?? ''}</span>
        </div>
        <div>Amount: ${w?.amount.toFixed(2)}</div>
        <div>
          Purchase Date:{' '}
          <span className='text-xs text-gray-300 block'>
            {new Date(w?.purchaseDate ?? '').toDateString()}
          </span>
        </div>
        {w?.expiryDate && (
          <div>
            Expiry Date:{' '}
            <span className='text-xs text-red-500 block'>
              {new Date(w?.expiryDate).toDateString()}
            </span>
          </div>
        )}
        <div>
          Notes: <span className='text-xs text-gray-300 block'>{w?.notes}</span>
        </div>
      </div>
      <img
        src={
          w?.media
            ? `${w?.media?.url}`
            : `https://placehold.co/400?text=${w?.name}`
        }
        alt={w?.name}
        className='bg-gray-300 md:justify-self-end object-cover rounded-lg w-80 h-50 align-end'
      />
    </div>
  );
};

export default ExpiryOverviewForm;
