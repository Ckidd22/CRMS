// src/components/OrderForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl, 
  Box, 
  Typography,
  Card,
  CardContent,
  IconButton,
  Alert,
  Snackbar,
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  LocalCafe as CoffeeIcon,
  Label as LabelIcon
} from '@mui/icons-material';

function OrderForm() {
  const [order, setOrder] = useState({
    customer: '',
    customLabels: false,
    deliveryMethod: '',
    coffeeOrders: [
      {
        coffeeType: '',
        quantity: '',
        bagSize: '',
        grindSize: 'Whole Bean'
      }
    ]
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const transformedOrders = order.coffeeOrders.map(coffeeOrder => ({
        customer: order.customer,
        customLabels: order.customLabels,
        deliveryMethod: order.deliveryMethod,
        completed: false,
        coffeeType: coffeeOrder.coffeeType,
        quantity: coffeeOrder.quantity,
        bagSize: coffeeOrder.bagSize,
        grindSize: coffeeOrder.grindSize
      }));

      await axios.post('http://localhost:3001/api/orders', transformedOrders);
      
      setSnackbar({
        open: true,
        message: 'Order submitted successfully!',
        severity: 'success'
      });

      setOrder({
        customer: '',
        customLabels: false,
        deliveryMethod: '',
        coffeeOrders: [
          {
            coffeeType: '',
            quantity: '',
            bagSize: '',
            grindSize: 'Whole Bean'
          }
        ]
      });
    } catch (error) {
      console.error('Error adding order:', error);
      setSnackbar({
        open: true,
        message: 'Error submitting order. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCoffeeOrderChange = (index, field, value) => {
    const newCoffeeOrders = [...order.coffeeOrders];
    newCoffeeOrders[index] = {
      ...newCoffeeOrders[index],
      [field]: value
    };
    setOrder({
      ...order,
      coffeeOrders: newCoffeeOrders
    });
  };

  const addCoffeeToOrder = () => {
    setOrder({
      ...order,
      coffeeOrders: [
        ...order.coffeeOrders,
        {
          coffeeType: '',
          quantity: '',
          bagSize: '',
          grindSize: 'Whole Bean'
        }
      ]
    });
  };

  const removeCoffeeFromOrder = (index) => {
    const newCoffeeOrders = order.coffeeOrders.filter((_, i) => i !== index);
    setOrder({
      ...order,
      coffeeOrders: newCoffeeOrders
    });
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        New Order
      </Typography>

      <form onSubmit={handleSubmit}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <CoffeeIcon color="primary" />
              <Typography variant="h6">
                Customer Information
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <TextField
                label="Customer Name"
                value={order.customer}
                onChange={(e) => setOrder({ ...order, customer: e.target.value })}
                fullWidth
                required
                sx={{ flex: 2 }}
              />

              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Delivery Method</InputLabel>
                <Select
                  value={order.deliveryMethod}
                  onChange={(e) => setOrder({ ...order, deliveryMethod: e.target.value })}
                  label="Delivery Method"
                  required
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Please Choose a Delivery Method
                  </MenuItem>
                  <MenuItem value="Deliver">Deliver</MenuItem>
                  <MenuItem value="Shipped">Shipped</MenuItem>
                  <MenuItem value="Pickup">Pickup</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <LabelIcon color={order.customLabels ? 'primary' : 'disabled'} />
                <Typography
                  component="label"
                  sx={{ 
                    cursor: 'pointer',
                    userSelect: 'none',
                    color: order.customLabels ? 'primary.main' : 'text.secondary'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={order.customLabels}
                    onChange={(e) => setOrder({ ...order, customLabels: e.target.checked })}
                    style={{ display: 'none' }}
                  />
                  Custom Labels
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {order.coffeeOrders.map((coffeeOrder, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Coffee Order #{index + 1}
                </Typography>
                {index > 0 && (
                  <IconButton
                    color="error"
                    onClick={() => removeCoffeeFromOrder(index)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth required>
                    <InputLabel>Coffee Type</InputLabel>
                    <Select
                      value={coffeeOrder.coffeeType}
                      onChange={(e) => handleCoffeeOrderChange(index, 'coffeeType', e.target.value)}
                      label="Coffee Type"
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Please Choose a Coffee
                      </MenuItem>
                      <MenuItem value="Brasil">Brasil</MenuItem>
                      <MenuItem value="Ethiopia">Ethiopia</MenuItem>
                      <MenuItem value="Guatemala">Guatemala</MenuItem>
                      <MenuItem value="Colombia">Colombia</MenuItem>
                      <MenuItem value="Two Tigers">Two Tigers</MenuItem>
                      <MenuItem value="Legacy">Legacy</MenuItem>
                      <MenuItem value="Jackpot">Jackpot</MenuItem>
                      <MenuItem value="Cold Brew">Cold Brew</MenuItem>
                      <MenuItem value="Decaf">Decaf</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    label="Quantity"
                    value={coffeeOrder.quantity}
                    onChange={(e) => handleCoffeeOrderChange(index, 'quantity', e.target.value)}
                    fullWidth
                    required
                    type="number"
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth required>
                    <InputLabel>Bag Size</InputLabel>
                    <Select
                      value={coffeeOrder.bagSize}
                      onChange={(e) => handleCoffeeOrderChange(index, 'bagSize', e.target.value)}
                      label="Bag Size"
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Please Choose a Bag Size
                      </MenuItem>
                      <MenuItem value="5lb">5lb</MenuItem>
                      <MenuItem value="2lb">2lb</MenuItem>
                      <MenuItem value="10oz">10oz</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Grind Size</InputLabel>
                    <Select
                      value={coffeeOrder.grindSize}
                      onChange={(e) => handleCoffeeOrderChange(index, 'grindSize', e.target.value)}
                      label="Grind Size"
                    >
                      <MenuItem value="Whole Bean">Whole Bean</MenuItem>
                      <MenuItem value="Drip">Drip</MenuItem>
                      <MenuItem value="Cold Brew">Cold Brew</MenuItem>
                      <MenuItem value="French Press">French Press</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}

        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button
            startIcon={<AddIcon />}
            onClick={addCoffeeToOrder}
            variant="outlined"
            sx={{ flex: 1 }}
          >
            Add Another Coffee
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ flex: 1 }}
          >
            Submit Order
          </Button>
        </Box>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default OrderForm;