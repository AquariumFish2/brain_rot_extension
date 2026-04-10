"use client";

import { motion } from "framer-motion";
import { useShop } from "@/context/ShopContext";
import { SHOP_ITEMS, SHOP_ITEMS_WITH_ICONS } from "@/app/shop/page";
import Link from "next/link";
import {
  Palmtree,
  Sun,
  Cloud,
  Waves,
  Check,
  ShoppingBag,
  Umbrella,
  Castle,
  TreePalm,
  Shell,
  Sailboat,
  Fish,
} from "lucide-react";

// Map item IDs to their Lucide icons for rendering on the beach
const ITEM_ICON_MAP: Record<string, React.ReactNode> = {
  umbrella: <Umbrella className="w-8 h-8 md:w-10 md:h-10" />,
  surfboard: <Waves className="w-8 h-8 md:w-10 md:h-10" />,
  sandcastle: <Castle className="w-8 h-8 md:w-10 md:h-10" />,
  "palm-tree": <TreePalm className="w-8 h-8 md:w-10 md:h-10" />,
  crab: <Shell className="w-8 h-8 md:w-10 md:h-10" />,
  shell: <Shell className="w-8 h-8 md:w-10 md:h-10" />,
  boat: <Sailboat className="w-8 h-8 md:w-10 md:h-10" />,
  dolphin: <Fish className="w-8 h-8 md:w-10 md:h-10" />,
};

export default function AchievementsPage() {
  const { purchasedItems } = useShop();

  const ownedItems = SHOP_ITEMS.filter((item) =>
    purchasedItems.includes(item.id)
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-500 font-pixel text-[10px] px-4 py-2 rounded-full border border-blue-200 tracking-wider mb-4">
            <Palmtree className="w-4 h-4" /> ACHIEVEMENT GALLERY
          </span>
          <h1 className="font-pixel text-xl md:text-2xl text-foreground mb-3">
            Your <span className="text-primary">Beach</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Items you buy from the shop appear here on your beach. Keep your
            streak going to earn more coins!
          </p>
        </motion.div>

        {/* Beach Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative w-full rounded-2xl border-2 border-rose-line overflow-hidden shadow-xl"
          style={{ aspectRatio: "16/9" }}
        >
          {/* Beach background — layered gradient simulating sky, sea, sand */}
          <div className="absolute inset-0">
            {/* Sky */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, #87CEEB 0%, #B0E0E6 35%, #40A0D0 45%, #2E8BC0 50%, #F5DEB3 50%, #EDC9AF 70%, #DEB887 100%)",
              }}
            />
            {/* Sun */}
            <div className="absolute" style={{ top: "8%", right: "15%" }}>
              <Sun className="w-14 h-14 text-yellow-400 drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]" />
            </div>
            {/* Clouds */}
            <Cloud className="absolute w-12 h-12 text-white/70" style={{ top: "10%", left: "10%" }} />
            <Cloud className="absolute w-10 h-10 text-white/60" style={{ top: "15%", left: "30%" }} />
            <Cloud className="absolute w-8 h-8 text-white/50" style={{ top: "8%", left: "55%" }} />
            {/* Waves */}
            <div className="absolute w-full flex justify-center gap-4 opacity-30" style={{ top: "47%" }}>
              <Waves className="w-8 h-8 text-blue-400" />
              <Waves className="w-8 h-8 text-blue-400" />
              <Waves className="w-8 h-8 text-blue-400" />
              <Waves className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          {/* Placed items */}
          {ownedItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="absolute cursor-pointer group text-primary drop-shadow-lg"
              style={{
                left: `${item.position.x}%`,
                top: `${item.position.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              whileHover={{ scale: 1.3 }}
              title={item.name}
            >
              {ITEM_ICON_MAP[item.id] || <Shell className="w-8 h-8" />}
              {/* Tooltip */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-card border border-rose-line rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                <span className="font-pixel text-[8px] text-foreground">
                  {item.name}
                </span>
              </div>
            </motion.div>
          ))}

          {/* Empty state */}
          {ownedItems.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
              <Palmtree className="w-12 h-12 text-white mb-4 drop-shadow-md" />
              <p className="font-pixel text-[11px] text-white drop-shadow-md mb-2">
                Your beach is empty!
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1 font-pixel text-[9px] bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-accent transition-colors"
              >
                <ShoppingBag className="w-3 h-3" /> VISIT SHOP
              </Link>
            </div>
          )}
        </motion.div>

        {/* Owned items list */}
        {ownedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <h3 className="font-pixel text-[10px] text-muted-foreground mb-4 tracking-wider">
              COLLECTED ITEMS ({ownedItems.length}/{SHOP_ITEMS.length})
            </h3>
            <div className="flex flex-wrap gap-3">
              {SHOP_ITEMS_WITH_ICONS.map((item) => {
                const owned = purchasedItems.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${
                      owned
                        ? "bg-card border-green-300 text-foreground"
                        : "bg-muted/30 border-rose-line text-muted-foreground opacity-50"
                    }`}
                  >
                    <div className={`[&_svg]:w-4 [&_svg]:h-4 flex-shrink-0 ${owned ? "text-primary" : "text-muted-foreground grayscale"}`}>
                      {item.icon}
                    </div>
                    <span className="font-pixel text-[8px]">{item.name}</span>
                    {owned && <Check className="w-3 h-3 text-green-500 flex-shrink-0" />}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
