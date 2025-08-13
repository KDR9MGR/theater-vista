import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield } from 'lucide-react';

// Remove hardcoded UUID check, use role-based authentication instead

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      // Check specifically for admin role in metadata, not the main user role which is always 'authenticated'
      const userMetadata = session?.user?.user_metadata || (session?.user as any)?.raw_user_meta_data;
      if (userMetadata?.role === 'admin') {
        navigate('/admin');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Check if user has admin role in metadata
      const userMetadata = data.user?.user_metadata || (data.user as any)?.raw_user_meta_data;
      if (userMetadata?.role !== 'admin') {
        setError('Access denied. Admin privileges required.');
        await supabase.auth.signOut();
        return;
      }

      navigate('/admin');
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-admin p-4">
      <Card className="w-full max-w-md shadow-admin-lg border-admin">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-admin-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-admin-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-admin-foreground">Admin Access</CardTitle>
            <CardDescription className="text-admin-muted">
              Sign in to access the admin dashboard
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-admin-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@theatervista.com"
                required
                className="bg-admin-input border-admin-border focus:border-admin-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-admin-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="bg-admin-input border-admin-border focus:border-admin-primary"
              />
            </div>
            
            {error && (
              <Alert className="border-destructive/50 text-destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full bg-admin-primary hover:bg-admin-primary/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}