import { PiUserCheckDuotone } from 'react-icons/pi';
import type { ActionFunctionArgs } from 'react-router';
import { redirect, Form, useActionData } from 'react-router';
import { setJwtCookie } from '~/utills/cookies';

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const username = form.get('username');
  const email = form.get('email');
  const password = form.get('password');

  const res = await fetch(
    `${import.meta.env.VITE_STRAPI_URL}/api/auth/local/register`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    return { error: data.error?.message || 'Registration failed' };
  }

  return redirect('/', {
    headers: {
      'Set-Cookie': setJwtCookie(data.jwt),
    },
  });
}

export default function Register() {
  const actionData = useActionData();

  return (
    <div className='bg-slate-950 px-4 py-5 text-white'>
      <div className='mx-auto flex max-w-md items-center justify-center'>
        <div className='w-full'>
          <div className='mb-8 text-center'>
            <div className='mx-auto mb-5 flex h-14 w-14 items center justify-center rounded-2xl bg-indigo-500 shadow-lg shadow-indigo-500/30'>
              <PiUserCheckDuotone className='p-2 w-14 h-14' />
            </div>
            <h1 className='text-3xl font-bold tracking-tight'>Register</h1>
            <p className='mt-2 text-sm text-slate-400'>
              Fill in your details to sign up
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
                  htmlFor='username'
                  className='mb-2 block text-sm font-medium text-slate-200'
                >
                  Username
                </label>
                <input
                  id='username'
                  name='username'
                  type='text'
                  placeholder='Username'
                  autoComplete='username'
                  required
                  className='block w-full rounded-lg border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30'
                />
              </div>
              <div>
                <label
                  htmlFor='email'
                  className='mb-2 block text-sm font-medium text-slate-200'
                >
                  Email address
                </label>
                <input
                  id='email'
                  name='email'
                  type='email'
                  placeholder='Email'
                  autoComplete='email'
                  required
                  className='block w-full rounded-lg border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30'
                />
              </div>
              <div>
                <label
                  htmlFor='password'
                  className='mb-2 block text-sm font-medium text-slate-200'
                >
                  Password
                </label>

                <input
                  id='password'
                  name='password'
                  type='password'
                  placeholder='Password'
                  autoComplete='current-password'
                  required
                  className='block w-full rounded-lg border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30'
                />
              </div>

              <button
                type='submit'
                className='w-full rounded-lg bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-950 active:scale-[0.98] cursor-pointer'
              >
                Register
              </button>
            </Form>

            <p className='mt-6 text-center text-sm text-slate-400'>
              Already have an account?{' '}
              <a
                href='/login'
                className='font-medium text-indigo-400 transition hover:text-indigo-300'
              >
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
