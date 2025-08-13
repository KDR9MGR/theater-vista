import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

// Use role-based authentication instead of hardcoded UUID

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          navigate('/admin/login');
          return;
        }

        // Check if user has admin role in metadata
        const userMetadata = session.user.user_metadata || (session.user as any).raw_user_meta_data;
        if (userMetadata?.role !== 'admin') {
          navigate('/');
          return;
        }

        setUser(session.user);
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session?.user) {
          navigate('/admin/login');
          return;
        }
        
        const userMetadata = session.user.user_metadata || (session.user as any).raw_user_meta_data;
        if (userMetadata?.role !== 'admin') {
          navigate('/admin/login');
          return;
        }
        
        setUser(session.user);
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Authenticating...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}