'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Profile.module.css';
import { useCart } from '@/context/CartContext';

interface Order {
  orderId: string;
  createdAt: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  paymentMethod: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    qty: number;
    image: string;
  }>;
}

export default function ProfileClient() {
  const router = useRouter();
  const { logoutCleanup } = useCart();
  
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'account' | 'orders' | 'address' | 'settings'>('account');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Edit profile fields states
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editImage, setEditImage] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Address fields states
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressStreet, setAddressStreet] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressState, setAddressState] = useState('');
  const [addressZip, setAddressZip] = useState('');
  const [addressCountry, setAddressCountry] = useState('India');
  const [addressMessage, setAddressMessage] = useState('');

  // Password fields states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Load user details on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        
        // Fetch latest details (including address) from backend
        const fetchUserData = async () => {
          try {
            const res = await fetch(`/api/profile/user?email=${encodeURIComponent(parsedUser.email)}`);
            const data = await res.json();
            if (data.success && data.user) {
              setCurrentUser(data.user);
              setEditName(data.user.name || '');
              setEditPhone(data.user.phone || '');
              setEditImage(data.user.image || '');
              
              if (data.user.address) {
                setAddressStreet(data.user.address.street || '');
                setAddressCity(data.user.address.city || '');
                setAddressState(data.user.address.state || '');
                setAddressZip(data.user.address.zip || '');
                setAddressCountry(data.user.address.country || 'India');
              }
              
              // Keep session storage in sync
              localStorage.setItem('currentUser', JSON.stringify(data.user));
            } else {
              // Fallback if user details not returned yet
              setCurrentUser(parsedUser);
              setEditName(parsedUser.name || '');
              setEditPhone(parsedUser.phone || '');
              setEditImage(parsedUser.image || '');
            }
          } catch (err) {
            console.error('Failed to sync user details with backend:', err);
            // Fallback
            setCurrentUser(parsedUser);
            setEditName(parsedUser.name || '');
            setEditPhone(parsedUser.phone || '');
            setEditImage(parsedUser.image || '');
          } finally {
            setIsLoading(false);
          }
        };
        fetchUserData();
      } catch (e) {
        console.error('Failed to parse current user:', e);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      // Automatically open the login overlay modal if they land on profile page and are not logged in
      const accountBtn = document.querySelector('[aria-label="Account"]') as HTMLElement;
      if (accountBtn) {
        setTimeout(() => {
          accountBtn.click();
        }, 100);
      }
    }
  }, []);

  // Fetch user orders when tabs change or on mount
  useEffect(() => {
    if (!currentUser?.email) {
      setOrders([]);
      return;
    }

    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const res = await fetch(`/api/profile/orders?email=${encodeURIComponent(currentUser.email)}`);
        const data = await res.json();
        if (data.success && data.orders) {
          setOrders(data.orders);
        }
      } catch (e) {
        console.error('Failed to fetch user orders:', e);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser, activeTab]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    logoutCleanup();
    setCurrentUser(null);
    router.push('/');
    // Force a page refresh to clear layout states
    setTimeout(() => {
      window.location.reload();
    }, 150);
  };

  // Open Header profile modal as fallback helper
  const handleOpenAuthModal = () => {
    const btn = document.querySelector('[aria-label="Account"]') as HTMLElement;
    if (btn) {
      btn.click();
    } else {
      router.push('/');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setProfileError('Image size should be less than 2MB.');
        return;
      }
      setProfileError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Profile Save Changes
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage('');
    setProfileError('');

    if (!editName.trim() || !editPhone.trim()) {
      setProfileError('Full Name and Phone Number are required.');
      return;
    }

    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          name: editName,
          phone: editPhone,
          image: editImage
        })
      });
      const data = await res.json();
      if (data.success) {
        // Update session storage
        const updatedSession = { ...currentUser, name: editName, phone: editPhone, image: editImage };
        setCurrentUser(updatedSession);
        localStorage.setItem('currentUser', JSON.stringify(updatedSession));

        setProfileMessage('Profile details updated successfully!');
        setIsEditing(false);
      } else {
        setProfileError(data.error || 'Failed to update profile.');
      }
    } catch (err) {
      setProfileError('Network error while saving profile changes.');
    }
  };

  // Address Save Changes
  const handleAddressSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressMessage('');

    try {
      const addressObj = {
        street: addressStreet,
        city: addressCity,
        state: addressState,
        zip: addressZip,
        country: addressCountry
      };

      const res = await fetch('/api/profile/update-address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          address: addressObj
        })
      });
      const data = await res.json();
      if (data.success) {
        // Update session storage
        const updatedSession = { ...currentUser, address: addressObj };
        setCurrentUser(updatedSession);
        localStorage.setItem('currentUser', JSON.stringify(updatedSession));

        setAddressMessage('Address details saved successfully!');
        setIsEditingAddress(false);
      } else {
        console.error('Failed to update address:', data.error);
      }
    } catch (err) {
      console.error('Failed to save address details:', err);
    }
  };

  // Password Update Save
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill out all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    try {
      const res = await fetch('/api/profile/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          currentPassword,
          newPassword
        })
      });
      const data = await res.json();
      if (data.success) {
        setPasswordSuccess('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(data.error || 'Failed to update password.');
      }
    } catch (err) {
      setPasswordError('Network error during password update.');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  // Not Logged In View
  if (!currentUser) {
    return (
      <div className="container" style={{ margin: '4rem auto', maxWidth: '600px' }}>
        <div className={styles.notLoggedInCard}>
          <div className={styles.lockIconWrapper}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2>Access Denied</h2>
          <p>Please sign in to view your Account Dashboard.</p>
          <div className={styles.notLoggedInActions}>
            <button className={styles.primaryAuthBtn} onClick={handleOpenAuthModal}>
              Sign In / Sign Up
            </button>
            <button className={styles.secondaryHomeBtn} onClick={() => router.push('/')}>
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginBottom: '5rem' }}>
      <div className={styles.dashboardGrid}>
        
        {/* Left Sidebar Menu */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarMenu}>
            <button 
              className={`${styles.sidebarItem} ${activeTab === 'account' ? styles.sidebarItemActive : ''}`}
              onClick={() => setActiveTab('account')}
            >
              <svg className={styles.sidebarIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              My Account
            </button>

            <button 
              className={`${styles.sidebarItem} ${activeTab === 'orders' ? styles.sidebarItemActive : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <svg className={styles.sidebarIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
              My Orders
            </button>

            <button 
              className={`${styles.sidebarItem} ${activeTab === 'address' ? styles.sidebarItemActive : ''}`}
              onClick={() => setActiveTab('address')}
            >
              <svg className={styles.sidebarIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              Address Book
            </button>

            <button 
              className={`${styles.sidebarItem} ${activeTab === 'settings' ? styles.sidebarItemActive : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <svg className={styles.sidebarIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              Settings
            </button>
          </div>

          <button className={styles.logoutBtn} onClick={handleLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>

        {/* Right Panel Card Display */}
        <div className={styles.mainCard}>
          
          {/* TAB 1: MY ACCOUNT (PROFILE VIEW) */}
          {activeTab === 'account' && (
            <div>
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.cardTitle}>My Profile</h2>
                  <p className={styles.cardSubtitle}>View and manage your account information</p>
                </div>
                {!isEditing ? (
                  <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    Edit Profile
                  </button>
                ) : (
                  <button className={styles.editBtn} style={{ borderColor: 'var(--gray)', color: 'var(--gray)' }} onClick={() => { setIsEditing(false); setProfileError(''); setProfileMessage(''); setEditImage(currentUser.image || ''); }}>
                    Cancel
                  </button>
                )}
              </div>

              {profileMessage && <div className={styles.successBox}>{profileMessage}</div>}
              {profileError && <div className={styles.errorBox}>{profileError}</div>}

              {/* Profile Overview Card */}
              <div className={styles.profileOverviewBox}>
                <div className={styles.avatarCircle}>
                  {editImage ? (
                    <img src={editImage} alt="Profile" />
                  ) : currentUser.image ? (
                    <img src={currentUser.image} alt={currentUser.name || 'User'} />
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#777785" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  )}
                </div>
                <div className={styles.avatarText}>
                  <span className={styles.memberBadge}>MEMBER SINCE 2026</span>
                  <h3 className={styles.avatarName}>{currentUser.name || 'Admin User'}</h3>
                  <p className={styles.avatarEmail}>{currentUser.email || 'admin@gmail.com'}</p>
                </div>
              </div>

              {/* Account Information details */}
              <div className={styles.infoSection}>
                <h4 className={styles.sectionHeading}>Account Information</h4>
                <p className={styles.sectionSubtitle}>Basic details about your account identity</p>

                <form onSubmit={handleProfileSave} className={styles.profileForm}>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>FULL NAME</label>
                      <input 
                        type="text" 
                        className={styles.formInput} 
                        disabled={!isEditing} 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>EMAIL ADDRESS</label>
                      <input 
                        type="email" 
                        className={styles.formInput} 
                        disabled 
                        value={currentUser.email} 
                        style={{ backgroundColor: '#f5f6fa', cursor: 'not-allowed' }}
                      />
                      <span className={styles.formLabelTip}>Email cannot be changed after registration</span>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>MOBILE NUMBER</label>
                      <input 
                        type="tel" 
                        pattern="[6-9][0-9]{9}"
                        maxLength={10}
                        className={styles.formInput} 
                        disabled={!isEditing} 
                        value={editPhone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^\d]/g, '');
                          if (val.length === 0 || /^[6-9]/.test(val)) {
                            setEditPhone(val.slice(0, 10));
                          }
                        }}
                        placeholder="e.g. 9876543210"
                      />
                    </div>

                    {isEditing && (
                      <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                        <label className={styles.formLabel}>PROFILE PHOTO</label>
                        <input 
                          type="file" 
                          accept="image/*"
                          className={styles.formInput} 
                          onChange={handleImageChange}
                        />
                        <span className={styles.formLabelTip}>Upload profile photo (Max 2MB)</span>
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <button type="submit" className={styles.saveChangesBtn}>
                      Save Changes
                    </button>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: MY ORDERS */}
          {activeTab === 'orders' && (
            <div>
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.cardTitle}>My Orders</h2>
                  <p className={styles.cardSubtitle}>Track and manage your order history</p>
                </div>
              </div>

              {ordersLoading ? (
                <div style={{ padding: '2rem 0', textAlign: 'center', color: '#666' }}>
                  Loading order history...
                </div>
              ) : orders.length === 0 ? (
                <div className={styles.emptyStateBox}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}>
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  <h4>No orders found</h4>
                  <p>You haven't placed any orders with this account yet.</p>
                  <button className={styles.browseBtn} onClick={() => router.push('/products')}>
                    Browse Products
                  </button>
                </div>
              ) : (
                <div className={styles.ordersList}>
                  {orders.map((order) => (
                    <div key={order.orderId} className={styles.orderCard}>
                      <div className={styles.orderCardHeader}>
                        <div>
                          <span className={styles.orderId}>{order.orderId}</span>
                          <span className={styles.orderDate}>Placed on: {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <span className={`${styles.badgeStatus} ${styles[`status_${order.status.toLowerCase()}`] || styles.status_pending}`}>
                            {order.status}
                          </span>
                          <span className={`${styles.badgeStatus} ${order.paymentStatus === 'PAID' ? styles.status_paid : styles.status_unpaid}`}>
                            Payment: {order.paymentStatus}
                          </span>
                        </div>
                      </div>

                      <div className={styles.orderItems}>
                        {order.items.map((item, idx) => (
                          <div key={idx} className={styles.orderItemRow}>
                            <img src={item.image || '/images/default_product.png'} alt={item.name} className={styles.orderItemImg} />
                            <div className={styles.orderItemMeta}>
                              <h5>{item.name}</h5>
                              <p>Qty: {item.qty} × ₹{item.price.toLocaleString()}</p>
                            </div>
                            <span className={styles.orderItemTotal}>₹{(item.price * item.qty).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      <div className={styles.orderCardFooter}>
                        <div>
                          <strong>Method:</strong> {order.paymentMethod}
                        </div>
                        <div className={styles.grandTotalText}>
                          Grand Total: <span>₹{order.subtotal.toLocaleString()}/-</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADDRESS BOOK */}
          {activeTab === 'address' && (
            <div>
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.cardTitle}>Address Book</h2>
                  <p className={styles.cardSubtitle}>Manage your default delivery addresses</p>
                </div>
                {!isEditingAddress ? (
                  <button className={styles.editBtn} onClick={() => setIsEditingAddress(true)}>
                    Edit Address
                  </button>
                ) : (
                  <button className={styles.editBtn} style={{ borderColor: 'var(--gray)', color: 'var(--gray)' }} onClick={() => setIsEditingAddress(false)}>
                    Cancel
                  </button>
                )}
              </div>

              {addressMessage && <div className={styles.successBox}>{addressMessage}</div>}

              <div className={styles.addressContainer}>
                <form onSubmit={handleAddressSave} className={styles.profileForm}>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                      <label className={styles.formLabel}>STREET ADDRESS</label>
                      <input 
                        type="text" 
                        className={styles.formInput} 
                        disabled={!isEditingAddress}
                        placeholder="House number and street name"
                        value={addressStreet}
                        onChange={(e) => setAddressStreet(e.target.value)}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>TOWN / CITY</label>
                      <input 
                        type="text" 
                        className={styles.formInput} 
                        disabled={!isEditingAddress}
                        placeholder="City"
                        value={addressCity}
                        onChange={(e) => setAddressCity(e.target.value)}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>STATE</label>
                      <input 
                        type="text" 
                        className={styles.formInput} 
                        disabled={!isEditingAddress}
                        placeholder="State"
                        value={addressState}
                        onChange={(e) => setAddressState(e.target.value)}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>ZIP CODE</label>
                      <input 
                        type="text" 
                        className={styles.formInput} 
                        disabled={!isEditingAddress}
                        placeholder="ZIP/Postal Code"
                        value={addressZip}
                        onChange={(e) => setAddressZip(e.target.value)}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>COUNTRY</label>
                      <input 
                        type="text" 
                        className={styles.formInput} 
                        disabled={!isEditingAddress}
                        placeholder="Country"
                        value={addressCountry}
                        onChange={(e) => setAddressCountry(e.target.value)}
                      />
                    </div>
                  </div>

                  {isEditingAddress && (
                    <button type="submit" className={styles.saveChangesBtn} style={{ marginTop: '1.5rem' }}>
                      Save Address
                    </button>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === 'settings' && (
            <div>
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.cardTitle}>Account Settings</h2>
                  <p className={styles.cardSubtitle}>Update security and account credentials</p>
                </div>
              </div>

              {passwordSuccess && <div className={styles.successBox}>{passwordSuccess}</div>}
              {passwordError && <div className={styles.errorBox}>{passwordError}</div>}

              <div className={styles.settingsSection}>
                <h4 className={styles.sectionHeading}>Change Password</h4>
                <p className={styles.sectionSubtitle}>Ensure your account remains highly secure</p>

                <form onSubmit={handlePasswordUpdate} className={styles.profileForm} style={{ maxWidth: '500px' }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>CURRENT PASSWORD</label>
                    <input 
                      type="password" 
                      required
                      className={styles.formInput} 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>NEW PASSWORD</label>
                    <input 
                      type="password" 
                      required
                      className={styles.formInput} 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>CONFIRM NEW PASSWORD</label>
                    <input 
                      type="password" 
                      required
                      className={styles.formInput} 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <button type="submit" className={styles.saveChangesBtn} style={{ marginTop: '1rem' }}>
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
