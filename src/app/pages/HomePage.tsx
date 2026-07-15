import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Sparkles, Clock, Shield, Award, TrendingUp, MapPin, Users, ChefHat } from 'lucide-react';
import { Button } from '../components/ui/button';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl text-orange-600">Feast Hub</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-700 hover:text-orange-600 transition">Features</a>
            <a href="#why-us" className="text-gray-700 hover:text-orange-600 transition">Why Choose Us</a>
            <Link to="/customer/login">
              <Button variant="outline">Customer Login</Button>
            </Link>
            <Link to="/admin/login">
              <Button>Admin Login</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-orange-700">Next-Gen Food Ordering</span>
            </div>
            <h2 className="text-5xl mb-6 text-gray-900">
              Experience Food Ordering <span className="text-orange-600">Reimagined</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Feast Hub brings you an innovative dining experience with AR food previews, 
              live kitchen tracking, and gamified rewards. Order smarter, not harder.
            </p>
            <div className="flex gap-4">
              <Link to="/customer/register">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                  Start Ordering Now
                </Button>
              </Link>
              <Link to="/customer/login">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-8">
              <div>
                <div className="text-3xl text-orange-600 mb-1">4.9★</div>
                <div className="text-sm text-gray-600">User Rating</div>
              </div>
              <div>
                <div className="text-3xl text-orange-600 mb-1">10k+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl text-orange-600 mb-1">500+</div>
                <div className="text-sm text-gray-600">Dishes</div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src="https://images.unsplash.com/photo-1667207394004-acb6aaf4790e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                alt="Pizza"
                className="rounded-2xl shadow-2xl"
              />
              <motion.img
                whileHover={{ scale: 1.05 }}
                src="https://images.unsplash.com/photo-1631533633021-0a0a3e1ed34b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                alt="Burger"
                className="rounded-2xl shadow-2xl mt-8"
              />
              <motion.img
                whileHover={{ scale: 1.05 }}
                src="https://images.unsplash.com/photo-1719454260877-643468a873dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                alt="Sushi"
                className="rounded-2xl shadow-2xl"
              />
              <motion.img
                whileHover={{ scale: 1.05 }}
                src="https://images.unsplash.com/photo-1607257882338-70f7dd2ae344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                alt="Dessert"
                className="rounded-2xl shadow-2xl mt-8"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl mb-4 text-gray-900">Innovative Features</h3>
            <p className="text-xl text-gray-600">What makes Feast Hub different from the rest</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <motion.div
              whileHover={{ y: -10 }}
              className="p-6 rounded-xl border border-gray-200 bg-gradient-to-br from-orange-50 to-white"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="text-xl mb-2">AR Food Preview</h4>
              <p className="text-gray-600">See your dish in 3D before ordering with augmented reality technology</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -10 }}
              className="p-6 rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-white"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-xl mb-2">Live Kitchen View</h4>
              <p className="text-gray-600">Watch your food being prepared in real-time with kitchen cameras</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -10 }}
              className="p-6 rounded-xl border border-gray-200 bg-gradient-to-br from-green-50 to-white"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-xl mb-2">Gamified Rewards</h4>
              <p className="text-gray-600">Earn points, unlock badges, and get exclusive perks with every order</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -10 }}
              className="p-6 rounded-xl border border-gray-200 bg-gradient-to-br from-purple-50 to-white"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="text-xl mb-2">AI Meal Planner</h4>
              <p className="text-gray-600">Get personalized meal recommendations based on your taste and health goals</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-us" className="py-20 bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-4xl mb-6 text-gray-900">Why Choose Feast Hub?</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-xl mb-2">Lightning Fast Delivery</h4>
                    <p className="text-gray-600">Average delivery time of just 25 minutes with our optimized routing system</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xl mb-2">Quality Guaranteed</h4>
                    <p className="text-gray-600">100% fresh ingredients, verified kitchens, and temperature-controlled delivery</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-xl mb-2">Award-Winning Service</h4>
                    <p className="text-gray-600">Recognized as the most innovative food delivery platform of 2026</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-xl mb-2">Community First</h4>
                    <p className="text-gray-600">Share recipes, rate dishes, and connect with food lovers worldwide</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img
                src="https://images.unsplash.com/photo-1719204089341-11dec48eae19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
                alt="Restaurant"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl mb-6">Ready to Experience the Future of Food?</h3>
          <p className="text-xl mb-8 opacity-90">Join thousands of satisfied customers today</p>
          <div className="flex gap-4 justify-center">
            <Link to="/customer/register">
              <Button size="lg" variant="secondary">
                Get Started Free
              </Button>
            </Link>
            <Link to="/admin/register">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                Register as Partner
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl">Feast Hub</h4>
              </div>
              <p className="text-gray-400">Revolutionizing food delivery with innovation and care</p>
            </div>
            <div>
              <h5 className="mb-4">Company</h5>
              <div className="space-y-2 text-gray-400">
                <div>About Us</div>
                <div>Careers</div>
                <div>Press</div>
              </div>
            </div>
            <div>
              <h5 className="mb-4">Support</h5>
              <div className="space-y-2 text-gray-400">
                <div>Help Center</div>
                <div>Contact Us</div>
                <div>FAQs</div>
              </div>
            </div>
            <div>
              <h5 className="mb-4">Legal</h5>
              <div className="space-y-2 text-gray-400">
                <div>Privacy Policy</div>
                <div>Terms of Service</div>
                <div>Cookie Policy</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            © 2026 Feast Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
