import Header from './Header';
import Loader from './Loader';

import { Outlet, useNavigation } from 'react-router-dom';

function AppLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  return (
    <>
        <div className="bg-white">
      {isLoading && <Loader />}
      <Header/>
      <Outlet />
      </div>
    </>
  );
}

export default AppLayout;
