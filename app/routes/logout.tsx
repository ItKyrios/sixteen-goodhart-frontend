import { redirect } from 'react-router';
import { clearJwtCookie } from '~/utills/cookies';

export async function action() {
  return redirect('/login', {
    headers: {
      'Set-Cookie': clearJwtCookie(),
    },
  });
}

export default function Logout() {
  return (
    <form method='post' className='space-y-5'>
      <button
        type='submit'
        className='w-full rounded-lg bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-950 active:scale-[0.98] cursor-pointer'
      >
        Logout
      </button>
    </form>
  );
}
