import "../styles/globals.css";
import { Metadata } from "next";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Container } from "@mui/material";
import Providers from "./Providers";

export const metadata: Metadata = {
  title: "Modern LeetCode",
  description: "Interactive coding challenges with smooth animations",
};

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Providers>{children}</Providers>
          </Container>
        </ThemeProvider>
      </body>
    </html>
  );
}

