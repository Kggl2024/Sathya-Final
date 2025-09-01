import {
  LayoutDashboard,
  PaintBucket,
  Package,
  IndianRupee,
  SwatchBook,
  User,
  FileText,
  Users,
  ClipboardList,
  Wrench,
  Hammer,
  Truck,
  Boxes,
  ListCollapse,
  Layers,
  PanelsTopLeft,
  PlusCircle,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'; // tree-shakable with Vite [8]

export const topMenus = [
  { id: 1, name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { id: 2, name: 'Contract Management', path: '/contracts', icon: PaintBucket },
  { id: 3, name: 'Supply Management', path: '/supply', icon: Package },
  { id: 4, name: 'Finance Management', path: '/finance', icon: IndianRupee },
  { id: 5, name: 'Resource Management', path: '/resources', icon: SwatchBook },
  // user icon used in topbar
  { id: 99, name: 'User', path: '#', icon: User },
];

// Left sidebar config per section
export const sidebarConfig = {
  '/': [
    {
      title: 'Overview',
      icon: LayoutDashboard,
      items: [
        { label: 'Summary', to: '/', icon: ListCollapse },
        { label: 'Reports', to: '/reports', icon: FileText },
      ],
    },
  ],
  '/contracts': [
    {
      title: 'Masters',
      icon: ClipboardList,
      items: [
        { label: 'Master Client Creation', to: '/contracts/master-client', icon: Users },
        { label: 'Master PO Creation', to: '/contracts/master-po', icon: FileText },
      ],
    },
    {
      title: 'Project',
      icon: PanelsTopLeft,
      items: [
        { label: 'Project List', to: '/contracts/projects', icon: Layers },
      ],
      accordion: {
        label: 'Project Projections',
        icon: ListCollapse,
        children: [
          { label: 'Material Projection', to: '/contracts/projections/material', icon: Boxes },
          { label: 'Labor Projection', to: '/contracts/projections/labor', icon: Hammer },
          { label: 'Rental Projection', to: '/contracts/projections/rental', icon: Truck },
          { label: 'Miscellaneous Projection', to: '/contracts/projections/misc', icon: Wrench },
        ],
        allowAdd: { label: 'Add Projection', icon: PlusCircle, to: '/contracts/projections/new' },
      },
    },
  ],
  '/supply': [
    {
      title: 'Inventory',
      icon: Boxes,
      items: [
        { label: 'Stock', to: '/supply/stock', icon: Boxes },
        { label: 'Vendors', to: '/supply/vendors', icon: Users },
        { label: 'Purchase Orders', to: '/supply/po', icon: FileText },
      ],
    },
  ],
  '/finance': [
    {
      title: 'Finance',
      icon: IndianRupee,
      items: [
        { label: 'Invoices', to: '/finance/invoices', icon: FileText },
        { label: 'Payments', to: '/finance/payments', icon: IndianRupee },
        { label: 'Reports', to: '/finance/reports', icon: ListCollapse },
      ],
    },
  ],
  '/resources': [
    {
      title: 'Resources',
      icon: SwatchBook,
      items: [
        { label: 'Staff', to: '/resources/staff', icon: Users },
        { label: 'Assign', to: '/resources/assign', icon: ClipboardList },
        { label: 'Utilization', to: '/resources/utilization', icon: ListCollapse },
      ],
    },
  ],
};

export const miscIcons = {
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
};
