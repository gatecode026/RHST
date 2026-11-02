'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import styles from './Admin.module.css';

interface Submission {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  type: 'contact' | 'installation' | 'it-support';
  submittedAt: string;
  status?: 'Pending' | 'In Progress' | 'Resolved';
  notes?: string;
}

interface OrderItem {
  id: string | number;
  name: string;
  price: number;
  qty: number;
}

interface Order {
  id: string;
  orderId: string;
  items: OrderItem[];
  subtotal: number;
  customer?: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  couponCode?: string;
  discountApplied?: number;
  status: 'Pending' | 'Shipped' | 'Completed' | 'Cancelled';
  paymentStatus: 'PENDING' | 'COMPLETED';
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  image: string;
  link: string;
  slug?: string;
  parentGroup?: string;
  description?: string;
  status?: string;
}

interface Brand {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  status?: string;
}

interface Seller {
  id: string;
  name: string;
  mainCategory: string;
  location: string;
  rating?: number;
  reviewCount?: number;
  verified?: boolean;
  memberSince?: string;
  gstNumber?: string;
  responseTime?: string;
  responseRate?: string;
  natureOfBusiness?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  trustScore?: string;
  status?: string;
}

interface Product {
  id: string;
  name: string;
  slug?: string;
  price: string;
  image: string;
  link: string;
  category: string;
  brand?: string;
  sku?: string;
  stock?: number;
  status?: 'PUBLISHED' | 'DRAFT';
  description?: string;
  mrp?: number;
  discount?: number;
  featured?: boolean;
  onOffer?: boolean;
  warranty?: number;
  lowStockThreshold?: number;
  sellerId?: string;
  sellerName?: string;
  sellerLocation?: string;
  sellerGst?: string;
  sellerTrustScore?: string;
}

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  image: string;
  theme: string;
  link: string;
}

interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  isActive: boolean;
  minPurchase: number;
  usageLimit: number;
  usageCount: number;
  expiryDate: string;
}

interface ActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
}

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

interface Settings {
  shopName: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  taxRate: string;
  shopHours: string;
}

