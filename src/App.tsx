import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminVendors from "./pages/admin/AdminVendors";
import AdminVendorDetails from "./pages/admin/AdminVendorDetails";
import AdminServices from "./pages/admin/AdminServices";
import AdminTheaters from "./pages/admin/AdminTheaters";
import AdminTheme from "./pages/admin/AdminTheme";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminTheaterDetails from "./pages/admin/AdminTheaterDetails";
import { ServiceListingEdit } from "./pages/admin/ServiceListingEdit";
import ScreenEdit from "./pages/admin/ScreenEdit";
import AdminCategories from "./pages/admin/AdminCategories";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="vendors" element={<AdminVendors />} />
            <Route path="vendors/:vendorId" element={<AdminVendorDetails />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="service-listings/:id/edit" element={<ServiceListingEdit />} />
            <Route path="theaters" element={<AdminTheaters />} />
            <Route path="theaters/:theaterId" element={<AdminTheaterDetails />} />
            <Route path="theaters/:theaterId/screens/:screenId/edit" element={<ScreenEdit />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="theme" element={<AdminTheme />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
