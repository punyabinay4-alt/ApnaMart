import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  const handleSendOtps = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (phone.replace(/\D/g, '').length !== 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    setStep(2);
  };

  const handleVerifyAndRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phoneOtp) {
      setError('Please enter the phone verification OTP.');
      return;
    }

    const newUser = {
      name,
      gender,
      phone,
      email,
      identifier: phone,
      registeredAt: new Date().toISOString()
    };

    const existingUsers = JSON.parse(localStorage.getItem('apnamart_db_users') || '[]');
    existingUsers.push(newUser);
    localStorage.setItem('apnamart_db_users', JSON.stringify(existingUsers));

    alert('Registration successful! You can now log in.');
    navigate('/login');
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-900 p-4 font-sans'>
      <div className='bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md'>
        <div className='text-center mb-6'>
          <div className='inline-block bg-blue-600 text-white font-black text-xl px-4 py-1.5 rounded-xl mb-2'>🛍️ ApnaMart</div>
          <h2 className='text-2xl font-black text-gray-900'>New User Registration</h2>
          <p className='text-gray-500 text-xs mt-1'>Scalable Multi-User Database Engine</p>
        </div>

        {error && (
          <div className='bg-red-50 border border-red-200 text-red-600 text-xs font-semibold p-3 rounded-xl mb-4 text-center'>
            ⚠️ {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtps} className='space-y-3'>
            <div>
              <label className='block text-gray-700 text-xs font-bold mb-1 uppercase'>Full Name *</label>
              <input type='text' value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter your full name' className='w-full px-3 py-2 border rounded-xl text-sm bg-gray-50' required />
            </div>

            <div>
              <label className='block text-gray-700 text-xs font-bold mb-1 uppercase'>Gender *</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} className='w-full px-3 py-2 border rounded-xl text-sm bg-gray-50 font-semibold'>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
                <option value='Other'>Other</option>
              </select>
            </div>

            <div>
              <label className='block text-gray-700 text-xs font-bold mb-1 uppercase'>Phone Number (10 digits) *</label>
              <input type='tel' maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder='9348335255' className='w-full px-3 py-2 border rounded-xl text-sm bg-gray-50' required />
            </div>

            <div>
              <label className='block text-gray-700 text-xs font-bold mb-1 uppercase'>Email ID (Optional)</label>
              <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='name@example.com' className='w-full px-3 py-2 border rounded-xl text-sm bg-gray-50' />
            </div>

            <button type='submit' className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow transition text-sm mt-2'>
              Send Verification OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndRegister} className='space-y-4'>
            <div>
              <label className='block text-gray-700 text-xs font-bold mb-1 uppercase'>Enter Phone OTP *</label>
              <input type='text' maxLength={6} value={phoneOtp} onChange={(e) => setPhoneOtp(e.target.value)} placeholder='Enter 6-digit OTP' className='w-full px-3 py-2 border rounded-xl text-sm bg-gray-50 font-bold' required />
            </div>

            <button type='submit' className='w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow transition text-sm'>
              Verify & Complete Registration
            </button>

            <button type='button' onClick={() => setStep(1)} className='w-full text-xs text-gray-500 font-bold hover:underline text-center block'>
              ← Back to Details
            </button>
          </form>
        )}

        <div className='mt-4 text-center text-sm text-gray-600'>
          Already registered? <Link to='/login' className='text-blue-600 font-bold hover:underline'>Login Here</Link>
        </div>
      </div>
    </div>
  );
}