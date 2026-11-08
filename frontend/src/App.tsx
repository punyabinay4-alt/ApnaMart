import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

// Flipkart/Amazon Style Categories with Icons
const categories = [
  { name: 'All', icon: '🔥' },
  { name: 'Mobiles', icon: '📱' },
  { name: 'Electronics', icon: '💻' },
  { name: 'Fashion', icon: '👕' },
  { name: 'Home & Living', icon: '🏠' },
  { name: 'Books', icon: '📚' },
  { name: 'Beauty', icon: '✨' },
  { name: 'Groceries', icon: '🍎' }
];

const adjectives = ['Ultra', 'Pro Max', 'Elite', 'Prime', 'Advanced', 'Supreme', 'Dynamic', 'Neo', 'Classic', 'Apex', 'Titanium', 'Turbo'];
const nouns = ['Smartphone', 'Laptop', 'Headphones', 'Smartwatch', 'Camera', 'Sneakers', 'Backpack', 'Desk Chair', 'Water Bottle', 'Gaming Keyboard', 'Wireless Mouse', 'Smart TV'];

const categoryImages: Record<string, string[]> = {
  Mobiles: ['https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500', 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500'],
  Electronics: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500'],
  Laptops: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500'],
  Fashion: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'],
  'Home & Living': ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500'],
  Books: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500'],
  Beauty: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500'],
  Groceries: ['https://images.unsplash.com/photo-1542838132-92c53300491e?w=500']
};

const generate1000Products = () => {
  const items = [];
  let id = 1;
  const cats = ['Mobiles', 'Electronics', 'Laptops', 'Fashion', 'Home & Living', 'Books', 'Beauty', 'Groceries'];

  for (let batch = 0; batch < 130; batch++) {
    cats.forEach(cat => {
      const imgList = categoryImages[cat] || categoryImages['Electronics'];
      const image = imgList[batch % imgList.length];
      const adj = adjectives[(id + batch) % adjectives.length];
      const noun = nouns[id % nouns.length];
      const price = Math.floor(199 + (id * 127) % 79000);

      items.push({
        id: id,
        name: `${adj} ${noun} Edition ${id} (${cat})`,
        price: price,
        originalPrice: Math.round(price * 1.35),
        rating: (4.0 + (id % 9) * 0.1).toFixed(1),
        reviews: `${120 + (id * 17) % 6000}`,
        image: image,
        category: cat,
        seller: id % 2 === 0 ? 'ApnaMart TopSeller' : 'Global Retail Hub'
      });
      id++;
    });
  }
  return items;
};

const allProducts = generate1000Products();

function StoreHome() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<{ id: number; name: string; price: number; image: string; qty: number; seller: string }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'store' | 'orders' | 'settings' | 'seller' | 'admin'>('store');

  const [user, setUser] = useState<{ name?: string; gender?: string; identifier: string; role: string; loggedIn: boolean } | null>(null);

  // Settings Profile State
  const [settingsProfile, setSettingsProfile] = useState({
    name: 'Punya Binay Swain',
    gender: 'Male',
    phone: '9348335255',
    email: 'swainpunyabinay@gmail.com',
    language: 'English'
  });

  const [savedAddresses] = useState([
    { id: 1, title: 'Home', line1: 'Silicon Hills, Patia', city: 'Bhubaneswar', state: 'Odisha', pincode: '751024' }
  ]);

  const [savedCards] = useState([
    { id: 1, bank: 'HDFC Bank', masked: '•••• •••• •••• 9812', type: 'Visa Debit' }
  ]);
  const [walletBalance] = useState(5000);

  // Checkout State
  const [checkoutAddress, setCheckoutAddress] = useState({ line1: 'Silicon Hills, Patia', city: 'Bhubaneswar', state: 'Odisha', pincode: '751024', phone: '9348335255' });
  const [paymentType, setPaymentType] = useState<'online' | 'offline'>('online');
  const [onlineGateway, setOnlineGateway] = useState<'upi' | 'card'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });

  // Orders State (With Cancel & Live Tracking)
  const [ordersList, setOrdersList] = useState([
    {
      id: 'ORD-77412',
      date: 'Nov 06, 2026',
      total: 12999,
      status: 'Out for Delivery',
      step: 3,
      items: ['Ultra Smartphone Pro Max'],
      customerName: 'Punya Binay Swain'
    }
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const session = localStorage.getItem('apnamart_user_session');
    if (session) {
      const parsed = JSON.parse(session);
      setUser(parsed);
      setSettingsProfile(prev => ({ ...prev, name: parsed.name || '', phone: parsed.identifier || '' }));
      if (parsed.role === 'admin') setActiveTab('admin');
      if (parsed.role === 'seller') setActiveTab('seller');
    }
  }, []);

  const handlePincodeLookup = (pin: string) => {
    setCheckoutAddress(prev => ({ ...prev, pincode: pin }));
    if (pin.length === 6) {
      if (pin.startsWith('75')) setCheckoutAddress(prev => ({ ...prev, city: 'Bhubaneswar', state: 'Odisha' }));
      else if (pin.startsWith('11')) setCheckoutAddress(prev => ({ ...prev, city: 'New Delhi', state: 'Delhi' }));
      else if (pin.startsWith('40')) setCheckoutAddress(prev => ({ ...prev, city: 'Mumbai', state: 'Maharashtra' }));
      else setCheckoutAddress(prev => ({ ...prev, city: 'Metropolitan City', state: 'India' }));
    }
  };

  const addToCart = (product: typeof allProducts[0]) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const handleBuyNow = (product: typeof allProducts[0]) => {
    addToCart(product);
    if (!user || !user.loggedIn) {
      alert('Please log in first to place your order.');
      navigate('/login');
    } else {
      setIsCheckoutOpen(true);
    }
  };

  const cancelOrder = (orderId: string) => {
    setOrdersList(ordersList.map(o => o.id === orderId ? { ...o, status: 'Cancelled by User', step: 0 } : o));
    alert(`Order ${orderId} has been successfully cancelled.`);
  };

  const confirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutAddress.line1 || !checkoutAddress.pincode) {
      alert('Please enter complete delivery address.');
      return;
    }

    if (paymentType === 'online') {
      if (onlineGateway === 'card' && (!cardDetails.number || cardDetails.number.length < 16)) {
        alert('Please enter valid 16-digit card details for secure bank debit.');
        return;
      }
      alert(`🏦 Bank Account Successfully Debited via Gateway!\nAmount: ₹${totalPrice.toLocaleString()}`);
    }

    const newOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: 'Today',
      total: totalPrice,
      status: 'Order Placed & Packed',
      step: 1,
      items: cart.map(i => i.name),
      customerName: user?.name || 'Customer'
    };

    setOrdersList([newOrder, ...ordersList]);
    alert(`🎉 Order Placed Successfully! Order ID: ${newOrder.id}`);
    setCart([]);
    setIsCheckoutOpen(false);
    setActiveTab('orders');
  };

  const filteredProducts = allProducts.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col font-sans'>
      {/* Flipkart / Amazon Signature Blue Header */}
      <nav className='bg-[#2874f0] text-white px-6 py-3 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-50 shadow-md'>
        <div className='flex items-center space-x-2 cursor-pointer' onClick={() => { setActiveTab('store'); navigate('/'); }}>
          <div className='flex flex-col'>
            <h1 className='text-xl font-black italic tracking-wider text-yellow-300'>Apna<span className='text-white'>Mart</span></h1>
            <span className='text-[9px] text-yellow-200 tracking-widest uppercase font-bold'>Explore Plus+</span>
          </div>
        </div>

        <div className='w-full md:w-2/5 relative'>
          <input 
            type='text' 
            placeholder='Search for products, brands and more...' 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full px-4 py-2 rounded-sm text-gray-900 text-sm focus:outline-none shadow'
          />
        </div>

        <div className='flex items-center space-x-4 font-semibold text-xs md:text-sm'>
          <button onClick={() => setActiveTab('store')} className={`px-3 py-1.5 transition ${activeTab === 'store' ? 'bg-blue-800 rounded font-bold' : ''}`}>Store</button>
          <button onClick={() => setActiveTab('orders')} className={`px-3 py-1.5 transition ${activeTab === 'orders' ? 'bg-blue-800 rounded font-bold' : ''}`}>My Orders</button>
          <button onClick={() => setActiveTab('settings')} className={`px-3 py-1.5 transition ${activeTab === 'settings' ? 'bg-blue-800 rounded font-bold' : ''}`}>Settings</button>

          {user?.role === 'seller' && (
            <button onClick={() => setActiveTab('seller')} className={`px-3 py-1.5 transition ${activeTab === 'seller' ? 'bg-blue-800 rounded font-bold' : ''}`}>Seller Hub</button>
          )}

          {user?.role === 'admin' && (
            <button onClick={() => setActiveTab('admin')} className={`px-3 py-1.5 transition ${activeTab === 'admin' ? 'bg-purple-700 rounded font-bold' : ''}`}>Admin Panel</button>
          )}

          {user && user.loggedIn ? (
            <div className='flex items-center space-x-2 bg-blue-700 px-3 py-1.5 rounded border border-blue-400 text-xs'>
              <span>👤 {user.name}</span>
              <button onClick={() => { localStorage.removeItem('apnamart_user_session'); setUser(null); navigate('/login'); }} className='text-yellow-300 font-bold ml-2 underline'>Logout</button>
            </div>
          ) : (
            <Link to='/login' className='bg-white text-blue-600 px-5 py-1.5 rounded font-bold shadow hover:bg-gray-100'>Login</Link>
          )}

          <button onClick={() => setIsCartOpen(true)} className='relative bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded text-sm font-bold flex items-center gap-1 shadow'>
            🛒 Cart <span className='bg-yellow-400 text-blue-950 text-xs rounded-full px-1.5 font-black'>{cart.reduce((a, c) => a + c.qty, 0)}</span>
          </button>
        </div>
      </nav>

      {/* 1. STORE TAB */}
      {activeTab === 'store' && (
        <>
          {/* Category Bar */}
          <div className='bg-white shadow-sm px-6 py-3 flex space-x-8 overflow-x-auto text-xs md:text-sm font-bold text-gray-800 border-b justify-center items-center'>
            {categories.map(cat => (
              <button 
                key={cat.name} 
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-1.5 hover:text-blue-600 whitespace-nowrap pb-1 ${selectedCategory === cat.name ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
              >
                <span>{cat.icon}</span> {cat.name}
              </button>
            ))}
          </div>

          <main className='max-w-7xl mx-auto px-4 py-6 flex-1 w-full'>
            <div className='bg-gradient-to-r from-blue-600 to-indigo-800 rounded-xl p-8 text-white mb-8 shadow-lg flex flex-col md:flex-row justify-between items-center'>
              <div>
                <span className='bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full uppercase'>Big Billion Days</span>
                <h2 className='text-3xl font-black mt-2'>1000+ Unique Products Catalog</h2>
                <p className='text-blue-100 text-sm mt-1'>Instant Pincode lookup, direct bank debit, and live order tracking.</p>
              </div>
            </div>

            <h3 className='text-xl font-bold text-gray-800 mb-6'>Available Catalog ({filteredProducts.length} Items)</h3>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
              {filteredProducts.slice(0, 60).map(product => (
                <div key={product.id} className='bg-white rounded-xl shadow-sm hover:shadow-xl transition overflow-hidden flex flex-col border border-gray-200'>
                  <div className='h-48 w-full bg-gray-50 relative overflow-hidden'>
                    <img src={product.image} alt={product.name} className='w-full h-full object-cover hover:scale-105 transition duration-300' />
                    <span className='absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded font-semibold'>{product.category}</span>
                  </div>
                  <div className='p-4 flex flex-col flex-1 justify-between'>
                    <div>
                      <h4 className='font-bold text-gray-800 text-sm line-clamp-2'>{product.name}</h4>
                      <p className='text-[11px] text-gray-500 mt-0.5'>Seller: <b>{product.seller}</b></p>
                      <div className='flex items-center space-x-2 mt-2'>
                        <span className='bg-green-600 text-white text-xs px-1.5 py-0.5 rounded font-bold'>{product.rating} ★</span>
                        <span className='text-gray-400 text-xs'>({product.reviews} reviews)</span>
                      </div>
                    </div>

                    <div className='mt-4 pt-3 border-t border-gray-100'>
                      <div className='mb-3'>
                        <span className='text-lg font-black text-gray-900'>₹{product.price.toLocaleString()}</span>
                        <span className='text-xs text-gray-400 line-through ml-2'>₹{product.originalPrice.toLocaleString()}</span>
                      </div>

                      <div className='grid grid-cols-2 gap-2'>
                        <button 
                          onClick={() => addToCart(product)}
                          className='bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 py-2 rounded-lg text-xs font-bold transition'
                        >
                          Add to Cart
                        </button>
                        <button 
                          onClick={() => handleBuyNow(product)}
                          className='bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-xs font-bold shadow transition'
                        >
                          Place Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </>
      )}

      {/* 2. MY ORDERS & LIVE TRACKING TAB */}
      {activeTab === 'orders' && (
        <main className='max-w-4xl mx-auto px-4 py-8 flex-1 w-full'>
          <h2 className='text-2xl font-black text-gray-900 mb-6'>My Orders & Live Tracking</h2>
          <div className='space-y-6'>
            {ordersList.map(order => (
              <div key={order.id} className='bg-white rounded-2xl shadow p-6 border'>
                <div className='flex justify-between items-center border-b pb-4 mb-4'>
                  <div>
                    <span className='text-xs font-bold text-blue-600 uppercase'>{order.id}</span>
                    <p className='text-sm font-bold text-gray-800 mt-0.5'>{order.items.join(', ')}</p>
                  </div>
                  <div className='text-right'>
                    <span className='text-lg font-black text-gray-900'>₹{order.total.toLocaleString()}</span>
                    <p className='text-xs text-gray-400'>{order.date}</p>
                  </div>
                </div>

                <div className='flex justify-between items-center mb-4'>
                  <h4 className='text-xs font-bold text-gray-600 uppercase'>Status: <span className='text-blue-600'>{order.status}</span></h4>
                  {order.step > 0 && order.step < 4 && (
                    <button onClick={() => cancelOrder(order.id)} className='bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1 rounded-lg text-xs font-bold'>
                      Cancel Order
                    </button>
                  )}
                </div>

                <div className='grid grid-cols-4 gap-2 text-center text-xs font-bold'>
                  <div className={`p-2 rounded-xl ${order.step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'}`}>1. Ordered</div>
                  <div className={`p-2 rounded-xl ${order.step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'}`}>2. Packed</div>
                  <div className={`p-2 rounded-xl ${order.step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'}`}>3. Out for Delivery</div>
                  <div className={`p-2 rounded-xl ${order.step >= 4 ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'}`}>4. Delivered</div>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* 3. SETTINGS TAB */}
      {activeTab === 'settings' && (
        <main className='max-w-3xl mx-auto px-4 py-8 flex-1 w-full space-y-6'>
          <div className='bg-white rounded-2xl shadow p-6 border space-y-4'>
            <h2 className='text-xl font-black text-gray-900 mb-2'>My Account Settings</h2>
            <div className='grid grid-cols-2 gap-4 text-xs font-bold'>
              <div>
                <label className='block text-gray-600 uppercase mb-1'>Full Name</label>
                <input type='text' value={settingsProfile.name} onChange={e => setSettingsProfile({...settingsProfile, name: e.target.value})} className='w-full p-2.5 border rounded-xl bg-gray-50' />
              </div>
              <div>
                <label className='block text-gray-600 uppercase mb-1'>Gender</label>
                <select value={settingsProfile.gender} onChange={e => setSettingsProfile({...settingsProfile, gender: e.target.value})} className='w-full p-2.5 border rounded-xl bg-gray-50 font-semibold'>
                  <option value='Male'>Male</option>
                  <option value='Female'>Female</option>
                  <option value='Other'>Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className='block text-gray-600 uppercase mb-1'>Language Settings</label>
              <select value={settingsProfile.language} onChange={e => setSettingsProfile({...settingsProfile, language: e.target.value})} className='w-full p-2.5 border rounded-xl bg-gray-50 text-sm font-semibold'>
                <option value='English'>English (Default)</option>
                <option value='Hindi'>Hindi (हिंदी)</option>
                <option value='Odia'>Odia (ଓଡ଼ିଆ)</option>
              </select>
            </div>
          </div>

          <div className='bg-white rounded-2xl shadow p-6 border space-y-4'>
            <h2 className='text-xl font-black text-gray-900 mb-2'>Saved Addresses</h2>
            {savedAddresses.map(addr => (
              <div key={addr.id} className='bg-gray-50 p-3 rounded-xl border flex justify-between items-center text-xs'>
                <div>
                  <b className='text-blue-600'>{addr.title}</b>: {addr.line1}, {addr.city}, {addr.state} - {addr.pincode}
                </div>
              </div>
            ))}
          </div>

          <div className='bg-white rounded-2xl shadow p-6 border space-y-4'>
            <h2 className='text-xl font-black text-gray-900 mb-2'>Saved Cards & Wallet</h2>
            <div className='flex justify-between items-center bg-blue-50 p-3 rounded-xl border border-blue-200 text-xs font-bold text-blue-900'>
              <span>ApnaMart Pay Wallet Balance:</span>
              <span className='text-lg font-black'>₹{walletBalance.toLocaleString()}</span>
            </div>
            {savedCards.map(card => (
              <div key={card.id} className='bg-gray-50 p-3 rounded-xl border flex justify-between items-center text-xs'>
                <span>💳 {card.bank} ({card.type}) - {card.masked}</span>
                <span className='text-green-600 font-bold'>Active</span>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* 4. SELLER HUB TAB */}
      {activeTab === 'seller' && (
        <main className='max-w-4xl mx-auto px-4 py-8 flex-1 w-full'>
          <h2 className='text-2xl font-black text-gray-900 mb-2'>Seller Dashboard & Selled Products</h2>
          <p className='text-gray-500 text-xs mb-6'>Manage your listed catalog and track items sold to customers.</p>
          
          <div className='grid grid-cols-3 gap-4 mb-6'>
            <div className='bg-white p-4 rounded-xl shadow border text-center'>
              <h4 className='text-xs font-bold text-gray-400 uppercase'>Total Selled Items</h4>
              <p className='text-2xl font-black text-blue-600 mt-1'>142</p>
            </div>
            <div className='bg-white p-4 rounded-xl shadow border text-center'>
              <h4 className='text-xs font-bold text-gray-400 uppercase'>Total Revenue</h4>
              <p className='text-2xl font-black text-green-600 mt-1'>₹4,82,900</p>
            </div>
            <div className='bg-white p-4 rounded-xl shadow border text-center'>
              <h4 className='text-xs font-bold text-gray-400 uppercase'>Active Listings</h4>
              <p className='text-2xl font-black text-purple-600 mt-1'>12 Products</p>
            </div>
          </div>
        </main>
      )}

      {/* 5. ADMIN PANEL TAB */}
      {activeTab === 'admin' && (
        <main className='max-w-5xl mx-auto px-4 py-8 flex-1 w-full'>
          <h2 className='text-2xl font-black text-gray-900 mb-2'>System Administrator Master Control Panel</h2>
          <p className='text-gray-500 text-xs mb-6'>Track, monitor, and modify all user orders across India.</p>

          <div className='bg-white rounded-2xl shadow p-6 border overflow-x-auto'>
            <h3 className='text-sm font-bold text-gray-800 mb-4 uppercase'>All Platform Orders Monitor</h3>
            <table className='w-full text-left text-xs'>
              <thead>
                <tr className='border-b bg-gray-50 text-gray-600'>
                  <th className='p-3'>Order ID</th>
                  <th className='p-3'>Customer Name</th>
                  <th className='p-3'>Items</th>
                  <th className='p-3'>Total Amount</th>
                  <th className='p-3'>Status</th>
                </tr>
              </thead>
              <tbody>
                {ordersList.map(ord => (
                  <tr key={ord.id} className='border-b hover:bg-gray-50'>
                    <td className='p-3 font-bold text-blue-600'>{ord.id}</td>
                    <td className='p-3'>{ord.customerName}</td>
                    <td className='p-3'>{ord.items.join(', ')}</td>
                    <td className='p-3 font-bold'>₹{ord.total.toLocaleString()}</td>
                    <td className='p-3'><span className='bg-green-100 text-green-800 px-2 py-0.5 rounded font-bold'>{ord.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className='fixed inset-0 bg-black/50 z-50 flex justify-end'>
          <div className='bg-white w-full max-w-md h-full p-6 flex flex-col shadow-2xl'>
            <div className='flex justify-between items-center pb-4 border-b'>
              <h3 className='text-lg font-black text-gray-900'>Shopping Cart</h3>
              <button onClick={() => setIsCartOpen(false)} className='text-gray-500 hover:text-black font-bold text-lg'>✕</button>
            </div>

            <div className='flex-1 overflow-y-auto py-4 space-y-4'>
              {cart.length === 0 ? (
                <p className='text-center text-gray-500 mt-20'>Your cart is empty!</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className='flex items-center justify-between bg-gray-50 p-3 rounded-xl border'>
                    <img src={item.image} alt={item.name} className='w-14 h-14 object-cover rounded-lg' />
                    <div className='flex-1 ml-3'>
                      <h4 className='text-xs font-bold text-gray-800'>{item.name}</h4>
                      <p className='text-xs font-semibold text-blue-600 mt-1'>₹{item.price.toLocaleString()} × {item.qty}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className='border-t pt-4'>
                <div className='flex justify-between font-bold text-base mb-4'>
                  <span>Total Amount:</span>
                  <span className='text-blue-600'>₹{totalPrice.toLocaleString()}</span>
                </div>
                <button onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow transition'>
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4'>
          <div className='bg-white w-full max-w-xl rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]'>
            <div className='flex justify-between items-center pb-4 border-b mb-4'>
              <h3 className='text-lg font-black text-gray-900'>Checkout & Bank Payment</h3>
              <button onClick={() => setIsCheckoutOpen(false)} className='text-gray-500 hover:text-black font-bold'>✕</button>
            </div>

            <form onSubmit={confirmOrder} className='space-y-4'>
              <div className='bg-gray-50 p-4 rounded-xl border'>
                <h4 className='text-xs font-bold text-gray-800 uppercase mb-3'>📍 Delivery Address (Pincode Auto Lookup)</h4>
                <div className='space-y-3 text-xs'>
                  <input type='text' value={checkoutAddress.line1} onChange={e => setCheckoutAddress({...checkoutAddress, line1: e.target.value})} placeholder='House No., Building, Street' className='w-full p-2.5 border rounded-lg bg-white' required />
                  <div className='grid grid-cols-3 gap-2'>
                    <input type='text' maxLength={6} value={checkoutAddress.pincode} onChange={e => handlePincodeLookup(e.target.value)} placeholder='Pincode' className='p-2.5 border rounded-lg bg-white font-bold text-blue-600' required />
                    <input type='text' value={checkoutAddress.city} readOnly placeholder='City' className='p-2.5 border rounded-lg bg-gray-100 font-semibold' required />
                    <input type='text' value={checkoutAddress.state} readOnly placeholder='State' className='p-2.5 border rounded-lg bg-gray-100 font-semibold' required />
                  </div>
                </div>
              </div>

              <div>
                <h4 className='text-xs font-bold text-gray-800 uppercase mb-2'>💳 Payment Method (Direct Bank Account Debit)</h4>
                <div className='flex gap-4 mb-3 text-xs font-bold'>
                  <button type='button' onClick={() => setPaymentType('online')} className={`flex-1 py-2.5 rounded-xl border transition ${paymentType === 'online' ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-gray-50 text-gray-700'}`}>
                    Online Payment (Bank Debit)
                  </button>
                  <button type='button' onClick={() => setPaymentType('offline')} className={`flex-1 py-2.5 rounded-xl border transition ${paymentType === 'offline' ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-gray-50 text-gray-700'}`}>
                    Cash on Delivery
                  </button>
                </div>

                {paymentType === 'online' && (
                  <div className='bg-blue-50 p-4 rounded-xl border border-blue-200 space-y-3 text-xs'>
                    <div className='flex space-x-4 font-bold border-b pb-2'>
                      <button type='button' onClick={() => setOnlineGateway('upi')} className={onlineGateway === 'upi' ? 'text-blue-600 underline' : 'text-gray-600'}>UPI ID</button>
                      <button type='button' onClick={() => setOnlineGateway('card')} className={onlineGateway === 'card' ? 'text-blue-600 underline' : 'text-gray-600'}>Bank Card</button>
                    </div>

                    {onlineGateway === 'upi' && (
                      <input type='text' value={upiId} onChange={e => setUpiId(e.target.value)} placeholder='username@oksbi' className='w-full p-2.5 border rounded-xl bg-white' required />
                    )}

                    {onlineGateway === 'card' && (
                      <div className='space-y-2'>
                        <input type='text' maxLength={16} value={cardDetails.number} onChange={e => setCardDetails({...cardDetails, number: e.target.value})} placeholder='16-Digit Card Number' className='w-full p-2 border rounded-lg bg-white' required />
                        <div className='grid grid-cols-2 gap-2'>
                          <input type='text' maxLength={5} value={cardDetails.expiry} onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})} placeholder='MM/YY' className='p-2 border rounded-lg bg-white' required />
                          <input type='password' maxLength={3} value={cardDetails.cvv} onChange={e => setCardDetails({...cardDetails, cvv: e.target.value})} placeholder='CVV' className='p-2 border rounded-lg bg-white' required />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className='bg-blue-50 p-4 rounded-xl flex justify-between items-center border border-blue-100'>
                <span className='font-bold text-gray-700 text-sm'>Total Payable:</span>
                <span className='text-xl font-black text-blue-600'>₹{totalPrice.toLocaleString()}</span>
              </div>

              <button type='submit' className='w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition text-sm'>
                Confirm & Pay via Bank Debit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<StoreHome />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </Router>
  );
}