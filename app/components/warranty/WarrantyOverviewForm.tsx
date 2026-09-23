import type { Warranty } from '~/types';

type Props = {
  warrantyItem?: Warranty; //optional for new item
};

const WarrantyOverviewForm = ({ warrantyItem: w }: Props) => {
  return (
    <div className='grid grid-cols-2 justify-between text-sm bg-gray-900 p-4 rounded-xs shadow-md hover:bg-gray-800 active:bg-gray-800'>
      <div>
        <div className='text-lg font-medium'>{w?.name ?? ''}</div>
        <div>
          Model:{' '}
          <span className='text-xs text-gray-300 block'>{w?.model ?? ''}</span>
        </div>
        <div>Amount: ${(w?.amount ?? 0).toFixed(2)}</div>
        <div>
          Purchase Date:{' '}
          <span className='text-xs text-gray-300 block'>
            {new Date(w?.purchaseDate ?? '').toDateString()}
          </span>
        </div>
        {w?.warrantyEnd && (
          <div>
            Warranty End Date:{' '}
            <span className='text-xs text-orange-500 block'>
              {new Date(w?.warrantyEnd ?? '').toDateString()}
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
            ? `${w?.media?.url ?? ''}`
            : `https://placehold.co/400?text=${w?.name}`
        }
        alt={w?.name}
        className='bg-gray-300 md:justify-self-end object-cover rounded-lg w-80 h-50 align-end'
      />
    </div>
  );
};

export default WarrantyOverviewForm;
