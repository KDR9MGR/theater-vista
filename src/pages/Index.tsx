import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-8">
            <img src="/app_logo.svg" alt="Sylonow" className="w-100 h-100" />
           
          </div>
          <p className="text-xl text-muted-foreground mb-12">
            Admin Dashboard
          </p>
          <Link to="/admin">
            <Button className="bg-gradient-primary hover:opacity-90 text-white px-8 py-4 text-lg">
              Access Dashboard
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>


      </div>
    </div>
  );
};

export default Index;
