import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <Router>
      <div className='min-h-screen bg-gray-50'>
        <nav className='bg-white shadow-md p-4 flex justify-between items-center'>
          <h1 className='text-xl font-bold text-blue-600'>ApnaMart</h1>
          <div className='space-x-4'>
            <Link to='/' className='text-gray-600 hover:text-blue-600 font-medium'>Home</Link>
            <Link to='/login' className='text-gray-600 hover:text-blue-600 font-medium'>Login</Link>
            <Link to='/register' className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'>Register</Link>
          </div>
        </nav>
        <Routes>
          <Route path='/' element={
            <div className='flex flex-col items-center justify-center mt-20'>
              <h2 className='text-4xl font-extrabold text-gray-800 mb-4'>Welcome to ApnaMart</h2>
              <p className='text-gray-600 text-lg mb-6'>Your one-stop destination for seamless e-commerce shopping & management.</p>
              <Link to='/register' className='bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700'>Get Started</Link>
            </div>
          } />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}
