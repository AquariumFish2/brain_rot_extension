"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  image: string;       // path to item image
  position: { x: number; y: number }; // position on the beach canvas
}

interface ShopState {
  coins: number;
  purchasedItems: string[]; // item IDs
  buyItem: (item: ShopItem) => boolean;
  addCoins: (amount: number) => void;
}

const ShopContext = createContext<ShopState | undefined>(undefined);

const STORAGE_KEY = "thinkfirst_shop";

function loadState(): { coins: number; purchasedItems: string[] } {
  if (typeof window === "undefined") return { coins: 500, purchasedItems: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { coins: 500, purchasedItems: [] };
}

function saveState(coins: number, purchasedItems: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ coins, purchasedItems }));
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [coins, setCoins] = useState(500);
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const state = loadState();
    setCoins(state.coins);
    setPurchasedItems(state.purchasedItems);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveState(coins, purchasedItems);
  }, [coins, purchasedItems, loaded]);

  const buyItem = (item: ShopItem): boolean => {
    if (coins < item.price || purchasedItems.includes(item.id)) return false;
    setCoins((c) => c - item.price);
    setPurchasedItems((items) => [...items, item.id]);
    return true;
  };

  const addCoins = (amount: number) => {
    setCoins((c) => c + amount);
  };

  return (
    <ShopContext.Provider value={{ coins, purchasedItems, buyItem, addCoins }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within a ShopProvider");
  return context;
}
