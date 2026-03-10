'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
} from '@mui/material';
import { useMemo } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Theme is created only once – useMemo prevents re‑creation on every render
  const darkTheme = useMemo(
    () => createTheme({ palette: { mode: 'dark' } }),
    []
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: { duration: 0.3 },
            }}
            exit={{
              opacity: 0,
              x: -20,
              transition: { duration: 0.2 },
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </Container>
    </ThemeProvider>
  );
}
