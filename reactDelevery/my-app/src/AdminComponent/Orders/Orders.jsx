import { Card, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import React, { useState } from 'react';
import OrderTable from './OrderTable';

const ordersStatus = [
  { label: "Pending", value: "PENDING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "All", value: "All" },
];

const Orders = () => {
  const [filterValue, setFilterValue] = useState();  // Initialisation à "All" pour correspondre au premier élément

  const handleFilter = (value) => {
    setFilterValue(value);  // Accès à la valeur de l'option sélectionnée
    console.log('value',value);
    
  };

  return (
    <div className='px-2'>
      <Card className='p-5'>
        <Typography sx={{ paddingBottom: "1rem" }} variant='h5'>
          Order Status
        </Typography>
        <FormControl>
          <RadioGroup
            onChange={handleFilter}
            row
            name='category'
            value={filterValue}  
          >
            {ordersStatus.map((item) => 
              <FormControlLabel
                key={item.value}  // Utiliser 'item.value' comme clé pour une meilleure unicité
                value={item.value}
                control={<Radio />}
                label={item.label}
                sx={{ color: "gray" }}
              />
            )}
          </RadioGroup>
        </FormControl>
      </Card>

      <OrderTable />
    </div>
  );
};

export default Orders;
