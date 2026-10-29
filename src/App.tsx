import { Routes, Route } from 'react-router-dom';
import BoardPage from './pages/BoardPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<BoardPage />} />
    </Routes>
  );
}

export default App;
