import React, { useState, useEffect } from 'react';
import { Users, Building2, Theater, TrendingUp, Star, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalVendors: number;
  verifiedVendors: number;
  totalServices: number;
  activeServices: number;
  totalTheaters: number;
  approvedTheaters: number;
}

function StatCard({ title, value, subtitle, icon: Icon, trend }: {
  title: string;
  value: number;
  subtitle: string;
  icon: any;
  trend?: string;
}) {
  return (
    <Card className="p-6 shadow-admin-md hover:shadow-admin-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-bold text-foreground">{value}</h3>
            {trend && (
              <Badge className="bg-success/10 text-success border-success/20">
                {trend}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </Card>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalVendors: 0,
    verifiedVendors: 0,
    totalServices: 0,
    activeServices: 0,
    totalTheaters: 0,
    approvedTheaters: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [vendorsData, servicesData, theatersData] = await Promise.all([
        supabase.from('vendors').select('verification_status'),
        supabase.from('service_listings').select('is_active'),
        supabase.from('private_theaters').select('approval_status'),
      ]);

      const vendors = vendorsData.data || [];
      const services = servicesData.data || [];
      const theaters = theatersData.data || [];

      setStats({
        totalVendors: vendors.length,
        verifiedVendors: vendors.filter(v => v.verification_status === 'verified').length,
        totalServices: services.length,
        activeServices: services.filter(s => s.is_active).length,
        totalTheaters: theaters.length,
        approvedTheaters: theaters.filter(t => t.approval_status === 'approved').length,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-8 bg-muted rounded w-1/3"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to Theater Vista Admin Dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-success" />
          <span className="text-sm text-muted-foreground">System Status: </span>
          <Badge className="bg-success text-success-foreground">Active</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Vendors"
          value={stats.totalVendors}
          subtitle={`${stats.verifiedVendors} verified`}
          icon={Users}
          trend={stats.verifiedVendors > 0 ? `${Math.round((stats.verifiedVendors / stats.totalVendors) * 100)}%` : undefined}
        />

        <StatCard
          title="Service Listings"
          value={stats.totalServices}
          subtitle={`${stats.activeServices} active`}
          icon={Building2}
          trend={stats.activeServices > 0 ? `${Math.round((stats.activeServices / stats.totalServices) * 100)}%` : undefined}
        />

        <StatCard
          title="Private Theaters"
          value={stats.totalTheaters}
          subtitle={`${stats.approvedTheaters} approved`}
          icon={Theater}
          trend={stats.approvedTheaters > 0 ? `${Math.round((stats.approvedTheaters / stats.totalTheaters) * 100)}%` : undefined}
        />

        <StatCard
          title="Growth Rate"
          value={24}
          subtitle="This month"
          icon={TrendingUp}
          trend="+12%"
        />

        <StatCard
          title="Average Rating"
          value={4.5}
          subtitle="Platform average"
          icon={Star}
          trend="+0.2"
        />

        <StatCard
          title="Active Sessions"
          value={156}
          subtitle="Current users"
          icon={Activity}
          trend="+8%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 shadow-admin-md">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New vendor registered</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-2 h-2 bg-info rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Theater listing approved</p>
                <p className="text-xs text-muted-foreground">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Service review pending</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-admin-md">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors text-left">
              <Users className="w-5 h-5 text-primary mb-2" />
              <p className="text-sm font-medium">Manage Vendors</p>
            </button>
            <button className="p-3 bg-success/10 hover:bg-success/20 rounded-lg transition-colors text-left">
              <Building2 className="w-5 h-5 text-success mb-2" />
              <p className="text-sm font-medium">Review Services</p>
            </button>
            <button className="p-3 bg-info/10 hover:bg-info/20 rounded-lg transition-colors text-left">
              <Theater className="w-5 h-5 text-info mb-2" />
              <p className="text-sm font-medium">Approve Theaters</p>
            </button>
            <button className="p-3 bg-warning/10 hover:bg-warning/20 rounded-lg transition-colors text-left">
              <TrendingUp className="w-5 h-5 text-warning mb-2" />
              <p className="text-sm font-medium">View Analytics</p>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}