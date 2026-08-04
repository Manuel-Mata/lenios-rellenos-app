import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/stock" element={<Products />} />
          {/* Mock routes for future implement */}
          <Route path="/customers" element={<div className="p-6"><h2>Clientes</h2><p>Módulo en construcción.</p></div>} />
          <Route path="/settings" element={<div className="p-6"><h2>Configuración</h2><p>Módulo en construcción.</p></div>} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
