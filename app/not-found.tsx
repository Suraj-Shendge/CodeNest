'use client';

import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      sx={{
        textAlign: 'center',
        py: 10,
      }}
    >
      <Typography variant="h3" gutterBottom>
        404 – Page Not Found
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Oops! The page you’re looking for does not exist.
      </Typography>
      <Link href="/" passHref>
        <Typography
          component="a"
          variant="button"
          sx={{ mt: 2, display: 'inline-block' }}
        >
          Go back home
        </Typography>
      </Link>
    </Box>
  );
}
