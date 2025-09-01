// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Menubar from './components/Menubar';
import Sidebar from './components/Sidebar';

const Placeholder = ({ title }) => (
  <div className="p-4">
    <h1 className="text-xl font-semibold">{title}</h1>
    <p className="text-gray-600 mt-2">Content goes here.</p>
  </div>
);

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col">
        <Menubar onMobileMenuToggle={() => setMobileOpen(true)} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
          />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-3 lg:p-6">
            <Routes>
              {/* Dashboard */}
              <Route path="/" element={<Placeholder title="Dashboard" />} />
              <Route path="/reports" element={<Placeholder title="Dashboard Reports" />} />

              {/* Contracts */}
              <Route path="/contracts" element={<Placeholder title="Contract Management" />} />
              <Route path="/contracts/master-client" element={<Placeholder title="Master Client Creation" />} />
              <Route path="/contracts/master-po" element={<Placeholder title="Master PO Creation" />} />
              <Route path="/contracts/projects" element={<Placeholder title="Projects" />} />
              <Route path="/contracts/projections/material" element={<Placeholder title="Material Projection" />} />
              <Route path="/contracts/projections/labor" element={<Placeholder title="Labor Projection" />} />
              <Route path="/contracts/projections/rental" element={<Placeholder title="Rental Projection" />} />
              <Route path="/contracts/projections/misc" element={<Placeholder title="Miscellaneous Projection" />} />
              <Route path="/contracts/projections/new" element={<Placeholder title="Add Projection" />} />

              {/* Supply */}
              <Route path="/supply" element={<Placeholder title="Supply Management" />} />
              <Route path="/supply/stock" element={<Placeholder title="Stock" />} />
              <Route path="/supply/vendors" element={<Placeholder title="Vendors" />} />
              <Route path="/supply/po" element={<Placeholder title="Purchase Orders" />} />

              {/* Finance */}
              <Route path="/finance" element={<Placeholder title="Finance Management" />} />
              <Route path="/finance/invoices" element={<Placeholder title="Invoices" />} />
              <Route path="/finance/payments" element={<Placeholder title="Payments" />} />
              <Route path="/finance/reports" element={<Placeholder title="Finance Reports" />} />

              {/* Resources */}
              <Route path="/resources" element={<Placeholder title="Resource Management" />} />
              <Route path="/resources/staff" element={<Placeholder title="Staff" />} />
              <Route path="/resources/assign" element={<Placeholder title="Assign" />} />
              <Route path="/resources/utilization" element={<Placeholder title="Utilization" />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
