import { Outlet } from 'react-router';
import { useNavigation } from 'react-router';
import Hero from '~/components/Hero';
import { FadeLoader } from 'react-spinners';
import { useState } from 'react';
import { useAppContext } from '~/context/AppContext';

const HomeLayout = () => {
  const { appState } = useAppContext();
  const userName = appState?.user?.username ?? 'User';
  const navigation = useNavigation();
  const isLoading =
    navigation.state == 'submitting' || navigation.state == 'loading';
  const [heroCollapsed, setHeroCollapsed] = useState(false);

  return (
    <>
      <Hero
        userName={userName}
        collapsed={heroCollapsed}
        onCollapse={() => setHeroCollapsed(true)}
        onExpand={() => setHeroCollapsed(false)}
      />

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
