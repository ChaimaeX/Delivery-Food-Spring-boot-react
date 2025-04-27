import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

export default function FullScreenLoading() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'background.paper',
        zIndex: 9999
      }}
    >
      <Stack spacing={2} sx={{ width: '80%', maxWidth: 400 }}>
        {/* Header Skeleton */}
        <Skeleton variant="rounded" width="100%" height={60} />
        
        {/* Content Area */}
        <Skeleton variant="rectangular" width="100%" height={300} />
        
        {/* Footer/Button Area */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton variant="rounded" width={120} height={40} />
          <Skeleton variant="rounded" width={120} height={40} />
        </Box>
      </Stack>
    </Box>
  );
}