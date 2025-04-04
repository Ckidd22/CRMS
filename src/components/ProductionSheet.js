// src/components/ProductionSheet.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Typography, 
  Box, 
  Grid, 
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Collapse,
  useTheme
} from '@mui/material';
import {
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  LocalCafe as CoffeeIcon,
  LocalShipping as ShippingIcon,
  Inventory as InventoryIcon,
  Label as LabelIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';

function ProductionSheet() {
  const theme = useTheme();
  const [roastingData, setRoastingData] = useState({
    roastingCalculations: [],
    packagingNeeds: {
      fiveLbBags: 0,
      twoLbBags: 0,
      tenOzBags: 0,
      labels: {
        fiveLb: {},
        twoLb: {},
        tenOz: {}
      }
    },
    totalBatches: 0,
    ordersByDeliveryMethod: {
      Deliver: [],
      Shipped: [],
      Pickup: []
    },
    groundCoffee: {
      Drip: [],
      'Cold Brew': [],
      'French Press': []
    },
    completedRoasts: {}
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    roasting: true,
    ground: true,
    production: true,
    orders: true
  });

  const fetchRoastingCalculations = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/roasting-calculations');
      // Sort the roasting calculations by batch size (smallest to largest)
      const sortedCalculations = [...response.data.roastingCalculations].sort((a, b) => 
        parseFloat(a.batchSize) - parseFloat(b.batchSize)
      );
      setRoastingData({
        ...response.data,
        roastingCalculations: sortedCalculations
      });
    } catch (error) {
      console.error('Error fetching roasting calculations:', error);
    }
  };

  const calculateTotalPounds = () => {
    return roastingData.roastingCalculations.reduce((total, calc) => {
      return total + parseFloat(calc.totalPounds);
    }, 0).toFixed(2);
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:3001/api/orders/${orderId}`);
      fetchRoastingCalculations();
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleRoastCompletion = async (coffeeType, completed) => {
    try {
      await axios.post('http://localhost:3001/api/completed-roasts', {
        coffeeType,
        completed
      });
      fetchRoastingCalculations();
    } catch (error) {
      console.error('Error updating roast completion:', error);
    }
  };

  const handleOrderCompletion = async (orderId, completed) => {
    try {
      await axios.patch(`http://localhost:3001/api/orders/${orderId}`, { completed });
      fetchRoastingCalculations();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const openDeleteDialog = (orderId) => {
    setOrderToDelete(orderId);
    setDeleteDialogOpen(true);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    fetchRoastingCalculations();
  }, []);

  const SectionHeader = ({ title, section, icon: Icon }) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        p: 2,
        '&:hover': {
          bgcolor: 'action.hover'
        }
      }}
      onClick={() => toggleSection(section)}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Icon color="primary" />
        <Typography variant="h6">{title}</Typography>
      </Box>
      {expandedSections[section] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
    </Box>
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Production Sheet
      </Typography>

      <Grid container spacing={3}>
        {/* Roasting Calculations Section */}
        <Grid item xs={12}>
          <Card>
            <SectionHeader 
              title="Roasting Calculations" 
              section="roasting"
              icon={CoffeeIcon}
            />
            <Collapse in={expandedSections.roasting}>
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Coffee Type</TableCell>
                        <TableCell align="right">Total Pounds</TableCell>
                        <TableCell align="right">Number of Batches</TableCell>
                        <TableCell align="right">Batch Size</TableCell>
                        <TableCell align="right">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {roastingData.roastingCalculations.map((calc, index) => (
                        <TableRow 
                          key={index}
                          sx={{ 
                            textDecoration: roastingData.completedRoasts[calc.coffeeType] ? 'line-through' : 'none',
                            opacity: roastingData.completedRoasts[calc.coffeeType] ? 0.7 : 1
                          }}
                        >
                          <TableCell>{calc.coffeeType}</TableCell>
                          <TableCell align="right">{calc.totalPounds}</TableCell>
                          <TableCell align="right">{calc.numberOfRoasts}</TableCell>
                          <TableCell align="right">{`${calc.batchSize} lbs`}</TableCell>
                          <TableCell align="right">
                            <Checkbox
                              checked={roastingData.completedRoasts[calc.coffeeType] || false}
                              onChange={(e) => handleRoastCompletion(calc.coffeeType, e.target.checked)}
                              icon={<CheckCircleIcon />}
                              checkedIcon={<CheckCircleIcon />}
                              sx={{
                                color: theme.palette.grey[300],
                                '&.Mui-checked': {
                                  color: theme.palette.success.main,
                                },
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ 
                  mt: 3, 
                  p: 2, 
                  bgcolor: 'background.default', 
                  borderRadius: 1,
                  display: 'flex',
                  gap: 4
                }}>
                  <Typography variant="h6">
                    Total Batches: {roastingData.totalBatches}
                  </Typography>
                  <Typography variant="h6">
                    Total Pounds: {calculateTotalPounds()} lbs
                  </Typography>
                </Box>
              </CardContent>
            </Collapse>
          </Card>
        </Grid>

        {/* Ground Coffee Section */}
        <Grid item xs={12}>
          <Card>
            <SectionHeader 
              title="Ground Coffee" 
              section="ground"
              icon={InventoryIcon}
            />
            <Collapse in={expandedSections.ground}>
              <CardContent>
                {Object.entries(roastingData.groundCoffee).map(([grindSize, orders]) => (
                  orders.length > 0 && (
                    <Box key={grindSize} sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        <Chip 
                          label={grindSize} 
                          color="primary" 
                          size="small" 
                          sx={{ mr: 1 }}
                        />
                      </Typography>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Customer</TableCell>
                              <TableCell>Coffee Type</TableCell>
                              <TableCell align="right">Quantity</TableCell>
                              <TableCell>Bag Size</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {orders.map((order, index) => (
                              <TableRow key={index}>
                                <TableCell>{order.customer}</TableCell>
                                <TableCell>{order.coffeeType}</TableCell>
                                <TableCell align="right">{order.quantity}</TableCell>
                                <TableCell>{order.bagSize}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )
                ))}
              </CardContent>
            </Collapse>
          </Card>
        </Grid>

        {/* Production Requirements Section */}
        <Grid item xs={12}>
          <Card>
            <SectionHeader 
              title="Production Requirements" 
              section="production"
              icon={LabelIcon}
            />
            <Collapse in={expandedSections.production}>
              <CardContent>
                <Grid container spacing={3}>
                  {/* Packaging Requirements Section */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Bag Requirements
                    </Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Size</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>5lb Bags</TableCell>
                            <TableCell align="right">{roastingData.packagingNeeds.fiveLbBags}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>2lb Bags</TableCell>
                            <TableCell align="right">{roastingData.packagingNeeds.twoLbBags}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>10oz Bags</TableCell>
                            <TableCell align="right">{roastingData.packagingNeeds.tenOzBags}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>

                  {/* Label Requirements Section */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Label Requirements
                    </Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell align="right">5lb</TableCell>
                            <TableCell align="right">2lb</TableCell>
                            <TableCell align="right">10oz</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Object.keys({
                            ...roastingData.packagingNeeds.labels.fiveLb,
                            ...roastingData.packagingNeeds.labels.twoLb,
                            ...roastingData.packagingNeeds.labels.tenOz
                          }).map((labelName, index) => (
                            <TableRow key={index}>
                              <TableCell>{labelName}</TableCell>
                              <TableCell align="right">
                                {roastingData.packagingNeeds.labels.fiveLb[labelName] || 0}
                              </TableCell>
                              <TableCell align="right">
                                {roastingData.packagingNeeds.labels.twoLb[labelName] || 0}
                              </TableCell>
                              <TableCell align="right">
                                {roastingData.packagingNeeds.labels.tenOz[labelName] || 0}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </CardContent>
            </Collapse>
          </Card>
        </Grid>

        {/* Orders By Delivery Method Section */}
        <Grid item xs={12}>
          <Card>
            <SectionHeader 
              title="Orders By Delivery Method" 
              section="orders"
              icon={ShippingIcon}
            />
            <Collapse in={expandedSections.orders}>
              <CardContent>
                {Object.entries(roastingData.ordersByDeliveryMethod).map(([method, orders]) => (
                  orders.length > 0 && (
                    <Box key={method} sx={{ mb: 4 }}>
                      <Typography variant="h6" gutterBottom>
                        <Chip 
                          label={method} 
                          color={
                            method === 'Deliver' ? 'primary' : 
                            method === 'Shipped' ? 'secondary' : 
                            'default'
                          }
                          sx={{ mr: 1 }}
                        />
                      </Typography>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Customer</TableCell>
                              <TableCell>Order Details</TableCell>
                              <TableCell align="right">Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {orders.map((order) => (
                              <TableRow 
                                key={order.id}
                                sx={{ 
                                  textDecoration: order.completed ? 'line-through' : 'none',
                                  opacity: order.completed ? 0.7 : 1
                                }}
                              >
                                <TableCell>{order.customer}</TableCell>
                                <TableCell>
                                  {order.coffees.map((coffee, index) => (
                                    <Typography 
                                      key={index} 
                                      variant="body2" 
                                      sx={{ mb: 0.5 }}
                                    >
                                      {`${coffee.quantity} x ${coffee.bagSize} ${coffee.coffeeType}${coffee.grindSize !== 'Whole Bean' ? ` (${coffee.grindSize})` : ''}`}
                                    </Typography>
                                  ))}
                                </TableCell>
                                <TableCell align="right">
                                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                    <Checkbox
                                      checked={order.completed}
                                      onChange={(e) => handleOrderCompletion(order.id, e.target.checked)}
                                      icon={<CheckCircleIcon />}
                                      checkedIcon={<CheckCircleIcon />}
                                      sx={{
                                        color: theme.palette.grey[300],
                                        '&.Mui-checked': {
                                          color: theme.palette.success.main,
                                        },
                                      }}
                                    />
                                    <IconButton 
                                      size="small"
                                      color="error" 
                                      onClick={() => openDeleteDialog(order.id)}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )
                ))}
              </CardContent>
            </Collapse>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          elevation: 2,
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>Delete Order</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this order?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => handleDeleteOrder(orderToDelete)} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProductionSheet;