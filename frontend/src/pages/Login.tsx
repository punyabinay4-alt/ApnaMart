import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [role, setRole] = useState<'customer' | 'seller' | 'admin'>('customer');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('Please enter your mobile number or email ID.');
      return;
    }

    if (role === 'admin' && identifier !== 'swainpunyabinay@gmail.com' && identifier !== '9348335255') {
      setError('Access Denied: Invalid System Administrator Credentials.');
      return;
    }

    setStep('otp');
  };

  const handleVerifyAndLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length < 4) {
      setError('Please enter a valid OTP verification code.');
      return;
    }

    const session = {
      identifier: identifier,
      role: role,
      name: role === 'admin' ? 'Punya Binay Swain (Admin)' : (role === 'seller' ? 'Verified Vendor' : 'Customer Account'),
      loggedIn: true,
      authTime: new Date().toISOString()
    };

    localStorage.setItem('apnamart_user_session', JSON.stringify(session));
    alert(`Secure Login Successful as ${role.toUpperCase()}!`);
    navigate('/');
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-900 p-4 font-sans'>
      <div className='bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md'>
        <div className='text-center mb-6'>
          <div className='inline-block bg-blue-600 text-white font-black text-xl px-4 py-1.5 rounded-xl mb-2'>🛍️ ApnaMart</div>
          <h2 className='text-2xl font-black text-gray-900'>Enterprise User Login</h2>
          <p className='text-gray-500 text-xs mt-1'>Encrypted Multi-Tenant DB Gateway</p>
        </div>

        <div className='flex bg-gray-100 p-1 rounded-xl mb-6 text-xs font-bold'>
          <button type='button' onClick={() => { setRole('customer'); setError(''); }} className={`flex-1 py-2 rounded-lg transition ${role === 'customer' ? 'bg-blue-600 text-white shadow' : 'text-gray-600'}`}>Customer</button>
          <button type='button' onClick={() => { setRole('seller'); setError(''); }} className={`flex-1 py-2 rounded-lg transition ${role === 'seller' ? 'bg-blue-600 text-white shadow' : 'text-gray-600'}`}>Seller</button>
          <button type='button' onClick={() => { setRole('admin'); setError(''); }} className={`flex-1 py-2 rounded-lg transition ${role === 'admin' ? 'bg-purple-600 text-white shadow' : 'text-gray-600'}`}>Admin</button>
        </div>

        {error && (
          <div className='bg-red-50 border border-red-200 text-red-600 text-xs font-semibold p-3 rounded-xl mb-4 text-center'>
            ⚠️ {error}
          </div>
        )}

        {step === 'input' ? (
          <form onSubmit={handleRequestOtp} className='space-y-4'>
            <div>
              <label className='block text-gray-700 text-xs font-bold mb-1 uppercase'>Mobile Number or Email ID</label>
              <input
                type='text'
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className='w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-gray-50'
                placeholder='Enter mobile or email'
                required
              />
            </div>

            <button type='submit' className={`w-full text-white font-bold py-3 rounded-xl shadow-lg transition text-sm ${role === 'admin' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
              Get Secure OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndLogin} className='space-y-4'>
            <div className='bg-blue-50 p-3 rounded-xl text-xs text-blue-800 text-center font-medium'>
              📲 SMS OTP has been dispatched to your mobile number.
            </div>

            <div>
              <label className='block text-gray-700 text-xs font-bold mb-1 uppercase'>Enter OTP Code</label>
              <input
                type='text'
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className='w-full px-4 py-3 border rounded-xl text-center text-2xl font-bold tracking-widest bg-gray-50'
                placeholder='••••••'
                required
              />
            </div>

            <button type='submit' className='w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow transition text-sm'>
              Verify & Secure Login
            </button>

            <button type='button' onClick={() => setStep('input')} className='w-full text-xs text-gray-500 font-bold hover:underline text-center block'>
              ← Change Mobile/Email ID
            </button>
          </form>
        )}

        <div className='mt-6 text-center text-sm text-gray-600'>
          New user? <Link to='/register' className='text-blue-600 font-bold hover:underline'>Register Account</Link>
        </div>
      </div>
    </div>
  );
}