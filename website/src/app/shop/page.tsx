"use client";

import { motion } from "react-motion";
import { useShop } from "@/context/ShopContext";
import { SHOP_ITEMS } from "@/lib/items";
import { Check, Coins, ShoppingBag, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ShopPage() {
  const { coins, purchasedItems, buyItem } = useShop();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-secondary text-primary font-pixel text-[10px] px-4 py-2 rounded-full border border-rose-line tracking-wider mb-4">
            <Coins className="w-4 h-4" /> STREAK SHOP
          </div>
          <h1 className="font-pixel text-2xl md:text-3xl text-foreground mb-4">
            Beach <span className="text-primary">Gallery</span> Shop
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Spend your streak coins to decorate your personal beach achievement gallery!
          </p>

          <div className="inline-flex items-center gap-3 bg-card border-2 border-rose-line rounded-2xl px-6 py-3 shadow-md">
            <Coins className="w-6 h-6 text-primary" />
            <span className="font-pixel text-xl text-foreground">{coins}</span>
            <span className="text-xs text-muted-foreground font-pixel">coins</span>
          </div>
        </div>

        {/* Shop Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {SHOP_ITEMS.map((item) => {
            const isOwned = purchasedItems.includes(item.id);
            const canAfford = coins >= item.price;

            return (
              <div
                key={item.id}
                className={`group relative bg-card rounded-2xl border-2 p-6 transition-all ${
                  isOwned
                    ? "border-green-200 bg-green-50/10"
                    : "border-rose-line hover:border-primary/40 hover:shadow-xl hover:-translate-y-1"
                }`}
              >
                {isOwned && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-1 z-10">
                    <Check className="w-4 h-4" />
                  </div>
                )}

                <div className="flex flex-col items-center text-center">
                  <div className={`mb-6 p-4 rounded-xl transition-transform group-hover:scale-110 ${
                    isOwned ? "text-green-500" : "text-primary"
                  }`}>
                    <div className="[&_svg]:w-12 [&_svg]:h-12">
                      {item.icon}
                    </div>
                  </div>

                  <h3 className="font-pixel text-[12px] text-foreground mb-2">
                    {item.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-6">
                    <Coins className="w-4 h-4 text-primary" />
                    <span className="font-pixel text-sm">{item.price}</span>
                  </div>

                  <Button
                    onClick={() => buyItem(item)}
                    disabled={isOwned || !canAfford}
                    className={`w-full font-pixel text-[10px] py-4 rounded-xl transition-all ${
                      isOwned
                        ? "bg-green-500/20 text-green-600 border-green-200"
                        : "bg-primary text-primary-foreground hover:bg-accent hover:shadow-lg hover:shadow-primary/20"
                    }`}
                  >
                    {isOwned ? "OWNED" : canAfford ? "BUY ITEM" : "NEED MORE COINS"}
                  </Button>
                </div>

                {isOwned && (
                  <div className="mt-4 text-center">
                    <span className="text-[9px] font-pixel text-green-600 block">
                      Added to Gallery!
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
