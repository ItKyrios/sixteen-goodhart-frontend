import { Form, useActionData } from 'react-router';
import type { ActionFunctionArgs } from 'react-router';
import { redirect } from 'react-router';
import { setJwtCookie } from '~/utills/cookies';

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const identifier = form.get('identifier');
  const password = form.get('password');

  const res = await fetch(`${import.meta.env.VITE_STRAPI_URL}/api/auth/local`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: data.error?.message || 'Login failed' };
  }

  return redirect('/', {
    headers: {
      'Set-Cookie': setJwtCookie(data.jwt),
    },
  });
}

export default function Login() {
  const actionData = useActionData();

  return (
    <div className='bg-slate-950 px-4 py-12 text-white'>
      <div className='mx-auto flex max-w-md items-center justify-center'>
        <div className='w-full'>
          <div className='mb-8 text-center'>
            <div className='mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500 shadow-lg shadow-indigo-500/30'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                className='h-7 w-7'
                aria-hidden='true'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a8.25 8.25 0 0 1 15 0'
                />
              </svg>
            </div>

            <h1 className='text-3xl font-bold tracking-tight'>Welcome back</h1>

            <p className='mt-2 text-sm text-slate-400'>
              Sign in to continue to your account
            </p>
          </div>

          <div className='rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8'>
            {actionData?.error && (
              <div
                role='alert'
                className='mb-5 rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300'
              >
                {actionData.error}
              </div>
            )}

            <Form method='post' className='space-y-5'>
              <div>
                <label
                  htmlFor='identifier'
                  className='mb-2 block text-sm font-medium text-slate-200'
                >
                  Email address
                </label>

                <input
                  id='identifier'
                  name='identifier'
                  type='email'
                  placeholder='you@example.com'
                  autoComplete='email'
                  required
                  className='block w-full rounded-lg border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30'
                />
              </div>

              <div>
                <div className='mb-2 flex items-center justify-between'>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-slate-200'
                  >
                    Password
                  </label>

                  <a
                    href='/forgot-password'
                    className='text-sm text-indigo-400 transition hover:text-indigo-300'
                  >
                    Forgot password?
                  </a>
                </div>

                <input
                  id='password'
                  name='password'
                  type='password'
                  placeholder='Enter your password'
                  autoComplete='current-password'
                  required
                  className='block w-full rounded-lg border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30'
                />
              </div>

              <button
                type='submit'
                className='w-full rounded-lg bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-950 active:scale-[0.98] cursor-pointer'
              >
                Login
              </button>
            </Form>

            <p className='mt-6 text-center text-sm text-slate-400'>
              Don’t have an account?{' '}
              <a
                href='/register'
                className='font-medium text-indigo-400 transition hover:text-indigo-300'
              >
                Create one
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
