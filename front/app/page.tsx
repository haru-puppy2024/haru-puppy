'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';

export default function Home() {
  const router = useRouter();
  const [cookies] = useCookies(['access_token']);

  useEffect(() => {
    const token = cookies['access_token'];

    if (token) {
      router.push('/home');
    } else {
      router.push('/auth/login');
    }
  }, [router, cookies]);
  return null;
}
