import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Database, Users, Building2, Theater, ArrowRight, BarChart3 } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Theater Vista</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8">
            Professional Admin Dashboard for Theater & Event Management
          </p>
          <Link to="/admin">
            <Button className="bg-gradient-primary hover:opacity-90 text-white px-8 py-3 text-lg">
              Access Admin Dashboard
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 shadow-admin-md hover:shadow-admin-lg transition-all duration-200 group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Vendors</h3>
                <p className="text-sm text-muted-foreground">Manage vendors</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-admin-md hover:shadow-admin-lg transition-all duration-200 group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center group-hover:bg-success/20 transition-colors">
                <Building2 className="w-6 h-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Services</h3>
                <p className="text-sm text-muted-foreground">Service listings</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-admin-md hover:shadow-admin-lg transition-all duration-200 group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center group-hover:bg-info/20 transition-colors">
                <Theater className="w-6 h-6 text-info" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Theaters</h3>
                <p className="text-sm text-muted-foreground">Private theaters</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-admin-md hover:shadow-admin-lg transition-all duration-200 group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center group-hover:bg-warning/20 transition-colors">
                <BarChart3 className="w-6 h-6 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Analytics</h3>
                <p className="text-sm text-muted-foreground">View insights</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-8 shadow-admin-lg text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Complete Admin Dashboard
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Built with modern React components, featuring data tables with search and filtering capabilities. 
            Manage your theater and event management platform with ease.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>✨ Real-time data</span>
            <span>🔍 Advanced filtering</span>
            <span>📊 Analytics dashboard</span>
            <span>🎭 Theater management</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