const getAvatarStyle = (name: string) => {
  const colors = [
    { bg: '#eff6ff', color: '#1d4ed8' },
    { bg: '#ecfdf5', color: '#047857' },
    { bg: '#fef3c7', color: '#d97706' },
    { bg: '#fdf2f8', color: '#be185d' },
    { bg: '#f5f3ff', color: '#6d28d9' },
    { bg: '#f0fdfa', color: '#0f766e' }
  ];
  let hash = 0;
  const str = name || '';
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

const ADMIN_MODULES = [
  { key: 'Dashboard', icon: '▦' },
  { key: 'Users', icon: '👤' },
  { key: 'Categories', icon: '🗂' },
  { key: 'Products', icon: '📦' },
  { key: 'Sellers', icon: '🏢' },
  { key: 'Brands', icon: '🎗' },
  { key: 'Orders', icon: '🛒' },
  { key: 'Coupons', icon: '🏷' },
  { key: 'Homepage Banner', icon: '🖼' },
  { key: 'Blogs', icon: '📝' },
  { key: 'Blog Categories', icon: '📂' },
];

type ModulePermission = { view: boolean; create: boolean; edit: boolean; delete: boolean };
type AdminPermissions = { [module: string]: ModulePermission };

const defaultAdminPermissions = (): AdminPermissions => {
  const perms: AdminPermissions = {};
  ADMIN_MODULES.forEach(m => {
    perms[m.key] = { view: true, create: true, edit: true, delete: true };
  });
  return perms;
};

export default function AdminDashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'categories' | 'products' | 'sellers' | 'orders' | 'customers' | 'coupons' | 'queries' | 'analytics' | 'activity-logs' | 'admin-manager' | 'settings' | 'brands' | 'blogs' | 'promo-banner'
  >('dashboard');

  // Database State lists
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [adminProductsPage, setAdminProductsPage] = useState(1);
  const [adminProductsLimit, setAdminProductsLimit] = useState(25);
  const [adminProductsTotal, setAdminProductsTotal] = useState(0);
  const [adminProductsTotalPages, setAdminProductsTotalPages] = useState(1);
  const [adminProductsLoading, setAdminProductsLoading] = useState(false);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [settings, setSettings] = useState<Settings>({
    shopName: '',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    taxRate: '18',
    shopHours: ''
  });

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal View States
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Modals Add States
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddBrandOpen, setIsAddBrandOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddSellerOpen, setIsAddSellerOpen] = useState(false);
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);

  // Import Modal States
  const [isImportProductOpen, setIsImportProductOpen] = useState(false);
  const [isImportSellerOpen, setIsImportSellerOpen] = useState(false);
  const [productImportRows, setProductImportRows] = useState<Record<string, string>[]>([]);
  const [productImportFileName, setProductImportFileName] = useState('');
  const [productImportLoading, setProductImportLoading] = useState(false);
  const [productImportMessage, setProductImportMessage] = useState('');
  const [productImportError, setProductImportError] = useState('');
  const [productUsdRate, setProductUsdRate] = useState<number>(85.0);
  const [autoConvertCurrency, setAutoConvertCurrency] = useState<boolean>(true);

  const [sellerImportRows, setSellerImportRows] = useState<Record<string, string>[]>([]);
  const [sellerImportFileName, setSellerImportFileName] = useState('');
  const [sellerImportLoading, setSellerImportLoading] = useState(false);
  const [sellerImportMessage, setSellerImportMessage] = useState('');
  const [sellerImportError, setSellerImportError] = useState('');
  const [isAssigningSellers, setIsAssigningSellers] = useState(false);

  // Sellers Search & Filter States
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null);
  const [sellerSearchQuery, setSellerSearchQuery] = useState('');
  const [sellerCategoryFilter, setSellerCategoryFilter] = useState('All');
  const [adminSellersPage, setAdminSellersPage] = useState(1);
  const [adminSellersLimit, setAdminSellersLimit] = useState(25);

  // Add Seller Form State
  const [newSellerName, setNewSellerName] = useState('');
  const [newSellerMainCategory, setNewSellerMainCategory] = useState('');
  const [newSellerLocation, setNewSellerLocation] = useState('');
  const [newSellerPhone, setNewSellerPhone] = useState('');
  const [newSellerEmail, setNewSellerEmail] = useState('');
  const [newSellerGst, setNewSellerGst] = useState('');
  const [newSellerContactPerson, setNewSellerContactPerson] = useState('');
  const [newSellerNature, setNewSellerNature] = useState('Wholesale Supplier & Manufacturer');
  const [newSellerTrustScore, setNewSellerTrustScore] = useState('Verified TrustSEAL');
  const [newSellerRating, setNewSellerRating] = useState('4.8');
  const [newSellerResponseTime, setNewSellerResponseTime] = useState('< 2 Hours');

  // Edit Seller Form State
  const [editSellerName, setEditSellerName] = useState('');
  const [editSellerMainCategory, setEditSellerMainCategory] = useState('');
  const [editSellerLocation, setEditSellerLocation] = useState('');
  const [editSellerPhone, setEditSellerPhone] = useState('');
  const [editSellerEmail, setEditSellerEmail] = useState('');
  const [editSellerGst, setEditSellerGst] = useState('');
  const [editSellerContactPerson, setEditSellerContactPerson] = useState('');
  const [editSellerNature, setEditSellerNature] = useState('Verified Supplier');
  const [editSellerTrustScore, setEditSellerTrustScore] = useState('Verified TrustSEAL');
  const [editSellerStatus, setEditSellerStatus] = useState('Active');

  // Product Seller assignment states for Add Product
  const [newProdSellerId, setNewProdSellerId] = useState('');
  const [newProdSellerName, setNewProdSellerName] = useState('');
  const [newProdSellerLocation, setNewProdSellerLocation] = useState('');

  // Product Seller assignment states for Edit Product
  const [editProdSellerId, setEditProdSellerId] = useState('');
  const [editProdSellerName, setEditProdSellerName] = useState('');
  const [editProdSellerLocation, setEditProdSellerLocation] = useState('');

  // Blogs States
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);

  // Active form state for blogs
  const [blogTitle, setBlogTitle] = useState('');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogCoverImage, setBlogCoverImage] = useState('https://ik.imagekit.io/zp0tch54w/RHST/wmremove-transformed.png');
  const [blogStatus, setBlogStatus] = useState<'Published' | 'Draft' | 'Scheduled'>('Draft');
  const [blogFeatured, setBlogFeatured] = useState(false);
  const [blogCategory, setBlogCategory] = useState('Laptops & Computers');
  const [blogTags, setBlogTags] = useState('Tech, Tips, Gadgets');
  const [blogSortOrder, setBlogSortOrder] = useState(0);
  const [blogAuthorName, setBlogAuthorName] = useState('Admin Team');
  const [blogAuthorPhoto, setBlogAuthorPhoto] = useState('');
  const [blogAuthorDesignation, setBlogAuthorDesignation] = useState('Blog Panel Writer');
  const [blogAuthorBio, setBlogAuthorBio] = useState('Short bio...');
  const [blogBlocks, setBlogBlocks] = useState<any[]>([]);

  // Orders filtering & actions local states
  const [ordersSearchQuery, setOrdersSearchQuery] = useState('');
  const [ordersStatusFilter, setOrdersStatusFilter] = useState<'All' | 'Pending' | 'Shipped' | 'Completed' | 'Cancelled'>('All');
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState<Order | null>(null);
  const [updatingOrderStatus, setUpdatingOrderStatus] = useState<'Pending' | 'Shipped' | 'Completed' | 'Cancelled'>('Pending');
  const [updatingOrderPaymentStatus, setUpdatingOrderPaymentStatus] = useState<'PENDING' | 'COMPLETED'>('PENDING');
  const [viewingCustomer, setViewingCustomer] = useState<any | null>(null);

  // Queries modal local states
  const [modalStatus, setModalStatus] = useState<'Pending' | 'In Progress' | 'Resolved'>('Pending');
  const [modalNotes, setModalNotes] = useState('');

  // Activity Logs filtering states
  const [logsSearchQuery, setLogsSearchQuery] = useState('');
  const [logsAdminFilter, setLogsAdminFilter] = useState('All');
  const [logsModuleFilter, setLogsModuleFilter] = useState('All');
  const [logsActionFilter, setLogsActionFilter] = useState('All');
  const [logsStartDate, setLogsStartDate] = useState('');
  const [logsEndDate, setLogsEndDate] = useState('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Add Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatImage, setNewCatImage] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatParentGroup, setNewCatParentGroup] = useState('None');
  const [newCatDescription, setNewCatDescription] = useState('');

  // Add Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdStock, setNewProdStock] = useState('10');
  const [newProdStatus, setNewProdStatus] = useState<'PUBLISHED' | 'DRAFT'>('PUBLISHED');
  const [newProdSlug, setNewProdSlug] = useState('');
  const [newProdDescription, setNewProdDescription] = useState('');
  const [newProdMrp, setNewProdMrp] = useState('');
  const [newProdDiscount, setNewProdDiscount] = useState('0');
  const [newProdFeatured, setNewProdFeatured] = useState(false);
  const [newProdOnOffer, setNewProdOnOffer] = useState(false);
  const [newProdWarranty, setNewProdWarranty] = useState('0');
  const [newProdLowStockThreshold, setNewProdLowStockThreshold] = useState('10');

  // Add Coupon Form State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponActive, setNewCouponActive] = useState(true);
  const [newCouponMinPurchase, setNewCouponMinPurchase] = useState('0');
  const [newCouponUsageLimit, setNewCouponUsageLimit] = useState('100');
  const [newCouponExpiryDate, setNewCouponExpiryDate] = useState('');

  // Promo Banner Form States
  const [promoBadgeText, setPromoBadgeText] = useState('⚡ Limited Time Offer');
  const [promoTitle, setPromoTitle] = useState('Summer Gaming Upgrade Sale');
  const [promoDescription, setPromoDescription] = useState('Get up to 40% off on all RTX 40-series graphics cards and premium gaming peripherals.');
  const [promoButtonText, setPromoButtonText] = useState('Shop the Sale');
  const [promoButtonLink, setPromoButtonLink] = useState('/shop');
  const [promoImageUrl, setPromoImageUrl] = useState('https://images.unsplash.com/photo-15872023775-e29f172b9d7a');
  const [promoExpiryDate, setPromoExpiryDate] = useState('2026-05-27T07:58');
  const [promoIsActive, setPromoIsActive] = useState(true);
  const [isSavingPromo, setIsSavingPromo] = useState(false);

  // Validation error states
  const [productMrpError, setProductMrpError] = useState('');
  const [productDiscountError, setProductDiscountError] = useState('');
  const [couponDiscountError, setCouponDiscountError] = useState('');
  const [couponMinPurchaseError, setCouponMinPurchaseError] = useState('');
  const [couponExpiryDateError, setCouponExpiryDateError] = useState('');

  // Admin Credentials Update Form State
  const [currentAdminUsername, setCurrentAdminUsername] = useState('admin');
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [credMessage, setCredMessage] = useState('');
  const [credError, setCredError] = useState('');

  // Admin Manager State
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  // Add Admin Form
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPwd, setNewAdminPwd] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('PRODUCT MANAGER');
  const [adminFormError, setAdminFormError] = useState('');
  const [newAdminFullName, setNewAdminFullName] = useState('');
  const [newAdminActive, setNewAdminActive] = useState(true);
  const [newAdminPermissions, setNewAdminPermissions] = useState<AdminPermissions>(defaultAdminPermissions());
  // Edit Admin Form
  const [editAdminUsername, setEditAdminUsername] = useState('');
  const [editAdminEmail, setEditAdminEmail] = useState('');
  const [editAdminPwd, setEditAdminPwd] = useState('');
  const [editAdminRole, setEditAdminRole] = useState('');
  const [editAdminStatus, setEditAdminStatus] = useState('');
  const [editAdminError, setEditAdminError] = useState('');

  // Edit Category Modal States
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatImage, setEditCatImage] = useState('');
  const [editCatSlug, setEditCatSlug] = useState('');
  const [editCatParentGroup, setEditCatParentGroup] = useState('None');
  const [editCatDescription, setEditCatDescription] = useState('');
  const [editCatStatus, setEditCatStatus] = useState('Visible');

  // Add Brand Form State
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandSlug, setNewBrandSlug] = useState('');
  const [newBrandDescription, setNewBrandDescription] = useState('');
  const [newBrandImage, setNewBrandImage] = useState('');

  // Edit Brand Modal States
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [editBrandName, setEditBrandName] = useState('');
  const [editBrandSlug, setEditBrandSlug] = useState('');
  const [editBrandDescription, setEditBrandDescription] = useState('');
  const [editBrandImage, setEditBrandImage] = useState('');
  const [editBrandStatus, setEditBrandStatus] = useState('Visible');

  // Edit Product Modal States
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editProdName, setEditProdName] = useState('');
  const [editProdSlug, setEditProdSlug] = useState('');
  const [editProdImage, setEditProdImage] = useState('');
  const [editProdCategory, setEditProdCategory] = useState('');
  const [editProdBrand, setEditProdBrand] = useState('');
  const [editProdSku, setEditProdSku] = useState('');
  const [editProdStock, setEditProdStock] = useState('10');
  const [editProdStatus, setEditProdStatus] = useState<'PUBLISHED' | 'DRAFT'>('PUBLISHED');
  const [editProdDescription, setEditProdDescription] = useState('');
  const [editProdMrp, setEditProdMrp] = useState('');
  const [editProdDiscount, setEditProdDiscount] = useState('0');
  const [editProdFeatured, setEditProdFeatured] = useState(false);
  const [editProdOnOffer, setEditProdOnOffer] = useState(false);
  const [editProdWarranty, setEditProdWarranty] = useState('0');
  const [editProdLowStockThreshold, setEditProdLowStockThreshold] = useState('10');

  // Settings Form State
  const [shopName, setShopName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [taxRate, setTaxRate] = useState('18');
  const [shopHours, setShopHours] = useState('');
  const [settingsMessage, setSettingsMessage] = useState('');
  const [themeColor, setThemeColor] = useState('cyan');
  const [darkMode, setDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Check login on mount
  useEffect(() => {
    const isSavedLogin = sessionStorage.getItem('admin_session');
    if (isSavedLogin === 'true') {
      setTimeout(() => setIsLoggedIn(true), 0);
    }
    const savedTab = sessionStorage.getItem('admin_active_tab');
    if (savedTab) {
      setActiveTab(savedTab as any);
    }
  }, []);

  // Sync activeTab changes to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('admin_active_tab', activeTab);
  }, [activeTab]);

  // Lock body scroll when any admin modal is open to prevent background scrolling/bleeding
  useEffect(() => {
    const isAnyModalOpen =
      isAddCategoryOpen ||
      isAddBrandOpen ||
      isAddProductOpen ||
      isAddSellerOpen ||
      isImportProductOpen ||
      isImportSellerOpen ||
      editingSeller !== null ||
      isAddCouponOpen ||
      isBlogModalOpen ||
      isUpdateStatusModalOpen ||
      isAddAdminOpen;

    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [
    isAddCategoryOpen,
    isAddBrandOpen,
    isAddProductOpen,
    isAddSellerOpen,
    isImportProductOpen,
    isImportSellerOpen,
    editingSeller,
    isAddCouponOpen,
    isBlogModalOpen,
    isUpdateStatusModalOpen,
    isAddAdminOpen
  ]);

  // Apply theme color to CSS variables across the whole admin panel
  useEffect(() => {
    const PALETTE: Record<string, { primary: string; hover: string; light: string }> = {
      blue: { primary: '#3b82f6', hover: '#2563eb', light: '#eff6ff' },
      emerald: { primary: '#10b981', hover: '#059669', light: '#ecfdf5' },
      violet: { primary: '#8b5cf6', hover: '#7c3aed', light: '#f5f3ff' },
      rose: { primary: '#f43f5e', hover: '#e11d48', light: '#fff1f2' },
      amber: { primary: '#f59e0b', hover: '#d97706', light: '#fffbeb' },
      orange: { primary: '#f97316', hover: '#ea580c', light: '#fff7ed' },
      indigo: { primary: '#4f46e5', hover: '#4338ca', light: '#eef2ff' },
      cyan: { primary: '#06b6d4', hover: '#0891b2', light: '#ecfeff' },
      teal: { primary: '#0d9488', hover: '#0f766e', light: '#f0fdfa' },
      pink: { primary: '#ec4899', hover: '#db2777', light: '#fdf2f8' },
      lime: { primary: '#84cc16', hover: '#65a30d', light: '#f7fee7' },
      slate: { primary: '#64748b', hover: '#475569', light: '#f8fafc' },
    };
    const chosen = PALETTE[themeColor] || PALETTE['cyan'];
    const root = document.documentElement;
    root.style.setProperty('--primary', chosen.primary);
    root.style.setProperty('--primary-hover', chosen.hover);
    root.style.setProperty('--primary-light', chosen.light);
  }, [themeColor]);



  // Real-time validation for product fields
  useEffect(() => {
    if (newProdMrp) {
      const val = Number(newProdMrp);
      if (val < 0) {
        setProductMrpError('MRP cannot be negative.');
      } else {
        setProductMrpError('');
      }
    } else {
      setProductMrpError('');
    }
  }, [newProdMrp]);

  useEffect(() => {
    if (newProdDiscount) {
      const val = Number(newProdDiscount);
      if (val < 0 || val > 100) {
        setProductDiscountError('Discount percentage must be between 0% and 100%.');
      } else {
        setProductDiscountError('');
      }
    } else {
      setProductDiscountError('');
    }
  }, [newProdDiscount]);

  // Real-time validation for coupon fields
  useEffect(() => {
    const discountVal = Number(newCouponDiscount) || 0;
    const minPurchaseVal = Number(newCouponMinPurchase) || 0;

    if (newCouponDiscount) {
      if (discountVal < 0) {
        setCouponDiscountError('Discount value cannot be negative.');
      } else if (newCouponType === 'percentage' && discountVal > 100) {
        setCouponDiscountError('Percentage discount cannot be greater than 100%.');
      } else {
        setCouponDiscountError('');
      }
    } else {
      setCouponDiscountError('');
    }

    if (newCouponType === 'fixed' && newCouponMinPurchase && newCouponDiscount) {
      if (minPurchaseVal < discountVal) {
        setCouponMinPurchaseError('Minimum purchase cannot be less than the fixed discount amount.');
      } else {
        setCouponMinPurchaseError('');
      }
    } else {
      setCouponMinPurchaseError('');
    }
  }, [newCouponDiscount, newCouponMinPurchase, newCouponType]);

  useEffect(() => {
    if (newCouponExpiryDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expiry = new Date(newCouponExpiryDate);
      if (expiry < today) {
        setCouponExpiryDateError('Expiry date cannot be in the past.');
      } else {
        setCouponExpiryDateError('');
      }
    } else {
      setCouponExpiryDateError('');
    }
  }, [newCouponExpiryDate]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchSubmissions(),
        fetchOrders(),
        fetchAdminCategories(),
        fetchAdminBrands(),
        fetchAdminProducts(),
        fetchAdminSellers(),
        fetchCoupons(),
        fetchLogs(),
        fetchSettings(),
        fetchAdmins(),
        fetchBlogs(),
        fetchPromoBanner()
      ]);
    } catch (e) {
      console.error('Error fetching dashboard listings', e);
    } finally {
      setLoading(false);
    }
  };
  // Fetch all data lists on login or tab switch
  useEffect(() => {
    if (isLoggedIn) {
      fetchAllData();
    }
  }, [isLoggedIn]);

  const fetchSubmissions = async () => {
    const res = await fetch('/api/admin/submissions');
    const data = await res.json();
    if (data.success) setSubmissions(data.submissions.reverse());
  };

  const fetchOrders = async () => {
    const res = await fetch('/api/admin/orders');
    const data = await res.json();
    if (data.success) setOrders(data.orders.reverse());
  };

  const fetchAdminCategories = async () => {
    const res = await fetch('/api/admin/categories');
    const data = await res.json();
    if (data.success) setCategories(data.categories);
  };

  const fetchAdminBrands = async () => {
    const res = await fetch('/api/admin/brands');
    const data = await res.json();
    if (data.success) setBrands(data.brands);
  };

  const fetchAdminProducts = async (page = 1, limit = 25, search = '', category = 'All') => {
    setAdminProductsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(limit));
      if (search.trim()) params.set('search', search.trim());
      if (category && category !== 'All') params.set('category', category);

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.products) {
        setAdminProducts(data.products);
        if (data.pagination) {
          setAdminProductsTotal(data.pagination.total);
          setAdminProductsTotalPages(data.pagination.totalPages);
          setAdminProductsPage(data.pagination.page);
        } else {
          setAdminProductsTotal(data.products.length);
          setAdminProductsTotalPages(1);
          setAdminProductsPage(1);
        }
      }
    } catch (e) {
      console.error('Error fetching admin products:', e);
    } finally {
      setAdminProductsLoading(false);
    }
  };

  const fetchAdminSellers = async () => {
    try {
      const res = await fetch('/api/admin/sellers');
      const data = await res.json();
      if (data.success) setSellers(data.sellers);
    } catch (e) {
      console.error('Error fetching admin sellers:', e);
    }
  };

  const fetchCoupons = async () => {
    const res = await fetch('/api/admin/coupons');
    const data = await res.json();
    if (data.success) setCoupons(data.coupons);
  };

  const fetchPromoBanner = async () => {
    try {
      const res = await fetch('/api/admin/promo-banner');
      const data = await res.json();
      if (data.success && data.banner) {
        setPromoBadgeText(data.banner.badgeText || '');
        setPromoTitle(data.banner.title || '');
        setPromoDescription(data.banner.description || '');
        setPromoButtonText(data.banner.buttonText || '');
        setPromoButtonLink(data.banner.buttonLink || '');
        setPromoImageUrl(data.banner.imageUrl || '');
        if (data.banner.expiryDate) {
          const date = new Date(data.banner.expiryDate);
          const tzOffset = date.getTimezoneOffset() * 60000;
          const localISOTime = (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 16);
          setPromoExpiryDate(localISOTime);
        } else {
          setPromoExpiryDate('');
        }
        setPromoIsActive(data.banner.isActive !== false);
      }
    } catch (err) {
      console.error('Error fetching promo banner:', err);
    }
  };

  const handleSavePromoBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPromo(true);
    try {
      const expiryUTC = promoExpiryDate ? new Date(promoExpiryDate).toISOString() : '';
      const res = await fetch('/api/admin/promo-banner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          badgeText: promoBadgeText,
          title: promoTitle,
          description: promoDescription,
          buttonText: promoButtonText,
          buttonLink: promoButtonLink,
          imageUrl: promoImageUrl,
          expiryDate: expiryUTC,
          isActive: promoIsActive
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Promo banner changes saved successfully!');
        fetchLogs();
      } else {
        alert(data.error || 'Failed to save changes.');
      }
    } catch (err) {
      console.error('Error saving promo banner:', err);
      alert('An error occurred while saving.');
    } finally {
      setIsSavingPromo(false);
    }
  };

  const fetchBlogs = async () => {
    const res = await fetch('/api/admin/blogs');
    const data = await res.json();
    if (data.success) setBlogs(data.blogs);
  };

  const fetchLogs = async () => {
    const res = await fetch('/api/admin/activity-logs');
    const data = await res.json();
    if (data.success) setLogs(data.logs);
  };

  const fetchSettings = async () => {
    const res = await fetch('/api/admin/settings');
    const data = await res.json();
    if (data.success && data.settings) {
      setSettings(data.settings);
      setShopName(data.settings.shopName);
      setContactEmail(data.settings.contactEmail);
      setContactPhone(data.settings.contactPhone);
      setContactAddress(data.settings.contactAddress);
      setTaxRate(data.settings.taxRate);
      setShopHours(data.settings.shopHours);
    }
  };

  const fetchAdmins = async () => {
    try {
      const res = await fetch('/api/admin/manager');
      const data = await res.json();
      if (data.success) setAdminUsers(data.admins);
    } catch (e) {
      console.error('Error fetching admins', e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (data.success) {
        setIsLoggedIn(true);
        sessionStorage.setItem('admin_session', 'true');
        setCurrentAdminUsername(username);
      } else {
        setLoginError(data.error || 'Invalid credentials.');
      }
    } catch (e) {
      setLoginError('Error logging in.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    sessionStorage.removeItem('admin_session');
    sessionStorage.removeItem('admin_active_tab');
  };

  const handleUpdateSubmissionStatus = async (id: string, status: 'Pending' | 'In Progress' | 'Resolved') => {
    try {
      const res = await fetch('/api/admin/submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();
      if (data.success) {
        setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
        fetchLogs();
      } else {
        alert(data.error || 'Failed to update query status.');
      }
    } catch (e) {
      alert('Error updating status.');
    }
  };

  const handleSaveSubmissionDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;
    try {
      const res = await fetch('/api/admin/submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedSubmission.id,
          status: modalStatus,
          notes: modalNotes
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmissions(prev => prev.map(s => s.id === selectedSubmission.id ? { ...s, status: modalStatus, notes: modalNotes } : s));
        setSelectedSubmission(null);
        fetchLogs();
      } else {
        alert(data.error || 'Failed to save query resolution details.');
      }
    } catch (e) {
      alert('Error saving details.');
    }
  };

  // Delete Handlers
  const handleDeleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this query?')) return;
    try {
      const res = await fetch(`/api/admin/submissions?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSubmissions(prev => prev.filter(item => item.id !== id));
        fetchLogs();
      }
    } catch (e) {
      alert('Error deleting submission');
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.filter(item => item.id !== id));
        fetchLogs();
      }
    } catch (e) {
      alert('Error deleting order');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? This might affect products under this category.')) return;
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCategories(prev => prev.filter(item => item.id !== id));
        fetchLogs();
      } else {
        alert(data.error || 'Failed to delete category');
      }
    } catch (e) {
      alert('Network error deleting category');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAdminProducts(prev => prev.filter(item => item.id !== id));
        fetchLogs();
      }
    } catch (e) {
      alert('Error deleting product');
    }
  };

  const handleDeleteSeller = async (id: string, name?: string) => {
    if (!confirm(`Are you sure you want to delete supplier "${name || 'this supplier'}"? Any products assigned to this supplier will have their supplier detached.`)) return;
    try {
      const res = await fetch(`/api/admin/sellers?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSellers(prev => prev.filter(item => item.id !== id));
        fetchLogs();
      } else {
        alert(data.error || 'Failed to delete seller');
      }
    } catch (e) {
      alert('Error deleting seller');
    }
  };



  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon code?')) return;
    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCoupons(prev => prev.filter(item => item.id !== id));
        fetchLogs();
      }
    } catch (e) {
      alert('Error deleting coupon');
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const res = await fetch(`/api/admin/blogs?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setBlogs(prev => prev.filter(item => item.id !== id));
        fetchLogs();
      } else {
        alert(data.error || 'Error deleting blog post');
      }
    } catch (e) {
      alert('Error deleting blog post');
    }
  };

  const resetBlogForm = (blogToEdit?: any) => {
    if (blogToEdit) {
      setEditingBlog(blogToEdit);
      setBlogTitle(blogToEdit.title || '');
      setBlogExcerpt(blogToEdit.excerpt || '');
      setBlogCoverImage(blogToEdit.image || 'https://ik.imagekit.io/zp0tch54w/RHST/wmremove-transformed.png');
      setBlogStatus(blogToEdit.status || 'Draft');
      setBlogFeatured(blogToEdit.featured || false);
      setBlogCategory(blogToEdit.category || 'Laptops & Computers');
      setBlogTags(blogToEdit.tags || 'Tech, Tips, Gadgets');
      setBlogSortOrder(blogToEdit.sortOrder || 0);
      setBlogAuthorName(blogToEdit.authorName || 'Admin Team');
      setBlogAuthorPhoto(blogToEdit.authorPhoto || '');
      setBlogAuthorDesignation(blogToEdit.authorDesignation || 'Blog Panel Writer');
      setBlogAuthorBio(blogToEdit.authorBio || 'Short bio...');
      setBlogBlocks(blogToEdit.blocks || []);
    } else {
      setEditingBlog(null);
      setBlogTitle('');
      setBlogExcerpt('');
      setBlogCoverImage('https://ik.imagekit.io/zp0tch54w/RHST/wmremove-transformed.png');
      setBlogStatus('Draft');
      setBlogFeatured(false);
      setBlogCategory('Laptops & Computers');
      setBlogTags('Tech, Tips, Gadgets');
      setBlogSortOrder(0);
      setBlogAuthorName('Admin Team');
      setBlogAuthorPhoto('');
      setBlogAuthorDesignation('Blog Panel Writer');
      setBlogAuthorBio('Short bio...');
      setBlogBlocks([
        { id: 'block-' + Date.now(), type: 'paragraph', text: '' }
      ]);
    }
  };

  const handleEditBlog = (blog: any) => {
    resetBlogForm(blog);
    setIsBlogModalOpen(true);
  };

  const handleCreateBlog = () => {
    resetBlogForm();
    setIsBlogModalOpen(true);
  };

  const addBlock = (type: string) => {
    const id = 'block-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    let newBlock: any = { id, type };
    if (type === 'paragraph' || type === 'heading' || type === 'subheading' || type === 'blockquote') {
      newBlock.text = '';
    } else if (type === 'bulletList' || type === 'numberedList') {
      newBlock.items = [''];
    } else if (type === 'callout') {
      newBlock.image = '';
      newBlock.title = '';
      newBlock.subtitle = '';
      newBlock.description = '';
    } else if (type === 'image' || type === 'video') {
      newBlock.url = '';
      newBlock.alt = '';
      newBlock.caption = '';
    } else if (type === 'table') {
      newBlock.headers = ['Column 1', 'Column 2', 'Column 3'];
      newBlock.rows = [['Cell', 'Cell', 'Cell']];
    } else if (type === 'divider') {
      // empty
    }
    setBlogBlocks([...blogBlocks, newBlock]);
  };

  const removeBlock = (blockId: string) => {
    setBlogBlocks(blogBlocks.filter(b => b.id !== blockId));
  };

  const moveBlockUp = (index: number) => {
    if (index === 0) return;
    const newBlocks = [...blogBlocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index - 1];
    newBlocks[index - 1] = temp;
    setBlogBlocks(newBlocks);
  };

  const moveBlockDown = (index: number) => {
    if (index === blogBlocks.length - 1) return;
    const newBlocks = [...blogBlocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index + 1];
    newBlocks[index + 1] = temp;
    setBlogBlocks(newBlocks);
  };

  const updateBlockField = (blockId: string, field: string, value: any) => {
    setBlogBlocks(blogBlocks.map(b => {
      if (b.id === blockId) {
        return { ...b, [field]: value };
      }
      return b;
    }));
  };

  const addListItem = (blockId: string) => {
    setBlogBlocks(blogBlocks.map(b => {
      if (b.id === blockId) {
        return { ...b, items: [...(b.items || []), ''] };
      }
      return b;
    }));
  };

  const removeListItem = (blockId: string, itemIndex: number) => {
    setBlogBlocks(blogBlocks.map(b => {
      if (b.id === blockId) {
        const newItems = [...(b.items || [])];
        newItems.splice(itemIndex, 1);
        return { ...b, items: newItems };
      }
      return b;
    }));
  };

  const updateListItemText = (blockId: string, itemIndex: number, val: string) => {
    setBlogBlocks(blogBlocks.map(b => {
      if (b.id === blockId) {
        const newItems = [...(b.items || [])];
        newItems[itemIndex] = val;
        return { ...b, items: newItems };
      }
      return b;
    }));
  };

  const addTableColumn = (blockId: string) => {
    setBlogBlocks(blogBlocks.map(b => {
      if (b.id === blockId) {
        const newHeaders = [...(b.headers || []), `Column ${b.headers.length + 1}`];
        const newRows = b.rows.map((row: string[]) => [...row, 'Cell']);
        return { ...b, headers: newHeaders, rows: newRows };
      }
      return b;
    }));
  };

  const removeTableColumn = (blockId: string, colIndex: number) => {
    setBlogBlocks(blogBlocks.map(b => {
      if (b.id === blockId) {
        if (b.headers.length <= 1) return b;
        const newHeaders = [...b.headers];
        newHeaders.splice(colIndex, 1);
        const newRows = b.rows.map((row: string[]) => {
          const newRow = [...row];
          newRow.splice(colIndex, 1);
          return newRow;
        });
        return { ...b, headers: newHeaders, rows: newRows };
      }
      return b;
    }));
  };

  const addTableRow = (blockId: string) => {
    setBlogBlocks(blogBlocks.map(b => {
      if (b.id === blockId) {
        const newRow = Array(b.headers.length).fill('Cell');
        return { ...b, rows: [...b.rows, newRow] };
      }
      return b;
    }));
  };

  const removeTableRow = (blockId: string, rowIndex: number) => {
    setBlogBlocks(blogBlocks.map(b => {
      if (b.id === blockId) {
        if (b.rows.length <= 1) return b;
        const newRows = [...b.rows];
        newRows.splice(rowIndex, 1);
        return { ...b, rows: newRows };
      }
      return b;
    }));
  };

  const updateTableCellText = (blockId: string, rowIndex: number, colIndex: number, val: string) => {
    setBlogBlocks(blogBlocks.map(b => {
      if (b.id === blockId) {
        const newRows = b.rows.map((row: string[], rIdx: number) => {
          if (rIdx === rowIndex) {
            const newRow = [...row];
            newRow[colIndex] = val;
            return newRow;
          }
          return row;
        });
        return { ...b, rows: newRows };
      }
      return b;
    }));
  };

  const updateTableHeaderText = (blockId: string, colIndex: number, val: string) => {
    setBlogBlocks(blogBlocks.map(b => {
      if (b.id === blockId) {
        const newHeaders = [...b.headers];
        newHeaders[colIndex] = val;
        return { ...b, headers: newHeaders };
      }
      return b;
    }));
  };

  const handleSubmitBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim()) {
      alert('Blog title is required.');
      return;
    }

    const blogData = {
      title: blogTitle,
      excerpt: blogExcerpt,
      image: blogCoverImage,
      status: blogStatus,
      featured: blogFeatured,
      category: blogCategory,
      tags: blogTags,
      sortOrder: Number(blogSortOrder),
      authorPhoto: blogAuthorPhoto,
      authorName: blogAuthorName,
      authorDesignation: blogAuthorDesignation,
      authorBio: blogAuthorBio,
      blocks: blogBlocks
    };

    try {
      if (editingBlog) {
        const res = await fetch('/api/admin/blogs', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingBlog.id, ...blogData })
        });
        const data = await res.json();
        if (data.success) {
          setBlogs(prev => prev.map(b => b.id === editingBlog.id ? data.blog : b));
          setIsBlogModalOpen(false);
          setEditingBlog(null);
          fetchLogs();
        } else {
          alert(data.error || 'Error updating blog post');
        }
      } else {
        const res = await fetch('/api/admin/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(blogData)
        });
        const data = await res.json();
        if (data.success) {
          setBlogs(prev => [data.blog, ...prev]);
          setIsBlogModalOpen(false);
          fetchLogs();
        } else {
          alert(data.error || 'Error creating blog post');
        }
      }
    } catch (error) {
      console.error(error);
      alert('Error saving blog post');
    }
  };

  const handleUpdateOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatingOrder) return;
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: updatingOrder.orderId,
          status: updatingOrderStatus,
          paymentStatus: updatingOrderPaymentStatus
        })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.orderId === updatingOrder.orderId ? { ...o, status: updatingOrderStatus, paymentStatus: updatingOrderPaymentStatus } : o));
        setIsUpdateStatusModalOpen(false);
        setUpdatingOrder(null);
        fetchLogs();
      } else {
        alert(data.error || 'Failed to update order status');
      }
    } catch (err) {
      alert('Error updating order status');
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) {
      alert('No orders to export.');
      return;
    }
    const headers = ['Order ID', 'Customer Name', 'Customer Email', 'Customer Phone', 'Date', 'Subtotal', 'Discount Applied', 'Status', 'Payment Status'];
    const rows = filteredOrdersList.map(o => [
      o.orderId,
      o.customer?.name || 'Guest',
      o.customer?.email || '',
      o.customer?.phone || '',
      new Date(o.createdAt).toLocaleDateString(),
      o.subtotal,
      o.discountApplied || 0,
      o.status,
      o.paymentStatus
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCustomersCSV = () => {
    if (customersList.length === 0) {
      alert('No customers to export.');
      return;
    }
    const headers = ['Customer Name', 'Customer Email', 'Customer Phone', 'Joined Date', 'Orders Placed', 'Total Spent'];
    const rows = filteredCustomers.map(c => [
      c.name,
      c.email,
      c.phone || '',
      c.joinedDate ? new Date(c.joinedDate).toLocaleDateString() : '',
      c.ordersCount,
      c.totalSpent
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `customers_export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Robust RFC 4180 CSV Parser (preserves commas and newlines inside quoted fields)
  const parseCSV = (text: string): Record<string, string>[] => {
    if (!text || !text.trim()) return [];

    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentVal = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentVal += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        currentRow.push(currentVal.trim());
        currentVal = '';
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') i++;
        currentRow.push(currentVal.trim());
        currentVal = '';
        if (currentRow.some(c => c !== '')) {
          rows.push(currentRow);
        }
        currentRow = [];
      } else {
        currentVal += char;
      }
    }

    if (currentVal || currentRow.length > 0) {
      currentRow.push(currentVal.trim());
      if (currentRow.some(c => c !== '')) {
        rows.push(currentRow);
      }
    }

    if (rows.length < 2) return [];

    const headers = rows[0].map(h => h.replace(/^["\xEF\xBB\xBF\uFEFF]+|["]+$/g, '').trim());
    const result: Record<string, string>[] = [];

    for (let r = 1; r < rows.length; r++) {
      const rowVals = rows[r];
      if (rowVals.every(v => v === '')) continue;
      const rowObj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        rowObj[h] = rowVals[idx] !== undefined ? rowVals[idx] : '';
      });
      result.push(rowObj);
    }

    return result;
  };

  // Products CSV Export
  const handleExportProductsCSV = async () => {
    try {
      const res = await fetch('/api/admin/products?export=true');
      const data = await res.json();
      if (!data.success || !data.products || data.products.length === 0) {
        alert('No products to export.');
        return;
      }
      const headers = [
        'Product ID',
        'Name',
        'SKU',
        'Category',
        'Brand',
        'Price',
        'Stock',
        'Supplier',
        'Seller Location',
        'Status'
      ];
      const rows = data.products.map((p: any) => [
        p.id || '',
        p.name || '',
        p.sku || '',
        p.category || '',
        p.brand || '',
        p.price || '',
        p.stock !== undefined ? p.stock : 0,
        p.sellerName || '',
        p.sellerLocation || '',
        p.status || 'PUBLISHED'
      ]);
      const csvContent = [headers.join(','), ...rows.map((r: any[]) => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `products_export_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      alert('Failed to export products.');
    }
  };

  // Sellers CSV Export
  const handleExportSellersCSV = () => {
    if (filteredSellers.length === 0) {
      alert('No sellers to export.');
      return;
    }
    const headers = [
      'Company Name',
      'Main Category',
      'Location',
      'GST Number',
      'Contact Person',
      'Phone',
      'Email',
      'Nature of Business',
      'Trust Score',
      'Rating',
      'Response Time',
      'Status'
    ];
    const rows = filteredSellers.map(s => [
      s.name,
      s.mainCategory,
      s.location,
      s.gstNumber || '',
      s.contactPerson || '',
      s.phone || '',
      s.email || '',
      s.natureOfBusiness || '',
      s.trustScore || '',
      s.rating || 5,
      s.responseTime || '< 2 Hours',
      s.status || 'Active'
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sellers_export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sample CSV Templates
  const handleDownloadProductSampleCSV = () => {
    const headers = [
      'Product Name',
      'Category',
      'Brand',
      'MRP',
      'Discount (%)',
      'Stock',
      'SKU',
      'Status',
      'Supplier',
      'Seller Location',
      'Seller GST',
      'Image URL',
      'Description'
    ];
    const sampleRows = [
      [
        'Logitech MX Master 3S Wireless Mouse',
        'Keyboard & Mouse',
        'Logitech',
        8995,
        15,
        25,
        'SKU-LOGI-MX3S',
        'PUBLISHED',
        'Apex Tech Systems Pvt Ltd',
        'Jaipur, Rajasthan',
        '08AABCA1234F1Z1',
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46',
        'Quiet clicks 8K DPI any-surface tracking ergonomics.'
      ],
      [
        'Women Embroidered Cotton Kurti',
        "Women's",
        'KalaNiketan',
        1899,
        20,
        50,
        'SKU-W-KURTI-01',
        'PUBLISHED',
        'KalaNiketan Apparels & Textiles Pvt Ltd',
        'Surat, Gujarat',
        '24AAPCK1029F1Z2',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b',
        'Pure cotton designer kurti for festive and casual wear.'
      ]
    ];
    const csvContent = [headers.join(','), ...sampleRows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'sample_products_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadKaggleSampleCSV = () => {
    const headers = [
      'prices.amountMin',
      'prices.availability',
      'prices.condition',
      'prices.currency',
      'prices.dateSeen',
      'prices.isSale',
      'prices.merchant',
      'prices.shipping',
      'prices.sourceURLs',
      'asins',
      'brand',
      'categories',
      'dateAdded',
      'dateUpdated',
      'ean',
      'imageURLs',
      'keys',
      'manufacturer',
      'manufacturerNumber',
      'name',
      'primaryCategories',
      'sourceURLs',
      'upc',
      'weight'
    ];
    const sampleRows = [
      [
        '104.80',
        'Yes',
        'New',
        'USD',
        '2023-09-08T06:50:00Z',
        'FALSE',
        'Best Buy',
        'Free Shipping',
        'https://example.com/sandisk',
        'B00C20LO99',
        'SanDisk',
        'Electronics, Storage Devices, Memory Cards',
        '2023-01-01T00:00:00Z',
        '2023-06-01T00:00:00Z',
        '0619659134013',
        'https://images-na.ssl-images-amazon.com/images/I/71oVh2UO8xL._SL1500_.jpg',
        'sandisk/sdsqunc064gan6ia',
        'SanDisk',
        'SDSQUNC-064G-AN6IA',
        'SanDisk Ultra 64GB microSDXC UHS-I Card with Adapter',
        'Electronics',
        'https://example.com/sandisk-ultra',
        '619659134013',
        '1.6 ounces'
      ]
    ];
    const csvContent = [headers.join(','), ...sampleRows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'kaggle_electronic_products_sample.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSellerSampleCSV = () => {
    const headers = [
      'Company Name',
      'Main Category',
      'Location',
      'Phone',
      'Email',
      'GST Number',
      'Contact Person',
      'Nature of Business',
      'Trust Score',
      'Rating',
      'Response Time',
      'Status'
    ];
    const sampleRows = [
      [
        'Apex Tech Systems Pvt Ltd',
        'Laptops & Computers',
        'Jaipur, Rajasthan',
        '+91 98290 12345',
        'sales@apextechsystems.in',
        '08AABCA1234F1Z1',
        'Rajesh Sharma',
        'Wholesale Supplier & Manufacturer',
        'Verified TrustSEAL',
        4.9,
        '< 1 Hour',
        'Active'
      ],
      [
        'KalaNiketan Apparels & Textiles Pvt Ltd',
        "Women's",
        'Surat, Gujarat',
        '+91 98251 44556',
        'sales@kalaniketanapparels.in',
        '24AAPCK1029F1Z2',
        'Pravinbhai Patel',
        'Manufacturer & Direct Exporter',
        'Verified TrustSEAL',
        4.9,
        '< 2 Hours',
        'Active'
      ]
    ];
    const csvContent = [headers.join(','), ...sampleRows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'sample_sellers_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Products Import File Handler
  const handleProductCsvFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProductImportFileName(file.name);
    setProductImportError('');
    setProductImportMessage('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const rows = parseCSV(text);
        if (rows.length === 0) {
          setProductImportError('The selected file appears to be empty or has an invalid CSV format.');
          setProductImportRows([]);
        } else {
          setProductImportRows(rows);
        }
      } catch (err: any) {
        setProductImportError('Failed to parse CSV file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  // Execute Products Import
  const handleExecuteProductImport = async () => {
    if (productImportRows.length === 0) {
      alert('Please select a valid CSV file first.');
      return;
    }
    setProductImportLoading(true);
    setProductImportError('');
    setProductImportMessage('');
    try {
      const res = await fetch('/api/admin/products/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: productImportRows,
          usdExchangeRate: autoConvertCurrency ? productUsdRate : 1.0
        })
      });
      const data = await res.json();
      if (data.success) {
        setProductImportMessage(data.message || `Successfully imported ${data.count} products!`);
        await fetchAdminProducts();
        fetchLogs();
        setTimeout(() => {
          setIsImportProductOpen(false);
          setProductImportRows([]);
          setProductImportFileName('');
          setProductImportMessage('');
        }, 1800);
      } else {
        setProductImportError(data.error || 'Failed to import products.');
      }
    } catch (err: any) {
      setProductImportError('Network error while importing products.');
    } finally {
      setProductImportLoading(false);
    }
  };

  // Sellers Import File Handler
  const handleSellerCsvFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSellerImportFileName(file.name);
    setSellerImportError('');
    setSellerImportMessage('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const rows = parseCSV(text);
        if (rows.length === 0) {
          setSellerImportError('The selected file appears to be empty or has an invalid CSV format.');
          setSellerImportRows([]);
        } else {
          setSellerImportRows(rows);
        }
      } catch (err: any) {
        setSellerImportError('Failed to parse CSV file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  // Execute Sellers Import
  const handleExecuteSellerImport = async () => {
    if (sellerImportRows.length === 0) {
      alert('Please select a valid CSV file first.');
      return;
    }
    setSellerImportLoading(true);
    setSellerImportError('');
    setSellerImportMessage('');
    try {
      const res = await fetch('/api/admin/sellers/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellers: sellerImportRows })
      });
      const data = await res.json();
      if (data.success) {
        setSellerImportMessage(data.message || `Successfully imported ${data.count} sellers!`);
        await fetchAdminSellers();
        await fetchAdminProducts();
        fetchLogs();
        setTimeout(() => {
          setIsImportSellerOpen(false);
          setSellerImportRows([]);
          setSellerImportFileName('');
          setSellerImportMessage('');
        }, 1800);
      } else {
        setSellerImportError(data.error || 'Failed to import sellers.');
      }
    } catch (err: any) {
      setSellerImportError('Network error while importing sellers.');
    } finally {
      setSellerImportLoading(false);
    }
  };

  // Assign Sellers to All Products
  const handleAssignSellersToAllProducts = async () => {
    if (!confirm('Assign verified IndiaMART suppliers to all products in your catalog?')) return;
    setIsAssigningSellers(true);
    try {
      const res = await fetch('/api/admin/sellers/assign-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceReassign: true })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || 'Successfully mapped sellers to all products!');
        await fetchAdminProducts();
        fetchLogs();
      } else {
        alert('Failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      alert('Network error while assigning sellers: ' + err.message);
    } finally {
      setIsAssigningSellers(false);
    }
  };

  const handlePrintInvoice = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocker is active. Please enable pop-ups for this site.');
      return;
    }
    const itemsHtml = order.items.map(item => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px; font-weight: 500;">${item.name}</td>
        <td style="padding: 10px; text-align: center;">${item.qty}</td>
        <td style="padding: 10px; text-align: right;">₹${item.price.toLocaleString()}</td>
        <td style="padding: 10px; text-align: right;">₹${(item.price * item.qty).toLocaleString()}</td>
      </tr>
    `).join('');
    const discountRowHtml = order.discountApplied ? `
      <tr>
        <td colspan="3" style="text-align: right; padding: 6px 10px; font-weight: 500; color: #666;">Discount (${order.couponCode || 'Promo'}):</td>
        <td style="text-align: right; padding: 6px 10px; font-weight: 600; color: #ef4444;">-₹${order.discountApplied.toLocaleString()}</td>
      </tr>
    ` : '';
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.orderId}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #333; margin: 40px; }
            .invoice-header { display: flex; justify-content: space-between; border-bottom: 2px solid #00a8b5; padding-bottom: 20px; margin-bottom: 30px; }
            .logo-section h1 { font-size: 28px; margin: 0; color: #111; text-transform: uppercase; font-weight: 800; }
            .logo-section span { color: #00a8b5; font-size: 13px; font-weight: 600; letter-spacing: 0.1em; }
            .invoice-details { text-align: right; }
            .invoice-details h2 { font-size: 24px; margin: 0 0 10px 0; color: #00a8b5; }
            .invoice-details p { margin: 2px 0; font-size: 14px; color: #666; }
            .billing-section { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .billing-section div { width: 48%; }
            .billing-section h3 { font-size: 14px; text-transform: uppercase; color: #888; margin-bottom: 10px; letter-spacing: 0.05em; }
            .billing-section p { margin: 4px 0; font-size: 15px; line-height: 1.4; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background-color: #f8fafc; border-bottom: 2px solid #e2e8f0; color: #475569; font-weight: 600; font-size: 13px; text-transform: uppercase; padding: 12px 10px; text-align: left; }
            .total-section { float: right; width: 300px; margin-top: 10px; }
            .footer { border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 50px; text-align: center; font-size: 13px; color: #888; }
            @media print {
              body { margin: 20px; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div style="display: flex; justify-content: flex-end; margin-bottom: 20px; margin-top: -20px;">
            <button onclick="window.print()" style="background-color: #00a8b5; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px;">Print Invoice</button>
          </div>
          <div class="invoice-header">
            <div class="logo-section">
              <h1>VALNQIX E-COMMERCE</h1>
              <span>VALNQIX IT ECOMMERCE PVT. LTD.</span>
            </div>
            <div class="invoice-details">
              <h2>INVOICE</h2>
              <p><strong>Invoice No:</strong> INV-${order.orderId.substring(4)}</p>
              <p><strong>Order ID:</strong> ${order.orderId}</p>
              <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div class="billing-section">
            <div>
              <h3>Sender / Supplier</h3>
              <p><strong>VALNQIX IT E-Commerce Pvt. Ltd.</strong></p>
              <p>G 52, UP, NOIDA</p>
              <p>Uttar Pradesh, India 201301</p>
              <p>Email: info@valnqix.in</p>
            </div>
            <div>
              <h3>Bill To / Ship To</h3>
              <p><strong>${order.customer?.name || 'Guest Customer'}</strong></p>
              <p>${order.customer?.address || 'N/A'}</p>
              <p>Phone: ${order.customer?.phone || 'N/A'}</p>
              <p>Email: ${order.customer?.email || 'N/A'}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th style="text-align: left;">Product Item</th>
                <th style="width: 80px; text-align: center;">Qty</th>
                <th style="width: 120px; text-align: right;">Unit Price</th>
                <th style="width: 120px; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              <tr>
                <td colspan="3" style="text-align: right; padding: 15px 10px 6px 10px; font-weight: 500; color: #666;">Subtotal:</td>
                <td style="text-align: right; padding: 15px 10px 6px 10px; font-weight: 600;">₹${(order.subtotal + (order.discountApplied || 0)).toLocaleString()}</td>
              </tr>
              ${discountRowHtml}
              <tr style="border-top: 1px solid #ddd; border-bottom: 2px double #333;">
                <td colspan="3" style="text-align: right; padding: 10px; font-weight: 700; font-size: 16px;">Grand Total:</td>
                <td style="text-align: right; padding: 10px; font-weight: 800; font-size: 16px; color: #00a8b5;">₹${order.subtotal.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
          <div style="margin-top: 40px; font-size: 14px;">
            <p><strong>Payment Status:</strong> <span style="color: ${order.paymentStatus === 'COMPLETED' ? '#28a745' : '#e67e22'}; font-weight: bold; text-transform: uppercase;">${order.paymentStatus}</span></p>
            <p><strong>Delivery Status:</strong> <span style="font-weight: bold;">${order.status}</span></p>
          </div>
          <div class="footer">
            <p>Thank you for shopping with us! This is a system-generated invoice.</p>
            <p>&copy; ${new Date().getFullYear()} VALNQIX IT E-Commerce Pvt. Ltd. All rights reserved.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Add Actions
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCatName,
          slug: newCatSlug,
          parentGroup: newCatParentGroup,
          description: newCatDescription,
          image: newCatImage
        })
      });
      const data = await res.json();
      if (data.success) {
        setCategories(prev => [...prev, data.category]);
        setNewCatName('');
        setNewCatImage('');
        setNewCatSlug('');
        setNewCatParentGroup('None');
        setNewCatDescription('');
        setIsAddCategoryOpen(false);
        fetchLogs();
      }
    } catch (e) {
      alert('Error creating category');
    }
  };

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName) return;
    try {
      const res = await fetch('/api/admin/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newBrandName,
          slug: newBrandSlug,
          description: newBrandDescription,
          image: newBrandImage
        })
      });
      const data = await res.json();
      if (data.success) {
        setBrands(prev => [...prev, data.brand]);
        setNewBrandName('');
        setNewBrandSlug('');
        setNewBrandDescription('');
        setNewBrandImage('');
        setIsAddBrandOpen(false);
        fetchLogs();
      }
    } catch (e) {
      alert('Error creating brand');
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductMrpError('');
    setProductDiscountError('');

    if (!newProdName || !newProdMrp || !newProdCategory) {
      alert('Name, MRP, and Category are required.');
      return;
    }

    const mrpVal = Number(newProdMrp) || 0;
    const discountVal = Number(newProdDiscount) || 0;
    let hasError = false;

    if (mrpVal < 0) {
      setProductMrpError('MRP cannot be negative.');
      hasError = true;
    }

    if (discountVal < 0 || discountVal > 100) {
      setProductDiscountError('Discount percentage must be between 0% and 100%.');
      hasError = true;
    }

    if (hasError) return;

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProdName,
          slug: newProdSlug,
          mrp: newProdMrp,
          discount: newProdDiscount,
          image: newProdImage,
          category: newProdCategory,
          brand: newProdBrand,
          sku: newProdSku,
          stock: newProdStock,
          status: newProdStatus,
          description: newProdDescription,
          featured: newProdFeatured,
          onOffer: newProdOnOffer,
          warranty: newProdWarranty,
          lowStockThreshold: newProdLowStockThreshold,
          sellerId: newProdSellerId,
          sellerName: newProdSellerName,
          sellerLocation: newProdSellerLocation
        })
      });
      const data = await res.json();
      if (data.success) {
        setAdminProducts(prev => [data.product, ...prev]);
        setNewProdName('');
        setNewProdImage('');
        setNewProdCategory('');
        setNewProdBrand('');
        setNewProdSku('');
        setNewProdStock('10');
        setNewProdStatus('PUBLISHED');
        setNewProdSlug('');
        setNewProdDescription('');
        setNewProdMrp('');
        setNewProdDiscount('0');
        setNewProdFeatured(false);
        setNewProdOnOffer(false);
        setNewProdWarranty('0');
        setNewProdLowStockThreshold('10');
        setNewProdSellerId('');
        setNewProdSellerName('');
        setNewProdSellerLocation('');
        setIsAddProductOpen(false);
        fetchLogs();
      }
    } catch (e) {
      alert('Error creating product');
    }
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setEditCatName(cat.name);
    setEditCatImage(cat.image);
    setEditCatSlug(cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'));
    setEditCatParentGroup(cat.parentGroup || 'None');
    setEditCatDescription(cat.description || '');
    setEditCatStatus(cat.status || 'Visible');
  };

  const handleEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setEditProdName(prod.name);
    setEditProdSlug(prod.slug || prod.name.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-'));
    setEditProdImage(prod.image);
    setEditProdCategory(prod.category);
    setEditProdBrand(prod.brand || '');
    setEditProdSku(prod.sku || '');
    setEditProdStock(String(prod.stock !== undefined ? prod.stock : 10));
    setEditProdStatus(prod.status || 'PUBLISHED');
    setEditProdDescription(prod.description || '');
    setEditProdMrp(String(prod.mrp !== undefined ? prod.mrp : parseInt((prod.price || '').replace(/[^\d]/g, ''), 10)));
    setEditProdDiscount(String(prod.discount !== undefined ? prod.discount : 0));
    setEditProdFeatured(prod.featured === true);
    setEditProdOnOffer(prod.onOffer === true);
    setEditProdWarranty(String(prod.warranty !== undefined ? prod.warranty : 0));
    setEditProdLowStockThreshold(String(prod.lowStockThreshold !== undefined ? prod.lowStockThreshold : 10));
    setEditProdSellerId(prod.sellerId || '');
    setEditProdSellerName(prod.sellerName || '');
    setEditProdSellerLocation(prod.sellerLocation || '');
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCategory.id,
          name: editCatName,
          slug: editCatSlug,
          parentGroup: editCatParentGroup,
          description: editCatDescription,
          image: editCatImage,
          status: editCatStatus
        })
      });
      const data = await res.json();
      if (data.success) {
        setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, ...data.category } : c));
        setEditingCategory(null);
        fetchLogs();
      } else {
        alert(data.error || 'Failed to update category.');
      }
    } catch (err) {
      alert('Error updating category.');
    }
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setEditBrandName(brand.name);
    setEditBrandSlug(brand.slug || brand.name.toLowerCase().replace(/\s+/g, '-'));
    setEditBrandDescription(brand.description || '');
    setEditBrandImage(brand.image || '');
    setEditBrandStatus(brand.status || 'Visible');
  };

  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrand) return;
    try {
      const res = await fetch('/api/admin/brands', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingBrand.id,
          name: editBrandName,
          slug: editBrandSlug,
          description: editBrandDescription,
          image: editBrandImage,
          status: editBrandStatus
        })
      });
      const data = await res.json();
      if (data.success) {
        setBrands(prev => prev.map(b => b.id === editingBrand.id ? { ...b, ...data.brand } : b));
        setEditingBrand(null);
        fetchLogs();
      } else {
        alert(data.error || 'Failed to update brand.');
      }
    } catch (err) {
      alert('Error updating brand.');
    }
  };

  const handleDeleteBrand = async (id: string) => {
    if (!confirm('Are you sure you want to delete this brand? This might affect products under this brand.')) return;
    try {
      const res = await fetch(`/api/admin/brands?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setBrands(prev => prev.filter(item => item.id !== id));
        fetchLogs();
      } else {
        alert(data.error || 'Failed to delete brand.');
      }
    } catch (e) {
      alert('Network error deleting brand');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingProduct.id,
          name: editProdName,
          slug: editProdSlug,
          mrp: editProdMrp,
          discount: editProdDiscount,
          image: editProdImage,
          category: editProdCategory,
          brand: editProdBrand,
          sku: editProdSku,
          stock: editProdStock,
          status: editProdStatus,
          description: editProdDescription,
          featured: editProdFeatured,
          onOffer: editProdOnOffer,
          warranty: editProdWarranty,
          lowStockThreshold: editProdLowStockThreshold,
          sellerId: editProdSellerId,
          sellerName: editProdSellerName,
          sellerLocation: editProdSellerLocation
        })
      });
      const data = await res.json();
      if (data.success) {
        setAdminProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...data.product } : p));
        setEditingProduct(null);
        fetchLogs();
      } else {
        alert(data.error || 'Failed to update product.');
      }
    } catch (err) {
      alert('Error updating product.');
    }
  };

  const handleAddSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSellerName.trim() || !newSellerMainCategory.trim()) {
      alert('Seller Name and Main Category are required.');
      return;
    }
    try {
      const res = await fetch('/api/admin/sellers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSellerName,
          mainCategory: newSellerMainCategory,
          location: newSellerLocation,
          phone: newSellerPhone,
          email: newSellerEmail,
          gstNumber: newSellerGst,
          contactPerson: newSellerContactPerson,
          natureOfBusiness: newSellerNature,
          trustScore: newSellerTrustScore,
          rating: newSellerRating,
          responseTime: newSellerResponseTime
        })
      });
      const data = await res.json();
      if (data.success) {
        setSellers(prev => [data.seller, ...prev]);
        setNewSellerName('');
        setNewSellerMainCategory('');
        setNewSellerLocation('');
        setNewSellerPhone('');
        setNewSellerEmail('');
        setNewSellerGst('');
        setNewSellerContactPerson('');
        setIsAddSellerOpen(false);
        fetchLogs();
      } else {
        alert(data.error || 'Failed to add seller.');
      }
    } catch (err) {
      alert('Error creating seller.');
    }
  };

  const handleEditSeller = (seller: Seller) => {
    setEditingSeller(seller);
    setEditSellerName(seller.name);
    setEditSellerMainCategory(seller.mainCategory);
    setEditSellerLocation(seller.location);
    setEditSellerPhone(seller.phone || '');
    setEditSellerEmail(seller.email || '');
    setEditSellerGst(seller.gstNumber || '');
    setEditSellerContactPerson(seller.contactPerson || '');
    setEditSellerNature(seller.natureOfBusiness || 'Verified Supplier');
    setEditSellerTrustScore(seller.trustScore || 'Verified TrustSEAL');
    setEditSellerStatus(seller.status || 'Active');
  };

  const handleSaveSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSeller) return;
    try {
      const res = await fetch('/api/admin/sellers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingSeller.id,
          name: editSellerName,
          mainCategory: editSellerMainCategory,
          location: editSellerLocation,
          phone: editSellerPhone,
          email: editSellerEmail,
          gstNumber: editSellerGst,
          contactPerson: editSellerContactPerson,
          natureOfBusiness: editSellerNature,
          trustScore: editSellerTrustScore,
          status: editSellerStatus
        })
      });
      const data = await res.json();
      if (data.success) {
        setSellers(prev => prev.map(s => s.id === editingSeller.id ? { ...s, ...data.seller } : s));
        fetchAdminProducts();
        setEditingSeller(null);
        fetchLogs();
      } else {
        alert(data.error || 'Failed to update seller.');
      }
    } catch (err) {
      alert('Error updating seller.');
    }
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponDiscountError('');
    setCouponMinPurchaseError('');
    setCouponExpiryDateError('');

    if (!newCouponCode || !newCouponDiscount) return;

    const discountVal = Number(newCouponDiscount) || 0;
    const minPurchaseVal = Number(newCouponMinPurchase) || 0;
    let hasError = false;

    if (discountVal < 0) {
      setCouponDiscountError("Discount value cannot be negative.");
      hasError = true;
    }

    if (newCouponType === 'fixed') {
      if (minPurchaseVal < discountVal) {
        setCouponMinPurchaseError("Minimum purchase amount cannot be less than the fixed discount amount.");
        hasError = true;
      }
    } else if (newCouponType === 'percentage') {
      if (discountVal > 100) {
        setCouponDiscountError("Percentage discount cannot be greater than 100%.");
        hasError = true;
      }
    }

    if (newCouponExpiryDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expiry = new Date(newCouponExpiryDate);
      if (expiry < today) {
        setCouponExpiryDateError("Expiry date cannot be in the past.");
        hasError = true;
      }
    }

    if (hasError) return;

    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCouponCode,
          discount: newCouponDiscount,
          type: newCouponType,
          isActive: newCouponActive,
          minPurchase: newCouponMinPurchase,
          usageLimit: newCouponUsageLimit,
          expiryDate: newCouponExpiryDate
        })
      });
      const data = await res.json();
      if (data.success) {
        setCoupons(prev => [...prev, data.coupon]);
        setNewCouponCode('');
        setNewCouponDiscount('');
        setNewCouponMinPurchase('0');
        setNewCouponUsageLimit('100');
        setNewCouponExpiryDate('');
        setNewCouponActive(true);
        setIsAddCouponOpen(false);
        fetchLogs();
      }
    } catch (e) {
      alert('Error creating coupon');
    }
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredError('');
    setCredMessage('');
    if (!newAdminUsername || !newAdminPassword) {
      setCredError('Username and password are required.');
      return;
    }
    try {
      const res = await fetch('/api/admin/manager', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentUsername: currentAdminUsername,
          newUsername: newAdminUsername,
          newPassword: newAdminPassword
        })
      });
      const data = await res.json();
      if (data.success) {
        setCredMessage('Account credentials successfully updated.');
        setCurrentAdminUsername(newAdminUsername);
        setNewAdminUsername('');
        setNewAdminPassword('');
        fetchLogs();
        fetchAdmins();
      } else {
        setCredError(data.error || 'Failed to update credentials.');
      }
    } catch (e) {
      setCredError('Error updating admin account settings.');
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminFormError('');
    if (!newAdminName || !newAdminPwd) {
      setAdminFormError('Username and password are required.');
      return;
    }
    try {
      const res = await fetch('/api/admin/manager', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          username: newAdminName,
          fullName: newAdminFullName,
          email: newAdminEmail,
          password: newAdminPwd,
          role: newAdminRole,
          active: newAdminActive,
          permissions: newAdminPermissions
        })
      });
      const data = await res.json();
      if (data.success) {
        setAdminUsers(prev => [...prev, data.admin]);
        setNewAdminName('');
        setNewAdminFullName('');
        setNewAdminEmail('');
        setNewAdminPwd('');
        setNewAdminRole('PRODUCT MANAGER');
        setNewAdminActive(true);
        setNewAdminPermissions(defaultAdminPermissions());
        setIsAddAdminOpen(false);
        fetchLogs();
      } else {
        setAdminFormError(data.error || 'Failed to add admin.');
      }
    } catch (e) {
      setAdminFormError('Error adding admin.');
    }
  };

  const handleEditAdminSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;
    setEditAdminError('');
    try {
      const res = await fetch('/api/admin/manager', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingAdmin.id,
          username: editAdminUsername,
          email: editAdminEmail,
          password: editAdminPwd || undefined,
          role: editAdminRole,
          status: editAdminStatus
        })
      });
      const data = await res.json();
      if (data.success) {
        setAdminUsers(prev => prev.map(a => a.id === editingAdmin.id ? {
          ...a,
          username: editAdminUsername,
          email: editAdminEmail,
          role: editAdminRole,
          status: editAdminStatus
        } : a));
        setEditingAdmin(null);
        fetchLogs();
      } else {
        setEditAdminError(data.error || 'Failed to update admin.');
      }
    } catch (e) {
      setEditAdminError('Error updating admin.');
    }
  };

  const handleDeleteAdminUser = async (id: string, username: string) => {
    if (!confirm(`Are you sure you want to delete admin "${username}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/manager?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAdminUsers(prev => prev.filter(a => a.id !== id));
        fetchLogs();
      } else {
        alert(data.error || 'Failed to delete admin.');
      }
    } catch (e) {
      alert('Error deleting admin.');
    }
  };


  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsMessage('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopName,
          contactEmail,
          contactPhone,
          contactAddress,
          taxRate,
          shopHours
        })
      });
      const data = await res.json();
      if (data.success) {
        setSettingsMessage('Settings successfully saved.');
        fetchSettings();
        fetchLogs();
      }
    } catch (e) {
      alert('Error saving settings.');
    }
  };

  // Compile Dynamic Customers List
  const customersMap: { [email: string]: any } = {};
  orders.forEach(order => {
    if (order.customer && order.customer.email) {
      const email = order.customer.email.toLowerCase();
      const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
      if (!customersMap[email]) {
        customersMap[email] = {
          name: order.customer.name,
          email: order.customer.email,
          phone: order.customer.phone || 'N/A',
          address: order.customer.address || 'N/A',
          joinedDate: orderDate,
          ordersCount: 0,
          totalSpent: 0
        };
      } else {
        if (orderDate < customersMap[email].joinedDate) {
          customersMap[email].joinedDate = orderDate;
        }
      }
      customersMap[email].ordersCount += 1;
      customersMap[email].totalSpent += order.subtotal;
    }
  });
  const customersList = Object.values(customersMap);

  // Statistics Calculations
  const totalSales = orders.reduce((sum, order) => sum + order.subtotal, 0);
  const totalOrders = orders.length;
  const totalInquiries = submissions.length;
  const totalProducts = adminProductsTotal || adminProducts.length;

  // Orders list statistics & calculations
  const ordersPendingCount = orders.filter(o => o.status === 'Pending').length;
  const ordersShippedCount = orders.filter(o => o.status === 'Shipped').length;
  const ordersCompletedCount = orders.filter(o => o.status === 'Completed').length;

  // Submissions (queries) status calculations
  const pendingSubmissionsCount = submissions.filter(s => (s.status || 'Pending') === 'Pending').length;
  const inProgressSubmissionsCount = submissions.filter(s => s.status === 'In Progress').length;
  const resolvedSubmissionsCount = submissions.filter(s => s.status === 'Resolved').length;

  // Aggregated data for last 7 months (December to June)
  const monthlyTimeline = [
    { label: 'Dec', key: 'Dec', sales: 0, profit: 0, customers: 0, year: 2025, month: 11 },
    { label: 'Jan', key: 'Jan', sales: 0, profit: 0, customers: 0, year: 2026, month: 0 },
    { label: 'Feb', key: 'Feb', sales: 0, profit: 0, customers: 0, year: 2026, month: 1 },
    { label: 'Mar', key: 'Mar', sales: 0, profit: 0, customers: 0, year: 2026, month: 2 },
    { label: 'Apr', key: 'Apr', sales: 0, profit: 0, customers: 0, year: 2026, month: 3 },
    { label: 'May', key: 'May', sales: 0, profit: 0, customers: 0, year: 2026, month: 4 },
    { label: 'Jun', key: 'Jun', sales: 0, profit: 0, customers: 0, year: 2026, month: 5 }
  ];

  // Group orders by month
  orders.forEach(order => {
    if (order.createdAt) {
      const d = new Date(order.createdAt);
      const m = d.getMonth();
      const y = d.getFullYear();
      const monthBucket = monthlyTimeline.find(t => t.month === m && t.year === y);
      if (monthBucket) {
        monthBucket.sales += order.subtotal;
      }
    }
  });

  // Calculate estimated profit (15%) for each month
  monthlyTimeline.forEach(bucket => {
    bucket.profit = Math.round(bucket.sales * 0.15);
  });

  // Group customer registrations by joinedDate
  customersList.forEach((c: any) => {
    if (c.joinedDate) {
      const d = new Date(c.joinedDate);
      const m = d.getMonth();
      const y = d.getFullYear();
      const monthBucket = monthlyTimeline.find(t => t.month === m && t.year === y);
      if (monthBucket) {
        monthBucket.customers += 1;
      }
    }
  });

  // Category sales distribution
  const categorySalesMap: { [catName: string]: number } = {};
  orders.forEach(order => {
    if (order.items) {
      order.items.forEach(item => {
        const prod = adminProducts.find(p => p.name === item.name || p.id === String(item.id));
        const catName = prod?.category || 'Uncategorized';
        categorySalesMap[catName] = (categorySalesMap[catName] || 0) + (item.price * item.qty);
      });
    }
  });

  const totalCategorySales = Object.values(categorySalesMap).reduce((sum, v) => sum + v, 0);
  const categoryColors = ['#3b82f6', '#00a8b5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const categoryDistribution = Object.entries(categorySalesMap).map(([name, sales]) => {
    const percent = totalCategorySales > 0 ? Math.round((sales / totalCategorySales) * 100) : 0;
    return { name, sales, percent };
  }).sort((a, b) => b.sales - a.sales);

  const finalCategoryDistribution = categoryDistribution.length > 0 ? categoryDistribution : [
    { name: 'Processing Components', sales: 0, percent: 100 }
  ];

  const handleExportAnalyticsCSV = () => {
    const headers = ['Month', 'Gross Sales (INR)', 'Estimated Profit (INR)', 'New Customers'];
    const rows = monthlyTimeline.map(m => [
      `${m.label} ${m.year}`,
      m.sales,
      m.profit,
      m.customers
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics_export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Activity log helper & calculations
  const parseLogAction = (logAction: string) => {
    const actionLower = (logAction || '').toLowerCase();
    let module = 'System';
    let action = 'View';
    let color = '#3b82f6';
    let bgColor = '#eff6ff';

    // Determine Module
    if (actionLower.includes('product')) {
      module = 'Products';
      color = '#2563eb'; // blue-600
      bgColor = '#eff6ff'; // blue-50
    } else if (actionLower.includes('coupon')) {
      module = 'Coupons';
      color = '#d97706'; // amber-600
      bgColor = '#fffbeb'; // amber-50
    } else if (actionLower.includes('order')) {
      module = 'Orders';
      color = '#7c3aed'; // purple-600
      bgColor = '#f5f3ff'; // purple-50
    } else if (actionLower.includes('banner')) {
      module = 'Banners';
      color = '#db2777'; // pink-600
      bgColor = '#fdf2f8'; // pink-50
    } else if (actionLower.includes('settings')) {
      module = 'Settings';
      color = '#4b5563'; // gray-600
      bgColor = '#f3f4f6'; // gray-50
    } else if (actionLower.includes('admin') || actionLower.includes('login')) {
      module = 'Admin';
      color = '#0d9488'; // teal-600
      bgColor = '#f0fdfa'; // teal-50
    } else if (actionLower.includes('submission') || actionLower.includes('query')) {
      module = 'Queries';
      color = '#059669'; // emerald-600
      bgColor = '#ecfdf5'; // emerald-50
    }

    // Determine Action
    if (actionLower.includes('create')) {
      action = 'Create';
    } else if (actionLower.includes('delete')) {
      action = 'Delete';
    } else if (actionLower.includes('update') || actionLower.includes('edit')) {
      action = 'Edit';
    } else if (actionLower.includes('login') || actionLower.includes('auth')) {
      action = 'Login';
    } else if (actionLower.includes('view')) {
      action = 'View';
    }

    return { module, action, color, bgColor };
  };

  const handleClearAllLogs = async () => {
    if (!confirm('Are you sure you want to clear all activity logs? This cannot be undone.')) return;
    try {
      const res = await fetch('/api/admin/activity-logs', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setLogs([]);
        fetchLogs();
      } else {
        alert(data.error || 'Failed to clear activity logs.');
      }
    } catch (e) {
      alert('Error clearing activity logs.');
    }
  };

  // Filter logs list
  const filteredLogs = logs.filter(log => {
    // 1. Search Query filter (matches action, details or username)
    const matchesSearch =
      (log.action || '').toLowerCase().includes(logsSearchQuery.toLowerCase()) ||
      (log.details || '').toLowerCase().includes(logsSearchQuery.toLowerCase()) ||
      'admin user'.includes(logsSearchQuery.toLowerCase()) ||
      'super admin'.includes(logsSearchQuery.toLowerCase());

    // 2. Admin filter
    const matchesAdmin = logsAdminFilter === 'All' ||
      (logsAdminFilter === 'admin' && (log.details || '').toLowerCase().includes('admin'));

    const parsed = parseLogAction(log.action);

    // 3. Module filter
    const matchesModule = logsModuleFilter === 'All' || parsed.module === logsModuleFilter;

    // 4. Action filter
    const matchesAction = logsActionFilter === 'All' || parsed.action === logsActionFilter;

    // 5. Start/End Date filter
    let matchesDate = true;
    if (log.timestamp) {
      const logDate = new Date(log.timestamp);
      logDate.setHours(0, 0, 0, 0);

      if (logsStartDate) {
        const start = new Date(logsStartDate);
        start.setHours(0, 0, 0, 0);
        if (logDate < start) matchesDate = false;
      }

      if (logsEndDate) {
        const end = new Date(logsEndDate);
        end.setHours(23, 59, 59, 999);
        if (logDate > end) matchesDate = false;
      }
    }

    return matchesSearch && matchesAdmin && matchesModule && matchesAction && matchesDate;
  });

  // Calculate logs statistics
  const activityShownCount = filteredLogs.length;
  const activityViewCount = logs.filter(l => parseLogAction(l.action).action === 'View').length;
  const activityEditCount = logs.filter(l => parseLogAction(l.action).action === 'Edit').length;
  const activityCreateCount = logs.filter(l => parseLogAction(l.action).action === 'Create').length;
  const activityDeleteCount = logs.filter(l => parseLogAction(l.action).action === 'Delete').length;
  const activityLoginCount = logs.filter(l => parseLogAction(l.action).action === 'Login').length;


  const filteredOrdersList = orders.filter(order => {
    const matchesSearch =
      (order.orderId || '').toLowerCase().includes(ordersSearchQuery.toLowerCase()) ||
      (order.customer && (order.customer.name || '').toLowerCase().includes(ordersSearchQuery.toLowerCase())) ||
      (order.customer && (order.customer.email || '').toLowerCase().includes(ordersSearchQuery.toLowerCase()));

    const matchesStatus = ordersStatusFilter === 'All' || order.status === ordersStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // Coupon helper & Statistics Calculations
  const isCouponExpired = (expiryDate: string) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    expiry.setHours(23, 59, 59, 999);
    return today > expiry;
  };

  const activeCouponsCount = coupons.filter(c => c.isActive && !isCouponExpired(c.expiryDate)).length;
  const totalUsesCount = coupons.reduce((sum, c) => sum + (c.usageCount || 0), 0);
  const totalDiscountApplied = orders.reduce((sum, o) => sum + (o.discountApplied || 0), 0);

  // Live offer price calculation
  const mrpVal = Number(newProdMrp) || 0;
  const discountVal = Number(newProdDiscount) || 0;
  const offerPriceVal = mrpVal - (mrpVal * discountVal / 100);
  const formattedOfferPrice = '₹' + Math.round(offerPriceVal).toLocaleString();

  // Search filter calculations
  const filteredSubmissions = submissions.filter(sub =>
    (sub.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (sub.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (sub.subject || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter(order =>
    (order.orderId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (order.customer && (order.customer.name || '').toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCategories = categories.filter(cat =>
    (cat.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBrands = brands.filter(b =>
    (b.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = adminProducts;

  useEffect(() => {
    if (activeTab === 'products') {
      const timer = setTimeout(() => {
        fetchAdminProducts(1, adminProductsLimit, searchQuery);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, activeTab, adminProductsLimit]);

  const filteredSellers = sellers.filter(seller => {
    const matchesCategory = sellerCategoryFilter === 'All' || seller.mainCategory.toLowerCase() === sellerCategoryFilter.toLowerCase();
    const query = sellerSearchQuery.toLowerCase().trim();
    const matchesSearch = !query ||
      (seller.name || '').toLowerCase().includes(query) ||
      (seller.location || '').toLowerCase().includes(query) ||
      (seller.mainCategory || '').toLowerCase().includes(query) ||
      (seller.contactPerson || '').toLowerCase().includes(query) ||
      (seller.gstNumber || '').toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const paginatedSellers = useMemo(() => {
    const start = (adminSellersPage - 1) * adminSellersLimit;
    return filteredSellers.slice(start, start + adminSellersLimit);
  }, [filteredSellers, adminSellersPage, adminSellersLimit]);

  const totalSellerPages = Math.ceil(filteredSellers.length / adminSellersLimit) || 1;



  const filteredCoupons = coupons.filter(coup =>
    (coup.code || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCustomers = customersList.filter((cust: any) =>
    (cust.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cust.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setSearchQuery('');
    setViewingCustomer(null);
  };

  // Auth Guard Screen
  if (!isLoggedIn) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <img src="/images/logo.png" alt="VALNQIX Logo" className={styles.loginLogo} />
          <h2 className={styles.loginTitle}>Admin Control Center</h2>
          <form className={styles.loginForm} onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              className={styles.loginInput}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className={styles.loginInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: '2.75rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#999',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0',
                  lineHeight: 1
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {loginError && <div className={styles.loginError}>{loginError}</div>}
            <button type="submit" className={styles.loginBtn}>
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.adminContainer} ${darkMode ? styles.darkTheme : ''}`}>
      {/* 1. Left Sidebar Panel */}
      <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
        <div className={styles.sidebarHeader}>
          {!sidebarCollapsed && (
            <>
              <img src="/images/logo.png" alt="VALNQIX" className={styles.sidebarLogo} />
              <span className={styles.sidebarTitle}>Admin Panel</span>
            </>
          )}
          <button
            className={styles.sidebarCollapseBtn}
            onClick={() => setSidebarCollapsed(p => !p)}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              /* Right chevron > */
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            ) : (
              /* Left chevron < */
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            )}
          </button>
        </div>

        <nav className={styles.sidebarMenu}>
          {/* Dashboard */}
          <button
            onClick={() => handleTabChange('dashboard')}
            className={`${styles.sidebarItem} ${activeTab === 'dashboard' ? styles.sidebarItemActive : ''}`}
            title={sidebarCollapsed ? "Dashboard" : undefined}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="9" />
              <rect x="14" y="3" width="7" height="5" />
              <rect x="14" y="12" width="7" height="9" />
              <rect x="3" y="16" width="7" height="5" />
            </svg>
            {!sidebarCollapsed && <span>Dashboard</span>}
          </button>

          {/* Categories */}
          <button
            onClick={() => handleTabChange('categories')}
            className={`${styles.sidebarItem} ${activeTab === 'categories' ? styles.sidebarItemActive : ''}`}
            title={sidebarCollapsed ? "Categories" : undefined}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            {!sidebarCollapsed && <span>Categories</span>}
          </button>

          {/* Products */}
          <button
            onClick={() => handleTabChange('products')}
            className={`${styles.sidebarItem} ${activeTab === 'products' ? styles.sidebarItemActive : ''}`}
            title={sidebarCollapsed ? "Products" : undefined}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            {!sidebarCollapsed && <span>Products</span>}
          </button>

          {/* Sellers */}
          <button
            onClick={() => handleTabChange('sellers')}
            className={`${styles.sidebarItem} ${activeTab === 'sellers' ? styles.sidebarItemActive : ''}`}
            title={sidebarCollapsed ? "Sellers" : undefined}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <polyline points="17 11 19 13 23 9" />
            </svg>
            {!sidebarCollapsed && <span>Sellers</span>}
          </button>

          {/* Brands */}
          <button
            onClick={() => handleTabChange('brands')}
            className={`${styles.sidebarItem} ${activeTab === 'brands' ? styles.sidebarItemActive : ''}`}
            title={sidebarCollapsed ? "Brands" : undefined}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
            </svg>
            {!sidebarCollapsed && <span>Brands</span>}
          </button>

          {/* Blogs */}
          <button
            onClick={() => handleTabChange('blogs')}
            className={`${styles.sidebarItem} ${activeTab === 'blogs' ? styles.sidebarItemActive : ''}`}
            title={sidebarCollapsed ? "Blogs" : undefined}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            {!sidebarCollapsed && <span>Blogs</span>}
          </button>

          {/* Coupons */}
          <button
            onClick={() => handleTabChange('coupons')}
            className={`${styles.sidebarItem} ${activeTab === 'coupons' ? styles.sidebarItemActive : ''}`}
            title={sidebarCollapsed ? "Coupons" : undefined}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
            {!sidebarCollapsed && <span>Coupons</span>}
          </button>

          {/* Homepage Banner */}
          <button
            onClick={() => handleTabChange('promo-banner')}
            className={`${styles.sidebarItem} ${activeTab === 'promo-banner' ? styles.sidebarItemActive : ''}`}
            title={sidebarCollapsed ? "Homepage Banner" : undefined}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            {!sidebarCollapsed && <span>Homepage Banner</span>}
          </button>

          {/* Orders */}
          <button
            onClick={() => handleTabChange('orders')}
            className={`${styles.sidebarItem} ${activeTab === 'orders' ? styles.sidebarItemActive : ''}`}
            title={sidebarCollapsed ? "Orders" : undefined}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {!sidebarCollapsed && <span>Orders</span>}
          </button>

          {/* Customers */}
          <button
            onClick={() => handleTabChange('customers')}
            className={`${styles.sidebarItem} ${activeTab === 'customers' ? styles.sidebarItemActive : ''}`}
            title={sidebarCollapsed ? "Customers" : undefined}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            {!sidebarCollapsed && <span>Customers</span>}
          </button>

          {/* Queries */}
          <button
            onClick={() => handleTabChange('queries')}
            className={`${styles.sidebarItem} ${activeTab === 'queries' ? styles.sidebarItemActive : ''}`}
            title={sidebarCollapsed ? "Queries" : undefined}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {!sidebarCollapsed && <span>Queries</span>}
          </button>

          {/* Analytics */}
          <button
            onClick={() => handleTabChange('analytics')}
            className={`${styles.sidebarItem} ${activeTab === 'analytics' ? styles.sidebarItemActive : ''}`}
            title={sidebarCollapsed ? "Analytics" : undefined}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            {!sidebarCollapsed && <span>Analytics</span>}
          </button>

          {/* Activity Logs */}
          <button
            onClick={() => handleTabChange('activity-logs')}
            className={`${styles.sidebarItem} ${activeTab === 'activity-logs' ? styles.sidebarItemActive : ''}`}
            title={sidebarCollapsed ? "Activity Logs" : undefined}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {!sidebarCollapsed && <span>Activity Logs</span>}
          </button>

          {/* Admin Manager */}
          <button
            onClick={() => handleTabChange('admin-manager')}
            className={`${styles.sidebarItem} ${activeTab === 'admin-manager' ? styles.sidebarItemActive : ''}`}
            title={sidebarCollapsed ? "Admin Manager" : undefined}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            {!sidebarCollapsed && <span>Admin Manager</span>}
          </button>

          {/* Settings */}
          <button
            onClick={() => handleTabChange('settings')}
            className={`${styles.sidebarItem} ${activeTab === 'settings' ? styles.sidebarItemActive : ''}`}
            title={sidebarCollapsed ? "Settings" : undefined}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            {!sidebarCollapsed && <span>Settings</span>}
          </button>
        </nav>

      </aside>

      {/* 2. Right Workspace Content */}
      <div className={styles.mainArea}>
        {/* Top Header */}
        <header className={styles.dashHeader}>
          <div className={styles.headerTitleWrapper}>
            <h2 className={styles.headerTitle}>{activeTab.replace('-', ' ')} Overview</h2>
          </div>
          <div className={styles.headerRight}>


            {/* Theme color dot */}
            <div style={{
              width: '22px', height: '22px', borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              border: '2px solid white',
              boxShadow: '0 0 0 1.5px var(--primary)',
              cursor: 'default'
            }} />

            {/* Sun / Moon toggle */}
            <button
              onClick={() => setDarkMode(p => !p)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: darkMode ? '#fbbf24' : '#555', display: 'flex', alignItems: 'center', padding: '6px', transition: 'color 0.2s' }}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                /* Moon icon */
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                /* Sun icon */
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </button>

            {/* Avatar + Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(p => !p)}
                style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  backgroundColor: '#f3f4f6', border: '1.5px solid #e5e7eb',
                  cursor: 'pointer', fontWeight: 700, fontSize: '15px',
                  color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                {(currentAdminUsername || 'A').charAt(0).toUpperCase()}
              </button>

              {showUserMenu && (
                <>
                  {/* Backdrop */}
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 99 }}
                    onClick={() => setShowUserMenu(false)}
                  />
                  {/* Dropdown */}
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                    background: 'white', borderRadius: '10px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    border: '1px solid #e5e7eb',
                    minWidth: '200px', zIndex: 100,
                    overflow: 'hidden'
                  }}>
                    {/* User info */}
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid #f3f4f6' }}>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: '#111' }}>Admin User</div>
                      <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{currentAdminUsername}@valnqix.in</div>
                    </div>
                    {/* Menu items */}
                    <div style={{ padding: '6px 0' }}>
                      <button
                        onClick={() => { setShowUserMenu(false); handleTabChange('settings'); }}
                        style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'none', border: 'none', fontSize: '14px', color: '#333', cursor: 'pointer', display: 'block' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => { setShowUserMenu(false); handleTabChange('settings'); }}
                        style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'none', border: 'none', fontSize: '14px', color: '#333', cursor: 'pointer', display: 'block' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        Settings
                      </button>
                      <div style={{ borderTop: '1px solid #f3f4f6', margin: '4px 0' }} />
                      <button
                        onClick={() => { setShowUserMenu(false); handleLogout(); }}
                        style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'none', border: 'none', fontSize: '14px', color: '#ef4444', cursor: 'pointer', fontWeight: 500 }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#fff5f5')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Panels */}
        <main className={styles.dashContent}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem 0', color: '#666' }}>Fetching database records...</div>
          ) : (
            <>
              {/* === DASHBOARD TAB === */}
              {activeTab === 'dashboard' && (
                <div>
                  <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                      <div className={`${styles.statIconWrapper} ${styles.statIconWrapperGreen}`}>
                        ₹
                      </div>
                      <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Total Revenue</span>
                        <span className={styles.statVal}>₹{totalSales.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statIconWrapper}>
                        📦
                      </div>
                      <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Orders</span>
                        <span className={styles.statVal}>{totalOrders}</span>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statIconWrapper}>
                        ✉
                      </div>
                      <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Inquiries</span>
                        <span className={styles.statVal}>{totalInquiries}</span>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statIconWrapper}>
                        🏷️
                      </div>
                      <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Products</span>
                        <span className={styles.statVal}>{totalProducts}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.dashSplitGrid}>
                    {/* Left Pane - Recent Checkout Orders */}
                    <div className={styles.panelCard}>
                      <div className={styles.panelHeader}>
                        <h3 className={styles.panelTitle}>Recent Orders</h3>
                        <button onClick={() => setActiveTab('orders')} className={styles.viewBtn}>View All</button>
                      </div>
                      <div className={styles.tableWrapper}>
                        {orders.length === 0 ? (
                          <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No checkouts logged.</div>
                        ) : (
                          <table className={styles.table}>
                            <thead>
                              <tr>
                                <th className={styles.th}>Order ID</th>
                                <th className={styles.th}>Customer</th>
                                <th className={styles.th}>Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orders.slice(0, 5).map(order => (
                                <tr key={order.id} className={styles.tr}>
                                  <td className={styles.td} style={{ fontWeight: 600 }}>{order.orderId}</td>
                                  <td className={styles.td}>{order.customer?.name || 'Guest'}</td>
                                  <td className={styles.td} style={{ color: '#28a745', fontWeight: 600 }}>₹{order.subtotal.toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>

                    {/* Right Pane - Recent Queries */}
                    <div className={styles.panelCard}>
                      <div className={styles.panelHeader}>
                        <h3 className={styles.panelTitle}>Recent Inquiries</h3>
                        <button onClick={() => setActiveTab('queries')} className={styles.viewBtn}>View All</button>
                      </div>
                      <div className={styles.tableWrapper}>
                        {submissions.length === 0 ? (
                          <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No inquiry forms found.</div>
                        ) : (
                          <table className={styles.table}>
                            <thead>
                              <tr>
                                <th className={styles.th}>Name</th>
                                <th className={styles.th}>Subject</th>
                                <th className={styles.th}>Type</th>
                              </tr>
                            </thead>
                            <tbody>
                              {submissions.slice(0, 5).map(sub => (
                                <tr key={sub.id} className={styles.tr}>
                                  <td className={styles.td} style={{ fontWeight: 500 }}>{sub.fullName}</td>
                                  <td className={styles.td}>{sub.subject}</td>
                                  <td className={styles.td}>
                                    <span className={`${styles.badge} ${sub.type === 'it-support' ? styles.badgeSupport : styles.badgeContact}`}>{sub.type}</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* === BRANDS TAB === */}
              {activeTab === 'brands' && (
                <div className={styles.panelCard}>
                  <div className={styles.panelHeader} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem', padding: '1.75rem 2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <div>
                        <h3 className={styles.panelTitle} style={{ fontSize: '24px', textTransform: 'none', fontWeight: 700, margin: 0 }}>Brands</h3>
                        <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0 0' }}>Manage hardware product manufacturers.</p>
                      </div>
                      <button className={styles.addBtn} onClick={() => setIsAddBrandOpen(true)} style={{ backgroundColor: '#00a8b5', border: 'none' }}>
                        + Add Brand
                      </button>
                    </div>
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-start', marginTop: '0.5rem' }}>
                      <div className={styles.searchWrapper} style={{ maxWidth: '320px', width: '100%', backgroundColor: '#fff', border: '1px solid #e2e2e8' }}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                          type="text"
                          placeholder="Search brands..."
                          className={styles.searchInput}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.tableWrapper}>
                    {filteredBrands.length === 0 ? (
                      <div className={styles.emptyState}>No brands found.</div>
                    ) : (
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th className={styles.th}>Brand Name</th>
                            <th className={styles.th}>Slug</th>
                            <th className={styles.th}>Description</th>
                            <th className={styles.th}>Status</th>
                            <th className={styles.th} style={{ textAlign: 'right', paddingRight: '2rem' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredBrands.map(brand => (
                            <tr key={brand.id} className={styles.tr}>
                              <td className={styles.td}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                  <img
                                    src={brand.image || '/images/default_brand.png'}
                                    alt={brand.name}
                                    style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #eee', backgroundColor: '#fcfcfd', padding: '2px' }}
                                    onError={(e) => {
                                      e.currentTarget.onerror = null;
                                      e.currentTarget.src = '/images/default_brand.png';
                                    }}
                                  />
                                  <span style={{ fontWeight: 600, color: '#111', fontSize: '14.5px' }}>{brand.name}</span>
                                </div>
                              </td>
                              <td className={styles.td} style={{ fontFamily: 'monospace', color: '#777', fontSize: '13px', textTransform: 'uppercase' }}>
                                {brand.slug || brand.name.toLowerCase().replace(/\s+/g, '-')}
                              </td>
                              <td className={styles.td} style={{ color: '#555', fontSize: '13.5px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {brand.description || 'No description provided.'}
                              </td>
                              <td className={styles.td}>
                                <span className={brand.status === 'Hidden' ? styles.badgeHidden : styles.badgeVisible}>
                                  {brand.status || 'Visible'}
                                </span>
                              </td>
                              <td className={styles.td} style={{ textAlign: 'right', paddingRight: '2rem' }}>
                                <button className={styles.editBtn} onClick={() => handleEditBrand(brand)} style={{ fontWeight: 600 }}>
                                  Edit
                                </button>
                                <button className={styles.deleteBtn} onClick={() => handleDeleteBrand(brand.id)} style={{ fontWeight: 600 }}>
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* === BLOGS TAB === */}
              {activeTab === 'blogs' && (
                <div style={{ width: '100%' }}>
                  {isBlogModalOpen ? (
                    <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e2e8', padding: '2rem' }}>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <button
                          type="button"
                          onClick={() => { setIsBlogModalOpen(false); setEditingBlog(null); }}
                          style={{ background: 'none', border: 'none', color: '#00a8b5', cursor: 'pointer', fontWeight: 600, fontSize: '14.5px', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 }}
                        >
                          <span>←</span> Back to Blogs List
                        </button>
                      </div>

                      <h4 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>{editingBlog ? 'Edit Blog Post' : 'New Blog Post'}</h4>
                      <p style={{ color: '#666', fontSize: '13.5px', marginTop: '4px', marginBottom: '2rem' }}>Configure details and rich-block content below.</p>

                      <form onSubmit={handleSubmitBlog}>
                        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', textAlign: 'left' }}>
                          {/* Left Column (Main Editor) */}
                          <div style={{ flex: '1 1 65%', minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                            {/* Cover Image Upload Area */}
                            <div style={{ border: '1px solid #e2e2e8', borderRadius: '12px', padding: '1.25rem', backgroundColor: '#fafafa' }}>
                              <label style={{ fontWeight: 600, display: 'block', fontSize: '14px', marginBottom: '8px' }}>Cover Image</label>
                              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <img
                                  src={blogCoverImage || 'https://ik.imagekit.io/zp0tch54w/RHST/wmremove-transformed.png'}
                                  alt="Preview"
                                  style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ddd' }}
                                  onError={(e) => { e.currentTarget.src = 'https://ik.imagekit.io/zp0tch54w/RHST/wmremove-transformed.png'; }}
                                />
                                <div style={{ flex: 1 }}>
                                  <input
                                    type="text"
                                    placeholder="Image URL (e.g. /images/my-blog-cover.jpg)"
                                    className={styles.loginInput}
                                    value={blogCoverImage}
                                    onChange={(e) => setBlogCoverImage(e.target.value)}
                                    style={{ marginBottom: '8px' }}
                                  />
                                  <span style={{ fontSize: '11px', color: '#888' }}>Enter image URL or select from uploads.</span>
                                </div>
                              </div>
                            </div>

                            {/* Post Details Card */}
                            <div style={{ border: '1px solid #e2e2e8', borderRadius: '12px', padding: '1.25rem', backgroundColor: '#fff' }}>
                              <h5 style={{ margin: '0 0 1rem 0', fontSize: '15px', fontWeight: 700, borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Post Details</h5>

                              <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
                                <label className={styles.formLabel}>Title *</label>
                                <input
                                  type="text"
                                  placeholder="Blog Post Title"
                                  className={styles.loginInput}
                                  value={blogTitle}
                                  onChange={(e) => setBlogTitle(e.target.value)}
                                  required
                                />
                              </div>

                              <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                                <label className={styles.formLabel}>Excerpt (Short summary for listing)</label>
                                <textarea
                                  placeholder="Enter short summary..."
                                  className={styles.loginInput}
                                  value={blogExcerpt}
                                  onChange={(e) => setBlogExcerpt(e.target.value)}
                                  style={{ height: '70px', resize: 'none' }}
                                />
                              </div>
                            </div>

                            {/* Content Blocks Card */}
                            <div style={{ border: '1px solid #e2e2e8', borderRadius: '12px', padding: '1.25rem', backgroundColor: '#fff' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                                <h5 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Content Blocks</h5>
                                <span style={{ fontSize: '12px', color: '#666', fontWeight: 500 }}>{blogBlocks.length} Block(s)</span>
                              </div>

                              {/* Block Render Loop */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
                                {blogBlocks.map((b, idx) => {
                                  let blockColor = '#00a8b5';
                                  if (b.type === 'heading') blockColor = '#f59e0b';
                                  if (b.type === 'subheading') blockColor = '#fb923c';
                                  if (b.type === 'bulletList' || b.type === 'numberedList') blockColor = '#10b981';
                                  if (b.type === 'blockquote') blockColor = '#8b5cf6';
                                  if (b.type === 'callout') blockColor = '#ec4899';
                                  if (b.type === 'image' || b.type === 'video') blockColor = '#3b82f6';
                                  if (b.type === 'table') blockColor = '#14b8a6';
                                  if (b.type === 'divider') blockColor = '#6b7280';

                                  return (
                                    <div key={b.id} style={{ borderLeft: `5px solid ${blockColor}`, border: `1px solid #e2e2e8`, borderRadius: '8px', overflow: 'hidden' }}>
                                      {/* Block Header */}
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: '#fafafa', borderBottom: '1px solid #eee' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                          <span style={{ fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', color: blockColor }}>
                                            {b.type.replace(/([A-Z])/g, ' $1')}
                                          </span>
                                          <div style={{ display: 'flex', gap: '2px' }}>
                                            <button type="button" onClick={() => moveBlockUp(idx)} disabled={idx === 0} style={{ padding: '2px 4px', fontSize: '10px', border: '1px solid #ddd', background: '#fff', borderRadius: '3px', cursor: idx === 0 ? 'not-allowed' : 'pointer' }}>↑</button>
                                            <button type="button" onClick={() => moveBlockDown(idx)} disabled={idx === blogBlocks.length - 1} style={{ padding: '2px 4px', fontSize: '10px', border: '1px solid #ddd', background: '#fff', borderRadius: '3px', cursor: idx === blogBlocks.length - 1 ? 'not-allowed' : 'pointer' }}>↓</button>
                                          </div>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => removeBlock(b.id)}
                                          style={{ border: 'none', background: 'transparent', color: '#ff4d4f', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', padding: '0 4px' }}
                                        >
                                          ×
                                        </button>
                                      </div>

                                      {/* Block Inputs */}
                                      <div style={{ padding: '12px' }}>
                                        {(b.type === 'paragraph' || b.type === 'blockquote') && (
                                          <textarea
                                            placeholder={b.type === 'paragraph' ? "Paragraph text..." : "Blockquote text..."}
                                            value={b.text || ''}
                                            onChange={(e) => updateBlockField(b.id, 'text', e.target.value)}
                                            style={{ width: '100%', height: '80px', padding: '8px', border: '1px solid #e2e2e8', borderRadius: '6px', fontSize: '13.5px', resize: 'vertical' }}
                                          />
                                        )}

                                        {(b.type === 'heading' || b.type === 'subheading') && (
                                          <input
                                            type="text"
                                            placeholder={b.type === 'heading' ? "Section heading..." : "Subheading text..."}
                                            value={b.text || ''}
                                            onChange={(e) => updateBlockField(b.id, 'text', e.target.value)}
                                            style={{ width: '100%', padding: '8px', border: '1px solid #e2e2e8', borderRadius: '6px', fontSize: '13.5px' }}
                                          />
                                        )}

                                        {(b.type === 'bulletList' || b.type === 'numberedList') && (
                                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {(b.items || []).map((item: string, itemIdx: number) => (
                                              <div key={itemIdx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                <span style={{ fontSize: '12.5px', color: '#888', width: '20px', textAlign: 'center' }}>
                                                  {b.type === 'numberedList' ? `${itemIdx + 1}.` : '•'}
                                                </span>
                                                <input
                                                  type="text"
                                                  placeholder={`List item ${itemIdx + 1}`}
                                                  value={item}
                                                  onChange={(e) => updateListItemText(b.id, itemIdx, e.target.value)}
                                                  style={{ flex: 1, padding: '8px 12px', border: '1px solid #e2e2e8', borderRadius: '6px', fontSize: '13px' }}
                                                />
                                                <button
                                                  type="button"
                                                  onClick={() => removeListItem(b.id, itemIdx)}
                                                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px', color: '#ff4d4f' }}
                                                >
                                                  ×
                                                </button>
                                              </div>
                                            ))}
                                            <button
                                              type="button"
                                              onClick={() => addListItem(b.id)}
                                              style={{ alignSelf: 'flex-start', border: 'none', background: 'transparent', color: '#00a8b5', fontSize: '12px', fontWeight: 600, cursor: 'pointer', marginTop: '4px' }}
                                            >
                                              + Add Item
                                            </button>
                                          </div>
                                        )}

                                        {b.type === 'callout' && (
                                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                              <div>
                                                <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '3px' }}>Callout Image URL</label>
                                                <input type="text" placeholder="Image URL" style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e2e8', borderRadius: '6px', fontSize: '12.5px' }} value={b.image || ''} onChange={(e) => updateBlockField(b.id, 'image', e.target.value)} />
                                              </div>
                                              <div>
                                                <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '3px' }}>Callout Title</label>
                                                <input type="text" placeholder="Title" style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e2e8', borderRadius: '6px', fontSize: '12.5px' }} value={b.title || ''} onChange={(e) => updateBlockField(b.id, 'title', e.target.value)} />
                                              </div>
                                              <div>
                                                <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '3px' }}>Callout Subtitle</label>
                                                <input type="text" placeholder="Subtitle" style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e2e8', borderRadius: '6px', fontSize: '12.5px' }} value={b.subtitle || ''} onChange={(e) => updateBlockField(b.id, 'subtitle', e.target.value)} />
                                              </div>
                                            </div>
                                            <div>
                                              <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '3px' }}>Callout Description</label>
                                              <textarea placeholder="Write descriptive callout contents..." style={{ width: '100%', height: '125px', padding: '6px 8px', border: '1px solid #e2e2e8', borderRadius: '6px', fontSize: '12.5px', resize: 'none' }} value={b.description || ''} onChange={(e) => updateBlockField(b.id, 'description', e.target.value)} />
                                            </div>
                                          </div>
                                        )}

                                        {(b.type === 'image' || b.type === 'video') && (
                                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                                            <div>
                                              <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '3px' }}>{b.type === 'image' ? 'Image URL' : 'Video URL'}</label>
                                              <input type="text" placeholder={b.type === 'image' ? 'https://...' : 'YouTube Embed URL'} style={{ width: '100%', padding: '8px', border: '1px solid #e2e2e8', borderRadius: '6px', fontSize: '12.5px' }} value={b.url || ''} onChange={(e) => updateBlockField(b.id, 'url', e.target.value)} />
                                            </div>
                                            <div>
                                              <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '3px' }}>Alt Text / Title</label>
                                              <input type="text" placeholder="Alt Description" style={{ width: '100%', padding: '8px', border: '1px solid #e2e2e8', borderRadius: '6px', fontSize: '12.5px' }} value={b.alt || ''} onChange={(e) => updateBlockField(b.id, 'alt', e.target.value)} />
                                            </div>
                                            <div>
                                              <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '3px' }}>Caption</label>
                                              <input type="text" placeholder="Caption (optional)" style={{ width: '100%', padding: '8px', border: '1px solid #e2e2e8', borderRadius: '6px', fontSize: '12.5px' }} value={b.caption || ''} onChange={(e) => updateBlockField(b.id, 'caption', e.target.value)} />
                                            </div>
                                          </div>
                                        )}

                                        {b.type === 'table' && (
                                          <div style={{ overflowX: 'auto', border: '1px solid #e2e2e8', borderRadius: '6px', padding: '0.5rem', backgroundColor: '#fafafa' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                              <thead>
                                                <tr>
                                                  {(b.headers || []).map((h: string, colIdx: number) => (
                                                    <th key={colIdx} style={{ padding: '6px', borderBottom: '2px solid #ddd' }}>
                                                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <input
                                                          type="text"
                                                          value={h}
                                                          style={{ width: '100%', border: 'none', borderBottom: '1px dashed #aaa', fontSize: '11px', fontWeight: 'bold', padding: '2px', backgroundColor: 'transparent' }}
                                                          onChange={(e) => updateTableHeaderText(b.id, colIdx, e.target.value)}
                                                        />
                                                        <button type="button" onClick={() => removeTableColumn(b.id, colIdx)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ff4d4f', fontSize: '12px' }}>×</button>
                                                      </div>
                                                    </th>
                                                  ))}
                                                  <th style={{ width: '50px' }}>
                                                    <button type="button" onClick={() => addTableColumn(b.id)} style={{ padding: '2px 6px', fontSize: '10px', backgroundColor: '#eee', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>+ Col</button>
                                                  </th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {(b.rows || []).map((row: string[], rowIdx: number) => (
                                                  <tr key={rowIdx}>
                                                    {row.map((cell: string, colIdx: number) => (
                                                      <td key={colIdx} style={{ padding: '6px', borderBottom: '1px solid #eee' }}>
                                                        <input
                                                          type="text"
                                                          value={cell}
                                                          style={{ width: '100%', border: 'none', borderBottom: '1px solid #eee', fontSize: '11.5px', padding: '2px', backgroundColor: 'transparent' }}
                                                          onChange={(e) => updateTableCellText(b.id, rowIdx, colIdx, e.target.value)}
                                                        />
                                                      </td>
                                                    ))}
                                                    <td style={{ textAlign: 'center' }}>
                                                      <button type="button" onClick={() => removeTableRow(b.id, rowIdx)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ff4d4f', fontSize: '12px' }}>×</button>
                                                    </td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                            <button type="button" onClick={() => addTableRow(b.id)} style={{ marginTop: '8px', padding: '4px 10px', fontSize: '11px', backgroundColor: '#eee', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>+ Add Row</button>
                                          </div>
                                        )}

                                        {b.type === 'divider' && (
                                          <div style={{ textAlign: 'center', padding: '8px', color: '#888', fontStyle: 'italic', fontSize: '12px' }}>
                                            Divider: Render a clean horizontal rule line separator.
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Add Block Toolbar */}
                              <div style={{ padding: '0.75rem', border: '1px dashed #e2e2e8', borderRadius: '10px', backgroundColor: '#fafafa' }}>
                                <div style={{ fontSize: '12px', fontWeight: 600, color: '#666', marginBottom: '8px' }}>Add Content Block:</div>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                  {[
                                    { type: 'paragraph', label: 'Paragraph', bg: '#eff6ff', color: '#1e40af' },
                                    { type: 'heading', label: 'Section Heading', bg: '#fffbeb', color: '#92400e' },
                                    { type: 'subheading', label: 'Subheading', bg: '#fffaf0', color: '#c2410c' },
                                    { type: 'bulletList', label: 'Bullet List', bg: '#ecfdf5', color: '#065f46' },
                                    { type: 'numberedList', label: 'Numbered List', bg: '#ecfdf5', color: '#065f46' },
                                    { type: 'blockquote', label: 'Blockquote', bg: '#f5f3ff', color: '#5b21b6' },
                                    { type: 'callout', label: 'Callout Box', bg: '#fdf2f8', color: '#9d174d' },
                                    { type: 'image', label: 'Image', bg: '#f0f9ff', color: '#075985' },
                                    { type: 'video', label: 'Video', bg: '#f0f9ff', color: '#075985' },
                                    { type: 'table', label: 'Table', bg: '#f0fdfa', color: '#0f766e' },
                                    { type: 'divider', label: 'Divider', bg: '#f3f4f6', color: '#374151' }
                                  ].map(btn => (
                                    <button
                                      key={btn.type}
                                      type="button"
                                      onClick={() => addBlock(btn.type)}
                                      style={{
                                        padding: '5px 10px',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        border: 'none',
                                        borderRadius: '4px',
                                        backgroundColor: btn.bg,
                                        color: btn.color,
                                        cursor: 'pointer',
                                        transition: 'transform 0.1s'
                                      }}
                                      onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                                      onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; }}
                                    >
                                      {btn.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Column (Publish/Author sidebar) */}
                          <div style={{ width: '340px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                            {/* Publish Settings */}
                            <div style={{ border: '1px solid #e2e2e8', borderRadius: '12px', padding: '1.25rem', backgroundColor: '#fff' }}>
                              <h5 style={{ margin: '0 0 1rem 0', fontSize: '15px', fontWeight: 700, borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Publish</h5>

                              <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '8px' }}>Status</label>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  {(['Draft', 'Published', 'Scheduled'] as const).map(st => (
                                    <button
                                      key={st}
                                      type="button"
                                      onClick={() => setBlogStatus(st)}
                                      style={{
                                        flex: 1,
                                        padding: '8px 4px',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        borderRadius: '6px',
                                        border: blogStatus === st ? '1px solid #fb923c' : '1px solid #e2e2e8',
                                        backgroundColor: blogStatus === st ? '#fffaf0' : '#fff',
                                        color: blogStatus === st ? '#c2410c' : '#555',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      {st}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px' }}>Featured Post</label>
                                  <span style={{ fontSize: '11px', color: '#888' }}>Show in main web carousels</span>
                                </div>
                                <input
                                  type="checkbox"
                                  checked={blogFeatured}
                                  onChange={(e) => setBlogFeatured(e.target.checked)}
                                  style={{ width: '18px', height: '18px', accentColor: '#fb923c', cursor: 'pointer' }}
                                />
                              </div>
                            </div>

                            {/* Classification settings */}
                            <div style={{ border: '1px solid #e2e2e8', borderRadius: '12px', padding: '1.25rem', backgroundColor: '#fff' }}>
                              <h5 style={{ margin: '0 0 1rem 0', fontSize: '15px', fontWeight: 700, borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Classification</h5>

                              <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
                                <label className={styles.formLabel}>Category</label>
                                <select
                                  className={styles.loginInput}
                                  value={blogCategory}
                                  onChange={(e) => setBlogCategory(e.target.value)}
                                  style={{ height: '40px', padding: '0 8px', fontSize: '13px' }}
                                >
                                  <option value="Laptops & Computers">Laptops & Computers</option>
                                  <option value="Desktop PC's">Desktop PCs</option>
                                  <option value="Computer Accessories">Computer Accessories</option>
                                  <option value="Keyboard & Mouse">Keyboard & Mouse</option>
                                  <option value="Storage Devices">Storage Devices</option>
                                  <option value="Printers & Scanners">Printers & Scanners</option>
                                  <option value="Security Products">Security Products</option>
                                  <option value="Television">Television</option>
                                </select>
                              </div>

                              <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
                                <label className={styles.formLabel}>Tags (comma-separated)</label>
                                <input
                                  type="text"
                                  placeholder="Tech, Tips, Modern"
                                  className={styles.loginInput}
                                  value={blogTags}
                                  onChange={(e) => setBlogTags(e.target.value)}
                                  style={{ fontSize: '13px' }}
                                />
                              </div>

                              <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                                <label className={styles.formLabel}>Sort Order</label>
                                <input
                                  type="number"
                                  placeholder="0"
                                  className={styles.loginInput}
                                  value={blogSortOrder}
                                  onChange={(e) => setBlogSortOrder(Number(e.target.value))}
                                  style={{ fontSize: '13px' }}
                                />
                              </div>
                            </div>

                            {/* Author Settings Card */}
                            <div style={{ border: '1px solid #e2e2e8', borderRadius: '12px', padding: '1.25rem', backgroundColor: '#fff' }}>
                              <h5 style={{ margin: '0 0 1rem 0', fontSize: '15px', fontWeight: 700, borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Author Details</h5>

                              <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
                                <label className={styles.formLabel}>Author Name</label>
                                <input
                                  type="text"
                                  className={styles.loginInput}
                                  value={blogAuthorName}
                                  onChange={(e) => setBlogAuthorName(e.target.value)}
                                  style={{ fontSize: '13px' }}
                                />
                              </div>

                              <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
                                <label className={styles.formLabel}>Photo URL</label>
                                <input
                                  type="text"
                                  placeholder="Leave blank for generic avatar"
                                  className={styles.loginInput}
                                  value={blogAuthorPhoto}
                                  onChange={(e) => setBlogAuthorPhoto(e.target.value)}
                                  style={{ fontSize: '13px' }}
                                />
                              </div>

                              <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
                                <label className={styles.formLabel}>Designation</label>
                                <input
                                  type="text"
                                  className={styles.loginInput}
                                  value={blogAuthorDesignation}
                                  onChange={(e) => setBlogAuthorDesignation(e.target.value)}
                                  style={{ fontSize: '13px' }}
                                />
                              </div>

                              <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                                <label className={styles.formLabel}>Bio</label>
                                <textarea
                                  className={styles.loginInput}
                                  value={blogAuthorBio}
                                  onChange={(e) => setBlogAuthorBio(e.target.value)}
                                  style={{ height: '60px', resize: 'none', fontSize: '13px' }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons footer */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1.25rem' }}>
                          <button type="button" className={styles.backBtn} style={{ width: 'auto', padding: '0 1.25rem', height: '40px', fontSize: '14px' }} onClick={() => { setIsBlogModalOpen(false); setEditingBlog(null); }}>
                            Cancel
                          </button>
                          <button type="submit" className={styles.loginBtn} style={{ width: 'auto', padding: '0 1.5rem', height: '40px', fontSize: '14px', backgroundColor: '#fb923c', border: 'none', fontWeight: 600 }}>
                            {editingBlog ? 'Save Changes' : 'Create Post'}
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className={styles.panelCard}>
                      <div className={styles.panelHeader} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem', padding: '1.75rem 2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                          <div>
                            <h3 className={styles.panelTitle} style={{ fontSize: '24px', textTransform: 'none', fontWeight: 700, margin: 0 }}>Blogs</h3>
                            <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0 0' }}>Manage and write dynamic blog posts.</p>
                          </div>
                          <button className={styles.addBtn} onClick={handleCreateBlog} style={{ backgroundColor: '#00a8b5', border: 'none' }}>
                            + Add Blog
                          </button>
                        </div>
                        <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-start', marginTop: '0.5rem' }}>
                          <div className={styles.searchWrapper} style={{ maxWidth: '320px', width: '100%', backgroundColor: '#fff', border: '1px solid #e2e2e8' }}>
                            <span className={styles.searchIcon}>🔍</span>
                            <input
                              type="text"
                              placeholder="Search blogs..."
                              className={styles.searchInput}
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className={styles.tableWrapper}>
                        {(() => {
                          const filteredBlogs = blogs.filter(blog =>
                            (blog.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (blog.category || '').toLowerCase().includes(searchQuery.toLowerCase())
                          );
                          if (filteredBlogs.length === 0) {
                            return <div className={styles.emptyState}>No blogs found.</div>;
                          }
                          return (
                            <table className={styles.table}>
                              <thead>
                                <tr>
                                  <th className={styles.th}>Cover</th>
                                  <th className={styles.th}>Title</th>
                                  <th className={styles.th}>Category</th>
                                  <th className={styles.th}>Author</th>
                                  <th className={styles.th}>Status</th>
                                  <th className={styles.th} style={{ textAlign: 'right', paddingRight: '2rem' }}>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredBlogs.map(blog => (
                                  <tr key={blog.id} className={styles.tr}>
                                    <td className={styles.td} style={{ width: '80px' }}>
                                      <img
                                        src={blog.image || 'https://ik.imagekit.io/zp0tch54w/RHST/wmremove-transformed.png'}
                                        alt={blog.title}
                                        style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #eee' }}
                                        onError={(e) => {
                                          e.currentTarget.onerror = null;
                                          e.currentTarget.src = 'https://ik.imagekit.io/zp0tch54w/RHST/wmremove-transformed.png';
                                        }}
                                      />
                                    </td>
                                    <td className={styles.td} style={{ fontWeight: 600, color: '#111', fontSize: '14.5px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                      {blog.title}
                                    </td>
                                    <td className={styles.td} style={{ color: '#555', fontSize: '13.5px' }}>
                                      <span style={{ textTransform: 'uppercase', fontSize: '12px', fontWeight: 600, color: '#00a8b5' }}>
                                        {blog.category}
                                      </span>
                                    </td>
                                    <td className={styles.td} style={{ color: '#555', fontSize: '13.5px' }}>
                                      {blog.authorName}
                                    </td>
                                    <td className={styles.td}>
                                      <span className={blog.status === 'Draft' ? styles.badgeHidden : styles.badgeVisible} style={blog.status === 'Scheduled' ? { backgroundColor: '#fef3c7', color: '#d97706' } : undefined}>
                                        {blog.status}
                                      </span>
                                    </td>
                                    <td className={styles.td} style={{ textAlign: 'right', paddingRight: '2rem' }}>
                                      <button className={styles.editBtn} onClick={() => handleEditBlog(blog)} style={{ fontWeight: 600 }}>
                                        Edit
                                      </button>
                                      <button className={styles.deleteBtn} onClick={() => handleDeleteBlog(blog.id)} style={{ fontWeight: 600 }}>
                                        Delete
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* === CATEGORIES TAB === */}
              {activeTab === 'categories' && (
                <div className={styles.panelCard}>
                  <div className={styles.panelHeader} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem', padding: '1.75rem 2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <div>
                        <h3 className={styles.panelTitle} style={{ fontSize: '24px', textTransform: 'none', fontWeight: 700, margin: 0 }}>Categories</h3>
                        <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0 0' }}>Organize your hardware components into logical groups.</p>
                      </div>
                      <button className={styles.addBtn} onClick={() => setIsAddCategoryOpen(true)} style={{ backgroundColor: '#00a8b5', border: 'none' }}>
                        + Add Category
                      </button>
                    </div>
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-start', marginTop: '0.5rem' }}>
                      <div className={styles.searchWrapper} style={{ maxWidth: '320px', width: '100%', backgroundColor: '#fff', border: '1px solid #e2e2e8' }}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                          type="text"
                          placeholder="Search categories..."
                          className={styles.searchInput}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.tableWrapper}>
                    {filteredCategories.length === 0 ? (
                      <div className={styles.emptyState}>No categories found.</div>
                    ) : (
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th className={styles.th}>Category Name</th>
                            <th className={styles.th}>Slug</th>
                            <th className={styles.th}>Parent Group</th>
                            <th className={styles.th}>Status</th>
                            <th className={styles.th} style={{ textAlign: 'right', paddingRight: '2rem' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCategories.map(cat => (
                            <tr key={cat.id} className={styles.tr}>
                              <td className={styles.td}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                  <img
                                    src={cat.image || '/images/default_category.png'}
                                    alt={cat.name}
                                    style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #eee', backgroundColor: '#fcfcfd', padding: '2px' }}
                                    onError={(e) => {
                                      e.currentTarget.onerror = null;
                                      e.currentTarget.src = '/images/default_category.png';
                                    }}
                                  />
                                  <span style={{ fontWeight: 600, color: '#111', fontSize: '14.5px' }}>{cat.name}</span>
                                </div>
                              </td>
                              <td className={styles.td} style={{ fontFamily: 'monospace', color: '#777', fontSize: '13px', textTransform: 'uppercase' }}>
                                {cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}
                              </td>
                              <td className={styles.td}>
                                <span className={styles.badgeParent}>
                                  {cat.parentGroup && cat.parentGroup !== 'None' ? cat.parentGroup : 'Main Group'}
                                </span>
                              </td>
                              <td className={styles.td}>
                                <span className={styles.badgeVisible}>
                                  {cat.status || 'Visible'}
                                </span>
                              </td>
                              <td className={styles.td} style={{ textAlign: 'right', paddingRight: '2rem' }}>
                                <button className={styles.editBtn} onClick={() => handleEditCategory(cat)} style={{ fontWeight: 600 }}>
                                  Edit
                                </button>
                                <button className={styles.deleteBtn} onClick={() => handleDeleteCategory(cat.id)} style={{ fontWeight: 600 }}>
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* === PRODUCTS TAB === */}
              {activeTab === 'products' && (
                <div className={styles.panelCard}>
                  <div className={styles.panelHeader}>
                    <h3 className={styles.panelTitle}>Product Inventory</h3>
                    <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <button className={styles.addBtn} onClick={() => setIsAddProductOpen(true)}>
                        + Add Product
                      </button>
                      <button className={styles.exportBtn} onClick={() => setIsImportProductOpen(true)}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Import CSV
                      </button>
                      <button className={styles.exportBtn} onClick={handleExportProductsCSV}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Export CSV
                      </button>
                      <button
                        className={styles.exportBtn}
                        onClick={handleAssignSellersToAllProducts}
                        disabled={isAssigningSellers}
                        title="Auto-map verified sellers to all products by category"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="23 4 23 10 17 10" />
                          <polyline points="1 20 1 14 7 14" />
                          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                        </svg>
                        {isAssigningSellers ? 'Assigning...' : 'Assign Sellers'}
                      </button>
                      <div className={styles.searchWrapper}>
                        <input
                          type="text"
                          placeholder="Search inventory..."
                          className={styles.searchInput}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.tableWrapper}>
                    {adminProductsLoading ? (
                      <div className={styles.emptyState}>Loading inventory records...</div>
                    ) : filteredProducts.length === 0 ? (
                      <div className={styles.emptyState}>No products found in database.</div>
                    ) : (
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th className={styles.th}>Image</th>
                            <th className={styles.th}>Product Name</th>
                            <th className={styles.th}>SKU</th>
                            <th className={styles.th}>Category</th>
                            <th className={styles.th}>Supplier / Seller</th>
                            <th className={styles.th}>Price</th>
                            <th className={styles.th}>Stock</th>
                            <th className={styles.th}>Status</th>
                            <th className={styles.th}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.map(prod => (
                            <tr key={prod.id} className={styles.tr}>
                              <td className={styles.td}>
                                <img src={prod.image} alt={prod.name} style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #eee' }} />
                              </td>
                              <td className={styles.td} style={{ fontWeight: 500 }}>{prod.name}</td>
                              <td className={styles.td} style={{ fontFamily: 'monospace', color: '#666', fontSize: '13.5px' }}>{prod.sku || 'N/A'}</td>
                              <td className={styles.td}>
                                <span className={`${styles.badge}`} style={{ background: '#f5f5f7', color: '#555', border: '1px solid #e1e1e6', borderRadius: '100px', padding: '4px 12px', fontSize: '13px' }}>
                                  {prod.category}
                                </span>
                              </td>
                              <td className={styles.td}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontWeight: 600, color: '#0f766e', fontSize: '13px' }}>
                                    {prod.sellerName || 'Auto-Assigned'}
                                  </span>
                                  {prod.sellerLocation && (
                                    <span style={{ fontSize: '11px', color: '#888' }}>📍 {prod.sellerLocation}</span>
                                  )}
                                </div>
                              </td>
                              <td className={styles.td} style={{ color: '#111', fontWeight: 600 }}>{prod.price}</td>
                              <td className={styles.td} style={{ fontWeight: 500 }}>{prod.stock !== undefined ? prod.stock : 'N/A'}</td>
                              <td className={styles.td}>
                                <span className={`${styles.badge} ${prod.status === 'DRAFT' ? styles.badgeDraft : styles.badgePublished}`}>
                                  {prod.status || 'PUBLISHED'}
                                </span>
                              </td>
                              <td className={styles.td}>
                                <button className={styles.editBtn} onClick={() => handleEditProduct(prod)}>
                                  Edit
                                </button>
                                <button className={styles.deleteBtn} onClick={() => handleDeleteProduct(prod.id)}>
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {adminProductsTotalPages > 1 && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1.25rem 2rem',
                      borderTop: '1px solid #edf2f7',
                      backgroundColor: '#fafbfc',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      borderRadius: '0 0 12px 12px'
                    }}>
                      <div style={{ fontSize: '13.5px', color: '#64748b', fontWeight: 500 }}>
                        Showing {(adminProductsPage - 1) * adminProductsLimit + 1} to {Math.min(adminProductsPage * adminProductsLimit, adminProductsTotal)} of {adminProductsTotal.toLocaleString()} products
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <select
                          value={adminProductsLimit}
                          onChange={(e) => {
                            const newLimit = parseInt(e.target.value, 10);
                            setAdminProductsLimit(newLimit);
                            fetchAdminProducts(1, newLimit, searchQuery);
                          }}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            fontSize: '13px',
                            color: '#334155',
                            backgroundColor: '#fff',
                            cursor: 'pointer'
                          }}
                        >
                          <option value={25}>25 / page</option>
                          <option value={50}>50 / page</option>
                          <option value={100}>100 / page</option>
                        </select>
                        <button
                          disabled={adminProductsPage <= 1}
                          onClick={() => fetchAdminProducts(adminProductsPage - 1, adminProductsLimit, searchQuery)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            backgroundColor: adminProductsPage <= 1 ? '#f1f5f9' : '#fff',
                            color: adminProductsPage <= 1 ? '#94a3b8' : '#0f172a',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: adminProductsPage <= 1 ? 'not-allowed' : 'pointer'
                          }}
                        >
                          Prev
                        </button>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155', padding: '0 6px' }}>
                          Page {adminProductsPage} of {adminProductsTotalPages}
                        </span>
                        <button
                          disabled={adminProductsPage >= adminProductsTotalPages}
                          onClick={() => fetchAdminProducts(adminProductsPage + 1, adminProductsLimit, searchQuery)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            backgroundColor: adminProductsPage >= adminProductsTotalPages ? '#f1f5f9' : '#fff',
                            color: adminProductsPage >= adminProductsTotalPages ? '#94a3b8' : '#0f172a',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: adminProductsPage >= adminProductsTotalPages ? 'not-allowed' : 'pointer'
                          }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* === SELLERS TAB === */}
              {activeTab === 'sellers' && (
                <div className={styles.panelCard}>
                  <div className={styles.panelHeader} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem', padding: '1.75rem 2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <h3 className={styles.panelTitle} style={{ fontSize: '24px', textTransform: 'none', fontWeight: 700, margin: 0 }}>
                          Sellers & Verified Suppliers
                        </h3>
                        <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0 0' }}>
                          IndiaMART-style verified suppliers, manufacturers & distributors assigned to main product categories.
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button className={styles.addBtn} onClick={() => setIsAddSellerOpen(true)} style={{ backgroundColor: '#00a8b5', border: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                          + Add Supplier
                        </button>
                        <button className={styles.exportBtn} onClick={() => setIsImportSellerOpen(true)}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                          Import CSV
                        </button>
                        <button className={styles.exportBtn} onClick={handleExportSellersCSV}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                          Export CSV
                        </button>
                        <button
                          className={styles.exportBtn}
                          onClick={handleAssignSellersToAllProducts}
                          disabled={isAssigningSellers}
                          title="Assign verified suppliers to all products in catalog"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 4 23 10 17 10" />
                            <polyline points="1 20 1 14 7 14" />
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                          </svg>
                          {isAssigningSellers ? 'Assigning...' : 'Assign to All Products'}
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div className={styles.searchWrapper} style={{ maxWidth: '340px', width: '100%', backgroundColor: '#fff', border: '1px solid #e2e2e8' }}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                          type="text"
                          placeholder="Search suppliers by name, city, GST, category..."
                          className={styles.searchInput}
                          value={sellerSearchQuery}
                          onChange={(e) => setSellerSearchQuery(e.target.value)}
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#555' }}>Main Category:</span>
                        <select
                          className={styles.formSelect}
                          style={{ width: 'auto', minWidth: '180px', height: '38px', padding: '0 0.75rem', fontSize: '13.5px' }}
                          value={sellerCategoryFilter}
                          onChange={(e) => setSellerCategoryFilter(e.target.value)}
                        >
                          <option value="All">All Categories ({sellers.length})</option>
                          {categories.map((c) => {
                            const count = sellers.filter(s => s.mainCategory.toLowerCase() === c.name.toLowerCase()).length;
                            return (
                              <option key={c.id} value={c.name}>
                                {c.name} {count > 0 ? `(${count})` : ''}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className={styles.tableWrapper}>
                    {filteredSellers.length === 0 ? (
                      <div className={styles.emptyState}>No suppliers found matching criteria.</div>
                    ) : (
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th className={styles.th}>Company / Supplier</th>
                            <th className={styles.th}>Main Category</th>
                            <th className={styles.th}>Location</th>
                            <th className={styles.th}>Contact Info</th>
                            <th className={styles.th}>GST Number</th>
                            <th className={styles.th}>TrustSEAL / Rating</th>
                            <th className={styles.th}>Status</th>
                            <th className={styles.th} style={{ textAlign: 'right', paddingRight: '2rem' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedSellers.map((s: Seller) => (
                            <tr key={s.id} className={styles.tr}>
                              <td className={styles.td}>
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ fontWeight: 600, color: '#111', fontSize: '14px' }}>{s.name}</span>
                                    {s.verified && (
                                      <span title="IndiaMART Verified Supplier" style={{ color: '#059669', fontSize: '13px', fontWeight: 'bold' }}>✓</span>
                                    )}
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                                    {s.natureOfBusiness || 'Verified Supplier'} {s.memberSince ? `• Since ${s.memberSince}` : ''}
                                  </div>
                                </div>
                              </td>
                              <td className={styles.td}>
                                <span className={styles.badgeParent} style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                                  {s.mainCategory}
                                </span>
                              </td>
                              <td className={styles.td}>
                                <div style={{ fontSize: '13.5px', color: '#333' }}>📍 {s.location}</div>
                                {s.responseTime && (
                                  <div style={{ fontSize: '11.5px', color: '#777', marginTop: '2px' }}>⚡ {s.responseTime}</div>
                                )}
                              </td>
                              <td className={styles.td}>
                                <div style={{ fontSize: '13px', color: '#222', fontWeight: 500 }}>{s.contactPerson || 'N/A'}</div>
                                {s.phone && <div style={{ fontSize: '12px', color: '#555' }}>📞 {s.phone}</div>}
                                {s.email && <div style={{ fontSize: '12px', color: '#00a8b5' }}>✉️ {s.email}</div>}
                              </td>
                              <td className={styles.td} style={{ fontFamily: 'monospace', fontSize: '12.5px', color: '#444' }}>
                                {s.gstNumber || 'N/A'}
                              </td>
                              <td className={styles.td}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <span style={{ color: '#f59e0b', fontSize: '12px' }}>★</span>
                                  <span style={{ fontWeight: 600, fontSize: '13px', color: '#333' }}>{s.rating || 4.8}</span>
                                </div>
                                <div style={{ fontSize: '11.5px', color: '#059669', fontWeight: 500, marginTop: '2px' }}>
                                  {s.trustScore || 'Verified TrustSEAL'}
                                </div>
                              </td>
                              <td className={styles.td}>
                                <span className={styles.badgeVisible}>
                                  {s.status || 'Active'}
                                </span>
                              </td>
                              <td className={styles.td} style={{ textAlign: 'right', paddingRight: '2rem' }}>
                                <button className={styles.editBtn} onClick={() => handleEditSeller(s)} style={{ fontWeight: 600 }}>
                                  Edit
                                </button>
                                <button className={styles.deleteBtn} onClick={() => handleDeleteSeller(s.id, s.name)} style={{ fontWeight: 600 }}>
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {totalSellerPages > 1 && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1.25rem 2rem',
                      borderTop: '1px solid #edf2f7',
                      backgroundColor: '#fafbfc',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      borderRadius: '0 0 12px 12px'
                    }}>
                      <div style={{ fontSize: '13.5px', color: '#64748b', fontWeight: 500 }}>
                        Showing {(adminSellersPage - 1) * adminSellersLimit + 1} to {Math.min(adminSellersPage * adminSellersLimit, filteredSellers.length)} of {filteredSellers.length.toLocaleString()} suppliers
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <select
                          value={adminSellersLimit}
                          onChange={(e) => {
                            setAdminSellersLimit(parseInt(e.target.value, 10));
                            setAdminSellersPage(1);
                          }}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            fontSize: '13px',
                            color: '#334155',
                            backgroundColor: '#fff',
                            cursor: 'pointer'
                          }}
                        >
                          <option value={25}>25 / page</option>
                          <option value={50}>50 / page</option>
                          <option value={100}>100 / page</option>
                        </select>
                        <button
                          disabled={adminSellersPage <= 1}
                          onClick={() => setAdminSellersPage(prev => Math.max(1, prev - 1))}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            backgroundColor: adminSellersPage <= 1 ? '#f1f5f9' : '#fff',
                            color: adminSellersPage <= 1 ? '#94a3b8' : '#0f172a',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: adminSellersPage <= 1 ? 'not-allowed' : 'pointer'
                          }}
                        >
                          Prev
                        </button>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155', padding: '0 6px' }}>
                          Page {adminSellersPage} of {totalSellerPages}
                        </span>
                        <button
                          disabled={adminSellersPage >= totalSellerPages}
                          onClick={() => setAdminSellersPage(prev => Math.min(totalSellerPages, prev + 1))}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            backgroundColor: adminSellersPage >= totalSellerPages ? '#f1f5f9' : '#fff',
                            color: adminSellersPage >= totalSellerPages ? '#94a3b8' : '#0f172a',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: adminSellersPage >= totalSellerPages ? 'not-allowed' : 'pointer'
                          }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}



              {/* === ORDERS TAB === */}
              {activeTab === 'orders' && (
                <div>
                  <div className={styles.ordersHeader}>
                    <div>
                      <h3 className={styles.panelTitle} style={{ fontSize: '24px', textTransform: 'none', fontWeight: 700, margin: 0 }}>Orders</h3>
                      <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0 0' }}>Manage and track customer orders.</p>
                    </div>
                    <button className={styles.exportBtn} onClick={handleExportCSV}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Export
                    </button>
                  </div>

                  {/* Orders Stats Grid */}
                  <div className={styles.statsGrid} style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
                    <div className={styles.statCard}>
                      <div className={styles.statIconWrapper} style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
                        📅
                      </div>
                      <div className={styles.statInfo}>
                        <span className={styles.statLabel} style={{ fontSize: '12px' }}>Total Orders</span>
                        <span className={styles.statVal}>{totalOrders}</span>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statIconWrapper} style={{ backgroundColor: '#fff7ed', color: '#ea580c' }}>
                        🕒
                      </div>
                      <div className={styles.statInfo}>
                        <span className={styles.statLabel} style={{ fontSize: '12px' }}>Pending</span>
                        <span className={styles.statVal}>{ordersPendingCount}</span>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statIconWrapper} style={{ backgroundColor: '#faf5ff', color: '#7c3aed' }}>
                        🚚
                      </div>
                      <div className={styles.statInfo}>
                        <span className={styles.statLabel} style={{ fontSize: '12px' }}>Shipped</span>
                        <span className={styles.statVal}>{ordersShippedCount}</span>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statIconWrapper} style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                        ☑️
                      </div>
                      <div className={styles.statInfo}>
                        <span className={styles.statLabel} style={{ fontSize: '12px' }}>Completed</span>
                        <span className={styles.statVal}>{ordersCompletedCount}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.panelCard}>
                    <div className={styles.ordersFilterRow} style={{ padding: '1.5rem 1.5rem 0 1.5rem' }}>
                      <div className={styles.ordersSearchBox}>
                        <span style={{ color: '#888', fontSize: '15px' }}>🔍</span>
                        <input
                          type="text"
                          placeholder="Search orders by ID or customer..."
                          className={styles.ordersSearchInput}
                          value={ordersSearchQuery}
                          onChange={(e) => setOrdersSearchQuery(e.target.value)}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <select
                          className={styles.filterBtn}
                          value={ordersStatusFilter}
                          onChange={(e) => setOrdersStatusFilter(e.target.value as any)}
                          style={{ outline: 'none' }}
                        >
                          <option value="All">All Statuses</option>
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.tableWrapper}>
                      {filteredOrdersList.length === 0 ? (
                        <div className={styles.emptyState}>No orders matched the filter criteria.</div>
                      ) : (
                        <table className={styles.table}>
                          <thead>
                            <tr>
                              <th className={styles.th}>Order ID</th>
                              <th className={styles.th}>Customer</th>
                              <th className={styles.th}>Date</th>
                              <th className={styles.th}>Total Amount</th>
                              <th className={styles.th}>Status</th>
                              <th className={styles.th}>Payment</th>
                              <th className={styles.th}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredOrdersList.map(order => {
                              const orderStatus = order.status || 'Pending';
                              const paymentStatus = order.paymentStatus || 'PENDING';
                              return (
                                <tr key={order.id} className={styles.tr}>
                                  <td className={styles.td} style={{ fontWeight: 600 }}>#{order.orderId}</td>
                                  <td className={styles.td}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                      <span style={{ fontWeight: 600, color: '#111' }}>{order.customer?.name || 'Guest'}</span>
                                      <span style={{ fontSize: '12.5px', color: '#666', marginTop: '2px' }}>{order.customer?.email || 'N/A'}</span>
                                    </div>
                                  </td>
                                  <td className={styles.td}>
                                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </td>
                                  <td className={styles.td} style={{ fontWeight: 700, color: '#111' }}>
                                    ₹{order.subtotal.toLocaleString()}
                                  </td>
                                  <td className={styles.td}>
                                    <span className={`${styles.statusBadge} ${orderStatus === 'Pending' ? styles.statusBadgePending :
                                        orderStatus === 'Shipped' ? styles.statusBadgeShipped :
                                          orderStatus === 'Completed' ? styles.statusBadgeCompleted : styles.statusBadgeCancelled
                                      }`}>
                                      {orderStatus === 'Pending' && '🕒 '}
                                      {orderStatus === 'Shipped' && '🚚 '}
                                      {orderStatus === 'Completed' && '☑️ '}
                                      {orderStatus === 'Cancelled' && '🚫 '}
                                      {orderStatus}
                                    </span>
                                  </td>
                                  <td className={styles.td}>
                                    <span className={`${styles.paymentBadge} ${paymentStatus === 'COMPLETED' ? styles.paymentBadgeCompleted : styles.paymentBadgePending
                                      }`}>
                                      {paymentStatus}
                                    </span>
                                  </td>
                                  <td className={styles.td}>
                                    <div className={styles.actionMenuContainer}>
                                      <button className={styles.actionTrigger}>
                                        •••
                                      </button>
                                      <div className={styles.actionDropdown}>
                                        <button
                                          className={styles.actionItem}
                                          onClick={() => setSelectedOrder(order)}
                                        >
                                          👁️ View Details
                                        </button>
                                        <button
                                          className={styles.actionItem}
                                          onClick={() => {
                                            setUpdatingOrder(order);
                                            setUpdatingOrderStatus(order.status || 'Pending');
                                            setUpdatingOrderPaymentStatus(order.paymentStatus || 'PENDING');
                                            setIsUpdateStatusModalOpen(true);
                                          }}
                                        >
                                          🚚 Update Status
                                        </button>
                                        <button
                                          className={styles.actionItem}
                                          onClick={() => handlePrintInvoice(order)}
                                        >
                                          📄 Invoice
                                        </button>
                                        <button
                                          className={`${styles.actionItem} ${styles.actionItemDanger}`}
                                          onClick={() => handleDeleteOrder(order.id)}
                                        >
                                          🗑️ Delete Order
                                        </button>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* === CUSTOMERS TAB === */}
              {activeTab === 'customers' && (
                <div>
                  {viewingCustomer ? (
                    <div>
                      {/* Customer Profile View */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <button className={styles.backBtn} onClick={() => setViewingCustomer(null)}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                          </svg>
                        </button>
                        <div>
                          <h3 className={styles.panelTitle} style={{ fontSize: '28px', textTransform: 'none', fontWeight: 700, margin: 0 }}>Customer Profile</h3>
                          <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0 0' }}>Detailed overview of customer activity and history.</p>
                        </div>
                      </div>

                      <div className={styles.profileGrid}>
                        {/* Left Column */}
                        <div className={styles.profileLeftCol}>
                          {/* Profile Details Card */}
                          <div className={styles.profileCard}>
                            <div
                              style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 600,
                                fontSize: '32px',
                                backgroundColor: getAvatarStyle(viewingCustomer.name).bg,
                                color: getAvatarStyle(viewingCustomer.name).color,
                                margin: '0 auto 1rem auto'
                              }}
                            >
                              {viewingCustomer.name.charAt(0).toUpperCase()}
                            </div>

                            <h4 className={styles.profileName}>{viewingCustomer.name}</h4>
                            <div className={styles.profileEmail}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                              </svg>
                              {viewingCustomer.email}
                            </div>

                            <div className={styles.profileBadges}>
                              <span className={styles.badgeVerified}>Verified</span>
                              <span className={styles.badgeCustomer}>Customer</span>
                            </div>

                            <hr className={styles.profileDivider} />

                            <div className={styles.profileDetails}>
                              <div className={styles.profileDetailItem}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666' }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                  </svg>
                                  <span>Member Since</span>
                                </div>
                                <span style={{ fontWeight: 600, color: '#333' }}>
                                  {new Date(viewingCustomer.joinedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              </div>

                              <div className={styles.profileDetailItem}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666' }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                  </svg>
                                  <span>Total Orders</span>
                                </div>
                                <span style={{ fontWeight: 600, color: '#333' }}>{viewingCustomer.ordersCount}</span>
                              </div>

                              <div className={styles.profileDetailItem}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666' }}>
                                  <span style={{ fontSize: '13px', fontWeight: 600 }}>₹</span>
                                  <span>Total Spent</span>
                                </div>
                                <span style={{ fontWeight: 700, color: '#10b981' }}>
                                  ₹{viewingCustomer.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Addresses Card */}
                          <div className={styles.profileCard}>
                            <h4 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 1rem 0', color: '#111' }}>Addresses</h4>
                            <div style={{ color: '#888', fontSize: '13.5px', textAlign: 'center', padding: '0.5rem 0' }}>
                              {viewingCustomer.address && viewingCustomer.address !== 'N/A' ? (
                                <div style={{ textAlign: 'left', color: '#333', lineHeight: '1.5' }}>
                                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>Shipping Address:</div>
                                  <div>{viewingCustomer.address}</div>
                                  {viewingCustomer.phone && viewingCustomer.phone !== 'N/A' && (
                                    <div style={{ marginTop: '6px', fontSize: '12.5px', color: '#666' }}>Phone: {viewingCustomer.phone}</div>
                                  )}
                                </div>
                              ) : (
                                'No saved addresses'
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right Column (Order History) */}
                        <div className={styles.profileRightCol}>
                          <div className={styles.profileCard} style={{ minHeight: '380px' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 1rem 0', color: '#111' }}>Order History</h4>
                            {(() => {
                              const customerOrders = orders.filter(
                                o => o.customer && o.customer.email && o.customer.email.toLowerCase() === viewingCustomer.email.toLowerCase()
                              );
                              if (customerOrders.length === 0) {
                                return (
                                  <div className={styles.emptyStateOrderHistory}>
                                    <svg className={styles.emptyStateIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0z" />
                                    </svg>
                                    <div style={{ fontSize: '14px', color: '#888' }}>This customer hasn't placed any orders yet.</div>
                                  </div>
                                );
                              }
                              return (
                                <div className={styles.tableWrapper} style={{ minHeight: 'auto' }}>
                                  <table className={styles.table}>
                                    <thead>
                                      <tr>
                                        <th className={styles.th}>Order ID</th>
                                        <th className={styles.th}>Date</th>
                                        <th className={styles.th}>Total Amount</th>
                                        <th className={styles.th}>Status</th>
                                        <th className={styles.th}>Payment</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {customerOrders.map(order => {
                                        const orderStatus = order.status || 'Pending';
                                        const paymentStatus = order.paymentStatus || 'PENDING';
                                        return (
                                          <tr key={order.id} className={styles.tr}>
                                            <td className={styles.td} style={{ fontWeight: 600 }}>#{order.orderId}</td>
                                            <td className={styles.td}>
                                              {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className={styles.td} style={{ fontWeight: 700, color: '#111' }}>
                                              ₹{order.subtotal.toLocaleString()}
                                            </td>
                                            <td className={styles.td}>
                                              <span className={`${styles.statusBadge} ${orderStatus === 'Pending' ? styles.statusBadgePending :
                                                  orderStatus === 'Shipped' ? styles.statusBadgeShipped :
                                                    orderStatus === 'Completed' ? styles.statusBadgeCompleted : styles.statusBadgeCancelled
                                                }`}>
                                                {orderStatus}
                                              </span>
                                            </td>
                                            <td className={styles.td}>
                                              <span className={`${styles.paymentBadge} ${paymentStatus === 'COMPLETED' ? styles.paymentBadgeCompleted : styles.paymentBadgePending
                                                }`}>
                                                {paymentStatus}
                                              </span>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* Customers Directory View */}
                      <div className={styles.ordersHeader} style={{ marginBottom: '1.5rem' }}>
                        <div>
                          <h3 className={styles.panelTitle} style={{ fontSize: '28px', textTransform: 'none', fontWeight: 700, margin: 0 }}>Customers</h3>
                          <p style={{ color: '#666', fontSize: '14.5px', margin: '4px 0 0 0' }}>Manage your customer database and viewing their activity.</p>
                        </div>
                        <button className={styles.exportBtn} onClick={handleExportCustomersCSV}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                          Export Data
                        </button>
                      </div>

                      <div className={styles.panelCard}>
                        <div className={styles.ordersFilterRow} style={{ padding: '1.5rem 1.5rem 0 1.5rem', borderBottom: 'none' }}>
                          <div className={styles.ordersSearchBox}>
                            <span style={{ color: '#888', fontSize: '15px' }}>🔍</span>
                            <input
                              type="text"
                              placeholder="Search by name or email..."
                              className={styles.ordersSearchInput}
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>

                          <button className={styles.filterBtn} style={{ outline: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 12px' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                            </svg>
                          </button>
                        </div>

                        <div className={styles.tableWrapper}>
                          {filteredCustomers.length === 0 ? (
                            <div className={styles.emptyState}>No customers logged. Placed orders generate customers automatically.</div>
                          ) : (
                            <table className={styles.table}>
                              <thead>
                                <tr>
                                  <th className={styles.th}>Customer</th>
                                  <th className={styles.th}>Email</th>
                                  <th className={styles.th}>Joined Date</th>
                                  <th className={styles.th}>Orders</th>
                                  <th className={styles.th}>Total Spent</th>
                                  <th className={styles.th}>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredCustomers.map((cust: any, index) => (
                                  <tr key={cust.email || index} className={styles.tr}>
                                    <td className={styles.td}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div
                                          style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 600,
                                            fontSize: '14px',
                                            backgroundColor: getAvatarStyle(cust.name).bg,
                                            color: getAvatarStyle(cust.name).color
                                          }}
                                        >
                                          {cust.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span style={{ fontWeight: 600, color: '#111' }}>{cust.name}</span>
                                      </div>
                                    </td>
                                    <td className={styles.td}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                          <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                        <span>{cust.email}</span>
                                      </div>
                                    </td>
                                    <td className={styles.td}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                          <line x1="16" y1="2" x2="16" y2="6" />
                                          <line x1="8" y1="2" x2="8" y2="6" />
                                          <line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                        <span>
                                          {cust.joinedDate ? new Date(cust.joinedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                        </span>
                                      </div>
                                    </td>
                                    <td className={styles.td}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#444' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                          <line x1="3" y1="6" x2="21" y2="6" />
                                          <path d="M16 10a4 4 0 0 1-8 0" />
                                        </svg>
                                        <span style={{ fontWeight: 600 }}>{cust.ordersCount}</span>
                                      </div>
                                    </td>
                                    <td className={styles.td}>
                                      <span style={{ color: '#10b981', fontWeight: 700 }}>
                                        ₹{cust.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                      </span>
                                    </td>
                                    <td className={styles.td}>
                                      <div className={styles.actionMenuContainer}>
                                        <button className={styles.actionTrigger}>•••</button>
                                        <div className={styles.actionDropdown}>
                                          <button
                                            className={styles.actionItem}
                                            onClick={() => setViewingCustomer(cust)}
                                          >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                              <circle cx="12" cy="7" r="4" />
                                            </svg>
                                            View Profile
                                          </button>
                                          <button
                                            className={styles.actionItem}
                                            onClick={() => {
                                              setOrdersSearchQuery(cust.email);
                                              setActiveTab('orders');
                                            }}
                                          >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                                              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                              <line x1="3" y1="6" x2="21" y2="6" />
                                              <path d="M16 10a4 4 0 0 1-8 0" />
                                            </svg>
                                            View Orders
                                          </button>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* === COUPONS TAB === */}
              {activeTab === 'coupons' && (
                <div>
                  {/* Coupon Stats Row */}
                  <div className={styles.statsGrid} style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '1.5rem' }}>
                    <div className={styles.statCard}>
                      <div className={styles.statIconWrapper}>
                        🏷️
                      </div>
                      <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Active Coupons</span>
                        <span className={styles.statVal}>{activeCouponsCount}</span>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statIconWrapper}>
                        🔄
                      </div>
                      <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Total Uses</span>
                        <span className={styles.statVal}>{totalUsesCount}</span>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={`${styles.statIconWrapper} ${styles.statIconWrapperGreen}`}>
                        ₹
                      </div>
                      <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Total Discounted</span>
                        <span className={styles.statVal}>₹{totalDiscountApplied.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.panelCard}>
                    <div className={styles.panelHeader} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem', padding: '1.75rem 2rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <div>
                          <h3 className={styles.panelTitle} style={{ fontSize: '24px', textTransform: 'none', fontWeight: 700, margin: 0 }}>Discount Coupons</h3>
                          <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0 0' }}>Create and manage promo codes for store checkout.</p>
                        </div>
                        <button className={styles.addBtn} onClick={() => setIsAddCouponOpen(true)} style={{ backgroundColor: '#00a8b5', border: 'none' }}>
                          + Create Coupon
                        </button>
                      </div>
                      <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-start', marginTop: '0.5rem' }}>
                        <div className={styles.searchWrapper} style={{ maxWidth: '320px', width: '100%', backgroundColor: '#fff', border: '1px solid #e2e2e8' }}>
                          <span className={styles.searchIcon}>🔍</span>
                          <input
                            type="text"
                            placeholder="Search by code..."
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className={styles.tableWrapper}>
                      {filteredCoupons.length === 0 ? (
                        <div className={styles.emptyState}>No coupons active.</div>
                      ) : (
                        <table className={styles.table}>
                          <thead>
                            <tr>
                              <th className={styles.th}>Code</th>
                              <th className={styles.th}>Type</th>
                              <th className={styles.th}>Value</th>
                              <th className={styles.th}>Min. Purchase</th>
                              <th className={styles.th}>Validity</th>
                              <th className={styles.th}>Usage</th>
                              <th className={styles.th}>Status</th>
                              <th className={styles.th}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredCoupons.map(coup => {
                              const expired = isCouponExpired(coup.expiryDate);
                              return (
                                <tr key={coup.id} className={styles.tr}>
                                  <td className={styles.td}>
                                    <span className={styles.badge} style={{ backgroundColor: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', fontSize: '13px', fontWeight: 'bold' }}>
                                      {coup.code}
                                    </span>
                                  </td>
                                  <td className={styles.td} style={{ textTransform: 'capitalize', fontWeight: 500 }}>
                                    {coup.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                                  </td>
                                  <td className={styles.td} style={{ fontWeight: 600 }}>
                                    {coup.type === 'percentage' ? `${coup.discount}%` : `₹${coup.discount.toLocaleString()}`}
                                  </td>
                                  <td className={styles.td} style={{ fontWeight: 500 }}>
                                    {coup.minPurchase > 0 ? `₹${coup.minPurchase.toLocaleString()}` : 'No Minimum'}
                                  </td>
                                  <td className={styles.td}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#333' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#666' }}>
                                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                          <line x1="16" y1="2" x2="16" y2="6" />
                                          <line x1="8" y1="2" x2="8" y2="6" />
                                          <line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                        <span>
                                          {coup.expiryDate
                                            ? new Date(coup.expiryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                                            : 'Never Expires'}
                                        </span>
                                      </div>
                                      {expired && (
                                        <span style={{ color: '#ef4444', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', marginTop: '2px' }}>
                                          Expired
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className={styles.td}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '120px' }}>
                                      <span style={{ fontSize: '13px', fontWeight: 500, color: '#555' }}>
                                        {coup.usageCount || 0} / {coup.usageLimit || 100} redemptions
                                      </span>
                                      <div style={{ height: '6px', backgroundColor: '#e4e4e7', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div
                                          style={{
                                            height: '100%',
                                            backgroundColor: '#00a8b5',
                                            width: `${Math.min(100, ((coup.usageCount || 0) / (coup.usageLimit || 100)) * 100)}%`
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </td>
                                  <td className={styles.td}>
                                    <span className={`${styles.badge} ${coup.isActive && !expired ? styles.badgeVisible : styles.badgeDraft}`}>
                                      {coup.isActive && !expired ? 'Active' : expired ? 'Expired' : 'Inactive'}
                                    </span>
                                  </td>
                                  <td className={styles.td}>
                                    <button className={styles.deleteBtn} onClick={() => handleDeleteCoupon(coup.id)} style={{ fontWeight: 600 }}>
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* === HOMEPAGE PROMO BANNER TAB === */}
              {activeTab === 'promo-banner' && (
                <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
                  {/* Header Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                      <h2 style={{ fontSize: '32px', fontWeight: 700, margin: 0, color: '#1a1a1a', fontFamily: "'Outfit', sans-serif" }}>Homepage Banner</h2>
                      <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '15px' }}>Manage the promotional banner on your store's homepage.</p>
                    </div>
                    <button
                      onClick={handleSavePromoBanner}
                      disabled={isSavingPromo}
                      style={{
                        backgroundColor: '#00a8b5',
                        color: 'white',
                        padding: '10px 24px',
                        border: 'none',
                        borderRadius: '30px',
                        fontSize: '15px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(0, 168, 181, 0.2)',
                        transition: 'all 0.2s'
                      }}
                    >
                      {isSavingPromo ? 'Saving...' : 'Save Changes'}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                        <polyline points="17 21 17 13 7 13 7 21" />
                        <polyline points="7 3 7 8 15 8" />
                      </svg>
                    </button>
                  </div>

                  {/* Main Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    {/* Left Column: Settings Form */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {/* Card 1: Content Settings */}
                      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '18px', color: '#00a8b5', fontWeight: 'bold' }}>T</span>
                          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#333' }}>Content Settings</h4>
                        </div>
                        <p style={{ margin: '0 0 1rem 0', fontSize: '13px', color: '#666' }}>Update the text content of your promotional banner.</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4a5568', marginBottom: '6px' }}>Badge Text</label>
                            <input
                              type="text"
                              value={promoBadgeText}
                              onChange={(e) => setPromoBadgeText(e.target.value)}
                              placeholder="e.g. ⚡ Limited Time Offer"
                              style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e0', borderRadius: '8px', fontSize: '14px', color: '#333', backgroundColor: '#fff' }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4a5568', marginBottom: '6px' }}>Banner Title</label>
                            <input
                              type="text"
                              value={promoTitle}
                              onChange={(e) => setPromoTitle(e.target.value)}
                              placeholder="e.g. Summer Gaming Upgrade Sale"
                              style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e0', borderRadius: '8px', fontSize: '14px', color: '#333', backgroundColor: '#fff' }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4a5568', marginBottom: '6px' }}>Description Text</label>
                            <textarea
                              value={promoDescription}
                              onChange={(e) => setPromoDescription(e.target.value)}
                              placeholder="Describe your promotion details..."
                              rows={4}
                              style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e0', borderRadius: '8px', fontSize: '14px', resize: 'vertical', color: '#333', backgroundColor: '#fff' }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Card 2: Action Button */}
                      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '18px', color: '#00a8b5' }}>🔗</span>
                          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#333' }}>Action Button</h4>
                        </div>
                        <p style={{ margin: '0 0 1rem 0', fontSize: '13px', color: '#666' }}>Configure where the banner leads your customers.</p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4a5568', marginBottom: '6px' }}>Button Text</label>
                            <input
                              type="text"
                              value={promoButtonText}
                              onChange={(e) => setPromoButtonText(e.target.value)}
                              placeholder="Shop the Sale"
                              style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e0', borderRadius: '8px', fontSize: '14px', color: '#333', backgroundColor: '#fff' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4a5568', marginBottom: '6px' }}>Button Link</label>
                            <input
                              type="text"
                              value={promoButtonLink}
                              onChange={(e) => setPromoButtonLink(e.target.value)}
                              placeholder="/shop"
                              style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e0', borderRadius: '8px', fontSize: '14px', color: '#333', backgroundColor: '#fff' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Visuals, Timer & Preview */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {/* Card 3: Visuals & Timer */}
                      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '18px', color: '#00a8b5' }}>🖼️</span>
                          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#333' }}>Visuals & Timer</h4>
                        </div>
                        <p style={{ margin: '0 0 1rem 0', fontSize: '13px', color: '#666' }}>Manage the image and countdown timer.</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4a5568', marginBottom: '6px' }}>Image URL</label>
                            <input
                              type="text"
                              value={promoImageUrl}
                              onChange={(e) => setPromoImageUrl(e.target.value)}
                              placeholder="Image URL"
                              style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e0', borderRadius: '8px', fontSize: '14px', color: '#333', backgroundColor: '#fff' }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4a5568', marginBottom: '6px' }}>Expiry Date (for Countdown)</label>
                            <input
                              type="datetime-local"
                              value={promoExpiryDate}
                              onChange={(e) => setPromoExpiryDate(e.target.value)}
                              style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e0', borderRadius: '8px', fontSize: '14px', color: '#333', backgroundColor: '#fff' }}
                            />
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px' }}>
                            <div>
                              <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#333' }}>Banner Status</h5>
                              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#666' }}>Visible on the homepage when active.</p>
                            </div>
                            <div
                              onClick={() => setPromoIsActive(v => !v)}
                              style={{
                                width: '48px', height: '26px', borderRadius: '20px', cursor: 'pointer',
                                backgroundColor: promoIsActive ? '#00a8b5' : '#cbd5e0',
                                position: 'relative', transition: 'all 0.2s'
                              }}
                            >
                              <div style={{
                                width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white',
                                position: 'absolute', top: '3px', left: promoIsActive ? '25px' : '3px',
                                transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
                              }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card 4: Live Preview */}
                      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                          <span style={{ fontSize: '18px', color: '#00a8b5' }}>👁️</span>
                          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#333' }}>Live Preview (Stylized)</h4>
                        </div>

                        {/* Styled Preview Container */}
                        <div style={{
                          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                          color: '#fff',
                          padding: '1.5rem',
                          borderRadius: '10px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                          boxShadow: '0 10px 25px rgba(15, 23, 42, 0.3)',
                          border: '1px solid rgba(255, 255, 255, 0.08)'
                        }}>
                          {promoBadgeText && (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              padding: '3px 10px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              alignSelf: 'flex-start'
                            }}>
                              {promoBadgeText}
                            </span>
                          )}

                          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, letterSpacing: '0.02em', color: '#fff' }}>
                            {promoTitle || 'Your Banner Title'}
                          </h3>

                          {promoDescription && (
                            <p style={{ margin: 0, fontSize: '12.5px', color: '#94a3b8', lineHeight: '1.5', fontWeight: 300 }}>
                              {promoDescription}
                            </p>
                          )}

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                            {/* Stylized Mock Timer */}
                            <div style={{
                              backgroundColor: 'rgba(0,0,0,0.3)',
                              padding: '5px 12px',
                              borderRadius: '6px',
                              fontSize: '12.5px',
                              fontWeight: 600,
                              fontFamily: 'monospace',
                              letterSpacing: '1px',
                              color: '#94a3b8',
                              border: '1px solid rgba(255, 255, 255, 0.05)'
                            }}>
                              05 : 12 : 45
                            </div>

                            {/* Stylized Button */}
                            <div style={{
                              backgroundColor: '#2563eb',
                              color: 'white',
                              padding: '7px 18px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 600,
                              letterSpacing: '0.02em'
                            }}>
                              {promoButtonText || 'Shop the Sale'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* === QUERIES (SUBMISSIONS) TAB === */}
              {activeTab === 'queries' && (
                <div>
                  {/* Page Header */}
                  <div className={styles.ordersHeader} style={{ marginBottom: '1.5rem' }}>
                    <div>
                      <h3 className={styles.panelTitle} style={{ fontSize: '28px', textTransform: 'none', fontWeight: 700, margin: 0 }}>Customer Queries</h3>
                      <p style={{ color: '#666', fontSize: '14.5px', margin: '4px 0 0 0' }}>Review and respond to messages submitted via the contact form.</p>
                    </div>
                  </div>

                  {/* Submissions Stats Grid */}
                  <div className={styles.statsGrid} style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '1.5rem' }}>
                    <div className={styles.statCard}>
                      <div className={styles.statIconWrapper} style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
                        🕒
                      </div>
                      <div className={styles.statInfo}>
                        <span className={styles.statLabel} style={{ fontSize: '12px' }}>Pending</span>
                        <span className={styles.statVal}>{pendingSubmissionsCount}</span>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statIconWrapper} style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
                        💬
                      </div>
                      <div className={styles.statInfo}>
                        <span className={styles.statLabel} style={{ fontSize: '12px' }}>In Progress</span>
                        <span className={styles.statVal}>{inProgressSubmissionsCount}</span>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statIconWrapper} style={{ backgroundColor: '#ecfdf5', color: '#047857' }}>
                        ☑️
                      </div>
                      <div className={styles.statInfo}>
                        <span className={styles.statLabel} style={{ fontSize: '12px' }}>Resolved</span>
                        <span className={styles.statVal}>{resolvedSubmissionsCount}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.panelCard}>
                    <div className={styles.ordersFilterRow} style={{ padding: '1.5rem 1.5rem 0 1.5rem', borderBottom: 'none' }}>
                      <div className={styles.ordersSearchBox}>
                        <span style={{ color: '#888', fontSize: '15px' }}>🔍</span>
                        <input
                          type="text"
                          placeholder="Search queries..."
                          className={styles.ordersSearchInput}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className={styles.tableWrapper}>
                      {filteredSubmissions.length === 0 ? (
                        <div className={styles.emptyState}>No inquiries match the search filters.</div>
                      ) : (
                        <table className={styles.table}>
                          <thead>
                            <tr>
                              <th className={styles.th}>Customer</th>
                              <th className={styles.th}>Subject</th>
                              <th className={styles.th}>Message Snippet</th>
                              <th className={styles.th}>Date</th>
                              <th className={styles.th}>Status</th>
                              <th className={styles.th}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredSubmissions.map(sub => {
                              const subStatus = sub.status || 'Pending';
                              return (
                                <tr key={sub.id} className={styles.tr}>
                                  <td className={styles.td}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                      <span style={{ fontWeight: 600, color: '#111' }}>{sub.fullName}</span>
                                      <span style={{ fontSize: '12.5px', color: '#666', marginTop: '2px' }}>{sub.email}</span>
                                    </div>
                                  </td>
                                  <td className={styles.td} style={{ fontWeight: 600, color: '#111' }}>
                                    {sub.subject}
                                  </td>
                                  <td className={styles.td} style={{ color: '#666' }}>
                                    {sub.message.length > 30 ? sub.message.slice(0, 30) + '...' : sub.message}
                                  </td>
                                  <td className={styles.td} style={{ color: '#666' }}>
                                    {new Date(sub.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date(sub.submittedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                  </td>
                                  <td className={styles.td}>
                                    <span className={
                                      subStatus === 'Pending' ? styles.queryBadgePending :
                                        subStatus === 'In Progress' ? styles.queryBadgeInProgress : styles.queryBadgeResolved
                                    }>
                                      {subStatus.toUpperCase()}
                                    </span>
                                  </td>
                                  <td className={styles.td}>
                                    <div className={styles.actionMenuContainer}>
                                      <button className={styles.actionTrigger}>•••</button>
                                      <div className={styles.actionDropdown}>
                                        <div style={{ padding: '6px 14px', fontSize: '11px', fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f4f4f5', marginBottom: '4px' }}>Actions</div>
                                        <button
                                          className={styles.actionItem}
                                          onClick={() => {
                                            setSelectedSubmission(sub);
                                            setModalStatus(sub.status || 'Pending');
                                            setModalNotes(sub.notes || '');
                                          }}
                                        >
                                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                          </svg>
                                          View & Respond
                                        </button>
                                        <button
                                          className={styles.actionItem}
                                          onClick={() => handleUpdateSubmissionStatus(sub.id, 'Resolved')}
                                        >
                                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', color: '#10b981' }}>
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="16 10 11 15 8 12" />
                                          </svg>
                                          Mark Resolved
                                        </button>
                                        <button
                                          className={`${styles.actionItem} ${styles.actionItemDanger}`}
                                          onClick={() => handleDeleteSubmission(sub.id)}
                                        >
                                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="15" y1="9" x2="9" y2="15" />
                                            <line x1="9" y1="9" x2="15" y2="15" />
                                          </svg>
                                          Close Query
                                        </button>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* === ANALYTICS TAB === */}
              {activeTab === 'analytics' && (
                <div>
                  {/* Page Header */}
                  <div className={styles.ordersHeader} style={{ marginBottom: '1.5rem' }}>
                    <div>
                      <h3 className={styles.panelTitle} style={{ fontSize: '28px', textTransform: 'none', fontWeight: 700, margin: 0 }}>Analytics</h3>
                      <p style={{ color: '#666', fontSize: '14.5px', margin: '4px 0 0 0' }}>Detailed insights into your store's performance.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button className={styles.exportBtn} onClick={fetchAllData}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                        </svg>
                        Refresh Data
                      </button>
                      <button className={styles.exportBtn} onClick={handleExportAnalyticsCSV}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Export
                      </button>
                    </div>
                  </div>

                  {/* Analytics Stats Grid */}
                  <div className={styles.statsGrid} style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
                    <div className={styles.statCard}>
                      <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Total Sales</span>
                        <span className={styles.statVal}>₹{totalSales.toLocaleString()}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '12px' }}>
                          <span style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                            ▲ 12.4%
                          </span>
                          <span style={{ color: '#888' }}>vs prev. period</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Avg. Order Value</span>
                        <span className={styles.statVal}>
                          ₹{totalOrders > 0 ? Math.round(totalSales / totalOrders).toLocaleString() : 0}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '12px' }}>
                          <span style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                            ▲ 2.1%
                          </span>
                          <span style={{ color: '#888' }}>vs prev. period</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Total Orders</span>
                        <span className={styles.statVal}>{totalOrders}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '12px' }}>
                          <span style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                            ▲ 8.5%
                          </span>
                          <span style={{ color: '#888' }}>vs prev. period</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Total Customers</span>
                        <span className={styles.statVal}>{customersList.length}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '12px' }}>
                          <span style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                            ▲ 19%
                          </span>
                          <span style={{ color: '#888' }}>vs prev. period</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main charts split grid */}
                  <div className={styles.analyticsGrid}>
                    {/* Sales vs Profit Chart */}
                    <div className={styles.chartCard}>
                      <div className={styles.chartHeader}>
                        <h4 className={styles.chartTitle}>Sales vs Profit</h4>
                        <p className={styles.chartSubtitle}>Comparison between gross sales and net profit (estimated 15% margin).</p>
                      </div>

                      {/* Legend */}
                      <div className={styles.chartLegend}>
                        <div className={styles.legendItem}>
                          <span className={styles.legendDot} style={{ backgroundColor: '#3b82f6' }} />
                          <span>Gross Sales</span>
                        </div>
                        <div className={styles.legendItem}>
                          <span className={styles.legendDot} style={{ backgroundColor: '#10b981' }} />
                          <span>Net Profit (Est)</span>
                        </div>
                      </div>

                      {/* SVG Area Chart */}
                      <div style={{ width: '100%', overflowX: 'auto' }}>
                        {(() => {
                          const width = 600;
                          const height = 220;
                          const padLeft = 60;
                          const padRight = 20;
                          const padTop = 20;
                          const padBottom = 30;
                          const plotW = width - padLeft - padRight;
                          const plotH = height - padTop - padBottom;

                          const maxSalesVal = Math.max(...monthlyTimeline.map(m => m.sales), 10000);
                          const chartMaxY = Math.ceil(maxSalesVal / 30000) * 30000;

                          const xCoords = monthlyTimeline.map((_, i) => padLeft + i * (plotW / 6));

                          const salesPoints = monthlyTimeline.map((m, i) => {
                            const x = xCoords[i];
                            const y = padTop + plotH - (m.sales / chartMaxY) * plotH;
                            return `${x},${y}`;
                          });

                          const profitPoints = monthlyTimeline.map((m, i) => {
                            const x = xCoords[i];
                            const y = padTop + plotH - (m.profit / chartMaxY) * plotH;
                            return `${x},${y}`;
                          });

                          const salesAreaPath = `M ${padLeft},${padTop + plotH} L ${salesPoints.join(' L ')} L ${xCoords[6]},${padTop + plotH} Z`;
                          const profitAreaPath = `M ${padLeft},${padTop + plotH} L ${profitPoints.join(' L ')} L ${xCoords[6]},${padTop + plotH} Z`;

                          const gridTicks = [0, chartMaxY * 0.25, chartMaxY * 0.5, chartMaxY * 0.75, chartMaxY];

                          return (
                            <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} style={{ display: 'block', minWidth: '500px' }}>
                              <defs>
                                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                                </linearGradient>
                                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                                </linearGradient>
                              </defs>

                              {/* Grid Lines */}
                              {gridTicks.map((tick, idx) => {
                                const y = padTop + plotH - (tick / chartMaxY) * plotH;
                                return (
                                  <g key={idx}>
                                    <line x1={padLeft} y1={y} x2={width - padRight} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                                    <text x={padLeft - 10} y={y + 4} fill="#888" fontSize="11" textAnchor="end">
                                      {tick === 0 ? '0' : tick.toLocaleString()}
                                    </text>
                                  </g>
                                );
                              })}

                              {/* Areas */}
                              <path d={salesAreaPath} fill="url(#salesGrad)" />
                              <path d={profitAreaPath} fill="url(#profitGrad)" />

                              {/* Lines */}
                              <polyline points={salesPoints.join(' ')} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                              <polyline points={profitPoints.join(' ')} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

                              {/* Interactive Nodes */}
                              {monthlyTimeline.map((m, i) => {
                                const x = xCoords[i];
                                const ySales = padTop + plotH - (m.sales / chartMaxY) * plotH;
                                return (
                                  <g key={i}>
                                    {m.sales > 0 && (
                                      <circle cx={x} cy={ySales} r="4.5" fill="#3b82f6" stroke="white" strokeWidth="1.5" />
                                    )}
                                  </g>
                                );
                              })}

                              {/* X Axis Labels */}
                              {monthlyTimeline.map((m, i) => (
                                <text key={i} x={xCoords[i]} y={height - 8} fill="#666" fontSize="12" textAnchor="middle" fontWeight="500">
                                  {m.label}
                                </text>
                              ))}
                            </svg>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Sales by Category Donut Chart */}
                    <div className={styles.chartCard}>
                      <div className={styles.chartHeader}>
                        <h4 className={styles.chartTitle}>Sales by Category</h4>
                        <p className={styles.chartSubtitle}>Distribution of sales across main categories.</p>
                      </div>

                      <div className={styles.donutContainer}>
                        {(() => {
                          const size = 180;
                          const center = size / 2;
                          const r = 60;
                          const circ = 2 * Math.PI * r;

                          let cumulativePercent = 0;

                          return (
                            <>
                              <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                                <circle cx={center} cy={center} r={r} fill="transparent" stroke="#f1f5f9" strokeWidth="18" />
                                {finalCategoryDistribution.map((item, idx) => {
                                  const sliceColor = categoryColors[idx % categoryColors.length];
                                  const strokeDasharray = `${(item.percent / 100) * circ} ${circ}`;
                                  const strokeDashoffset = -((cumulativePercent / 100) * circ);

                                  cumulativePercent += item.percent;

                                  return (
                                    <circle
                                      key={idx}
                                      cx={center}
                                      cy={center}
                                      r={r}
                                      fill="transparent"
                                      stroke={sliceColor}
                                      strokeWidth="18"
                                      strokeDasharray={strokeDasharray}
                                      strokeDashoffset={strokeDashoffset}
                                      strokeLinecap="round"
                                      transform={`rotate(-90 ${center} ${center})`}
                                    />
                                  );
                                })}
                              </svg>
                              <div className={styles.donutLabel}>
                                <span className={styles.donutLabelValue}>
                                  ₹{totalCategorySales.toLocaleString()}
                                </span>
                                <span className={styles.donutLabelText}>
                                  Sales
                                </span>
                              </div>
                            </>
                          );
                        })()}
                      </div>

                      {/* Category Legend List */}
                      <div className={styles.categoryLegendsList}>
                        {finalCategoryDistribution.map((item, idx) => {
                          const sliceColor = categoryColors[idx % categoryColors.length];
                          return (
                            <div key={idx} className={styles.categoryLegendRow}>
                              <div className={styles.categoryLegendName}>
                                <span className={styles.legendDot} style={{ backgroundColor: sliceColor }} />
                                <span>{item.name}</span>
                              </div>
                              <span className={styles.categoryLegendPercent}>{item.percent}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* User Growth Chart */}
                  <div className={styles.chartCard} style={{ marginTop: '1.5rem' }}>
                    <div className={styles.chartHeader}>
                      <h4 className={styles.chartTitle}>User Growth</h4>
                      <p className={styles.chartSubtitle}>New customer registrations over time.</p>
                    </div>

                    {/* SVG Line Chart for User Growth */}
                    <div style={{ width: '100%', overflowX: 'auto' }}>
                      {(() => {
                        const width = 600;
                        const height = 220;
                        const padLeft = 40;
                        const padRight = 20;
                        const padTop = 20;
                        const padBottom = 30;
                        const plotW = width - padLeft - padRight;
                        const plotH = height - padTop - padBottom;

                        const maxCustVal = Math.max(...monthlyTimeline.map(m => m.customers), 3);
                        const chartMaxY = Math.ceil(maxCustVal / 3) * 3;

                        const xCoords = monthlyTimeline.map((_, i) => padLeft + i * (plotW / 6));

                        const customerPoints = monthlyTimeline.map((m, i) => {
                          const x = xCoords[i];
                          const y = padTop + plotH - (m.customers / chartMaxY) * plotH;
                          return `${x},${y}`;
                        });

                        const gridTicks = [0, chartMaxY * 0.25, chartMaxY * 0.5, chartMaxY * 0.75, chartMaxY];

                        return (
                          <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} style={{ display: 'block', minWidth: '500px' }}>
                            {/* Grid Lines */}
                            {gridTicks.map((tick, idx) => {
                              const y = padTop + plotH - (tick / chartMaxY) * plotH;
                              return (
                                <g key={idx}>
                                  <line x1={padLeft} y1={y} x2={width - padRight} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                                  <text x={padLeft - 10} y={y + 4} fill="#888" fontSize="11" textAnchor="end">
                                    {tick}
                                  </text>
                                </g>
                              );
                            })}

                            {/* Line */}
                            <polyline points={customerPoints.join(' ')} fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                            {/* Nodes */}
                            {monthlyTimeline.map((m, i) => {
                              const x = xCoords[i];
                              const y = padTop + plotH - (m.customers / chartMaxY) * plotH;
                              return (
                                <g key={i}>
                                  <circle cx={x} cy={y} r="4.5" fill="#0d9488" stroke="white" strokeWidth="1.5" />
                                </g>
                              );
                            })}

                            {/* X Axis Labels */}
                            {monthlyTimeline.map((m, i) => (
                              <text key={i} x={xCoords[i]} y={height - 8} fill="#666" fontSize="12" textAnchor="middle" fontWeight="500">
                                {m.label}
                              </text>
                            ))}
                          </svg>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* === ACTIVITY LOGS TAB === */}
              {activeTab === 'activity-logs' && (
                <div>
                  {/* Page Header */}
                  <div className={styles.ordersHeader} style={{ marginBottom: '1.5rem' }}>
                    <div>
                      <h3 className={styles.panelTitle} style={{ fontSize: '28px', textTransform: 'none', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00a8b5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                        Activity Logs
                        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', marginLeft: '4px' }} />
                      </h3>
                      <p style={{ color: '#666', fontSize: '14.5px', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        Track every action taken by admin accounts — <strong>{logs.length}</strong> total entries
                        <span style={{ backgroundColor: '#ecfdf5', color: '#059669', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>
                          Live updates active
                        </span>
                      </p>
                    </div>
                    <button className={styles.logsClearAllBtn} onClick={handleClearAllLogs}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      Clear All
                    </button>
                  </div>

                  {/* Stats Cards Row */}
                  <div className={styles.logsStatsGrid}>
                    <div className={styles.logsStatCard}>
                      <span className={styles.logsStatValue} style={{ color: '#111' }}>{activityShownCount}</span>
                      <span className={styles.logsStatLabel}>Shown</span>
                    </div>

                    <div className={styles.logsStatCard}>
                      <div className={styles.logsStatIcon} style={{ color: '#3b82f6' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </div>
                      <span className={styles.logsStatValue} style={{ color: '#3b82f6' }}>{activityViewCount}</span>
                      <span className={styles.logsStatLabel}>View</span>
                    </div>

                    <div className={styles.logsStatCard}>
                      <div className={styles.logsStatIcon} style={{ color: '#f59e0b' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </div>
                      <span className={styles.logsStatValue} style={{ color: '#f59e0b' }}>{activityEditCount}</span>
                      <span className={styles.logsStatLabel}>Edit</span>
                    </div>

                    <div className={styles.logsStatCard}>
                      <div className={styles.logsStatIcon} style={{ color: '#10b981' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </div>
                      <span className={styles.logsStatValue} style={{ color: '#10b981' }}>{activityCreateCount}</span>
                      <span className={styles.logsStatLabel}>Create</span>
                    </div>

                    <div className={styles.logsStatCard}>
                      <div className={styles.logsStatIcon} style={{ color: '#ef4444' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </div>
                      <span className={styles.logsStatValue} style={{ color: '#ef4444' }}>{activityDeleteCount}</span>
                      <span className={styles.logsStatLabel}>Delete</span>
                    </div>

                    <div className={styles.logsStatCard}>
                      <div className={styles.logsStatIcon} style={{ color: '#0d9488' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                          <polyline points="10 17 15 12 10 7" />
                          <line x1="15" y1="12" x2="3" y2="12" />
                        </svg>
                      </div>
                      <span className={styles.logsStatValue} style={{ color: '#0d9488' }}>{activityLoginCount}</span>
                      <span className={styles.logsStatLabel}>Login</span>
                    </div>
                  </div>

                  {/* Filter Bar */}
                  <div className={styles.logsFilterRow}>
                    <div className={styles.logsSearchBox}>
                      <span style={{ color: '#888', fontSize: '15px' }}>🔍</span>
                      <input
                        type="text"
                        placeholder="Search description, target, admin..."
                        className={styles.logsSearchInput}
                        value={logsSearchQuery}
                        onChange={(e) => setLogsSearchQuery(e.target.value)}
                      />
                    </div>

                    <select
                      className={styles.logsSelect}
                      value={logsAdminFilter}
                      onChange={(e) => setLogsAdminFilter(e.target.value)}
                    >
                      <option value="All">All Admins</option>
                      <option value="admin">admin</option>
                    </select>

                    <select
                      className={styles.logsSelect}
                      value={logsModuleFilter}
                      onChange={(e) => setLogsModuleFilter(e.target.value)}
                    >
                      <option value="All">All Modules</option>
                      <option value="Products">Products</option>
                      <option value="Orders">Orders</option>
                      <option value="Coupons">Coupons</option>
                      <option value="Banners">Banners</option>
                      <option value="Settings">Settings</option>
                      <option value="Admin">Admin</option>
                      <option value="Queries">Queries</option>
                    </select>

                    <select
                      className={styles.logsSelect}
                      value={logsActionFilter}
                      onChange={(e) => setLogsActionFilter(e.target.value)}
                    >
                      <option value="All">All Actions</option>
                      <option value="Create">Create</option>
                      <option value="Edit">Edit</option>
                      <option value="Delete">Delete</option>
                      <option value="Login">Login</option>
                      <option value="View">View</option>
                    </select>

                    <input
                      type="date"
                      className={styles.logsDateInput}
                      value={logsStartDate}
                      onChange={(e) => setLogsStartDate(e.target.value)}
                      placeholder="dd-mm-yyyy"
                    />

                    <input
                      type="date"
                      className={styles.logsDateInput}
                      value={logsEndDate}
                      onChange={(e) => setLogsEndDate(e.target.value)}
                      placeholder="dd-mm-yyyy"
                    />

                    <button className={styles.logsRefreshBtn} onClick={fetchLogs} title="Refresh Logs">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                      </svg>
                    </button>
                  </div>

                  {/* Logs Table */}
                  <div className={styles.panelCard}>
                    <div className={styles.tableWrapper}>
                      {filteredLogs.length === 0 ? (
                        <div className={styles.emptyState}>No activity logs match the selected filters.</div>
                      ) : (
                        <table className={styles.table}>
                          <thead>
                            <tr>
                              <th className={styles.th} style={{ width: '180px' }}>Time</th>
                              <th className={styles.th} style={{ width: '180px' }}>Admin</th>
                              <th className={styles.th} style={{ width: '140px' }}>Module</th>
                              <th className={styles.th} style={{ width: '130px' }}>Action</th>
                              <th className={styles.th}>Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredLogs.map((log, index) => {
                              const parsed = parseLogAction(log.action);

                              // Format date
                              const logTime = log.timestamp
                                ? new Date(log.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date(log.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
                                : 'N/A';

                              // Deterministic Target ID helper
                              const getTargetId = (logItem: any) => {
                                if (!logItem.id) return '6a15375c1dbc6a2071229321';
                                const prefix = '6a';
                                const mid = logItem.id.substring(2, 12);
                                const suffix = logItem.id.substring(12).split('').reverse().join('');
                                const combined = (prefix + mid + suffix).padEnd(24, '0').substring(0, 24);
                                return combined;
                              };

                              return (
                                <React.Fragment key={log.id || index}>
                                  <tr className={styles.tr}>
                                    <td className={styles.td} style={{ color: '#666', fontSize: '13.5px' }}>
                                      {logTime}
                                    </td>
                                    <td className={styles.td}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div
                                          style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            backgroundColor: '#00a8b5',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            flexShrink: 0
                                          }}
                                        >
                                          AU
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                          <span style={{ fontWeight: 600, color: '#111', fontSize: '13.5px' }}>Admin User</span>
                                          <span style={{ fontSize: '11px', color: '#888' }}>Super Admin</span>
                                        </div>
                                      </div>
                                    </td>
                                    <td className={styles.td}>
                                      <span
                                        className={styles.logModuleBadge}
                                        style={{
                                          backgroundColor: parsed.bgColor,
                                          color: parsed.color
                                        }}
                                      >
                                        {/* Module Icon prefix */}
                                        {parsed.module === 'Products' && (
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '3px' }}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                                        )}
                                        {parsed.module === 'Orders' && (
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '3px' }}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                                        )}
                                        {parsed.module === 'Coupons' && (
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '3px' }}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
                                        )}
                                        {parsed.module === 'Banners' && (
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '3px' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                        )}
                                        {parsed.module === 'Settings' && (
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '3px' }}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                                        )}
                                        {parsed.module === 'Admin' && (
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '3px' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                        )}
                                        {parsed.module === 'Queries' && (
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '3px' }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                        )}
                                        {parsed.module}
                                      </span>
                                    </td>
                                    <td className={styles.td}>
                                      <span
                                        className={styles.logActionBadge}
                                        style={{
                                          color:
                                            parsed.action === 'Create' ? '#10b981' :
                                              parsed.action === 'Edit' ? '#f59e0b' :
                                                parsed.action === 'Delete' ? '#ef4444' :
                                                  parsed.action === 'Login' ? '#0d9488' : '#3b82f6',
                                          backgroundColor:
                                            parsed.action === 'Create' ? '#ecfdf5' :
                                              parsed.action === 'Edit' ? '#fffbeb' :
                                                parsed.action === 'Delete' ? '#fef2f2' :
                                                  parsed.action === 'Login' ? '#f0fdfa' : '#eff6ff',
                                        }}
                                      >
                                        {parsed.action === 'Create' && '+ '}
                                        {parsed.action === 'Delete' && '- '}
                                        {parsed.action === 'Login' && '→ '}
                                        {parsed.action}
                                      </span>
                                    </td>
                                    <td className={styles.td} style={{ color: '#111', fontWeight: 500, fontSize: '13.5px' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                        <span>{log.details || log.action}</span>
                                        <button
                                          onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
                                          style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: '#888',
                                            borderRadius: '4px',
                                            transition: 'background-color 0.2s'
                                          }}
                                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                          {expandedLogId === log.id ? (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                              <polyline points="18 15 12 9 6 15" />
                                            </svg>
                                          ) : (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                              <polyline points="6 9 12 15 18 9" />
                                            </svg>
                                          )}
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                  {expandedLogId === log.id && (
                                    <tr style={{ backgroundColor: '#fafafa' }}>
                                      <td colSpan={5} style={{ padding: '15px 24px', borderBottom: '1px solid #e2e8f0' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 3fr 2.5fr', gap: '1.5rem', width: '100%' }}>
                                          <div>
                                            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '4px' }}>Admin Email</div>
                                            <div style={{ fontWeight: 600, fontSize: '13.5px', color: '#111' }}>admin@gmail.com</div>
                                          </div>
                                          <div>
                                            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '4px' }}>Target ID</div>
                                            <div style={{ fontFamily: 'monospace', fontSize: '13px', color: '#333' }}>{getTargetId(log)}</div>
                                          </div>
                                          <div>
                                            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '4px' }}>Full Description</div>
                                            <div style={{ fontWeight: 500, fontSize: '13.5px', color: '#111' }}>{log.details || log.action}</div>
                                          </div>
                                          <div>
                                            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '4px' }}>Log ID</div>
                                            <div style={{ fontFamily: 'monospace', fontSize: '13px', color: '#333' }}>{log.id}</div>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* === ADMIN MANAGER TAB === */}
              {activeTab === 'admin-manager' && (
                <div>
                  {/* Page Header */}
                  <div className={styles.ordersHeader} style={{ marginBottom: '1.5rem' }}>
                    <div>
                      <h3 className={styles.panelTitle} style={{ fontSize: '28px', textTransform: 'none', fontWeight: 700, margin: 0 }}>Admin Manager</h3>
                      <p style={{ color: '#666', fontSize: '14.5px', margin: '4px 0 0 0' }}>Create, manage, and configure role-based module permissions for store administrators.</p>
                    </div>
                    <button className={styles.addAdminBtn} onClick={() => { setIsAddAdminOpen(true); setAdminFormError(''); setNewAdminName(''); setNewAdminFullName(''); setNewAdminEmail(''); setNewAdminPwd(''); setNewAdminRole('ADMIN'); setNewAdminActive(true); setNewAdminPermissions(defaultAdminPermissions()); }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Add Admin
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className={styles.panelCard}>
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f0f0f4' }}>
                      <div className={styles.ordersSearchBox} style={{ maxWidth: '380px' }}>
                        <span style={{ color: '#888', fontSize: '15px' }}>🔍</span>
                        <input
                          type="text"
                          placeholder="Search admins by name, email or role..."
                          className={styles.ordersSearchInput}
                          value={adminSearchQuery}
                          onChange={(e) => setAdminSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className={styles.tableWrapper}>
                      {(() => {
                        const filteredAdmins = adminUsers.filter(a =>
                          (a.username || '').toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
                          (a.email || '').toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
                          (a.role || '').toLowerCase().includes(adminSearchQuery.toLowerCase())
                        );
                        if (filteredAdmins.length === 0) {
                          return <div className={styles.emptyState}>No admin accounts found.</div>;
                        }
                        return (
                          <table className={styles.table}>
                            <thead>
                              <tr>
                                <th className={styles.th}>Admin User</th>
                                <th className={styles.th}>Email</th>
                                <th className={styles.th}>Role</th>
                                <th className={styles.th}>Status</th>
                                <th className={styles.th}>Created At</th>
                                <th className={styles.th}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredAdmins.map(admin => {
                                const avatarStyle = getAvatarStyle(admin.username);
                                const initials = (admin.username || 'AU').slice(0, 2).toUpperCase();
                                const isSuperAdmin = (admin.role || '').toUpperCase() === 'SUPER ADMIN';
                                const isLoggedInAdmin = admin.username === currentAdminUsername;

                                return (
                                  <tr key={admin.id} className={styles.tr}>
                                    {/* Admin User */}
                                    <td className={styles.td}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div
                                          className={styles.adminAvatar}
                                          style={{ backgroundColor: avatarStyle.bg, color: avatarStyle.color }}
                                        >
                                          {initials}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                          <span style={{ fontWeight: 600, color: '#111', fontSize: '14px' }}>
                                            {admin.username}
                                            {isLoggedInAdmin && (
                                              <span style={{ marginLeft: '6px', fontSize: '11px', color: '#00a8b5', fontWeight: 600 }}>• You</span>
                                            )}
                                          </span>
                                        </div>
                                      </div>
                                    </td>

                                    {/* Email */}
                                    <td className={styles.td} style={{ color: '#555' }}>
                                      {admin.email || <span style={{ color: '#aaa', fontStyle: 'italic' }}>Not set</span>}
                                    </td>

                                    {/* Role */}
                                    <td className={styles.td}>
                                      <span className={
                                        isSuperAdmin ? styles.roleBadgeSuperAdmin :
                                          (admin.role || '').toUpperCase().includes('EDITOR') ? styles.roleBadgeEditor :
                                            styles.roleBadgeManager
                                      }>
                                        {admin.role || 'PRODUCT MANAGER'}
                                      </span>
                                    </td>

                                    {/* Status */}
                                    <td className={styles.td}>
                                      <span className={admin.status === 'Active' ? styles.adminStatusActive : styles.adminStatusInactive}>
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor', display: 'inline-block' }} />
                                        {admin.status || 'Active'}
                                      </span>
                                    </td>

                                    {/* Created At */}
                                    <td className={styles.td} style={{ color: '#666', fontSize: '13.5px' }}>
                                      {admin.createdAt
                                        ? new Date(admin.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                                        : 'N/A'}
                                    </td>

                                    {/* Actions — hover dropdown */}
                                    <td className={styles.td}>
                                      <div className={styles.actionMenuContainer}>
                                        <button className={styles.actionTrigger}>•••</button>
                                        <div className={styles.actionDropdown}>
                                          <div style={{ padding: '5px 14px', fontSize: '11px', fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f4f4f5', marginBottom: '4px' }}>Actions</div>
                                          <button
                                            className={styles.actionItem}
                                            onClick={() => {
                                              setEditingAdmin(admin);
                                              setEditAdminUsername(admin.username);
                                              setEditAdminEmail(admin.email || '');
                                              setEditAdminPwd('');
                                              setEditAdminRole(admin.role || 'PRODUCT MANAGER');
                                              setEditAdminStatus(admin.status || 'Active');
                                              setEditAdminError('');
                                            }}
                                          >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                            Edit
                                          </button>
                                          {!isSuperAdmin && (
                                            <button
                                              className={`${styles.actionItem} ${styles.actionItemDanger}`}
                                              onClick={() => handleDeleteAdminUser(admin.id, admin.username)}
                                            >
                                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                              </svg>
                                              Delete
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}



              {/* === SETTINGS TAB === */}
              {activeTab === 'settings' && (() => {
                const THEME_COLORS = [
                  { name: 'Blue', value: 'blue', hex: '#3b82f6' },
                  { name: 'Emerald', value: 'emerald', hex: '#10b981' },
                  { name: 'Violet', value: 'violet', hex: '#8b5cf6' },
                  { name: 'Rose', value: 'rose', hex: '#f43f5e' },
                  { name: 'Amber', value: 'amber', hex: '#f59e0b' },
                  { name: 'Orange', value: 'orange', hex: '#f97316' },
                  { name: 'Indigo', value: 'indigo', hex: '#4f46e5' },
                  { name: 'Cyan', value: 'cyan', hex: '#06b6d4' },
                  { name: 'Teal', value: 'teal', hex: '#0d9488' },
                  { name: 'Pink', value: 'pink', hex: '#ec4899' },
                  { name: 'Lime', value: 'lime', hex: '#84cc16' },
                  { name: 'Slate', value: 'slate', hex: '#64748b' },
                ];
                return (
                  <div style={{ maxWidth: '900px' }}>
                    {/* Page Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
                      <div>
                        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111', margin: '0 0 4px' }}>Settings</h2>
                        <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Manage your store configurations and preferences.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleSaveSettings as any}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          background: '#06b6d4', color: 'white',
                          border: 'none', borderRadius: '8px',
                          padding: '10px 20px', fontSize: '14px',
                          fontWeight: 600, cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                          <polyline points="17 21 17 13 7 13 7 21" />
                          <polyline points="7 3 7 8 15 8" />
                        </svg>
                        Save Changes
                      </button>
                    </div>

                    {/* Appearance & Brand Identity Card */}
                    <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', marginBottom: '1.5rem', overflow: 'hidden' }}>
                      {/* Card Header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '1.5rem' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#f0fdfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="2" y1="12" x2="22" y2="12" />
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                          </svg>
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '16px', color: '#111' }}>Appearance &amp; Brand Identity</div>
                          <div style={{ fontSize: '13px', color: '#06b6d4', marginTop: '2px' }}>Customize the visual theme and branding of your admin panel.</div>
                        </div>
                      </div>

                      <div style={{ borderTop: '1px solid #f3f4f6', padding: '1.5rem' }}>
                        {/* Primary Theme Color */}
                        <div style={{ marginBottom: '2rem' }}>
                          <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#111', margin: '0 0 6px' }}>Primary Theme Color</h4>
                          <p style={{ fontSize: '13.5px', color: '#666', margin: '0 0 1.25rem' }}>Choose a color that matches your brand.</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}>
                            {THEME_COLORS.map(tc => (
                              <button
                                key={tc.value}
                                type="button"
                                onClick={() => setThemeColor(tc.value)}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                              >
                                <div style={{
                                  width: '44px', height: '44px', borderRadius: '50%',
                                  backgroundColor: tc.hex,
                                  border: themeColor === tc.value ? `3px solid ${tc.hex}` : '3px solid transparent',
                                  outline: themeColor === tc.value ? `2px solid ${tc.hex}` : '2px solid transparent',
                                  outlineOffset: '2px',
                                  boxSizing: 'border-box',
                                  transition: 'outline 0.15s, border 0.15s'
                                }} />
                                <span style={{ fontSize: '11px', color: '#555', fontWeight: themeColor === tc.value ? 600 : 400 }}>{tc.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Dark Mode */}
                        <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '15px', color: '#111' }}>Dark Mode</div>
                            <div style={{ fontSize: '13px', color: '#666', marginTop: '3px' }}>Switch between light and dark dashboard themes.</div>
                          </div>
                          {/* Toggle Switch */}
                          <button
                            type="button"
                            onClick={() => setDarkMode(prev => !prev)}
                            style={{
                              position: 'relative', width: '48px', height: '26px',
                              borderRadius: '13px', border: 'none', cursor: 'pointer',
                              backgroundColor: darkMode ? '#06b6d4' : '#d1d5db',
                              transition: 'background-color 0.2s',
                              flexShrink: 0
                            }}
                            aria-label="Toggle dark mode"
                          >
                            <span style={{
                              position: 'absolute', top: '3px',
                              left: darkMode ? '25px' : '3px',
                              width: '20px', height: '20px', borderRadius: '50%',
                              background: 'white',
                              transition: 'left 0.2s',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                            }} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Store Configuration Card */}
                    <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '1.5rem', borderBottom: '1px solid #f3f4f6' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                          </svg>
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '16px', color: '#111' }}>Store Configuration</div>
                          <div style={{ fontSize: '13px', color: '#3b82f6', marginTop: '2px' }}>Update your shop name, contact info, and business hours.</div>
                        </div>
                      </div>
                      <form onSubmit={handleSaveSettings} style={{ padding: '1.5rem' }}>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>E-Commerce Shop Name *</label>
                          <input type="text" className={styles.loginInput} value={shopName} onChange={(e) => setShopName(e.target.value)} required />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Contact Phone</label>
                            <input type="text" className={styles.loginInput} value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Contact Email *</label>
                            <input type="email" className={styles.loginInput} value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required />
                          </div>
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Warehouse / Shipping Address *</label>
                          <input type="text" className={styles.loginInput} value={contactAddress} onChange={(e) => setContactAddress(e.target.value)} required />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Tax Rate (%) *</label>
                            <input type="number" className={styles.loginInput} value={taxRate} onChange={(e) => setTaxRate(e.target.value)} required />
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Working / Support Hours *</label>
                            <input type="text" className={styles.loginInput} value={shopHours} onChange={(e) => setShopHours(e.target.value)} required />
                          </div>
                        </div>
                        {settingsMessage && <div style={{ color: '#16a34a', fontSize: '14px', marginBottom: '1rem', fontWeight: 500 }}>{settingsMessage}</div>}
                      </form>
                    </div>
                  </div>
                );
              })()}
            </>
          )}
        </main>
      </div>

      {/* ======================================================== */}
      {/* ==================== FORM MODALS ======================= */}
      {/* ======================================================== */}

      {/* Inquiry detail modal (View & Respond) */}
      {selectedSubmission && (
        <div className={styles.modalOverlay} onClick={() => setSelectedSubmission(null)}>
          <div className={styles.modalContent} style={{ maxWidth: '640px', width: '100%', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setSelectedSubmission(null)}>×</button>
            <h4 className={styles.modalTitle} style={{ fontSize: '20px', fontWeight: 700, borderBottom: '1px solid #eee', paddingBottom: '0.75rem', marginBottom: '1.5rem', textTransform: 'none' }}>
              View & Respond to Query
            </h4>
            <form onSubmit={handleSaveSubmissionDetails}>
              {/* Customer Info Box (light gray bordered box card) */}
              <div
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '1.25rem',
                  backgroundColor: '#fafafa',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#777', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                      Customer Name
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '14.5px', color: '#111' }}>{selectedSubmission.fullName}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#777', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                      Email Address
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '14.5px', color: '#111' }}>{selectedSubmission.email}</div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #eee', paddingTop: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#777', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                    Phone Number
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '14.5px', color: '#111' }}>{selectedSubmission.phone || 'N/A'}</div>
                </div>
              </div>

              {/* Subject */}
              <div className={styles.formGroup} style={{ marginBottom: '1.25rem' }}>
                <label className={styles.formLabel} style={{ fontSize: '11px', textTransform: 'uppercase', color: '#666', fontWeight: 700, letterSpacing: '0.05em' }}>Subject</label>
                <input
                  type="text"
                  className={`${styles.loginInput} ${styles.readOnlyInput}`}
                  value={selectedSubmission.subject}
                  readOnly
                  disabled
                />
              </div>

              {/* Customer Message */}
              <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
                <label className={styles.formLabel} style={{ fontSize: '11px', textTransform: 'uppercase', color: '#666', fontWeight: 700, letterSpacing: '0.05em' }}>Customer Message</label>
                <textarea
                  className={`${styles.loginInput} ${styles.readOnlyInput}`}
                  value={selectedSubmission.message}
                  readOnly
                  disabled
                  style={{
                    height: '110px',
                    padding: '10px',
                    resize: 'none',
                    lineHeight: '1.5'
                  }}
                />
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '1.5rem 0' }} />

              {/* Status Select */}
              <div className={styles.formGroup} style={{ marginBottom: '1.25rem' }}>
                <label className={styles.formLabel} style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>Query Status</label>
                <select
                  className={styles.formSelect}
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value as any)}
                  style={{ width: '200px' }}
                >
                  <option value="Pending">PENDING</option>
                  <option value="In Progress">IN_PROGRESS</option>
                  <option value="Resolved">RESOLVED</option>
                </select>
              </div>

              {/* Resolution / Internal Notes */}
              <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
                <label className={styles.formLabel} style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>Admin Notes / Resolution Details</label>
                <textarea
                  className={styles.loginInput}
                  placeholder="Add internal notes or record how this query was resolved..."
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  style={{ height: '90px', padding: '10px', resize: 'vertical' }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className={styles.backBtn}
                  style={{ width: 'auto', padding: '0 1.25rem', height: '40px', fontSize: '14px' }}
                  onClick={() => setSelectedSubmission(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.loginBtn}
                  style={{
                    width: 'auto',
                    padding: '0 1.5rem',
                    height: '40px',
                    fontSize: '14px',
                    backgroundColor: '#00a8b5',
                    border: 'none',
                    fontWeight: 600
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Detail items modal */}
      {selectedOrder && (
        <div className={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setSelectedOrder(null)}>×</button>
            <h4 className={styles.modalTitle}>Checkout Items for Order {selectedOrder.orderId}</h4>
            <div className={styles.modalRow}>
              <span className={styles.modalLabel}>Placed Date:</span>
              <span className={styles.modalValue}>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
            </div>
            <div className={styles.modalRow}>
              <span className={styles.modalLabel}>Total Sale:</span>
              <span className={styles.modalValue} style={{ color: '#28a745', fontWeight: 600 }}>₹{selectedOrder.subtotal.toLocaleString()}</span>
            </div>
            {selectedOrder.couponCode && (
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Coupon Used:</span>
                <span className={styles.modalValue}>{selectedOrder.couponCode} (-₹{selectedOrder.discountApplied?.toLocaleString()})</span>
              </div>
            )}

            {selectedOrder.customer && (
              <>
                <h5 style={{ fontSize: '14px', fontWeight: 600, borderTop: '1px solid #f0f0f5', paddingTop: '10px', marginTop: '10px', marginBottom: '8px' }}>
                  Shipping Information
                </h5>
                <div className={styles.modalRow}>
                  <span className={styles.modalLabel}>Name:</span>
                  <span className={styles.modalValue}>{selectedOrder.customer.name}</span>
                </div>
                <div className={styles.modalRow}>
                  <span className={styles.modalLabel}>Email:</span>
                  <span className={styles.modalValue}>{selectedOrder.customer.email}</span>
                </div>
                <div className={styles.modalRow}>
                  <span className={styles.modalLabel}>Phone:</span>
                  <span className={styles.modalValue}>{selectedOrder.customer.phone}</span>
                </div>
                <div className={styles.modalRow}>
                  <span className={styles.modalLabel}>Address:</span>
                  <span className={styles.modalValue}>{selectedOrder.customer.address}</span>
                </div>
              </>
            )}

            <div style={{ marginTop: '1.25rem' }}>
              <span className={styles.modalLabel} style={{ display: 'block', marginBottom: '8px' }}>Purchase details:</span>
              <div style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
                {selectedOrder.items.map((item, idx) => (
                  <div key={item.id || idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: idx < selectedOrder.items.length - 1 ? '1px solid #eee' : 'none', backgroundColor: '#fafafa' }}>
                    <div style={{ fontSize: '14px' }}>
                      <span style={{ fontWeight: 500 }}>{item.name}</span>
                      <div style={{ fontSize: '12px', color: '#777', marginTop: '2px' }}>₹{item.price.toLocaleString()} each</div>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>
                      {item.qty} ×
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Brand Modal */}
      {isAddBrandOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsAddBrandOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setIsAddBrandOpen(false)}>×</button>
            <h4 className={styles.modalTitle} style={{ margin: 0 }}>Add New Brand</h4>
            <p style={{ color: '#666', fontSize: '13.5px', marginTop: '4px', marginBottom: '1.5rem' }}>Configure manufacture brand settings here.</p>
            <form onSubmit={handleAddBrand}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Brand Name *</label>
                <input
                  type="text"
                  placeholder="e.g. ASUS"
                  className={styles.loginInput}
                  value={newBrandName}
                  onChange={(e) => {
                    setNewBrandName(e.target.value);
                    setNewBrandSlug(e.target.value.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'));
                  }}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Slug (URL identifier)</label>
                <input
                  type="text"
                  placeholder="e.g. asus"
                  className={styles.loginInput}
                  value={newBrandSlug}
                  onChange={(e) => setNewBrandSlug(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  placeholder="Enter brand description..."
                  className={styles.loginInput}
                  style={{ height: '80px', resize: 'vertical', padding: '10px' }}
                  value={newBrandDescription}
                  onChange={(e) => setNewBrandDescription(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Image/Logo URL</label>
                <input
                  type="text"
                  placeholder="e.g. /images/asus.png"
                  className={styles.loginInput}
                  value={newBrandImage}
                  onChange={(e) => setNewBrandImage(e.target.value)}
                />
              </div>

              <button type="submit" className={styles.loginBtn} style={{ marginTop: '1.5rem', width: '100%', backgroundColor: '#00a8b5', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Create Brand
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Brand Modal */}
      {editingBrand && (
        <div className={styles.modalOverlay} onClick={() => setEditingBrand(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setEditingBrand(null)}>×</button>
            <h4 className={styles.modalTitle} style={{ margin: 0 }}>Edit Brand</h4>
            <p style={{ color: '#666', fontSize: '13.5px', marginTop: '4px', marginBottom: '1.5rem' }}>Configure brand details here.</p>
            <form onSubmit={handleSaveBrand}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Brand Name *</label>
                <input
                  type="text"
                  placeholder="e.g. ASUS"
                  className={styles.loginInput}
                  value={editBrandName}
                  onChange={(e) => {
                    setEditBrandName(e.target.value);
                    setEditBrandSlug(e.target.value.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'));
                  }}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Slug (URL identifier)</label>
                <input
                  type="text"
                  placeholder="e.g. asus"
                  className={styles.loginInput}
                  value={editBrandSlug}
                  onChange={(e) => setEditBrandSlug(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  placeholder="Enter brand description..."
                  className={styles.loginInput}
                  style={{ height: '80px', resize: 'vertical', padding: '10px' }}
                  value={editBrandDescription}
                  onChange={(e) => setEditBrandDescription(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Image/Logo URL</label>
                <input
                  type="text"
                  placeholder="e.g. /images/asus.png"
                  className={styles.loginInput}
                  value={editBrandImage}
                  onChange={(e) => setEditBrandImage(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Status</label>
                <select
                  className={styles.formSelect}
                  value={editBrandStatus}
                  onChange={(e) => setEditBrandStatus(e.target.value)}
                >
                  <option value="Visible">Visible</option>
                  <option value="Hidden">Hidden</option>
                </select>
              </div>

              <button type="submit" className={styles.loginBtn} style={{ marginTop: '1.5rem', width: '100%', backgroundColor: '#00a8b5', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Import Products Modal */}
      {isImportProductOpen && (
        <div className={styles.modalOverlay} onClick={() => { setIsImportProductOpen(false); setProductImportRows([]); setProductImportFileName(''); setProductImportError(''); setProductImportMessage(''); }}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <button className={styles.modalClose} onClick={() => { setIsImportProductOpen(false); setProductImportRows([]); setProductImportFileName(''); setProductImportError(''); setProductImportMessage(''); }}>×</button>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '8px' }}>
              <h4 className={styles.modalTitle} style={{ margin: 0 }}>Import Products via CSV</h4>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className={styles.sampleTemplateBtn}
                  onClick={handleDownloadKaggleSampleCSV}
                  title="Download Kaggle / Datafiniti format sample CSV template"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Kaggle / Datafiniti Template (USD)
                </button>
                <button
                  type="button"
                  className={styles.sampleTemplateBtn}
                  onClick={handleDownloadProductSampleCSV}
                  title="Download standard CSV template"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Standard Template
                </button>
              </div>
            </div>
            <p style={{ color: '#666', fontSize: '13.5px', marginTop: '4px', marginBottom: '1rem' }}>
              Bulk import products from CSV. Supports standard catalogs and <strong>Kaggle/Datafiniti Electronic Products datasets</strong> with automatic currency conversion to Indian Rupee (₹).
            </p>

            {/* Currency Converter Card */}
            <div className={styles.currencyConverterCard}>
              <div className={styles.currencyConverterHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '18px' }}>💱</span>
                  <span style={{ fontWeight: 700, fontSize: '13.5px', color: '#0369a1' }}>
                    Indian Rupee (₹ INR) Price Currency Converter
                  </span>
                  {productImportRows.length > 0 && ('prices.amountMin' in productImportRows[0] || 'prices.currency' in productImportRows[0]) && (
                    <span className={styles.formatBadge}>
                      Kaggle / Datafiniti Format Detected
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>
                    1 USD = ₹
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    className={styles.currencyRateInput}
                    value={productUsdRate}
                    onChange={(e) => setProductUsdRate(parseFloat(e.target.value) || 85)}
                  />
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>INR</span>
                </div>
              </div>
              <div style={{ fontSize: '12.5px', color: '#475569', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                <span>
                  Foreign prices (e.g. <strong>$104.80 USD</strong>) will convert to <strong>₹{Math.round(104.80 * (productUsdRate || 85)).toLocaleString('en-IN')} INR</strong> with automatic wholesale MRP & IndiaMART supplier mapping.
                </span>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', cursor: 'pointer', color: '#0f172a', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={autoConvertCurrency}
                    onChange={(e) => setAutoConvertCurrency(e.target.checked)}
                  />
                  Convert to INR (₹)
                </label>
              </div>
            </div>

            {productImportError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '13.5px', marginBottom: '1rem' }}>
                ⚠️ {productImportError}
              </div>
            )}

            {productImportMessage && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '10px 14px', borderRadius: '8px', fontSize: '13.5px', marginBottom: '1rem', fontWeight: 600 }}>
                ✓ {productImportMessage}
              </div>
            )}

            <label className={styles.dropZone}>
              <input
                type="file"
                accept=".csv"
                style={{ display: 'none' }}
                onChange={handleProductCsvFileSelect}
              />
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <div>
                <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '14.5px' }}>
                  {productImportFileName ? productImportFileName : 'Click to select CSV or drag file here'}
                </span>
                <div style={{ color: '#64748b', fontSize: '12.5px', marginTop: '2px' }}>
                  Supports Kaggle (prices.amountMin, asins, imageURLs) & standard CSV files
                </div>
              </div>
            </label>

            {productImportRows.length > 0 && (
              <div style={{ marginTop: '1.1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                    CSV Preview ({productImportRows.length} {productImportRows.length === 1 ? 'row' : 'rows'} detected):
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Showing first 3 rows</span>
                </div>
                <div className={styles.csvPreviewTableWrapper}>
                  {(() => {
                    const firstRow = productImportRows[0];
                    const isKaggle = 'prices.amountMin' in firstRow || 'prices.currency' in firstRow;

                    if (isKaggle) {
                      return (
                        <table className={styles.csvPreviewTable}>
                          <thead>
                            <tr>
                              <th>Product Name</th>
                              <th>Image (from CSV)</th>
                              <th>Categories</th>
                              <th>Brand</th>
                              <th>Original Price</th>
                              <th style={{ color: '#0369a1' }}>Converted Price (₹ INR)</th>
                              <th>ASIN / SKU</th>
                              <th>Stock</th>
                            </tr>
                          </thead>
                          <tbody>
                            {productImportRows.slice(0, 3).map((row, idx) => {
                              const rawPrice = Number(String(row['prices.amountMin'] || row.price || '0').replace(/[^\d.]/g, '')) || 0;
                              const curr = row['prices.currency'] || 'USD';
                              const inrPrice = autoConvertCurrency
                                ? (curr.includes('INR') || curr.includes('₹') ? rawPrice : Math.round(rawPrice * productUsdRate))
                                : rawPrice;
                              const rawImgStr = String(
                                row.imageURLs ||
                                row.imageurls ||
                                row.imageUrls ||
                                row.imageURL ||
                                row.image ||
                                row['Image URL'] ||
                                row.images ||
                                row['Image'] ||
                                ''
                              );
                              const matchedUrl = rawImgStr.match(/https?:\/\/[^\s,"'<>[\]{}|]+/i)?.[0] || '';

                              return (
                                <tr key={idx}>
                                  <td style={{ fontWeight: 600 }}>{row.name || row['Product Name'] || '-'}</td>
                                  <td>
                                    {matchedUrl ? (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <img src={matchedUrl} alt="" style={{ width: '28px', height: '28px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #e2e8f0' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                        <span style={{ fontSize: '11px', color: '#64748b', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{matchedUrl}</span>
                                      </div>
                                    ) : (
                                      <span style={{ color: '#94a3b8' }}>Default</span>
                                    )}
                                  </td>
                                  <td>{row.categories || row.primaryCategories || row.category || '-'}</td>
                                  <td>{row.brand || row.manufacturer || 'General'}</td>
                                  <td>{curr} {rawPrice ? rawPrice.toFixed(2) : '-'}</td>
                                  <td style={{ fontWeight: 700, color: '#059669' }}>
                                    ₹{inrPrice.toLocaleString('en-IN')}
                                  </td>
                                  <td>{row.asins || row.sku || row.upc || '-'}</td>
                                  <td>{row['prices.availability'] || 'In Stock'}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      );
                    }

                    return (
                      <table className={styles.csvPreviewTable}>
                        <thead>
                          <tr>
                            {Object.keys(firstRow).slice(0, 6).map((headerKey) => (
                              <th key={headerKey}>{headerKey}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {productImportRows.slice(0, 3).map((row, idx) => (
                            <tr key={idx}>
                              {Object.keys(firstRow).slice(0, 6).map((headerKey) => (
                                <td key={headerKey}>{row[headerKey] || '-'}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    );
                  })()}
                </div>
              </div>
            )}

            <button
              type="button"
              className={styles.loginBtn}
              onClick={handleExecuteProductImport}
              disabled={productImportLoading || productImportRows.length === 0}
              style={{
                marginTop: '1.5rem',
                width: '100%',
                backgroundColor: '#00a8b5',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {productImportLoading ? 'Importing Products...' : `Import ${productImportRows.length > 0 ? productImportRows.length : ''} Products to Database`}
            </button>
          </div>
        </div>
      )}

      {/* Import Sellers Modal */}
      {isImportSellerOpen && (
        <div className={styles.modalOverlay} onClick={() => { setIsImportSellerOpen(false); setSellerImportRows([]); setSellerImportFileName(''); setSellerImportError(''); setSellerImportMessage(''); }}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <button className={styles.modalClose} onClick={() => { setIsImportSellerOpen(false); setSellerImportRows([]); setSellerImportFileName(''); setSellerImportError(''); setSellerImportMessage(''); }}>×</button>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '8px' }}>
              <h4 className={styles.modalTitle} style={{ margin: 0 }}>Import Suppliers & Sellers via CSV</h4>
              <button
                type="button"
                className={styles.sampleTemplateBtn}
                onClick={handleDownloadSellerSampleCSV}
                title="Download sample CSV template for sellers"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Sample CSV
              </button>
            </div>
            <p style={{ color: '#666', fontSize: '13.5px', marginTop: '4px', marginBottom: '1.25rem' }}>
              Upload your verified vendor catalog to bulk insert suppliers with auto-category & product mapping.
            </p>

            {sellerImportError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '13.5px', marginBottom: '1rem' }}>
                ⚠️ {sellerImportError}
              </div>
            )}

            {sellerImportMessage && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '10px 14px', borderRadius: '8px', fontSize: '13.5px', marginBottom: '1rem', fontWeight: 600 }}>
                ✓ {sellerImportMessage}
              </div>
            )}

            <label className={styles.dropZone}>
              <input
                type="file"
                accept=".csv"
                style={{ display: 'none' }}
                onChange={handleSellerCsvFileSelect}
              />
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00a8b5" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <div>
                <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '14.5px' }}>
                  {sellerImportFileName ? sellerImportFileName : 'Click to select CSV or drag file here'}
                </span>
                <div style={{ color: '#64748b', fontSize: '12.5px', marginTop: '2px' }}>
                  Supports CSV with Company Name, Main Category, Location, GST, Phone, Email
                </div>
              </div>
            </label>

            {sellerImportRows.length > 0 && (
              <div style={{ marginTop: '1.1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                    CSV Preview ({sellerImportRows.length} {sellerImportRows.length === 1 ? 'row' : 'rows'} detected):
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Showing first 3 rows</span>
                </div>
                <div className={styles.csvPreviewTableWrapper}>
                  <table className={styles.csvPreviewTable}>
                    <thead>
                      <tr>
                        {Object.keys(sellerImportRows[0]).slice(0, 6).map((headerKey) => (
                          <th key={headerKey}>{headerKey}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sellerImportRows.slice(0, 3).map((row, idx) => (
                        <tr key={idx}>
                          {Object.keys(sellerImportRows[0]).slice(0, 6).map((headerKey) => (
                            <td key={headerKey}>{row[headerKey] || '-'}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <button
              type="button"
              className={styles.loginBtn}
              onClick={handleExecuteSellerImport}
              disabled={sellerImportLoading || sellerImportRows.length === 0}
              style={{
                marginTop: '1.5rem',
                width: '100%',
                backgroundColor: '#00a8b5',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {sellerImportLoading ? 'Importing Suppliers...' : `Import ${sellerImportRows.length > 0 ? sellerImportRows.length : ''} Suppliers to Database`}
            </button>
          </div>
        </div>
      )}

      {/* Add Seller Modal */}
      {isAddSellerOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsAddSellerOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
            <button className={styles.modalClose} onClick={() => setIsAddSellerOpen(false)}>×</button>
            <h4 className={styles.modalTitle} style={{ margin: 0 }}>Add New Supplier / Seller</h4>
            <p style={{ color: '#666', fontSize: '13.5px', marginTop: '4px', marginBottom: '1.5rem' }}>
              Register a verified manufacturer, wholesaler, or distributor to a main product category.
            </p>
            <form onSubmit={handleAddSeller}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                  <label className={styles.formLabel}>Company / Supplier Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. KalaNiketan Apparels & Textiles Pvt Ltd"
                    className={styles.loginInput}
                    value={newSellerName}
                    onChange={(e) => setNewSellerName(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Main Category *</label>
                  <select
                    className={styles.formSelect}
                    value={newSellerMainCategory}
                    onChange={(e) => setNewSellerMainCategory(e.target.value)}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Location (City, State) *</label>
                  <input
                    type="text"
                    placeholder="e.g. Surat, Gujarat"
                    className={styles.loginInput}
                    value={newSellerLocation}
                    onChange={(e) => setNewSellerLocation(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>GST Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 24AAPCK1029F1Z2"
                    className={styles.loginInput}
                    value={newSellerGst}
                    onChange={(e) => setNewSellerGst(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Pravinbhai Patel"
                    className={styles.loginInput}
                    value={newSellerContactPerson}
                    onChange={(e) => setNewSellerContactPerson(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Phone / Mobile</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98251 44556"
                    className={styles.loginInput}
                    value={newSellerPhone}
                    onChange={(e) => setNewSellerPhone(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. sales@company.in"
                    className={styles.loginInput}
                    value={newSellerEmail}
                    onChange={(e) => setNewSellerEmail(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Nature of Business</label>
                  <input
                    type="text"
                    placeholder="e.g. Manufacturer & Direct Exporter"
                    className={styles.loginInput}
                    value={newSellerNature}
                    onChange={(e) => setNewSellerNature(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Trust Badge</label>
                  <select
                    className={styles.formSelect}
                    value={newSellerTrustScore}
                    onChange={(e) => setNewSellerTrustScore(e.target.value)}
                  >
                    <option value="Verified TrustSEAL">Verified TrustSEAL</option>
                    <option value="Leading Supplier">Leading Supplier</option>
                    <option value="Star Supplier">Star Supplier</option>
                    <option value="Certified Wholesaler">Certified Wholesaler</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className={styles.loginBtn}
                style={{
                  marginTop: '1.5rem',
                  width: '100%',
                  backgroundColor: '#00a8b5',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600
                }}
              >
                + Register Supplier
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Seller Modal */}
      {editingSeller && (
        <div className={styles.modalOverlay} onClick={() => setEditingSeller(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
            <button className={styles.modalClose} onClick={() => setEditingSeller(null)}>×</button>
            <h4 className={styles.modalTitle} style={{ margin: 0 }}>Edit Supplier / Seller</h4>
            <p style={{ color: '#666', fontSize: '13.5px', marginTop: '4px', marginBottom: '1.5rem' }}>
              Update verified supplier credentials and assigned main category.
            </p>
            <form onSubmit={handleSaveSeller}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                  <label className={styles.formLabel}>Company / Supplier Name *</label>
                  <input
                    type="text"
                    className={styles.loginInput}
                    value={editSellerName}
                    onChange={(e) => setEditSellerName(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Main Category *</label>
                  <select
                    className={styles.formSelect}
                    value={editSellerMainCategory}
                    onChange={(e) => setEditSellerMainCategory(e.target.value)}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Location (City, State) *</label>
                  <input
                    type="text"
                    className={styles.loginInput}
                    value={editSellerLocation}
                    onChange={(e) => setEditSellerLocation(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>GST Number</label>
                  <input
                    type="text"
                    className={styles.loginInput}
                    value={editSellerGst}
                    onChange={(e) => setEditSellerGst(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Contact Person</label>
                  <input
                    type="text"
                    className={styles.loginInput}
                    value={editSellerContactPerson}
                    onChange={(e) => setEditSellerContactPerson(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Phone / Mobile</label>
                  <input
                    type="text"
                    className={styles.loginInput}
                    value={editSellerPhone}
                    onChange={(e) => setEditSellerPhone(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email Address</label>
                  <input
                    type="email"
                    className={styles.loginInput}
                    value={editSellerEmail}
                    onChange={(e) => setEditSellerEmail(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Nature of Business</label>
                  <input
                    type="text"
                    className={styles.loginInput}
                    value={editSellerNature}
                    onChange={(e) => setEditSellerNature(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Status</label>
                  <select
                    className={styles.formSelect}
                    value={editSellerStatus}
                    onChange={(e) => setEditSellerStatus(e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className={styles.loginBtn}
                style={{
                  marginTop: '1.5rem',
                  width: '100%',
                  backgroundColor: '#00a8b5',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600
                }}
              >
                Save Supplier Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add category modal */}
      {isAddCategoryOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsAddCategoryOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setIsAddCategoryOpen(false)}>×</button>
            <h4 className={styles.modalTitle} style={{ margin: 0 }}>Add New Category</h4>
            <p style={{ color: '#666', fontSize: '13.5px', marginTop: '4px', marginBottom: '1.5rem' }}>Configure your category settings here.</p>
            <form onSubmit={handleAddCategory}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Category Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Input Devices"
                  className={styles.loginInput}
                  value={newCatName}
                  onChange={(e) => {
                    setNewCatName(e.target.value);
                    setNewCatSlug(e.target.value.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'));
                  }}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Slug (URL identifier)</label>
                <input
                  type="text"
                  placeholder="e.g. input-devices"
                  className={styles.loginInput}
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Parent Category</label>
                <select
                  className={styles.formSelect}
                  value={newCatParentGroup}
                  onChange={(e) => setNewCatParentGroup(e.target.value)}
                >
                  <option value="None">None (Top Level)</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description</label>
                <input
                  type="text"
                  placeholder="Optional description..."
                  className={styles.loginInput}
                  value={newCatDescription}
                  onChange={(e) => setNewCatDescription(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Category Image URL</label>
                <input
                  type="text"
                  placeholder="e.g. /images/networking.png (optional)"
                  className={styles.loginInput}
                  value={newCatImage}
                  onChange={(e) => setNewCatImage(e.target.value)}
                />
                <div className={styles.mediaPreviewFrame} style={{ height: '110px' }}>
                  {newCatImage ? (
                    <img src={newCatImage} alt="Category Preview" className={styles.mediaPreviewImage} onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/default_category.png';
                    }} />
                  ) : (
                    <span className={styles.mediaPreviewPlaceholder}>Category Image Preview Frame</span>
                  )}
                </div>
              </div>

              <button type="submit" className={styles.loginBtn} style={{ marginTop: '1.5rem', width: '100%', backgroundColor: '#00a8b5', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Create Category
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit category modal */}
      {editingCategory && (
        <div className={styles.modalOverlay} onClick={() => setEditingCategory(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setEditingCategory(null)}>×</button>
            <h4 className={styles.modalTitle} style={{ margin: 0 }}>Edit Category</h4>
            <p style={{ color: '#666', fontSize: '13.5px', marginTop: '4px', marginBottom: '1.5rem' }}>Configure category settings here.</p>
            <form onSubmit={handleSaveCategory}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Category Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Input Devices"
                  className={styles.loginInput}
                  value={editCatName}
                  onChange={(e) => {
                    setEditCatName(e.target.value);
                    setEditCatSlug(e.target.value.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'));
                  }}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Slug (URL identifier)</label>
                <input
                  type="text"
                  placeholder="e.g. input-devices"
                  className={styles.loginInput}
                  value={editCatSlug}
                  onChange={(e) => setEditCatSlug(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Parent Category</label>
                <select
                  className={styles.formSelect}
                  value={editCatParentGroup}
                  onChange={(e) => setEditCatParentGroup(e.target.value)}
                >
                  <option value="None">None (Top Level)</option>
                  {categories.filter(c => c.id !== editingCategory.id).map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description</label>
                <input
                  type="text"
                  placeholder="Optional description..."
                  className={styles.loginInput}
                  value={editCatDescription}
                  onChange={(e) => setEditCatDescription(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Status</label>
                <select
                  className={styles.formSelect}
                  value={editCatStatus}
                  onChange={(e) => setEditCatStatus(e.target.value)}
                >
                  <option value="Visible">Visible</option>
                  <option value="Hidden">Hidden</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Category Image URL</label>
                <input
                  type="text"
                  placeholder="e.g. /images/networking.png (optional)"
                  className={styles.loginInput}
                  value={editCatImage}
                  onChange={(e) => setEditCatImage(e.target.value)}
                />
                <div className={styles.mediaPreviewFrame} style={{ height: '110px' }}>
                  {editCatImage ? (
                    <img src={editCatImage} alt="Category Preview" className={styles.mediaPreviewImage} onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/default_category.png';
                    }} />
                  ) : (
                    <span className={styles.mediaPreviewPlaceholder}>Category Image Preview Frame</span>
                  )}
                </div>
              </div>

              <button type="submit" className={styles.loginBtn} style={{ marginTop: '1.5rem', width: '100%', backgroundColor: '#00a8b5', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Save Category
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add product modal */}
      {isAddProductOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsAddProductOpen(false)}>
          <div className={styles.wideModalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setIsAddProductOpen(false)}>×</button>
            <h4 className={styles.modalTitle}>Add New Product</h4>
            <form onSubmit={handleAddProduct}>
              <div className={styles.createProductGrid}>
                {/* Left Column */}
                <div>
                  {/* Basic Information */}
                  <div className={styles.modalSection}>
                    <h5 className={styles.modalSectionTitle}>Basic Information</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Product Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. ASUS ROG Strix B550-F"
                          className={styles.loginInput}
                          value={newProdName}
                          onChange={(e) => {
                            setNewProdName(e.target.value);
                            setNewProdSlug(e.target.value.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'));
                          }}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>SKU (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. SKU-ROG-B550"
                          className={styles.loginInput}
                          value={newProdSku}
                          onChange={(e) => setNewProdSku(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Slug (URL identifier)</label>
                      <input
                        type="text"
                        placeholder="e.g. asus-rog-strix-b550-f"
                        className={styles.loginInput}
                        value={newProdSlug}
                        onChange={(e) => setNewProdSlug(e.target.value)}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Description</label>
                      <div className={styles.descriptionToolbar}>
                        <button type="button" className={styles.toolbarBtn} onClick={() => setNewProdDescription(prev => prev + ' **bold text**')}>Bold</button>
                        <button type="button" className={styles.toolbarBtn} onClick={() => setNewProdDescription(prev => prev + ' *italic text*')}>Italic</button>
                        <button type="button" className={styles.toolbarBtn} onClick={() => setNewProdDescription(prev => prev + ' [Link Text](https://link-url.com)')}>Link</button>
                        <button type="button" className={styles.toolbarBtn} onClick={() => setNewProdDescription(prev => prev + '\n- List item')}>List</button>
                      </div>
                      <textarea
                        placeholder="Describe your product specs, features, and warranty details..."
                        className={styles.descriptionTextarea}
                        value={newProdDescription}
                        onChange={(e) => setNewProdDescription(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Media Gallery */}
                  <div className={styles.modalSection}>
                    <h5 className={styles.modalSectionTitle}>Media Gallery</h5>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Image URL *</label>
                      <input
                        type="text"
                        placeholder="e.g. https://images.com/product.png"
                        className={styles.loginInput}
                        value={newProdImage}
                        onChange={(e) => setNewProdImage(e.target.value)}
                        required
                      />
                      <div className={styles.mediaPreviewFrame}>
                        {newProdImage ? (
                          <img src={newProdImage} alt="Product Preview" className={styles.mediaPreviewImage} onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images/default_product.png';
                          }} />
                        ) : (
                          <span className={styles.mediaPreviewPlaceholder}>Image Preview Frame (URL Required)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Inventory & Shipping */}
                  <div className={styles.modalSection}>
                    <h5 className={styles.modalSectionTitle}>Inventory & Shipping</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Stock Qty *</label>
                        <input
                          type="number"
                          placeholder="e.g. 10"
                          className={styles.loginInput}
                          value={newProdStock}
                          onChange={(e) => setNewProdStock(e.target.value)}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Low Stock Alert Threshold</label>
                        <input
                          type="number"
                          placeholder="e.g. 5"
                          className={styles.loginInput}
                          value={newProdLowStockThreshold}
                          onChange={(e) => setNewProdLowStockThreshold(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  {/* Pricing */}
                  <div className={styles.modalSection}>
                    <h5 className={styles.modalSectionTitle}>Pricing</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>MRP (INR) *</label>
                        <input
                          type="number"
                          placeholder="e.g. 25000"
                          className={styles.loginInput}
                          value={newProdMrp}
                          onChange={(e) => setNewProdMrp(e.target.value)}
                          required
                        />
                        {productMrpError && (
                          <span className={styles.fieldError}>{productMrpError}</span>
                        )}
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Discount (%)</label>
                        <input
                          type="number"
                          placeholder="e.g. 10"
                          className={styles.loginInput}
                          value={newProdDiscount}
                          onChange={(e) => setNewProdDiscount(e.target.value)}
                        />
                        {productDiscountError && (
                          <span className={styles.fieldError}>{productDiscountError}</span>
                        )}
                      </div>
                    </div>
                    <div className={styles.offerPriceBox}>
                      <span className={styles.offerPriceLabel}>Calculated Offer Price:</span>
                      <span className={styles.offerPriceValue}>{formattedOfferPrice}</span>
                    </div>
                  </div>

                  {/* Organization */}
                  <div className={styles.modalSection}>
                    <h5 className={styles.modalSectionTitle}>Organization & Supplier</h5>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Category *</label>
                      <select
                        className={styles.formSelect}
                        value={newProdCategory}
                        onChange={(e) => {
                          const catVal = e.target.value;
                          setNewProdCategory(catVal);
                          const matched = sellers.find(s => s.mainCategory.toLowerCase() === catVal.toLowerCase());
                          if (matched) {
                            setNewProdSellerId(matched.id);
                            setNewProdSellerName(matched.name);
                            setNewProdSellerLocation(matched.location);
                          }
                        }}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Brand *</label>
                      <select
                        className={styles.formSelect}
                        value={newProdBrand}
                        onChange={(e) => setNewProdBrand(e.target.value)}
                        required
                      >
                        <option value="">Select Brand</option>
                        {brands.map((b) => (
                          <option key={b.id} value={b.name}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Supplier / Seller</label>
                      <select
                        className={styles.formSelect}
                        value={newProdSellerId}
                        onChange={(e) => {
                          const sid = e.target.value;
                          setNewProdSellerId(sid);
                          const sel = sellers.find(s => s.id === sid);
                          if (sel) {
                            setNewProdSellerName(sel.name);
                            setNewProdSellerLocation(sel.location);
                          } else {
                            setNewProdSellerName('');
                            setNewProdSellerLocation('');
                          }
                        }}
                      >
                        <option value="">Auto-Assign by Category</option>
                        {sellers.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.mainCategory} - {s.location})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Visibility & Settings */}
                  <div className={styles.modalSection}>
                    <h5 className={styles.modalSectionTitle}>Product Settings</h5>
                    <div className={styles.switchGroup}>
                      <span className={styles.formLabel}>Published (Active)</span>
                      <label className={styles.toggleSwitch}>
                        <input
                          type="checkbox"
                          checked={newProdStatus === 'PUBLISHED'}
                          onChange={(e) => setNewProdStatus(e.target.checked ? 'PUBLISHED' : 'DRAFT')}
                        />
                        <span className={styles.toggleSlider}></span>
                      </label>
                    </div>
                    <div className={styles.switchGroup}>
                      <span className={styles.formLabel}>Featured Product</span>
                      <label className={styles.toggleSwitch}>
                        <input
                          type="checkbox"
                          checked={newProdFeatured}
                          onChange={(e) => setNewProdFeatured(e.target.checked)}
                        />
                        <span className={styles.toggleSlider}></span>
                      </label>
                    </div>
                    <div className={styles.switchGroup}>
                      <span className={styles.formLabel}>Show On Offer</span>
                      <label className={styles.toggleSwitch}>
                        <input
                          type="checkbox"
                          checked={newProdOnOffer}
                          onChange={(e) => setNewProdOnOffer(e.target.checked)}
                        />
                        <span className={styles.toggleSlider}></span>
                      </label>
                    </div>
                  </div>

                  {/* Warranty */}
                  <div className={styles.modalSection}>
                    <h5 className={styles.modalSectionTitle}>Warranty</h5>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Warranty Period</label>
                      <select
                        className={styles.formSelect}
                        value={newProdWarranty}
                        onChange={(e) => setNewProdWarranty(e.target.value)}
                      >
                        <option value="0">No Warranty</option>
                        <option value="6">6 Months</option>
                        <option value="12">12 Months (1 Year)</option>
                        <option value="24">24 Months (2 Years)</option>
                        <option value="36">36 Months (3 Years)</option>
                        <option value="60">60 Months (5 Years)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className={styles.loginBtn} style={{ width: '100%', marginTop: '1.5rem', height: '50px', fontSize: '16px' }}>
                Create & Save Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit product modal */}
      {editingProduct && (
        <div className={styles.modalOverlay} onClick={() => setEditingProduct(null)}>
          <div className={styles.wideModalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setEditingProduct(null)}>×</button>
            <h4 className={styles.modalTitle}>Edit Product</h4>
            <form onSubmit={handleSaveProduct}>
              <div className={styles.createProductGrid}>
                {/* Left Column */}
                <div>
                  {/* Basic Information */}
                  <div className={styles.modalSection}>
                    <h5 className={styles.modalSectionTitle}>Basic Information</h5>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Product Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Logitech MX Master 3S"
                        className={styles.loginInput}
                        value={editProdName}
                        onChange={(e) => {
                          setEditProdName(e.target.value);
                          setEditProdSlug(e.target.value.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'));
                        }}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Slug (URL identifier)</label>
                      <input
                        type="text"
                        placeholder="e.g. logitech-mx-master-3s"
                        className={styles.loginInput}
                        value={editProdSlug}
                        onChange={(e) => setEditProdSlug(e.target.value)}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Description</label>
                      <textarea
                        placeholder="Provide details about specs, features, compatibility..."
                        className={styles.descriptionTextarea}
                        value={editProdDescription}
                        onChange={(e) => setEditProdDescription(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Pricing and Inventory */}
                  <div className={styles.modalSection}>
                    <h5 className={styles.modalSectionTitle}>Pricing & Inventory</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>MRP (₹) *</label>
                        <input
                          type="number"
                          placeholder="e.g. 10000"
                          className={styles.loginInput}
                          value={editProdMrp}
                          onChange={(e) => setEditProdMrp(e.target.value)}
                          required
                        />
                        {productMrpError && <div style={{ color: 'red', fontSize: '11px', marginTop: '3px' }}>{productMrpError}</div>}
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Discount (%)</label>
                        <input
                          type="number"
                          placeholder="e.g. 15"
                          className={styles.loginInput}
                          value={editProdDiscount}
                          onChange={(e) => setEditProdDiscount(e.target.value)}
                        />
                        {productDiscountError && <div style={{ color: 'red', fontSize: '11px', marginTop: '3px' }}>{productDiscountError}</div>}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>SKU Code</label>
                        <input
                          type="text"
                          placeholder="e.g. SKU-MX-3S"
                          className={styles.loginInput}
                          value={editProdSku}
                          onChange={(e) => setEditProdSku(e.target.value)}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Stock Qty *</label>
                        <input
                          type="number"
                          className={styles.loginInput}
                          value={editProdStock}
                          onChange={(e) => setEditProdStock(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  {/* Categorization & Metadata */}
                  <div className={styles.modalSection}>
                    <h5 className={styles.modalSectionTitle}>Categorization</h5>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Category *</label>
                      <select
                        className={styles.formSelect}
                        value={editProdCategory}
                        onChange={(e) => setEditProdCategory(e.target.value)}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Brand *</label>
                      <select
                        className={styles.formSelect}
                        value={editProdBrand}
                        onChange={(e) => setEditProdBrand(e.target.value)}
                        required
                      >
                        <option value="">Select Brand</option>
                        {brands.map((b) => (
                          <option key={b.id} value={b.name}>{b.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Supplier / Seller</label>
                      <select
                        className={styles.formSelect}
                        value={editProdSellerId}
                        onChange={(e) => {
                          const sid = e.target.value;
                          setEditProdSellerId(sid);
                          const sel = sellers.find(s => s.id === sid);
                          if (sel) {
                            setEditProdSellerName(sel.name);
                            setEditProdSellerLocation(sel.location);
                          } else {
                            setEditProdSellerName('');
                            setEditProdSellerLocation('');
                          }
                        }}
                      >
                        <option value="">Select / Reassign Supplier</option>
                        {sellers.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.mainCategory} - {s.location})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Status</label>
                      <select
                        className={styles.formSelect}
                        value={editProdStatus}
                        onChange={(e) => setEditProdStatus(e.target.value as 'PUBLISHED' | 'DRAFT')}
                      >
                        <option value="PUBLISHED">Published</option>
                        <option value="DRAFT">Draft</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', borderTop: '1px solid #f4f4f5', paddingTop: '1rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#444', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={editProdFeatured}
                          onChange={(e) => setEditProdFeatured(e.target.checked)}
                          style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                        />
                        Featured Product
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#444', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={editProdOnOffer}
                          onChange={(e) => setEditProdOnOffer(e.target.checked)}
                          style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                        />
                        On Offer
                      </label>
                    </div>
                  </div>

                  {/* Media uploads */}
                  <div className={styles.modalSection}>
                    <h5 className={styles.modalSectionTitle}>Product Image</h5>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Image URL</label>
                      <input
                        type="text"
                        placeholder="e.g. /images/products/mouse.png"
                        className={styles.loginInput}
                        value={editProdImage}
                        onChange={(e) => setEditProdImage(e.target.value)}
                      />
                      <div className={styles.mediaPreviewFrame} style={{ marginTop: '10px' }}>
                        {editProdImage ? (
                          <img src={editProdImage} alt="Product Preview" className={styles.mediaPreviewImage} onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images/default_product.png';
                          }} />
                        ) : (
                          <span className={styles.mediaPreviewPlaceholder}>Product Image Preview</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional parameters */}
                  <div className={styles.modalSection}>
                    <h5 className={styles.modalSectionTitle}>Specifications</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Low Stock Alert</label>
                        <input
                          type="number"
                          className={styles.loginInput}
                          value={editProdLowStockThreshold}
                          onChange={(e) => setEditProdLowStockThreshold(e.target.value)}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Warranty Period</label>
                        <select
                          className={styles.formSelect}
                          value={editProdWarranty}
                          onChange={(e) => setEditProdWarranty(e.target.value)}
                        >
                          <option value="0">No Warranty</option>
                          <option value="6">6 Months</option>
                          <option value="12">12 Months (1 Year)</option>
                          <option value="24">24 Months (2 Years)</option>
                          <option value="36">36 Months (3 Years)</option>
                          <option value="60">60 Months (5 Years)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className={styles.loginBtn} style={{ width: '100%', marginTop: '1.5rem', height: '50px', fontSize: '16px' }}>
                Save & Update Product
              </button>
            </form>
          </div>
        </div>
      )}



      {/* Add coupon modal */}
      {isAddCouponOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsAddCouponOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setIsAddCouponOpen(false)}>×</button>
            <h4 className={styles.modalTitle}>Create Discount Coupon</h4>
            <form onSubmit={handleAddCoupon}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Coupon Code *</label>
                <input
                  type="text"
                  placeholder="e.g. FESTIVE20"
                  className={styles.loginInput}
                  style={{ textTransform: 'uppercase' }}
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Discount Type *</label>
                  <select
                    className={styles.formSelect}
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as 'percentage' | 'fixed')}
                    required
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (INR)</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Discount Value *</label>
                  <input
                    type="number"
                    placeholder="e.g. 15"
                    className={styles.loginInput}
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(e.target.value)}
                    required
                  />
                  {couponDiscountError && (
                    <span className={styles.fieldError}>{couponDiscountError}</span>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Min. Purchase (INR)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1000"
                    className={styles.loginInput}
                    value={newCouponMinPurchase}
                    onChange={(e) => setNewCouponMinPurchase(e.target.value)}
                  />
                  {couponMinPurchaseError && (
                    <span className={styles.fieldError}>{couponMinPurchaseError}</span>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Usage Limit (Times)</label>
                  <input
                    type="number"
                    placeholder="e.g. 100"
                    className={styles.loginInput}
                    value={newCouponUsageLimit}
                    onChange={(e) => setNewCouponUsageLimit(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Expiry Date</label>
                <input
                  type="date"
                  className={styles.loginInput}
                  value={newCouponExpiryDate}
                  onChange={(e) => setNewCouponExpiryDate(e.target.value)}
                  min={(() => {
                    const today = new Date();
                    const yyyy = today.getFullYear();
                    const mm = String(today.getMonth() + 1).padStart(2, '0');
                    const dd = String(today.getDate()).padStart(2, '0');
                    return `${yyyy}-${mm}-${dd}`;
                  })()}
                />
                {couponExpiryDateError && (
                  <span className={styles.fieldError}>{couponExpiryDateError}</span>
                )}
              </div>

              <div className={styles.formGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '8px', marginTop: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="couponActive"
                  checked={newCouponActive}
                  onChange={(e) => setNewCouponActive(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="couponActive" style={{ fontSize: '14px', cursor: 'pointer' }}>Make this coupon active immediately</label>
              </div>

              <button
                type="submit"
                className={styles.loginBtn}
                style={{
                  marginTop: '1.25rem',
                  width: '100%',
                  backgroundColor: '#00a8b5',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Create Coupon Code
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {isUpdateStatusModalOpen && updatingOrder && (
        <div className={styles.modalOverlay} onClick={() => { setIsUpdateStatusModalOpen(false); setUpdatingOrder(null); }}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => { setIsUpdateStatusModalOpen(false); setUpdatingOrder(null); }}>×</button>
            <h4 className={styles.modalTitle}>Update Order Status</h4>
            <p style={{ color: '#666', fontSize: '13.5px', marginTop: '4px', marginBottom: '1.5rem' }}>
              Modify delivery and payment configurations for Order ID: <strong>#{updatingOrder.orderId}</strong>
            </p>
            <form onSubmit={handleUpdateOrderStatus}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Delivery Status</label>
                <select
                  className={styles.formSelect}
                  value={updatingOrderStatus}
                  onChange={(e) => setUpdatingOrderStatus(e.target.value as any)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Payment Status</label>
                <select
                  className={styles.formSelect}
                  value={updatingOrderPaymentStatus}
                  onChange={(e) => setUpdatingOrderPaymentStatus(e.target.value as any)}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>

              <button
                type="submit"
                className={styles.loginBtn}
                style={{
                  marginTop: '1.5rem',
                  width: '100%',
                  backgroundColor: '#00a8b5',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Add Admin Modal — Full Design */}
      {isAddAdminOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsAddAdminOpen(false)}>
          <div className={styles.wideModalContent} style={{ maxWidth: '760px', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#00a8b5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg>
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#111', margin: 0 }}>Add Admin</h4>
              </div>
              <button className={styles.modalClose} style={{ position: 'static', fontSize: '22px' }} onClick={() => setIsAddAdminOpen(false)}>×</button>
            </div>
            <p style={{ color: '#888', fontSize: '13.5px', marginBottom: '1.5rem' }}>Configure administrator details, active status, role, and granular module permissions.</p>

            <form onSubmit={handleAddAdmin}>
              {/* Row 1: Full Name + Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className={styles.formGroup} style={{ margin: 0 }}>
                  <label className={styles.formLabel}>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    type="text"
                    className={styles.loginInput}
                    value={newAdminFullName}
                    onChange={(e) => setNewAdminFullName(e.target.value)}
                    placeholder="e.g. Sub Admin"
                    style={{ height: '44px', fontSize: '14px', border: '1.5px solid #d1d5db' }}
                  />
                </div>
                <div className={styles.formGroup} style={{ margin: 0 }}>
                  <label className={styles.formLabel}>Email Address <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    type="email"
                    className={styles.loginInput}
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="admin@gmail.com"
                    required
                    style={{ height: '44px', fontSize: '14px', border: '1.5px solid #d1d5db' }}
                  />
                </div>
              </div>

              {/* Row 2: Password + Role */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div className={styles.formGroup} style={{ margin: 0 }}>
                  <label className={styles.formLabel}>Password <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    type="password"
                    className={styles.loginInput}
                    value={newAdminPwd}
                    onChange={(e) => setNewAdminPwd(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{ height: '44px', fontSize: '14px', border: '1.5px solid #d1d5db' }}
                  />
                </div>
                <div className={styles.formGroup} style={{ margin: 0 }}>
                  <label className={styles.formLabel}>Role <span style={{ color: '#ef4444' }}>*</span></label>
                  <select
                    className={styles.formSelect}
                    value={newAdminRole}
                    onChange={(e) => setNewAdminRole(e.target.value)}
                    style={{ height: '44px', fontSize: '14px', border: '1.5px solid #d1d5db' }}
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPER ADMIN">SUPER ADMIN</option>
                    <option value="PRODUCT MANAGER">PRODUCT MANAGER</option>
                    <option value="ORDER MANAGER">ORDER MANAGER</option>
                    <option value="CONTENT EDITOR">CONTENT EDITOR</option>
                    <option value="SUPPORT AGENT">SUPPORT AGENT</option>
                    <option value="ANALYST">ANALYST</option>
                  </select>
                </div>
              </div>

              {/* Account Active Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <div
                  onClick={() => setNewAdminActive(v => !v)}
                  style={{
                    width: '22px', height: '22px', borderRadius: '6px', cursor: 'pointer', flexShrink: 0,
                    backgroundColor: newAdminActive ? '#00a8b5' : '#e5e7eb',
                    border: `2px solid ${newAdminActive ? '#00a8b5' : '#d1d5db'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  {newAdminActive && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#333', cursor: 'pointer' }} onClick={() => setNewAdminActive(v => !v)}>
                  Account Active
                </span>
              </div>

              {/* MODULE PERMISSIONS */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#00a8b5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Module Permissions</span>
                  <span style={{ fontSize: '12.5px', color: '#888' }}>Enabling Create/Edit/Delete auto-enables View</span>
                </div>

                <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                  {/* Table Header */}
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 60px', backgroundColor: '#2d2420', color: 'white', padding: '10px 16px', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', gap: '8px', alignItems: 'center' }}>
                    <div>Module</div>
                    <div style={{ textAlign: 'center' }}>View</div>
                    <div style={{ textAlign: 'center' }}>Create</div>
                    <div style={{ textAlign: 'center' }}>Edit</div>
                    <div style={{ textAlign: 'center' }}>Delete</div>
                    <div style={{ textAlign: 'center' }}>All</div>
                  </div>
                  {/* Module rows */}
                  {ADMIN_MODULES.map((mod, idx) => {
                    const perm = newAdminPermissions[mod.key];
                    const allOn = perm.view && perm.create && perm.edit && perm.delete;

                    const togglePerm = (field: keyof ModulePermission) => {
                      setNewAdminPermissions(prev => {
                        const cur = prev[mod.key];
                        const next = { ...cur, [field]: !cur[field] };
                        // If enabling create/edit/delete, auto-enable view
                        if ((field === 'create' || field === 'edit' || field === 'delete') && next[field]) {
                          next.view = true;
                        }
                        return { ...prev, [mod.key]: next };
                      });
                    };

                    const toggleAll = () => {
                      setNewAdminPermissions(prev => ({
                        ...prev,
                        [mod.key]: { view: !allOn, create: !allOn, edit: !allOn, delete: !allOn }
                      }));
                    };

                    const CheckBox = ({ field }: { field: keyof ModulePermission }) => (
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div
                          onClick={() => togglePerm(field)}
                          style={{
                            width: '20px', height: '20px', borderRadius: '5px', cursor: 'pointer',
                            backgroundColor: perm[field] ? '#00a8b5' : 'white',
                            border: `2px solid ${perm[field] ? '#00a8b5' : '#d1d5db'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.15s', flexShrink: 0
                          }}
                        >
                          {perm[field] && (
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      </div>
                    );

                    return (
                      <div
                        key={mod.key}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 60px',
                          padding: '12px 16px',
                          borderTop: '1px solid #f0f0f4',
                          backgroundColor: idx % 2 === 0 ? '#fff' : '#fafafa',
                          gap: '8px',
                          alignItems: 'center'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500, color: '#333' }}>
                          <span style={{ fontSize: '15px', width: '18px', textAlign: 'center' }}>{mod.icon}</span>
                          {mod.key}
                        </div>
                        <CheckBox field="view" />
                        <CheckBox field="create" />
                        <CheckBox field="edit" />
                        <CheckBox field="delete" />
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <button
                            type="button"
                            onClick={toggleAll}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              border: '1px solid #d1d5db',
                              background: allOn ? '#00a8b5' : 'white',
                              color: allOn ? 'white' : '#555',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.15s'
                            }}
                          >
                            All
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Username (login name) */}
              <div className={styles.formGroup} style={{ marginBottom: '1.25rem' }}>
                <label className={styles.formLabel}>Username <span style={{ color: '#ef4444' }}>*</span> <span style={{ color: '#aaa', fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: '12px' }}>(used to log in)</span></label>
                <input
                  type="text"
                  className={styles.loginInput}
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="e.g. subadmin01"
                  required
                  style={{ height: '44px', fontSize: '14px', border: '1.5px solid #d1d5db' }}
                />
              </div>

              {adminFormError && <div style={{ color: '#ef4444', fontSize: '13px', marginBottom: '1rem', fontWeight: 500 }}>{adminFormError}</div>}

              {/* Footer buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '1rem', borderTop: '1px solid #f0f0f4' }}>
                <button type="button" onClick={() => setIsAddAdminOpen(false)}
                  style={{ padding: '0 1.5rem', height: '42px', fontSize: '14px', fontWeight: 500, background: 'white', border: '1.5px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', color: '#555' }}>
                  Cancel
                </button>
                <button type="submit"
                  style={{ padding: '0 1.5rem', height: '42px', fontSize: '14px', fontWeight: 600, background: '#00a8b5', border: 'none', borderRadius: '8px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                  </svg>
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* Edit Admin Modal */}
      {editingAdmin && (
        <div className={styles.modalOverlay} onClick={() => setEditingAdmin(null)}>
          <div className={styles.modalContent} style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setEditingAdmin(null)}>×</button>
            <h4 className={styles.modalTitle} style={{ fontSize: '18px', fontWeight: 700, textTransform: 'none', borderBottom: '1px solid #f0f0f4', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
              Edit Admin
            </h4>
            {/* Admin preview */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', backgroundColor: '#fafafa', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <div
                className={styles.adminAvatar}
                style={{ backgroundColor: getAvatarStyle(editingAdmin.username).bg, color: getAvatarStyle(editingAdmin.username).color }}
              >
                {(editingAdmin.username || 'AU').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: '#111' }}>{editingAdmin.username}</div>
                <div style={{ fontSize: '12px', color: '#888' }}>Editing profile</div>
              </div>
            </div>
            <form onSubmit={handleEditAdminSave}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Username *</label>
                <input
                  type="text"
                  className={styles.loginInput}
                  value={editAdminUsername}
                  onChange={(e) => setEditAdminUsername(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email Address</label>
                <input
                  type="email"
                  className={styles.loginInput}
                  value={editAdminEmail}
                  onChange={(e) => setEditAdminEmail(e.target.value)}
                  placeholder="e.g. admin@example.com"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>New Password <span style={{ color: '#aaa', fontWeight: 400 }}>(leave blank to keep current)</span></label>
                <input
                  type="password"
                  className={styles.loginInput}
                  value={editAdminPwd}
                  onChange={(e) => setEditAdminPwd(e.target.value)}
                  placeholder="Enter new password..."
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Role *</label>
                  <select
                    className={styles.formSelect}
                    value={editAdminRole}
                    onChange={(e) => setEditAdminRole(e.target.value)}
                  >
                    <option value="SUPER ADMIN">Super Admin</option>
                    <option value="PRODUCT MANAGER">Product Manager</option>
                    <option value="ORDER MANAGER">Order Manager</option>
                    <option value="CONTENT EDITOR">Content Editor</option>
                    <option value="SUPPORT AGENT">Support Agent</option>
                    <option value="ANALYST">Analyst</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Status</label>
                  <select
                    className={styles.formSelect}
                    value={editAdminStatus}
                    onChange={(e) => setEditAdminStatus(e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              {editAdminError && <div style={{ color: '#ef4444', fontSize: '13px', marginBottom: '1rem', fontWeight: 500 }}>{editAdminError}</div>}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
                <button type="button" className={styles.backBtn} style={{ width: 'auto', padding: '0 1.25rem', height: '40px', fontSize: '14px' }} onClick={() => setEditingAdmin(null)}>
                  Cancel
                </button>
                <button type="submit" className={styles.loginBtn} style={{ width: 'auto', padding: '0 1.5rem', height: '40px', fontSize: '14px', backgroundColor: '#00a8b5', border: 'none', fontWeight: 600 }}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
}

