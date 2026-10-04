'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  BarChart3,
  ShoppingBag,
  Package,
  Users,
  Ticket,
  Truck,
  Settings,
  LogOut,
  Menu,
  X,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Download,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  DollarSign,
  Filter,
  ChevronRight,
  Lock,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Zap,
  Copy,
  Calendar,
  Percent,
  Home,
  Shield,
  BarChart,
  MessageSquare,
  Key,
} from 'lucide-react'

type Section =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'customers'
  | 'discounts'
  | 'shipping'
  | 'team'
  | 'settings'

interface Order {
  id: string
  customer_name: string
  customer_email: string
  total_amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'completed' | 'failed'
  created_at: string
  items: Array<{ product: string; qty: number; price: number }>
  delivery_address?: string
}

interface Product {
  id: string
  name: string
  description: string
  base_price: number
  discount_price?: number
  sku: string
  stock: number
  category: string
  images: string[]
  variants?: Record<string, string[]>
  created_at: string
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  total_spent: number
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
  usage_count: number
  active: boolean
}

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'staff'
  permissions: string[]
  status: 'active' | 'inactive'
}

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<Section>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Modal states
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showProductModal, setShowProductModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showCouponModal, setShowCouponModal] = useState(false)
  const [showTeamModal, setShowTeamModal] = useState(false)

  const supabase = createClient()

  // Load data on mount
  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        fetchOrders(),
        fetchProducts(),
        fetchCustomers(),
        fetchCoupons(),
        fetchTeamMembers(),
      ])
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchCustomers = async () => {
    try {
      const { data } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })
      setCustomers(data || [])
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  const fetchCoupons = async () => {
    try {
      const { data } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false })
      setCoupons(data || [])
    } catch (error) {
      console.error('Error fetching coupons:', error)
    }
  }

  const fetchTeamMembers = async () => {
    try {
      const { data } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: false })
      setTeamMembers(data || [])
    } catch (error) {
      console.error('Error fetching team members:', error)
    }
  }

  // Filtering and pagination logic
  const filteredOrders = useMemo(() => {
    let filtered = orders.filter((order) => {
      const matchesSearch =
        order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus =
        filterStatus === 'all' || order.status === filterStatus
      return matchesSearch && matchesStatus
    })
    return filtered
  }, [orders, searchQuery, filterStatus])

  const paginatedOrders = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage
    return filteredOrders.slice(startIdx, startIdx + itemsPerPage)
  }, [filteredOrders, currentPage])

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)

  // Analytics calculations
  const analytics = useMemo(() => {
    const completedOrders = orders.filter((o) => o.status === 'delivered')
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total_amount, 0)
    const pendingOrders = orders.filter((o) => o.status === 'pending').length
    const processingOrders = orders.filter((o) => o.status === 'processing').length

    return {
      totalSales: completedOrders.length,
      totalOrders: orders.length,
      pendingOrders,
      processingOrders,
      completedOrders: completedOrders.length,
      cancelledOrders: orders.filter((o) => o.status === 'cancelled').length,
      totalRevenue,
      netProfit: totalRevenue * 0.7, // Example: 70% profit margin
      activeCustomers: customers.filter((c) => c.status === 'active').length,
      totalCustomers: customers.length,
      lowStockProducts: products.filter((p) => p.stock < 10).length,
      totalProducts: products.length,
    }
  }, [orders, customers, products])

  const handleDeleteOrder = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try {
      await supabase.from('orders').delete().eq('id', id)
      await fetchOrders()
    } catch (error) {
      console.error('Error deleting order:', error)
    }
  }

  const handleUpdateOrderStatus = async (
    id: string,
    newStatus: Order['status']
  ) => {
    try {
      await supabase.from('orders').update({ status: newStatus }).eq('id', id)
      await fetchOrders()
      setSelectedOrder(null)
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try {
      await supabase.from('products').delete().eq('id', id)
      await fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const handleToggleCustomerStatus = async (
    id: string,
    newStatus: 'active' | 'blocked'
  ) => {
    try {
      await supabase.from('customers').update({ status: newStatus }).eq('id', id)
      await fetchCustomers()
    } catch (error) {
      console.error('Error updating customer:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'completed':
      case 'active':
        return <CheckCircle className="h-4 w-4" />
      case 'processing':
      case 'shipped':
        return <Clock className="h-4 w-4" />
      case 'pending':
        return <AlertTriangle className="h-4 w-4" />
      case 'cancelled':
      case 'failed':
      case 'blocked':
      case 'inactive':
        return <XCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  // ==================== SIDEBAR NAVIGATION ====================
  const SidebarNav = () => (
    <>
      <div className="flex items-center justify-between p-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Admin</h1>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="p-4 space-y-2">
        {[
          { id: 'dashboard' as Section, label: 'Dashboard', icon: BarChart3 },
          { id: 'orders' as Section, label: 'Orders', icon: ShoppingBag },
          { id: 'products' as Section, label: 'Products', icon: Package },
          { id: 'customers' as Section, label: 'Customers', icon: Users },
          { id: 'discounts' as Section, label: 'Discounts', icon: Ticket },
          { id: 'shipping' as Section, label: 'Shipping', icon: Truck },
          { id: 'team' as Section, label: 'Team', icon: Shield },
          { id: 'settings' as Section, label: 'Settings', icon: Settings },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              setActiveSection(id)
              setSidebarOpen(false)
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeSection === id
                ? 'bg-blue-100 text-blue-600 font-medium'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 bg-slate-50">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </>
  )

  // ==================== DASHBOARD SECTION ====================
  const DashboardSection = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>

      {/* Quick Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 text-sm">Total Sales</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {analytics.totalSales}
              </p>
            </div>
            <ShoppingBag className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                ${analytics.totalRevenue.toFixed(0)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 text-sm">Orders</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {analytics.totalOrders}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {analytics.pendingOrders} pending
              </p>
            </div>
            <Clock className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 text-sm">Active Customers</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {analytics.activeCustomers}
              </p>
            </div>
            <Users className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Order Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Order Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Pending</span>
              <span className="font-semibold text-yellow-600">
                {analytics.pendingOrders}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Processing</span>
              <span className="font-semibold text-blue-600">
                {analytics.processingOrders}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Completed</span>
              <span className="font-semibold text-green-600">
                {analytics.completedOrders}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Cancelled</span>
              <span className="font-semibold text-red-600">
                {analytics.cancelledOrders}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Sales Trend</h3>
          <div className="h-32 flex items-end justify-around gap-2">
            {[65, 45, 78, 55, 92, 68, 85].map((height, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-blue-400 to-blue-300 rounded-t"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <p className="text-xs text-slate-500 text-center mt-2">Last 7 days</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Top Selling</h3>
          <div className="space-y-2">
            {products.slice(0, 3).map((product) => (
              <div key={product.id} className="flex justify-between items-center text-sm">
                <span className="text-slate-600 truncate">{product.name}</span>
                <span className="font-semibold text-slate-900">
                  {Math.floor(Math.random() * 50) + 10}x
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Low Stock Alerts & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Low Stock Alerts
            </h3>
          </div>
          <div className="divide-y divide-slate-200 max-h-64 overflow-y-auto">
            {products
              .filter((p) => p.stock < 10)
              .slice(0, 5)
              .map((product) => (
                <div key={product.id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-slate-900">{product.name}</p>
                    <p className="text-sm text-slate-500">SKU: {product.sku}</p>
                  </div>
                  <span className="text-lg font-bold text-red-600">
                    {product.stock}
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Recent Orders</h3>
          </div>
          <div className="divide-y divide-slate-200 max-h-64 overflow-y-auto">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-slate-900">
                      {order.customer_name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  ${order.total_amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // ==================== ORDERS SECTION ====================
  const OrdersSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="h-5 w-5" />
          New Order
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-64 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value)
            setCurrentPage(1)
          }}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-mono text-slate-600">
                    {order.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <p className="font-medium text-slate-900">
                      {order.customer_name}
                    </p>
                    <p className="text-slate-500">{order.customer_email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    ${order.total_amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleUpdateOrderStatus(order.id, e.target.value as Order['status'])
                      }
                      className={`px-3 py-1 rounded text-xs font-semibold border-0 cursor-pointer ${getStatusColor(
                        order.status
                      )}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 w-fit ${getStatusColor(
                        order.payment_status
                      )}`}
                    >
                      {getStatusIcon(order.payment_status)}
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setSelectedOrder(order)
                        setShowOrderModal(true)
                      }}
                      className="text-blue-600 hover:bg-blue-50 p-2 rounded inline-flex"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded inline-flex"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Page {currentPage} of {Math.max(1, totalPages)}
        </p>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )

  // ==================== PRODUCTS SECTION ====================
  const ProductsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Products</h1>
        <button
          onClick={() => {
            setSelectedProduct(null)
            setShowProductModal(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Product Image */}
            <div className="h-48 bg-slate-200 flex items-center justify-center">
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="h-12 w-12 text-slate-400" />
              )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-semibold text-slate-900 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-sm text-slate-500 mt-1">SKU: {product.sku}</p>

              {/* Price */}
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-lg font-bold text-slate-900">
                  ${product.discount_price || product.base_price}
                </span>
                {product.discount_price && (
                  <span className="text-sm line-through text-slate-500">
                    ${product.base_price}
                  </span>
                )}
              </div>

              {/* Stock */}
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      product.stock === 0
                        ? 'bg-red-500'
                        : product.stock < 10
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{
                      width: `${Math.min((product.stock / 100) * 100, 100)}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  {product.stock}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setSelectedProduct(product)
                    setShowProductModal(true)
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // ==================== CUSTOMERS SECTION ====================
  const CustomersSection = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Customers</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {customer.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {customer.phone}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    ${customer.total_spent.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={customer.status}
                      onChange={(e) =>
                        handleToggleCustomerStatus(
                          customer.id,
                          e.target.value as 'active' | 'blocked'
                        )
                      }
                      className={`px-3 py-1 rounded text-xs font-semibold border-0 cursor-pointer ${
                        customer.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      <option value="active">Active</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedCustomer(customer)
                        setShowCustomerModal(true)
                      }}
                      className="text-blue-600 hover:bg-blue-50 p-2 rounded inline-flex"
                    >
                      <Eye className="h-4 w-4" />
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

  // ==================== DISCOUNTS SECTION ====================
  const DiscountsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Discounts & Coupons</h1>
        <button
          onClick={() => setShowCouponModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <div key={coupon.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-2xl text-slate-900 font-mono">
                  {coupon.code}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {coupon.discount_type === 'fixed'
                    ? `$${coupon.discount_value}`
                    : `${coupon.discount_value}%`}{' '}
                  OFF
                </p>
              </div>
              <button className="text-blue-600 hover:bg-blue-50 p-2 rounded">
                <Copy className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Usage</span>
                <span className="font-semibold text-slate-900">
                  {coupon.usage_count}/{coupon.usage_limit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Expires</span>
                <span className="font-semibold text-slate-900">
                  {new Date(coupon.expiry_date).toLocaleDateString()}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // ==================== SHIPPING & PAYMENTS SECTION ====================
  const ShippingSection = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Shipping & Payments</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipping Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-600" />
            Shipping Configuration
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Standard Shipping Cost
              </label>
              <input
                type="number"
                defaultValue="5.99"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Express Shipping Cost
              </label>
              <input
                type="number"
                defaultValue="12.99"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Free Shipping Threshold
              </label>
              <input
                type="number"
                defaultValue="50"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Save Settings
            </button>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-green-600" />
            Payment Methods
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-slate-300 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Cash on Delivery</p>
                <p className="text-sm text-slate-500">Pay at delivery</p>
              </div>
              <input type="checkbox" defaultChecked className="h-5 w-5" />
            </div>

            <div className="flex items-center justify-between p-4 border border-slate-300 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Credit/Debit Card</p>
                <p className="text-sm text-slate-500">Stripe integration</p>
              </div>
              <input type="checkbox" defaultChecked className="h-5 w-5" />
            </div>

            <div className="flex items-center justify-between p-4 border border-slate-300 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Digital Wallets</p>
                <p className="text-sm text-slate-500">Apple Pay, Google Pay</p>
              </div>
              <input type="checkbox" className="h-5 w-5" />
            </div>

            <button className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
              Update Payment Methods
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // ==================== TEAM SECTION ====================
  const TeamSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Team Management</h1>
        <button
          onClick={() => setShowTeamModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Add Member
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Permissions
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {teamMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {member.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {member.email}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {member.permissions.length} permissions
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        member.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="text-blue-600 hover:bg-blue-50 p-2 rounded inline-flex">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:bg-red-50 p-2 rounded inline-flex">
                      <Trash2 className="h-4 w-4" />
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

  // ==================== SETTINGS SECTION ====================
  const SettingsSection = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* General Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Store Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Store Name
                </label>
                <input
                  type="text"
                  defaultValue="My eCommerce Store"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  defaultValue="support@store.com"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  defaultValue="+1 (555) 123-4567"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                Save Settings
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Social Links
            </h2>
            <div className="space-y-4">
              <input
                type="url"
                placeholder="Facebook URL"
                defaultValue="https://facebook.com/store"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="url"
                placeholder="Instagram URL"
                defaultValue="https://instagram.com/store"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="url"
                placeholder="Twitter URL"
                defaultValue="https://twitter.com/store"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                Update Links
              </button>
            </div>
          </div>
        </div>

        {/* Audit Logs */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Audit Logs</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {[
              { action: 'Product Updated', user: 'Admin', time: '2 mins ago' },
              { action: 'Order Created', user: 'System', time: '5 mins ago' },
              { action: 'Customer Added', user: 'Manager', time: '1 hour ago' },
              { action: 'Settings Changed', user: 'Admin', time: '2 hours ago' },
              { action: 'Coupon Created', user: 'Manager', time: '3 hours ago' },
            ].map((log, i) => (
              <div key={i} className="text-sm pb-3 border-b border-slate-200 last:border-0">
                <p className="font-medium text-slate-900">{log.action}</p>
                <p className="text-xs text-slate-500">
                  {log.user} • {log.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // ==================== MODALS ====================
  const OrderModal = () =>
    showOrderModal && selectedOrder && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white">
            <h2 className="text-xl font-bold text-slate-900">Order Details</h2>
            <button onClick={() => setShowOrderModal(false)} className="text-slate-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Customer Info */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Customer Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Name</p>
                  <p className="font-semibold text-slate-900">
                    {selectedOrder.customer_name}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Email</p>
                  <p className="font-semibold text-slate-900">
                    {selectedOrder.customer_email}
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            {selectedOrder.delivery_address && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Delivery Address
                </h3>
                <p className="text-sm text-slate-600">
                  {selectedOrder.delivery_address}
                </p>
              </div>
            )}

            {/* Order Items */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Order Items</h3>
              <div className="space-y-2">
                {selectedOrder.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-3 bg-slate-50 rounded"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{item.product}</p>
                      <p className="text-sm text-slate-500">Qty: {item.qty}</p>
                    </div>
                    <p className="font-semibold text-slate-900">
                      ${(item.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Status & Payment */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Order Status</p>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleUpdateOrderStatus(
                      selectedOrder.id,
                      e.target.value as Order['status']
                    )
                  }
                  className={`w-full px-3 py-2 rounded text-sm font-semibold border-0 ${getStatusColor(
                    selectedOrder.status
                  )}`}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Payment Status</p>
                <select
                  className={`w-full px-3 py-2 rounded text-sm font-semibold border-0 ${getStatusColor(
                    selectedOrder.payment_status
                  )}`}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-slate-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${selectedOrder.total_amount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 font-medium">
                <Download className="h-4 w-4" />
                PDF Invoice
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">
                <Printer className="h-4 w-4" />
                Print Label
              </button>
            </div>
          </div>
        </div>
      </div>
    )

  const ProductModal = () =>
    showProductModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">
              {selectedProduct ? 'Edit Product' : 'Add Product'}
            </h2>
            <button onClick={() => setShowProductModal(false)} className="text-slate-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <input
              type="text"
              placeholder="Product Name"
              defaultValue={selectedProduct?.name}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              placeholder="Description"
              defaultValue={selectedProduct?.description}
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Base Price"
                defaultValue={selectedProduct?.base_price}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Discount Price"
                defaultValue={selectedProduct?.discount_price}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="SKU"
                defaultValue={selectedProduct?.sku}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Stock"
                defaultValue={selectedProduct?.stock}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <input
              type="text"
              placeholder="Category"
              defaultValue={selectedProduct?.category}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:bg-slate-50">
              <Plus className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600">Click to upload images</p>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-2 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 font-medium">
                Cancel
              </button>
              <button className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">
                {selectedProduct ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )

  const CustomerModal = () =>
    showCustomerModal && selectedCustomer && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">
              {selectedCustomer.name}
            </h2>
            <button onClick={() => setShowCustomerModal(false)} className="text-slate-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Email</p>
                <p className="font-semibold text-slate-900 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {selectedCustomer.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Phone</p>
                <p className="font-semibold text-slate-900 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {selectedCustomer.phone}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-500 mb-2">Order History</p>
              <div className="space-y-2">
                {orders
                  .filter((o) => o.customer_email === selectedCustomer.email)
                  .slice(0, 5)
                  .map((order) => (
                    <div key={order.id} className="flex justify-between items-center p-3 bg-slate-50 rounded">
                      <div>
                        <p className="font-medium text-slate-900">Order {order.id.slice(0, 8)}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <p className="text-lg font-bold text-slate-900">
                Total Spent: ${selectedCustomer.total_spent.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    )

  // Import the Printer icon (it's missing from the imports)
  const Printer = Package

  // Main component render
  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-white shadow-lg transition-all duration-300 overflow-hidden relative flex flex-col`}
      >
        <SidebarNav />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-white shadow-sm p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-600 hover:bg-slate-100 p-2 rounded"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="text-slate-600 flex items-center gap-4">
            <MessageSquare className="h-5 w-5 cursor-pointer" />
            <Bell className="h-5 w-5 cursor-pointer" />
            <button className="w-8 h-8 bg-blue-600 text-white rounded-full font-bold">
              A
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {activeSection === 'dashboard' && <DashboardSection />}
          {activeSection === 'orders' && <OrdersSection />}
          {activeSection === 'products' && <ProductsSection />}
          {activeSection === 'customers' && <CustomersSection />}
          {activeSection === 'discounts' && <DiscountsSection />}
          {activeSection === 'shipping' && <ShippingSection />}
          {activeSection === 'team' && <TeamSection />}
          {activeSection === 'settings' && <SettingsSection />}
        </div>
      </div>

      {/* Modals */}
      <OrderModal />
      <ProductModal />
      <CustomerModal />
    </div>
  )
}

// Add missing Bell icon
const Bell = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    {...props}
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21h3.4" />
  </svg>
)