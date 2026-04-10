"use client";

import { motion } from "framer-motion";
import { useShop, ShopItem } from "@/context/ShopContext";
import { useState } from "react";
import {
  Coins,
  Umbrella,
  Waves,
  Castle,
  TreePalm,
  Shell,
  Sailboat,
  Fish,
  Check,
  Lock,
} from "lucide-react";
import { ReactNode } from "react";

interface ShopItemDisplay extends ShopItem {
  icon: ReactNode;
}

const SHOP_ITEMS_DATA: ShopItemDisplay[] = [
  {
    id: "umbrella",
    name: "Beach Umbrella",
    price: 100,
    image: "umbrella",
    icon: <Umbrella className="w-10 h-10" />,
    position: { x: 30, y: 55 },
  },
  {
    id: "surfboard",
    name: "Surfboard",
    price: 150,
    image: "surfboard",
    icon: <Waves className="w-10 h-10" />,
    position: { x: 70, y: 60 },
  },
  {
    id: "sandcastle",
    name: "Sand Castle",
    price: 80,
    image: "sandcastle",
    icon: <Castle className="w-10 h-10" />,
    position: { x: 50, y: 75 },
  },
  {
    id: "palm-tree",
    name: "Palm Tree",
    price: 200,
    image: "palm-tree",
    icon: <TreePalm className="w-10 h-10" />,
    position: { x: 15, y: 45 },
  },
  {
    id: "crab",
    name: "Beach Crab",
    price: 60,
    image: "crab",
    icon: <Shell className="w-10 h-10" />,
    position: { x: 60, y: 80 },
  },
  {
    id: "shell",
    name: "Seashell",
    price: 40,
    image: "shell",
    icon: <Shell className="w-10 h-10" />,
    position: { x: 40, y: 82 },
  },
  {
    id: "boat",
    name: "Sailboat",
    price: 300,
    image: "boat",
    icon: <Sailboat className="w-10 h-10" />,
    position: { x: 80, y: 30 },
  },
  {
    id: "dolphin",
    name: "Dolphin",
    price: 250,
    image: "dolphin",
    icon: <Fish className="w-10 h-10" />,
    position: { x: 85, y: 40 },
  },
];

// Export for achievements page to use
export const SHOP_ITEMS: ShopItem[] = SHOP_ITEMS_DATA.map(({ icon, ...rest }) => rest);
export const SHOP_ITEMS_WITH_ICONS = SHOP_ITEMS_DATA;

export default function ShopPage() {
  const { coins, purchasedItems, buyItem } = useShop();
  const [notification, setNotification] = useState<string | null>(null);

  const handleBuy = (item: ShopItem) => {
    if (purchasedItems.includes(item.id)) {
      setNotification("Already owned!");
    } else if (coins < item.price) {
      setNotification("Not enough coins!");
    } else {
      const success = buyItem(item);
      if (success) {
        setNotification(`Purchased ${item.name}!`);
      }
    }
    setTimeout(() => setNotification(null), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-600 font-pixel text-[10px] px-4 py-2 rounded-full border border-yellow-200 tracking-wider mb-4">
            <Coins className="w-4 h-4" /> STREAK SHOP
          </span>
          <h1 className="font-pixel text-xl md:text-2xl text-foreground mb-3">
            Beach <span className="text-primary">Gallery</span> Shop
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto mb-4">
            Spend your streak coins to decorate your personal beach
            achievement gallery!
          </p>
          <div className="inline-flex items-center gap-2 bg-card border border-rose-line rounded-full px-5 py-2">
            <Coins className="w-5 h-5 text-primary" />
            <span className="font-pixel text-sm text-primary">{coins}</span>
            <span className="text-xs text-muted-foreground">coins</span>
          </div>
        </motion.div>

        {/* Notification */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-card border border-rose-line shadow-lg rounded-xl px-6 py-3 font-pixel text-[10px] text-foreground"
          >
            {notification}
          </motion.div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {SHOP_ITEMS_DATA.map((item, i) => {
            const owned = purchasedItems.includes(item.id);
            const canAfford = coins >= item.price;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`relative bg-card rounded-xl border p-5 flex flex-col items-center text-center transition-all group ${
                  owned
                    ? "border-green-300 bg-green-50/30"
                    : "border-rose-line hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                }`}
              >
                {/* Item icon */}
                <div className={`mb-3 group-hover:scale-110 transition-transform ${owned ? "text-green-600" : "text-primary"}`}>
                  {item.icon}
                </div>

                {/* Name */}
                <h3 className="font-pixel text-[9px] text-foreground mb-1 tracking-wide">
                  {item.name}
                </h3>

                {/* Price */}
                <p className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                  <Coins className="w-3 h-3" /> {item.price}
                </p>

                {/* Buy button */}
                <button
                  onClick={() => handleBuy(item)}
                  disabled={owned}
                  className={`w-full font-pixel text-[9px] px-3 py-2 rounded-lg transition-all inline-flex items-center justify-center gap-1 ${
                    owned
                      ? "bg-green-100 text-green-700 cursor-default"
                      : canAfford
                      ? "bg-primary text-primary-foreground hover:bg-accent shadow-sm hover:shadow-md"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {owned ? (
                    <><Check className="w-3 h-3" /> OWNED</>
                  ) : canAfford ? (
                    "BUY"
                  ) : (
                    <><Lock className="w-3 h-3" /> NOT ENOUGH</>
                  )}
                </button>

                {/* Owned badge */}
                {owned && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
