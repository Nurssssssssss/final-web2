import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ImageIcon } from 'lucide-react';
import { authAPI } from '../../services/api';

interface AuthProps {
  onLogin: (username: string) => void;
}

interface LoginResponse {
  token: string;
  user?: {
    _id: string;
    username: string;
    email: string;
    role?: string;
  };
}

export function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');      // новое поле
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || (!isLogin && (!username || !email))) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      if (isLogin) {
        // 🔹 ЛОГИН
        const res = (await authAPI.login({ email, password })) as LoginResponse;
        // authAPI.login уже сохранил token в localStorage

        const name = res.user?.username || username || email;
        const userId = res.user?._id;

        console.log('DEBUG login response', res);

        if (userId) {
          localStorage.setItem('currentUserId', userId);
        }
        localStorage.setItem('currentUser', name);

        onLogin(name);
      } else {
        // 🔹 РЕГИСТРАЦИЯ
        await authAPI.register({ username, email, password });
        // после успешной регистрации сразу логиним
        const res = (await authAPI.login({ email, password })) as LoginResponse;

        const name = res.user?.username || username || email;
        const userId = res.user?._id;

        console.log('DEBUG register+login response', res);

        if (userId) {
          localStorage.setItem('currentUserId', userId);
        }
        localStorage.setItem('currentUser', name);

        onLogin(name);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-4 shadow-lg">
            <ImageIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            FrontX
          </h1>
          <p className="text-gray-600">Discover and share creative ideas</p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin ? 'Sign in to continue to FrontX' : 'Join FrontX to start sharing'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <Input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-11"
                  />
                </div>
              )}
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
              </Button>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or</span>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                className="w-full h-11"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
