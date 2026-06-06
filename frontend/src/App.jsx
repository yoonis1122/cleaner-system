import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Landing from './pages/Landing';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ManagerDashboard from './pages/ManagerDashboard';
import CleanerDashboard from './pages/CleanerDashboard';
import UserDashboard from './pages/UserDashboard';
import CheckoutPage from './pages/CheckoutPage';

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/cleaner" element={<CleanerDashboard />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </>
  );
}

export default App;
