import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { 
  ChefHat, LogOut, DollarSign, ShoppingBag, TrendingUp, 
  Plus, Trash2, Edit, Package, Users, Search, Filter
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { useApp } from '../context/AppContext';
import { Order } from '../context/AppContext';

export function AdminDashboard() {
  const { user, logout, dishes, orders, addDish, deleteDish, updateOrderStatus, getIncomeStats } = useApp();
  const navigate = useNavigate();
  const [isAddDishOpen, setIsAddDishOpen] = useState(false);
  const [newDish, setNewDish] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    prepTime: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const incomeStats = getIncomeStats();

  const handleAddDish = () => {
    if (newDish.name && newDish.price) {
      addDish({
        name: newDish.name,
        description: newDish.description,
        price: parseFloat(newDish.price),
        category: newDish.category || 'General',
        image: newDish.image || 'https://images.unsplash.com/photo-1761095596765-c8abe01d3aea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
        available: true,
        rating: 4.5,
        prepTime: parseInt(newDish.prepTime) || 20,
      });
      setIsAddDishOpen(false);
      setNewDish({ name: '', description: '', price: '', category: '', image: '', prepTime: '' });
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'preparing': return 'bg-blue-100 text-blue-700';
      case 'ready': return 'bg-purple-100 text-purple-700';
      case 'delivering': return 'bg-orange-100 text-orange-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl text-gray-900">Feast Hub Admin</h1>
              <p className="text-sm text-gray-600">Welcome, {user.name}</p>
            </div>
          </div>
          <Button onClick={logout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div whileHover={{ y: -5 }}>
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm opacity-90">Today's Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl">₹{incomeStats.today.toFixed(2)}</div>
                <p className="text-sm opacity-90 mt-1">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  Live tracking
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -5 }}>
            <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm opacity-90">Monthly Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl">₹{incomeStats.month.toFixed(2)}</div>
                <p className="text-sm opacity-90 mt-1">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  This month
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -5 }}>
            <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm opacity-90">Yearly Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl">₹{incomeStats.year.toFixed(2)}</div>
                <p className="text-sm opacity-90 mt-1">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  2026 Total
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -5 }}>
            <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm opacity-90">Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl">{orders.length}</div>
                <p className="text-sm opacity-90 mt-1">
                  <ShoppingBag className="w-4 h-4 inline mr-1" />
                  All time
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 gap-2">
            <TabsTrigger value="orders" className="gap-2">
              <Package className="w-4 h-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="menu" className="gap-2">
              <ChefHat className="w-4 h-4" />
              Menu Management
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Order Management</CardTitle>
                    <CardDescription>View and manage customer orders</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 w-64"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="preparing">Preparing</SelectItem>
                        <SelectItem value="ready">Ready</SelectItem>
                        <SelectItem value="delivering">Delivering</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredOrders.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No orders found</p>
                    </div>
                  ) : (
                    filteredOrders.map(order => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="text-lg">{order.customerName}</h4>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">Order ID: {order.id}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(order.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl text-green-600">₹{order.total.toFixed(2)}</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <img 
                                src={item.dish.image} 
                                alt={item.dish.name}
                                className="w-12 h-12 rounded object-cover"
                              />
                              <div className="flex-1">
                                <div>{item.dish.name}</div>
                                <div className="text-gray-600">Qty: {item.quantity}</div>
                              </div>
                              <div>₹{(item.dish.price * item.quantity).toFixed(2)}</div>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          {order.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, 'preparing')}
                              className="bg-blue-500 hover:bg-blue-600"
                            >
                              Start Preparing
                            </Button>
                          )}
                          {order.status === 'preparing' && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, 'ready')}
                              className="bg-purple-500 hover:bg-purple-600"
                            >
                              Mark Ready
                            </Button>
                          )}
                          {order.status === 'ready' && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, 'delivering')}
                              className="bg-orange-500 hover:bg-orange-600"
                            >
                              Out for Delivery
                            </Button>
                          )}
                          {order.status === 'delivering' && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, 'completed')}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              Complete Order
                            </Button>
                          )}
                          {order.status !== 'completed' && order.status !== 'cancelled' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateOrderStatus(order.id, 'cancelled')}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Menu Management</CardTitle>
                    <CardDescription>Add, edit, or remove dishes from your menu</CardDescription>
                  </div>
                  <Dialog open={isAddDishOpen} onOpenChange={setIsAddDishOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-orange-500 to-red-500">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Dish
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New Dish</DialogTitle>
                        <DialogDescription>Fill in the details for your new dish</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Dish Name</Label>
                          <Input
                            placeholder="e.g., Margherita Pizza"
                            value={newDish.name}
                            onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Input
                            placeholder="Brief description"
                            value={newDish.description}
                            onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Price (₹)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="12.99"
                              value={newDish.price}
                              onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Prep Time (min)</Label>
                            <Input
                              type="number"
                              placeholder="20"
                              value={newDish.prepTime}
                              onChange={(e) => setNewDish({ ...newDish, prepTime: e.target.value })}
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Category</Label>
                          <Input
                            placeholder="e.g., Italian, Japanese"
                            value={newDish.category}
                            onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Image URL</Label>
                          <Input
                            placeholder="https://example.com/image.jpg"
                            value={newDish.image}
                            onChange={(e) => setNewDish({ ...newDish, image: e.target.value })}
                          />
                        </div>
                        <Button onClick={handleAddDish} className="w-full">
                          Add Dish
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dishes.map(dish => (
                    <motion.div
                      key={dish.id}
                      whileHover={{ y: -5 }}
                      className="border rounded-lg overflow-hidden bg-white"
                    >
                      <img 
                        src={dish.image} 
                        alt={dish.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="text-lg mb-1">{dish.name}</h4>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{dish.description}</p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xl text-green-600">₹{dish.price.toFixed(2)}</span>
                          <Badge variant="outline">{dish.category}</Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-red-600 border-red-300 hover:bg-red-50"
                          onClick={() => deleteDish(dish.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
