
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import MaterialPlanning from './pages/contract/MaterialPlanning';
import MaterialDispatch from './pages/contract/MaterialDispatch';
import ClientMasterCreation from './pages/contract/ClientMasterCreation';
import ProjectList from './pages/contract/ProjectList';
import POMasterCreation from './pages/contract/POMasterCreation';
import POMasterMain from './pages/contract/POMasterMain';
import WorkForcePlanning from './pages/contract/WorkForcePlanning';
import ProjectProjection from './pages/contract/ProjectProjection';

const Placeholder = ({ title }) => (
  <div className="p-4">
    <h1 className="text-xl font-semibold">{title}</h1>
    <p className="text-gray-600 mt-2">Content goes here.</p>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login page at "/" WITHOUT Menubar/Sidebar */}
        <Route path="/" element={<Login />} />

        {/* App shell for all other routes */}
        <Route element={<AppLayout />}>
          {/* Dashboard (use a different path than "/" now) */}
          <Route path="/admin/dashboard/:encodedUserId" element={<ProtectedRoute role="admin"><Placeholder title="Dashboard" /></ProtectedRoute>} />
          
          <Route path="/admin/dashboard/reports/:encodedUserId" element={<ProtectedRoute role="admin"><Placeholder title="Dashboard Reports" /></ProtectedRoute>} />

          {/* Contracts */}
          <Route path="/admin/contracts/:encodedUserId" element={<ProtectedRoute role="admin"><Placeholder title="Contract Management" /></ProtectedRoute>} />
          
          <Route 
              path="/admin/contracts/master-client/:encodedUserId" 
              element={
              <ProtectedRoute role="admin">
                <ClientMasterCreation />
              </ProtectedRoute>
              } 
          />
          
          <Route 
              path="/admin/contracts/master-po/:encodedUserId" 
              element={
                <ProtectedRoute role="admin">
                  {/* <POMasterCreation /> */}
                  <POMasterMain />
                </ProtectedRoute>
              } 
          />

          <Route 
              path="/admin/contracts/projects/:encodedUserId" 
              element={
                <ProtectedRoute role="admin">
                  <ProjectList />
                </ProtectedRoute>
              } 
          />

          <Route 
              path="/admin/contracts/projects/projections/:encodedUserId" 
              element={
                <ProtectedRoute role="admin">
                 <ProjectProjection />
                </ProtectedRoute>
              } 
          />

          <Route 
              path="/admin/contracts/projects/work-force-planning/:encodedUserId" 
              element={
                <ProtectedRoute role="admin">
                  <WorkForcePlanning />
                </ProtectedRoute>
              } 
          />

          <Route 
              path="/admin/contracts/projects/material-planning/:encodedUserId" 
              element={
                <ProtectedRoute role="admin">
                  <MaterialPlanning />
                </ProtectedRoute>
              } 
          />
          <Route 
              path="/admin/contracts/projects/material-dispatch/:encodedUserId" 
              element={
                <ProtectedRoute role="admin">
                  <MaterialDispatch />
                </ProtectedRoute>
              } 
          />

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
