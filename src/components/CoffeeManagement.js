// src/components/CoffeeManagement.js
import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Snackbar,
  Alert,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Coffee as CoffeeIcon,
  Blender as BlenderIcon
} from '@mui/icons-material';

function CoffeeManagement() {
  const theme = useTheme();
  const [coffees, setCoffees] = useState({ singleOrigins: [], blends: [] });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCoffee, setCurrentCoffee] = useState(null);
  const [dialogType, setDialogType] = useState('single');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [newCoffee, setNewCoffee] = useState({
    name: '',
    type: 'single',
    components: [{ coffee: '', percentage: '' }]
  });

  const fetchCoffees = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/coffees');
      const data = await response.json();
      setCoffees(data);
    } catch (error) {
      console.error('Error fetching coffees:', error);
      showSnackbar('Error fetching coffees', 'error');
    }
  }, []);

  React.useEffect(() => {
    fetchCoffees();
  }, [fetchCoffees]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAddComponent = () => {
    if (newCoffee.components.length < 4) {
      setNewCoffee({
        ...newCoffee,
        components: [...newCoffee.components, { coffee: '', percentage: '' }]
      });
    }
  };

  const handleRemoveComponent = (index) => {
    const newComponents = newCoffee.components.filter((_, i) => i !== index);
    setNewCoffee({
      ...newCoffee,
      components: newComponents
    });
  };

  const handleComponentChange = (index, field, value) => {
    const newComponents = [...newCoffee.components];
    newComponents[index] = { ...newComponents[index], [field]: value };

    // Automatically adjust percentages to total 100
    if (field === 'percentage') {
      const total = newComponents.reduce((sum, comp, i) => {
        return i === index ? sum + Number(value) : sum + Number(comp.percentage || 0);
      }, 0);

      if (total > 100) {
        value = Math.max(0, 100 - (total - Number(value)));
        newComponents[index].percentage = value.toString();
      }
    }

    setNewCoffee({ ...newCoffee, components: newComponents });
  };

  const validateBlend = () => {
    const total = newCoffee.components.reduce((sum, comp) => sum + Number(comp.percentage || 0), 0);
    return total === 100 && newCoffee.components.every(comp => comp.coffee && comp.percentage);
  };

  const handleSubmit = async () => {
    try {
      if (dialogType === 'blend' && !validateBlend()) {
        showSnackbar('Blend percentages must total 100%', 'error');
        return;
      }

      const endpoint = isEditing ? 
        `http://localhost:3001/api/coffees/${currentCoffee.id}` : 
        'http://localhost:3001/api/coffees';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCoffee),
      });

      showSnackbar(`Coffee ${isEditing ? 'updated' : 'added'} successfully`);
      setDialogOpen(false);
      setNewCoffee({ name: '', type: 'single', components: [{ coffee: '', percentage: '' }] });
      fetchCoffees();
    } catch (error) {
      console.error('Error saving coffee:', error);
      showSnackbar('Error saving coffee', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/coffees/${id}`, {
        method: 'DELETE',
      });
      showSnackbar('Coffee deleted successfully');
      fetchCoffees();
    } catch (error) {
      console.error('Error deleting coffee:', error);
      showSnackbar('Error deleting coffee', 'error');
    }
  };

  const handleEdit = (coffee) => {
    setCurrentCoffee(coffee);
    setNewCoffee({
      ...coffee,
      type: coffee.components ? 'blend' : 'single'
    });
    setIsEditing(true);
    setDialogType(coffee.components ? 'blend' : 'single');
    setDialogOpen(true);
  };

  const openAddDialog = (type) => {
    setIsEditing(false);
    setDialogType(type);
    setNewCoffee({
      name: '',
      type: type,
      components: type === 'blend' ? [{ coffee: '', percentage: '' }] : []
    });
    setDialogOpen(true);
  };

  const CoffeeTable = ({ title, coffees, type }) => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {type === 'single' ? <CoffeeIcon color="primary" /> : <BlenderIcon color="primary" />}
            <Typography variant="h6">{title}</Typography>
          </Box>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => openAddDialog(type)}
            size="small"
          >
            Add {type === 'single' ? 'Single Origin' : 'Blend'}
          </Button>
        </Box>

        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                {type === 'blend' && <TableCell>Components</TableCell>}
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coffees.map((coffee) => (
                <TableRow key={coffee.id}>
                  <TableCell>{coffee.name}</TableCell>
                  {type === 'blend' && (
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {coffee.components.map((comp, idx) => (
                          <Chip
                            key={idx}
                            label={`${comp.coffee} (${comp.percentage}%)`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </TableCell>
                  )}
                  <TableCell align="right">
                    <IconButton 
                      size="small" 
                      onClick={() => handleEdit(coffee)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small"
                      color="error" 
                      onClick={() => handleDelete(coffee.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Coffee Management
      </Typography>

      <CoffeeTable 
        title="Single Origin Coffees" 
        coffees={coffees.singleOrigins}
        type="single"
      />

      <CoffeeTable 
        title="Blends" 
        coffees={coffees.blends}
        type="blend"
      />

      {/* Add/Edit Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isEditing ? 'Edit' : 'Add'} {dialogType === 'single' ? 'Single Origin' : 'Blend'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={newCoffee.name}
            onChange={(e) => setNewCoffee({ ...newCoffee, name: e.target.value })}
            margin="normal"
          />

          {dialogType === 'blend' && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Components
              </Typography>
              {newCoffee.components.map((component, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <FormControl sx={{ flex: 2 }}>
                    <InputLabel>Coffee</InputLabel>
                    <Select
                      value={component.coffee}
                      onChange={(e) => handleComponentChange(index, 'coffee', e.target.value)}
                      label="Coffee"
                    >
                      {coffees.singleOrigins.map((coffee) => (
                        <MenuItem key={coffee.id} value={coffee.name}>
                          {coffee.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Percentage"
                    type="number"
                    value={component.percentage}
                    onChange={(e) => handleComponentChange(index, 'percentage', e.target.value)}
                    sx={{ flex: 1 }}
                    InputProps={{
                      endAdornment: '%',
                      inputProps: { min: 0, max: 100 }
                    }}
                  />
                  {index > 0 && (
                    <IconButton 
                      color="error" 
                      onClick={() => handleRemoveComponent(index)}
                      sx={{ mt: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
              {newCoffee.components.length < 4 && (
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddComponent}
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Add Component
                </Button>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {isEditing ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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

export default CoffeeManagement;