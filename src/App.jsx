import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import Dashboard from "@/components/pages/Dashboard";
import Contacts from "@/components/pages/Contacts";
import Deals from "@/components/pages/Deals";
import Activities from "@/components/pages/Activities";
import Reports from "@/components/pages/Reports";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const handleMenuClick = () => {
    setSidebarOpen(true);
  };
  
  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };
  
  const getPageTitle = (pathname) => {
    const routes = {
      '/': 'Dashboard',
      '/contacts': 'Contacts',
      '/deals': 'Deals',
      '/activities': 'Activities',
      '/reports': 'Reports'
    };
    return routes[pathname] || 'PipeFlow CRM';
  };
  
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Routes>
            <Route path="*" element={
              <>
                <Header 
                  title={getPageTitle(window.location.pathname)}
                  onMenuClick={handleMenuClick}
                />
                
                <main className="flex-1 overflow-auto p-6">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/contacts" element={<Contacts />} />
                    <Route path="/deals" element={<Deals />} />
                    <Route path="/activities" element={<Activities />} />
                    <Route path="/reports" element={<Reports />} />
                  </Routes>
                </main>
              </>
            } />
          </Routes>
        </div>
      </div>
      
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  );
}

export default App;