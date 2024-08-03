'use client';
import { Pretendard } from '@/public/fonts/fonts';
import { theme } from '@/styles/theme';
import Script from 'next/script';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from 'styled-components';
import './globals.css';
import StyledComponentsRegistry from './registry';
import { OverlayProvider } from 'overlay-kit';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <StyledComponentsRegistry>
          <html lang='kr'>
            <head>
              <Script
                src='https://t1.kakaocdn.net/kakao_js_sdk/2.6.0/kakao.min.js'
                strategy='afterInteractive'
                onLoad={() => {
                  if (window.Kakao && !window.Kakao.isInitialized()) {
                    window.Kakao.init('281badc9872f0dabb0a6ffdaedda3fe5');
                  }
                }}
              />
            </head>
            <body className={Pretendard.className}>
              <ThemeProvider theme={theme}>
                <OverlayProvider>{children} </OverlayProvider>
              </ThemeProvider>
            </body>
          </html>
        </StyledComponentsRegistry>
      </QueryClientProvider>
    </RecoilRoot>
  );
}
