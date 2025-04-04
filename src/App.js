// src/App.js
import React, { useState } from 'react';
import { 
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ShoppingCart as OrdersIcon,
  LocalCafe as CoffeeIcon,
  Assessment as ProductionIcon,
} from '@mui/icons-material';

// Import components
import Dashboard from './components/Dashboard';
import OrderForm from './components/OrderForm';
import ProductionSheet from './components/ProductionSheet';
import CoffeeManagement from './components/CoffeeManagement';

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [currentView, setCurrentView] = useState('dashboard');

  const drawerWidth = 240;

  const menuItems = [
    { id: 'dashboard', text: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'orders', text: 'Orders', icon: <OrdersIcon /> },
    { id: 'production', text: 'Production', icon: <ProductionIcon /> },
    { id: 'coffee', text: 'Coffee', icon: <CoffeeIcon /> },
  ];

  const getViewContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'orders':
        return <OrderForm />;
      case 'production':
        return <ProductionSheet />;
      case 'coffee':
        return <CoffeeManagement />;
      default:
        return (
          <Typography variant="h4" sx={{ p: 3 }}>
            {currentView.charAt(0).toUpperCase() + currentView.slice(1)} Content
          </Typography>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Coffee Roaster Management System
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar /> {/* Spacer to align with AppBar */}
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                if (isMobile) setDrawerOpen(false);
              }}
              selected={currentView === item.id}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: ['48px', '56px', '64px'], // Toolbar height at different breakpoints
        }}
      >
        {getViewContent()}
      </Box>
    </Box>
  );
}

export default App;