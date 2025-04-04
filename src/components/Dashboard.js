// src/components/Dashboard.js
import React from 'react';
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  useTheme
} from '@mui/material';
import {
  LocalCafe as CoffeeIcon,
  LocalShipping as ShippingIcon,
  Inventory as InventoryIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

function Dashboard() {
  const theme = useTheme();

  // Simple StatCard component
  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton
            sx={{
              backgroundColor: `${color}20`,
              color: color,
              '&:hover': { backgroundColor: `${color}30` },
            }}
          >
            {icon}
          </IconButton>
        </Box>
        <Typography variant="h4" component="div" sx={{ mb: 1 }}>
          {value}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value="0"
            icon={<AssessmentIcon />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pounds to Roast"
            value="0 lbs"
            icon={<CoffeeIcon />}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed Orders"
            value="0"
            icon={<InventoryIcon />}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Deliveries"
            value="0"
            icon={<ShippingIcon />}
            color={theme.palette.warning.main}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;