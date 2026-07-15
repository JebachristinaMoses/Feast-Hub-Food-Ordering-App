import { Link } from 'react-router';
import { ChefHat, Home } from 'lucide-react';
import { Button } from '../components/ui/button';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ChefHat className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-6xl mb-4 text-gray-900">404</h1>
        <h2 className="text-2xl mb-4 text-gray-700">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Looks like this dish isn't on our menu!
        </p>
        <Link to="/">
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
