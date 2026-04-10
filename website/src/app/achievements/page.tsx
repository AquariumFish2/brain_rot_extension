"use client";

import { useShop } from "@/context/ShopContext";
import { SHOP_ITEMS } from "@/lib/items";
import { motion } from "framer-motion";
import { Trees as PalmTree, Waves, House as SandCastle, Umbrella, Check, Sparkles, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AchievementsPage() {
  const { purchasedItems } = useShop();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Get owned items detailed data
  const ownedItems = SHOP_ITEMS.filter(item => purchasedItems.includes(item.id));

  return (
    <div className="min-h-screen bg-background flex flex-col pt-16">
      <div className="flex-1 relative overflow-hidden flex flex-col">
        {/* Beach Canvas */}
        <div 
          className="flex-1 relative min-h-[500px]"
          style={{
            background: "linear-gradient(to bottom, #87CEEB 0%, #E0F7FA 40%, #FFE082 60%, #FFD54F 100%)",
          }}
        >
          {/* Ocean Waves Animation */}
          <div className="absolute top-[40%] inset-0">
            <motion.div
              animate={{ y: [0, 8, 0], x: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-8 bg-white/20 blur-md"
            />
          </div>

          {/* Grid Overlay for feel */}
          <div className="absolute inset-0 opacity-[0.05]" style={{
            backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "50px 50px"
          }} />

          {/* Render Purchased Items */}
          {ownedItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute group z-10"
              style={{
                left: `${item.position.x}%`,
                top: `${item.position.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="relative cursor-pointer">
                {/* Visual Icon */}
                <div className="text-primary drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:scale-125 transition-transform duration-300 [&_svg]:w-14 [&_svg]:h-14 lg:[&_svg]:w-20 lg:[&_svg]:h-20">
                  {item.icon}
                </div>
                
                {/* Floating label on hover */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap bg-background/90 border border-rose-line px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="font-pixel text-[8px] tracking-tight">{item.name}</span>
                </div>
                
                {/* Particle effect around new items */}
                <motion.div
                  className="absolute inset-0 text-accent opacity-50"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Sparkles className="w-full h-full p-2" />
                </motion.div>
              </div>
            </motion.div>
          ))}

          {/* Empty State Instructions */}
          {purchasedItems.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl text-center max-w-sm">
                <MapPin className="w-12 h-12 text-primary/40 mx-auto mb-4" />
                <h2 className="font-pixel text-lg mb-2">Your Beach is Empty</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Visit the shop to unlock items with your streak coins!
                </p>
                <Link 
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-pixel text-[10px] px-6 py-3 rounded-xl hover:bg-accent transition-all"
                >
                  GO TO SHOP
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Collection Sidebar/Panel */}
        <div className="bg-card border-t border-rose-line p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-pixel text-lg text-foreground mb-1">Items Collection</h2>
                <p className="text-xs text-muted-foreground">{purchasedItems.length} of {SHOP_ITEMS.length} collected</p>
              </div>
              <Link href="/shop" className="text-primary font-pixel text-[10px] hover:underline underline-offset-4">
                GET MORE COINS
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {SHOP_ITEMS.map((item) => {
                const owned = purchasedItems.includes(item.id);
                return (
                  <div 
                    key={item.id}
                    className={`relative aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all p-4 ${
                      owned 
                        ? "bg-secondary/50 border-primary/20 text-primary shadow-inner" 
                        : "bg-muted/30 border-rose-line text-muted-foreground opacity-50 grayscale"
                    }`}
                  >
                    <div className="[&_svg]:w-6 [&_svg]:h-6 flex-shrink-0">
                      {item.icon}
                    </div>
                    <span className="font-pixel text-[8px] text-center">{item.name}</span>
                    {owned && <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5"><Check className="w-3 h-3 text-white" /></div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
