'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Tag,
  CreditCard,
  UserCog,
  Settings,
  ChevronDown,
  Plus,
  Edit2,
  Trash2,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Eye,
  X,
  Check,
  Ban,
  Clock,
  Truck,
  FileText,
  Upload,
  Shield,
  Globe,
  Bell,
  Menu,
  LogOut,
} from 'lucide-react'

// Types
interface Product {
  id: string
  name: string
  description: string
  price: number
  discount_price?: number
  sku?: string
  image_url: string
  images?: string[]
  category: string
  subcategory?: string
  variants?: Variant[]
  stock: number
  active: boolean
  created_at: string
}

interface Variant {
  id: string
  size?: string
  color?: string
  stock: number
  sku?: string
}

interface Order {
  id: string
  order_number: string
  customer_id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  delivery_address: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed'
  payment_method: string
  created_at: string
}

interface OrderItem {
  product_id: string
  product_name: string
  quantity: number
  price: number
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  total_spent: number
  order_count: number
  status: 'active' | 'blocked'
  created_at: string
}

interface Coupon {
  id: string
  code: string
  discount_type: 'fixed' | 'percentage'
  discount_value: number
  expiry_date: string
  usage_limit: number
  used_count: number
  active: boolean
}

interface AdminUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'viewer'
  permissions: string[]
  active: boolean
}

type Tab = 'dashboard' | 'orders' | 'products' | 'customers' | 'coupons' | 'payments' | 'team' | 'settings'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(false)
  
  // Data states
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  
  // Modal states
  const [showProductModal, setShowProductModal] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [showCouponModal, setShowCouponModal] = useState(false)
  const [showTeamModal, setShowTeamModal] = useState(false)
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  
  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    discount_price: '',
    sku: '',
    image_url: '',
    images: [] as string[],
    category: '',
    subcategory: '',
    stock: '',
    active: true,
  })
  
  const [couponForm, setCouponForm] = useState({
    code: '',
    discount_type: 'percentage' as 'fixed' | 'percentage',
    discount_value: '',
    expiry_date: '',
    usage_limit: '',
  })
  
  const [teamForm, setTeamForm] = useState({
    name: '',
    email: '',
    role: 'manager' as 'admin' | 'manager' | 'viewer',
    permissions: [] as string[],
  })
  
  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [orderStatusFilter, setOrderStatusFilter] = useState('all')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // Settings
  const [storeSettings, setStoreSettings] = useState({
    name: 'ShopHub',
    logo: '',
    email: '',
    phone: '',
    address: '',
    facebook: '',
    instagram: '',
    twitter: '',
  })
  
  const [shippingSettings, setShippingSettings] = useState({
    flat_rate: '',
    free_shipping_threshold: '',
    cod_enabled: true,
    payment_gateway_enabled: true,
  })

const supabase = createClient()

useEffect(() => {
    fetchData()
  }, [activeTab])

const fetchData = async () => {
    setLoading(true)
    
    if (activeTab === 'products' || activeTab === 'dashboard') {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setProducts(data)
    }
    
    // Mock data for other tabs (replace with actual Supabase queries)
    if (activeTab === 'orders' || activeTab === 'dashboard') {
      // Mock orders
      setOrders([
        {
          id: '1',
          order_number: 'ORD-001',
          customer_id: '1',
          customer_name: 'John Doe',
          customer_email: 'john@example.com',
          customer_phone: '+1234567890',
          delivery_address: '123 Main St, New York, NY 10001',
          items: [
            { product_id: '1', product_name: 'Product A', quantity: 2, price: 29.99 }
          ],
          subtotal: 59.98,
          shipping: 5.00,
          total: 64.98,
          status: 'pending',
          payment_status: 'pending',
          payment_method: 'COD',
          created_at: new Date().toISOString(),
        }
      ])
    }
    
    if (activeTab === 'customers' || activeTab === 'dashboard') {
      setCustomers([
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          total_spent: 299.99,
          order_count: 5,
          status: 'active',
          created_at: new Date().toISOString(),
        }
      ])
    }
    
    if (activeTab === 'coupons') {
      setCoupons([])
    }
    
    if (activeTab === 'team') {
      setAdminUsers([
        {
          id: '1',
          name: 'Admin User',
          email: 'admin@shophub.com',
          role: 'admin',
          permissions: ['all'],
          active: true,
        }
      ])
    }
    
    setLoading(false)
  }

