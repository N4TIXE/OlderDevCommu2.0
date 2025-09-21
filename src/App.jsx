import { Routes, Route } from 'react-router-dom';
import ComingSoon from './pages/ComingSoon';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Page404 from './pages/Page404';
import Game1 from './pages/Game1';
import Game2 from './pages/Game2';
import Main from './pages/Main';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/ComingSoon' element={<ComingSoon />} />
        <Route path='/Register' element={<Register />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/Game1' element={<Game1 />} />
        <Route path='/Game2' element={<Game2 />} />
        <Route path='*' element={<Page404 />} />
      </Routes>
    </>
  );
}

export default App;