import type { GroceryItem } from '~/types';

type Props = {
  grocery?: GroceryItem; //optional for new item
};

const GroceryForm = ({ grocery }: Props) => {
  return (
    <>
      <label htmlFor='name'>Item Name:</label>
      <input
        type='text'
        name='name'
        id='name'
        defaultValue={grocery?.name ?? ''}
        className='p-3 rounded-xs bg-gray-800'
      />

      <label htmlFor='quantity'>Item Qty:</label>
      <input
        type='number'
        name='quantity'
        id='quantity'
        defaultValue={grocery?.quantity ?? 1}
        className='p-3 rounded-xs bg-gray-800'
      />

      <label htmlFor='assignedTo'>Assigned To:</label>
      <input
        type='text'
        name='assignedTo'
        id='assignedTo'
        defaultValue={grocery?.assignedTo ?? ''}
        className='p-3 rounded-xs bg-gray-800'
      />

      <label htmlFor='category'>Category:</label>
      <select
        name='category'
        id='category'
        defaultValue={grocery?.category ?? 'others'}
        className='p-3 rounded-xs bg-gray-800'
      >
        <option value='fruits-and-vegetables'>Fruit & Vegetables</option>
        <option value='meat-and-seafood'>Meat & Seafood</option>
        <option value='dairy-and-eggs'>Dairy & Eggs</option>
        <option value='bakery'>Bakery</option>
        <option value='frozen-foods'>Frozen Foods</option>
        <option value='pantry'>Pantry</option>
        <option value='beverages'>Beverages</option>
        <option value='deli-and-prepared-foods'>Deli & Prepared Foods</option>
        <option value='household-and-personal-care'>
          Household & Personal Care
        </option>
        <option value='others'>Others</option>
      </select>

      <label htmlFor='priority'>Priority:</label>
      <select
        name='priority'
        id='priority'
        defaultValue={grocery?.priority ?? 'medium'}
        className='p-3 rounded-xs bg-gray-800'
      >
        <option value='low'>Low</option>
        <option value='medium'>Medium</option>
        <option value='high'>High</option>
      </select>

      <label className='flex item-center gap-3'>
        <input
          type='checkbox'
          name='done'
          id='done'
          defaultChecked={grocery?.done ?? false}
        />
        Mark as done
      </label>
    </>
  );
};

export default GroceryForm;