// Product CRUD
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const productData = {
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      discount_price: productForm.discount_price ? parseFloat(productForm.discount_price) : null,
      sku: productForm.sku || null,
      image_url: productForm.image_url,
      images: productForm.images,
      category: productForm.category,
      subcategory: productForm.subcategory || null,
      stock: parseInt(productForm.stock),
      active: productForm.active,
    }

if (selectedProduct) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', selectedProduct.id)
      
      if (!error) alert('Product updated successfully!')
    } else {
      const { error } = await supabase
        .from('products')
        .insert([productData])
      
      if (!error) alert('Product created successfully!')
    }

setShowProductModal(false)
    resetProductForm()
    fetchData()
  }

const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    if (!error) {
      alert('Product deleted!')
      fetchData()
    }
  }

const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      discount_price: '',
      sku: '',
      image_url: '',
      images: [],
      category: '',
      subcategory: '',
      stock: '',
      active: true,
    })
    setSelectedProduct(null)
  }

// Order functions
  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    // Mock implementation - replace with actual Supabase update
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o))
    alert(`Order status updated to ${status}`)
  }

const generateInvoice = (order: Order) => {
    alert(`Generating PDF invoice for order ${order.order_number}`)
    // Implement PDF generation here
  }

const generateShippingLabel = (order: Order) => {
    alert(`Generating shipping label for order ${order.order_number}`)
    // Implement shipping label generation here
  }

// Coupon functions
  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const newCoupon: Coupon = {
      id: Date.now().toString(),
      code: couponForm.code.toUpperCase(),
      discount_type: couponForm.discount_type,
      discount_value: parseFloat(couponForm.discount_value),
      expiry_date: couponForm.expiry_date,
      usage_limit: parseInt(couponForm.usage_limit),
      used_count: 0,
      active: true,
    }
    
    setCoupons([...coupons, newCoupon])
    setShowCouponModal(false)
    setCouponForm({
      code: '',
      discount_type: 'percentage',
      discount_value: '',
      expiry_date: '',
      usage_limit: '',
    })
    alert('Coupon created successfully!')
  }

const deleteCoupon = (id: string) => {
    if (confirm('Delete this coupon?')) {
      setCoupons(coupons.filter(c => c.id !== id))
      alert('Coupon deleted!')
    }
  }

// Team functions
  const handleTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newUser: AdminUser = {
      id: Date.now().toString(),
      name: teamForm.name,
      email: teamForm.email,
      role: teamForm.role,
      permissions: teamForm.permissions,
      active: true,
    }
    
    setAdminUsers([...adminUsers, newUser])
    setShowTeamModal(false)
    setTeamForm({
      name: '',
      email: '',
      role: 'manager',
      permissions: [],
    })
    alert('Team member added successfully!')
  }

const toggleCustomerStatus = (id: string) => {
    setCustomers(customers.map(c => 
      c.id === id ? { ...c, status: c.status === 'active' ? 'blocked' : 'active' } : c
    ))
  }

// Analytics calculations
  const stats = {
    totalSales: orders.reduce((sum, o) => sum + o.total, 0),
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    completedOrders: orders.filter(o => o.status === 'delivered').length,
    cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
    totalRevenue: orders.filter(o => o.payment_status === 'paid').reduce((sum, o) => sum + o.total, 0),
    netProfit: orders.filter(o => o.payment_status === 'paid').reduce((sum, o) => sum + (o.total * 0.3), 0), // 30% profit margin
    activeCustomers: customers.filter(c => c.status === 'active').length,
    lowStockProducts: products.filter(p => p.stock < 10).length,
  }

