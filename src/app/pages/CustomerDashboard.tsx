import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChefHat, LogOut, Search, ShoppingCart, MapPin, Clock, Star,
  Sparkles, Award, TrendingUp, Package, Eye, Trash2, Plus, Minus, Filter, Navigation, CheckCircle, X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Progress } from '../components/ui/progress';
import { useApp } from '../context/AppContext';
import { Order } from '../context/AppContext';

export function CustomerDashboard() {
  const { user, logout, dishes, orders, placeOrder, updateOrderFeedback } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<{ dishId: string; quantity: number }[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectedDish, setSelectedDish] = useState<any>(null);
  const [showOrderTracking, setShowOrderTracking] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string>('');
  const [lastPoints, setLastPoints] = useState<number>(0);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackOrder, setFeedbackOrder] = useState<Order | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState('');


  useEffect(() => {
    if (!user || user.role !== 'customer') {
      navigate('/customer/login');
    }
  }, [user, navigate]);

  const myOrders = user ? orders.filter(o => o.customerId === user.id) : [];
  const recentOrders = [...myOrders].sort((a, b) => b.timestamp - a.timestamp);

  // show feedback dialog for the first completed order lacking a rating
  useEffect(() => {
    const pending = recentOrders.find(o => o.status === 'completed' && o.rating === undefined);
    if (pending) {
      setFeedbackOrder(pending);
      setShowFeedbackDialog(true);
    }
  }, [recentOrders]);

  if (!user) return null;

  const categories = ['all', ...Array.from(new Set(dishes.map(d => d.category)))];

  const filteredDishes = dishes.filter(dish => {
    const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || dish.category === selectedCategory;
    return matchesSearch && matchesCategory && dish.available;
  });

  const addToCart = (dishId: string) => {
    const existing = cart.find(item => item.dishId === dishId);
    if (existing) {
      setCart(cart.map(item =>
        item.dishId === dishId ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { dishId, quantity: 1 }]);
    }
  };

  const updateCartQuantity = (dishId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.dishId === dishId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (dishId: string) => {
    setCart(cart.filter(item => item.dishId !== dishId));
  };

  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setLocationLoading(false);
        },
        () => {
          setLocationLoading(false);
          alert('Unable to fetch your location. Please enable location services.');
        }
      );
    } else {
      setLocationLoading(false);
      alert('Geolocation is not supported by your browser.');
    }
  };

  const cartItems = cart.map(item => ({
    ...item,
    dish: dishes.find(d => d.id === item.dishId)!
  })).filter(item => item.dish);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0 || !deliveryAddress) return;

    const orderItems = cartItems.map(item => ({
      dish: item.dish,
      quantity: item.quantity
    }));

    const pointsEarned = Math.round(cartTotal / 10);
    const newOrderId = await placeOrder(orderItems, deliveryAddress, latitude || undefined, longitude || undefined);
    setLastOrderId(newOrderId);
    setLastPoints(pointsEarned);
    setShowOrderSuccess(true);

    setCart([]);
    setShowCart(false);
    setDeliveryAddress('');
    setLatitude(null);
    setLongitude(null);
  };

  // Orders logic has been moved up to prevent hook order mismatch

  const getTrackingStages = () => [
    { name: 'Order Placed', icon: Package },
    { name: 'Preparing', icon: ChefHat },
    { name: 'Ready', icon: Award },
    { name: 'Out for Delivery', icon: MapPin },
    { name: 'Delivered', icon: Star },
  ];

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'preparing': return 'bg-blue-100 text-blue-700';
      case 'ready': return 'bg-purple-100 text-purple-700';
      case 'delivering': return 'bg-orange-100 text-orange-700';
      case 'completed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl text-gray-900">Feast Hub</h1>
                <p className="text-sm text-gray-600">Hi, {user.name}!</p>
                {user.points !== undefined && (
                  <p className="text-sm text-gray-600">Points: {user.points}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowCart(true)}
                variant="outline"
                className="relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
              <Button onClick={logout} variant="outline">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 mb-8 text-white relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm">Welcome to the Future of Food</span>
            </div>
            <h2 className="text-3xl mb-2">Order Your Favorite Meals</h2>
            <p className="text-white/90 mb-4">Experience AR previews, live tracking, and gamified rewards!</p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span className="text-sm">Earn Points</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="text-sm">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                <span className="text-sm">Quality Guaranteed</span>
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        </motion.div>

        <Tabs defaultValue="menu" className="space-y-6">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 gap-2">
            <TabsTrigger value="menu" className="gap-2">
              <ChefHat className="w-4 h-4" />
              Browse Menu
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <Package className="w-4 h-4" />
              My Orders
            </TabsTrigger>
          </TabsList>

          {/* Menu Tab */}
          <TabsContent value="menu" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex gap-4 flex-wrap">
              <div className="relative flex-1 min-w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search for dishes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map(cat => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    onClick={() => setSelectedCategory(cat)}
                    size="sm"
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Dishes Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDishes.map((dish, index) => (
                <motion.div
                  key={dish.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 cursor-pointer"
                >
                  <div className="relative group">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-56 object-cover transition group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelectedDish(dish)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                    <Badge className="absolute top-3 right-3 bg-white text-gray-900">
                      {dish.category}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg">{dish.name}</h3>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm">{dish.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{dish.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl text-green-600">₹{dish.price.toFixed(2)}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {dish.prepTime} min
                        </div>
                      </div>
                      <Button
                        onClick={() => addToCart(dish.id)}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Orders</CardTitle>
                <CardDescription>Track and view your order history</CardDescription>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No orders yet. Start ordering now!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map(order => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="text-lg">Order #{order.id.slice(-6)}</h4>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {new Date(order.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl text-green-600">₹{order.total.toFixed(2)}</div>
                            {order.status !== 'completed' && order.status !== 'cancelled' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-2"
                                onClick={() => {
                                  setTrackingOrder(order);
                                  setShowOrderTracking(true);
                                }}
                              >
                                <MapPin className="w-4 h-4 mr-2" />
                                Track
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-sm">
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
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Cart Dialog */}
      <Dialog open={showCart} onOpenChange={setShowCart}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Your Cart
            </DialogTitle>
            <DialogDescription>Review your items and checkout</DialogDescription>
          </DialogHeader>

          {cartItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.dishId} className="flex items-center gap-3 border rounded-lg p-3">
                  <img
                    src={item.dish.image}
                    alt={item.dish.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h4>{item.dish.name}</h4>
                    <p className="text-sm text-gray-600">₹{item.dish.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateCartQuantity(item.dishId, -1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateCartQuantity(item.dishId, 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromCart(item.dishId)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="mb-4">
                  <label className="text-sm mb-2 block">Delivery Address</label>
                  <Input
                    placeholder="Enter your delivery address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm block">Delivery Location (GPS)</label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={getCurrentLocation}
                      disabled={locationLoading}
                      className="gap-2"
                    >
                      <Navigation className="w-4 h-4" />
                      {locationLoading ? 'Getting Location...' : 'Get Location'}
                    </Button>
                  </div>
                  {latitude && longitude ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-green-700 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium">Location Captured</span>
                      </div>
                      <p className="text-xs text-green-600">Latitude: {latitude.toFixed(6)}</p>
                      <p className="text-xs text-green-600">Longitude: {longitude.toFixed(6)}</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <p className="text-xs text-gray-600">Click "Get Location" to capture your delivery location</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xl mb-4">
                  <span>Total:</span>
                  <span className="text-green-600">₹{cartTotal.toFixed(2)}</span>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  onClick={handleCheckout}
                  disabled={!deliveryAddress}
                >
                  Checkout ₹{cartTotal.toFixed(2)}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dish Preview Dialog */}
      <Dialog open={!!selectedDish} onOpenChange={() => setSelectedDish(null)}>
        <DialogContent className="max-w-lg">
          {selectedDish && (
            <div>
              <img
                src={selectedDish.image}
                alt={selectedDish.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedDish.name}</DialogTitle>
                <DialogDescription>{selectedDish.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="text-2xl text-green-600">₹{selectedDish.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Category:</span>
                  <Badge>{selectedDish.category}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Prep Time:</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedDish.prepTime} min
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Rating:</span>
                  <span className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    {selectedDish.rating}
                  </span>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 mt-4"
                  onClick={() => {
                    addToCart(selectedDish.id);
                    setSelectedDish(null);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Order Tracking Dialog */}
      <Dialog open={showOrderTracking} onOpenChange={setShowOrderTracking}>
        <DialogContent className="max-w-md">
          {trackingOrder && (
            <div>
              <DialogHeader>
                <DialogTitle>Track Your Order</DialogTitle>
                <DialogDescription>Order #{trackingOrder.id.slice(-6)}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                <div className="relative">
                  {getTrackingStages().map((stage, index) => {
                    const Icon = stage.icon;
                    const isCompleted = index <= trackingOrder.trackingStage;
                    const isCurrent = index === trackingOrder.trackingStage;

                    return (
                      <div key={index} className="flex gap-4 relative">
                        {index < 4 && (
                          <div className={`absolute left-6 top-12 w-0.5 h-16 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
                        )}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                          } ${isCurrent ? 'ring-4 ring-green-200' : ''}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="pb-8">
                          <h4 className={`${isCurrent ? 'text-green-600' : ''}`}>{stage.name}</h4>
                          {isCurrent && (
                            <p className="text-sm text-gray-600 mt-1">In progress...</p>
                          )}
                          {isCompleted && !isCurrent && (
                            <p className="text-sm text-green-600 mt-1">Completed</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t pt-4">
                  <h4 className="mb-2">Delivery Address</h4>
                  <p className="text-sm text-gray-600">{trackingOrder.deliveryAddress}</p>
                  {trackingOrder.latitude && trackingOrder.longitude && (
                    <div className="mt-3 text-xs text-gray-500">
                      <p>GPS: {trackingOrder.latitude.toFixed(4)}, {trackingOrder.longitude.toFixed(4)}</p>
                    </div>
                  )}
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-orange-700 mb-2">
                    <Clock className="w-5 h-5" />
                    <span>Estimated Delivery</span>
                  </div>
                  <p className="text-2xl">25-30 mins</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Order Success Dialog */}
      <Dialog open={showOrderSuccess} onOpenChange={setShowOrderSuccess}>
        <DialogContent className="max-w-md">
          <div className="text-center py-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="flex justify-center mb-4"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
              <p className="text-gray-600 mb-6">Your delicious order is being prepared</p>

              <div className="bg-orange-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-3">Order Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Order ID:</span>
                    <span className="font-medium">{lastOrderId.slice(-6)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Items:</span>
                    <span className="font-medium">{cartItems.length}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Estimated Time:</span>
                    <span className="font-medium">25-30 mins</span>
                  </div>
                  {latitude && longitude && (
                    <div className="pt-2 border-t mt-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-gray-600">
                          <p>Location: {latitude.toFixed(4)}, {longitude.toFixed(4)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  onClick={() => {
                    setShowOrderSuccess(false);
                    const currentOrder = orders[orders.length - 1];
                    if (currentOrder) {
                      setTrackingOrder(currentOrder);
                      setShowOrderTracking(true);
                    }
                  }}
                >
                  <Package className="w-4 h-4 mr-2" />
                  Track Your Order
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowOrderSuccess(false)}
                >
                  Continue Shopping
                </Button>
              </div>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rate Your Order</DialogTitle>
            <DialogDescription>Let us know how your experience was (optional)</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setFeedbackRating(star)}
                  className={`text-2xl ${feedbackRating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                  aria-label={`${star} star`}
                >
                  ★
                </button>
              ))}
            </div>
            <div>
              <label className="text-sm">Comments (optional)</label>
              <textarea
                className="w-full border rounded p-2 mt-1"
                rows={3}
                value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600"
                onClick={() => {
                  if (feedbackOrder) {
                    updateOrderFeedback(feedbackOrder.id, feedbackRating, feedbackText);
                  }
                  setShowFeedbackDialog(false);
                  setFeedbackRating(0);
                  setFeedbackText('');
                }}
              >
                Submit
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowFeedbackDialog(false)}
              >
                Skip
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
