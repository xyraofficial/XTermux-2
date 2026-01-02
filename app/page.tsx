"use client";
import React, { useState, useEffect } from 'react';
import HomeView from './views/Home';

export default function Page() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-black" />;

  return <HomeView />;
}