const topProducts = products
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 5)

const recentOrders = orders.slice(0, 5)

// Filtered orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter
    const matchesPayment = paymentStatusFilter === 'all' || order.payment_status === paymentStatusFilter
    return matchesSearch && matchesStatus && matchesPayment
  })

const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)

// Render functions
  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

{/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">${stats.totalSales.toFixed(2)}</p>
              <p className="text-sm text-green-600 mt-1">↑ 12% from last month</p>
            </div>
            <DollarSign className="h-12 w-12 text-green-600" />
          </div>
        </div>

<div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalOrders}</p>
              <div className="flex gap-2 mt-1 text-xs">
                <span className="text-yellow-600">Pending: {stats.pendingOrders}</span>
                <span className="text-green-600">Done: {stats.completedOrders}</span>
              </div>
            </div>
            <ShoppingCart className="h-12 w-12 text-blue-600" />
          </div>
        </div>

<div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue & Profit</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">${stats.totalRevenue.toFixed(0)}</p>
              <p className="text-sm text-gray-600 mt-1">Profit: ${stats.netProfit.toFixed(0)}</p>
            </div>
            <TrendingUp className="h-12 w-12 text-purple-600" />
          </div>
        </div>

<div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Customers</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activeCustomers}</p>
              <p className="text-sm text-blue-600 mt-1">Total: {customers.length}</p>
            </div>
            <Users className="h-12 w-12 text-orange-600" />
          </div>
        </div>
      </div>

