import { useState } from 'react';
import type { Warranty } from '~/types';
import data from '~/data/warranty.json';

const useWarranty = () => {
  const saved =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('warranty')
      : null;
  const initial = saved ? JSON.parse(saved) : data;

  const [warranty, setWarranty] = useState(<Warranty[]>initial);

  const updateWarranty = (updated: Warranty[]) => {
    setWarranty(updated);
    localStorage.setItem('warranty', JSON.stringify(updated));
  };

  return { warranty, updateWarranty };
};

export default useWarranty;
