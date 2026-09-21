import { Outlet } from 'react-router';
import { useNavigation } from 'react-router';
import Hero from '~/components/Hero';
import { FadeLoader } from 'react-spinners';

const HomeLayout = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state == 'loading';

  return (
    <>
      <Hero userName='Pramit' />

      <section className='max-w-6xl mx-auto px-6 my-8'>
        {/* Overlay spinner here */}
        {isLoading && (
          <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center'>
            <div className='relative z-10 p-8 rounded'>
              <FadeLoader color='lime' />
            </div>
          </div>
        )}
        <Outlet />
      </section>
    </>
  );
};

export default HomeLayout;