{/* Charts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart Placeholder */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Sales Trend (Last 7 Days)</h3>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Chart.js / Recharts Integration</p>
              <p className="text-sm text-gray-400">Sales visualization placeholder</p>
            </div>
          </div>
        </div>

{/* Top Selling Products */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Selling Products</h3>
          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No products available</p>
            ) : (
              topProducts.map((product, idx) => (
                <div key={product.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-400 w-6">#{idx + 1}</div>
                  <div className="h-12 w-12 bg-gray-200 rounded flex-shrink-0">
                    {product.image_url && (
                      <img src={product.image_url} alt={product.name} className="h-12 w-12 object-cover rounded" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${product.price}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

{/* Recent Orders & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
            <button
              onClick={() => setActiveTab('orders')}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No orders yet</p>
            ) : (
              recentOrders.map(order => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{order.order_number}</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{order.customer_name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</span>
                    <span className="font-bold text-gray-900">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

{/* Low Stock Alerts */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-bold text-gray-900">Low Stock Alerts</h3>
          </div>
          <div className="space-y-3">
            {products.filter(p => p.stock < 10).length === 0 ? (
              <div className="text-center py-8">
                <Check className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <p className="text-gray-500">All products are well stocked!</p>
              </div>
            ) : (
              products.filter(p => p.stock < 10).map(product => (
                <div key={product.id} className="border border-orange-200 bg-orange-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-600">{product.stock}</p>
                      <p className="text-xs text-gray-500">units left</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )

const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
          <p className="text-gray-600 mt-1">Manage and track all customer orders</p>
        </div>
      </div>

{/* Search & Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="search"
                placeholder="Search by order number or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={orderStatusFilter}
            onChange={(e) => setOrderStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Payments</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

{/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-gray-900">{order.order_number}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{order.customer_name}</p>
                      <p className="text-sm text-gray-500">{order.customer_email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-bold text-gray-900">${order.total.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                      order.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                      className={`px-3 py-1 rounded text-sm font-semibold border-2 cursor-pointer ${
                        order.status === 'pending' ? 'border-yellow-300 bg-yellow-100 text-yellow-800' :
                        order.status === 'processing' ? 'border-blue-300 bg-blue-100 text-blue-800' :
                        order.status === 'shipped' ? 'border-purple-300 bg-purple-100 text-purple-800' :
                        order.status === 'delivered' ? 'border-green-300 bg-green-100 text-green-800' :
                        'border-red-300 bg-red-100 text-red-800'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order)
                          setShowOrderModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => generateInvoice(order)}
                        className="text-green-600 hover:text-green-900"
                        title="Download Invoice"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => generateShippingLabel(order)}
                        className="text-purple-600 hover:text-purple-900"
                        title="Shipping Label"
                      >
                        <Truck className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

{/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
          <p className="text-gray-600 mt-1">Manage your product catalog and inventory</p>
        </div>
        <button
          onClick={() => {
            resetProductForm()
            setShowProductModal(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Product
        </button>
      </div>

<div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-gray-200 rounded flex-shrink-0">
                        {product.image_url && (
                          <img src={product.image_url} alt={product.name} className="h-12 w-12 object-cover rounded" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {product.sku || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-bold text-gray-900">${product.price.toFixed(2)}</p>
                      {product.discount_price && (
                        <p className="text-sm text-green-600">${product.discount_price.toFixed(2)}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`font-medium ${product.stock < 10 ? 'text-orange-600' : 'text-gray-900'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      product.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedProduct(product)
                          setProductForm({
                            name: product.name,
                            description: product.description,
                            price: product.price.toString(),
                            discount_price: product.discount_price?.toString() || '',
                            sku: product.sku || '',
                            image_url: product.image_url,
                            images: product.images || [],
                            category: product.category,
                            subcategory: product.subcategory || '',
                            stock: product.stock.toString(),
                            active: product.active,
                          })
                          setShowProductModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

const renderCustomers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
          <p className="text-gray-600 mt-1">View and manage customer accounts</p>
        </div>
      </div>

<div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customers.map(customer => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-blue-600">{customer.name[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-500">Since {new Date(customer.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900">{customer.email}</p>
                      <p className="text-sm text-gray-500">{customer.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-bold text-gray-900">${customer.total_spent.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-900">{customer.order_count}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleCustomerStatus(customer.id)}
                      className={`px-3 py-1 rounded text-xs font-semibold ${
                        customer.status === 'active' 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {customer.status === 'active' ? 'Active' : 'Blocked'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setSelectedCustomer(customer)
                        setShowCustomerModal(true)
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

const renderCoupons = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Discounts & Coupons</h2>
          <p className="text-gray-600 mt-1">Create and manage promotional codes</p>
        </div>
        <button
          onClick={() => setShowCouponModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Create Coupon
        </button>
      </div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map(coupon => (
          <div key={coupon.id} className="bg-white rounded-lg shadow-sm p-6 border-2 border-dashed border-gray-300">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-blue-100 px-4 py-2 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{coupon.code}</p>
              </div>
              <button
                onClick={() => deleteCoupon(coupon.id)}
                className="text-red-600 hover:text-red-900"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Discount:</span>
                <span className="font-bold text-gray-900">
                  {coupon.discount_type === 'percentage' 
                    ? `${coupon.discount_value}%` 
                    : `$${coupon.discount_value}`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Expires:</span>
                <span className="text-sm text-gray-900">{new Date(coupon.expiry_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Used:</span>
                <span className="text-gray-900">{coupon.used_count} / {coupon.usage_limit}</span>
              </div>
              <div className="pt-2">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  coupon.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {coupon.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        ))}
        {coupons.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No coupons created yet. Click "Create Coupon" to get started.
          </div>
        )}
      </div>
    </div>
  )

const renderPayments = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Payments & Shipping</h2>
        <p className="text-gray-600 mt-1">Configure payment methods and shipping options</p>
      </div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Methods</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <DollarSign className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Cash on Delivery (COD)</p>
                  <p className="text-sm text-gray-500">Accept cash payments on delivery</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={shippingSettings.cod_enabled}
                  onChange={(e) => setShippingSettings({...shippingSettings, cod_enabled: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

<div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Payment Gateway</p>
                  <p className="text-sm text-gray-500">Stripe, Razorpay, PayPal integration</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={shippingSettings.payment_gateway_enabled}
                  onChange={(e) => setShippingSettings({...shippingSettings, payment_gateway_enabled: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

{/* Shipping Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Shipping Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flat Rate Shipping ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={shippingSettings.flat_rate}
                onChange={(e) => setShippingSettings({...shippingSettings, flat_rate: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="5.00"
              />
            </div>

<div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Free Shipping Threshold ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={shippingSettings.free_shipping_threshold}
                onChange={(e) => setShippingSettings({...shippingSettings, free_shipping_threshold: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="50.00"
              />
              <p className="text-sm text-gray-500 mt-1">Orders above this amount ship free</p>
            </div>

<button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Save Shipping Settings
            </button>
          </div>
        </div>
      </div>

{/* Location-based Shipping (Placeholder) */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Location-Based Shipping Zones</h3>
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Truck className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Configure shipping rates by region/weight</p>
          <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium">
            + Add Shipping Zone
          </button>
        </div>
      </div>
    </div>
  )

const renderTeam = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team & User Management</h2>
          <p className="text-gray-600 mt-1">Manage admin access and permissions</p>
        </div>
        <button
          onClick={() => setShowTeamModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Team Member
        </button>
      </div>

<div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permissions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {adminUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-purple-600">{user.name[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded text-xs font-semibold ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.slice(0, 3).map((perm, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {perm}
                        </span>
                      ))}
                      {user.permissions.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          +{user.permissions.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      user.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

{/* RBAC Permissions Matrix */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Role Permissions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Permission</th>
                <th className="text-center py-3 px-4">Admin</th>
                <th className="text-center py-3 px-4">Manager</th>
                <th className="text-center py-3 px-4">Viewer</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                'View Dashboard',
                'Manage Products',
                'Manage Orders',
                'Manage Customers',
                'Create Coupons',
                'Payment Settings',
                'Team Management',
                'System Settings',
              ].map((permission, idx) => (
                <tr key={idx}>
                  <td className="py-3 px-4 text-gray-900">{permission}</td>
                  <td className="py-3 px-4 text-center">
                    <Check className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    {['Team Management', 'System Settings'].includes(permission) ? (
                      <X className="h-5 w-5 text-red-600 mx-auto" />
                    ) : (
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {permission === 'View Dashboard' ? (
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-600 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings & Security</h2>
        <p className="text-gray-600 mt-1">Configure store settings and security options</p>
      </div>

{/* Store Settings */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">General Store Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
            <input
              type="text"
              value={storeSettings.name}
              onChange={(e) => setStoreSettings({...storeSettings, name: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
            <input
              type="url"
              value={storeSettings.logo}
              onChange={(e) => setStoreSettings({...storeSettings, logo: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/logo.png"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
            <input
              type="email"
              value={storeSettings.email}
              onChange={(e) => setStoreSettings({...storeSettings, email: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={storeSettings.phone}
              onChange={(e) => setStoreSettings({...storeSettings, phone: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              value={storeSettings.address}
              onChange={(e) => setStoreSettings({...storeSettings, address: e.target.value})}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

<h4 className="text-md font-bold text-gray-900 mt-6 mb-3">Social Media Links</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
            <input
              type="url"
              value={storeSettings.facebook}
              onChange={(e) => setStoreSettings({...storeSettings, facebook: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://facebook.com/yourpage"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
            <input
              type="url"
              value={storeSettings.instagram}
              onChange={(e) => setStoreSettings({...storeSettings, instagram: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://instagram.com/yourpage"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
            <input
              type="url"
              value={storeSettings.twitter}
              onChange={(e) => setStoreSettings({...storeSettings, twitter: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://twitter.com/yourpage"
            />
          </div>
        </div>

<button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Save Settings
        </button>
      </div>

{/* Audit Logs */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Admin Activity Audit Logs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { time: '2026-10-03 10:30:15', user: 'admin@shophub.com', action: 'Product Updated', details: 'Updated Product #123' },
                { time: '2026-10-03 09:15:42', user: 'manager@shophub.com', action: 'Order Status Changed', details: 'ORD-001 → Shipped' },
                { time: '2026-10-02 18:45:22', user: 'admin@shophub.com', action: 'Coupon Created', details: 'SAVE20 - 20% discount' },
              ].map((log, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{log.time}</td>
                  <td className="px-4 py-3 text-gray-900">{log.user}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

{/* Security Settings */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
              Enable 2FA
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6 text-orange-600" />
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">Get alerts for important events</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard()
      case 'orders': return renderOrders()
      case 'products': return renderProducts()
      case 'customers': return renderCustomers()
      case 'coupons': return renderCoupons()
      case 'payments': return renderPayments()
      case 'team': return renderTeam()
      case 'settings': return renderSettings()
      default: return renderDashboard()
    }
  }

return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 flex flex-col fixed h-screen z-20`}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
        </div>

<nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
              { id: 'orders', icon: ShoppingCart, label: 'Orders' },
              { id: 'products', icon: Package, label: 'Products' },
              { id: 'customers', icon: Users, label: 'Customers' },
              { id: 'coupons', icon: Tag, label: 'Coupons' },
              { id: 'payments', icon: CreditCard, label: 'Payments' },
              { id: 'team', icon: UserCog, label: 'Team' },
              { id: 'settings', icon: Settings, label: 'Settings' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            ))}
          </div>
        </nav>

<div className="p-4 border-t border-gray-200">
          <a
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <Globe className="h-5 w-5" />
            {sidebarOpen && <span>View Store</span>}
          </a>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg mt-2">
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

{/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300 p-8`}>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          renderContent()
        )}
      </main>

{/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => {
                  setShowProductModal(false)
                  resetProductForm()
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

<form onSubmit={handleProductSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

<div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    required
                    value={productForm.description}
                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

<div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Base Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

<div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.discount_price}
                    onChange={(e) => setProductForm({...productForm, discount_price: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

<div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({...productForm, sku: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="PROD-001"
                  />
                </div>

<div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

<div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <input
                    type="text"
                    required
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Electronics"
                  />
                </div>

<div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sub-Category</label>
                  <input
                    type="text"
                    value={productForm.subcategory}
                    onChange={(e) => setProductForm({...productForm, subcategory: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Smartphones"
                  />
                </div>

<div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Main Image URL</label>
                  <input
                    type="url"
                    value={productForm.image_url}
                    onChange={(e) => setProductForm({...productForm, image_url: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

<div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Images (Multiple Upload Placeholder)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 cursor-pointer">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>

<div className="md:col-span-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={productForm.active}
                      onChange={(e) => setProductForm({...productForm, active: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Active (visible in storefront)</span>
                  </label>
                </div>
              </div>

<div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {selectedProduct ? 'Update Product' : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProductModal(false)
                    resetProductForm()
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

{/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">Order Details - {selectedOrder.order_number}</h3>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

<div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Customer Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedOrder.customer_name}</p>
                  <p><span className="font-medium">Email:</span> {selectedOrder.customer_email}</p>
                  <p><span className="font-medium">Phone:</span> {selectedOrder.customer_phone}</p>
                </div>
              </div>

{/* Delivery Address */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Delivery Address</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{selectedOrder.delivery_address}</p>
                </div>
              </div>

{/* Order Items */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Order Items</h4>
                <div className="border border-gray-200 rounded-lg divide-y">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-4 flex justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{item.product_name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

{/* Order Summary */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Order Summary</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Subtotal:</span>
                    <span className="font-medium">${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Shipping:</span>
                    <span className="font-medium">${selectedOrder.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-300 pt-2">
                    <span className="font-bold text-gray-900">Total:</span>
                    <span className="font-bold text-gray-900">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

{/* Payment Info */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Payment Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><span className="font-medium">Method:</span> {selectedOrder.payment_method}</p>
                  <p>
                    <span className="font-medium">Status:</span>{' '}
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      selectedOrder.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                      selectedOrder.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedOrder.payment_status}
                    </span>
                  </p>
                </div>
              </div>

{/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => generateInvoice(selectedOrder)}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <FileText className="h-5 w-5" />
                  Download Invoice
                </button>
                <button
                  onClick={() => generateShippingLabel(selectedOrder)}
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
                >
                  <Truck className="h-5 w-5" />
                  Shipping Label
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

{/* Customer Modal */}
      {showCustomerModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">Customer Profile</h3>
              <button
                onClick={() => setShowCustomerModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

<div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-blue-600">{selectedCustomer.name[0]}</span>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">{selectedCustomer.name}</h4>
                  <p className="text-gray-600">{selectedCustomer.email}</p>
                  <p className="text-gray-600">{selectedCustomer.phone}</p>
                </div>
              </div>

<div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">${selectedCustomer.total_spent.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedCustomer.order_count}</p>
                </div>
              </div>

<div>
                <h4 className="font-bold text-gray-900 mb-3">Order History</h4>
                <div className="border border-gray-200 rounded-lg divide-y">
                  {orders.filter(o => o.customer_id === selectedCustomer.id).map(order => (
                    <div key={order.id} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{order.order_number}</p>
                        <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

{/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Create New Coupon</h3>
              <button
                onClick={() => setShowCouponModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

<form onSubmit={handleCouponSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({...couponForm, code: e.target.value.toUpperCase()})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                  placeholder="SAVE20"
                />
              </div>

<div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type *</label>
                <select
                  value={couponForm.discount_type}
                  onChange={(e) => setCouponForm({...couponForm, discount_type: e.target.value as 'fixed' | 'percentage'})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>

<div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount Value *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={couponForm.discount_value}
                  onChange={(e) => setCouponForm({...couponForm, discount_value: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={couponForm.discount_type === 'percentage' ? '20' : '10.00'}
                />
              </div>

<div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                <input
                  type="date"
                  required
                  value={couponForm.expiry_date}
                  onChange={(e) => setCouponForm({...couponForm, expiry_date: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

<div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Usage Limit *</label>
                <input
                  type="number"
                  required
                  value={couponForm.usage_limit}
                  onChange={(e) => setCouponForm({...couponForm, usage_limit: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="100"
                />
              </div>

<div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Create Coupon
                </button>
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

{/* Team Member Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Add Team Member</h3>
              <button
                onClick={() => setShowTeamModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

<form onSubmit={handleTeamSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={teamForm.name}
                  onChange={(e) => setTeamForm({...teamForm, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

<div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={teamForm.email}
                  onChange={(e) => setTeamForm({...teamForm, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

<div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                <select
                  value={teamForm.role}
                  onChange={(e) => setTeamForm({...teamForm, role: e.target.value as 'admin' | 'manager' | 'viewer'})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="viewer">Viewer</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

<div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                <div className="space-y-2">
                  {['products', 'orders', 'customers', 'coupons'].map((perm) => (
                    <label key={perm} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={teamForm.permissions.includes(perm)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTeamForm({...teamForm, permissions: [...teamForm.permissions, perm]})
                          } else {
                            setTeamForm({...teamForm, permissions: teamForm.permissions.filter(p => p !== perm)})
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700 capitalize">{perm}</span>
                    </label>
                  ))}
                </div>
              </div>

<div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Member
                </button>
                <button
                  type="button"
                  onClick={() => setShowTeamModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
