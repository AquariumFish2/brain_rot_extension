import { ReactNode } from "react";
import { 
  GiPalmTree, 
  GiSandCastle, 
  GiSurfBoard, 
  GiSailboat, 
  GiSpiralShell, 
  GiCrab, 
  GiDolphin, 
  GiCoconuts,
  GiWaves
} from "react-icons/gi";
import { PiIsland, PiStar } from "react-icons/pi";
import { FaUmbrellaBeach } from "react-icons/fa";

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  icon: ReactNode;
  position: { x: number; y: number }; // Relative position on the beach canvas (0-100)
}

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: "palm-tree",
    name: "Palm Tree",
    price: 200,
    icon: <GiPalmTree className="w-10 h-10" />,
    position: { x: 80, y: 30 },
  },
  {
    id: "beach-umbrella",
    name: "Beach Umbrella",
    price: 100,
    icon: <FaUmbrellaBeach className="w-10 h-10" />,
    position: { x: 20, y: 70 },
  },
  {
    id: "sand-castle",
    name: "Sand Castle",
    price: 80,
    icon: <GiSandCastle className="w-10 h-10" />,
    position: { x: 50, y: 60 },
  },
  {
    id: "starfish",
    name: "Golden Starfish",
    price: 50,
    icon: <PiStar className="w-10 h-10" />,
    position: { x: 35, y: 85 },
  },
  {
    id: "surfboard",
    name: "Pro Surfboard",
    price: 150,
    icon: <GiSurfBoard className="w-10 h-10" />,
    position: { x: 65, y: 75 },
  },
  {
    id: "seashell",
    name: "Rare Seashell",
    price: 30,
    icon: <GiSpiralShell className="w-10 h-10" />,
    position: { x: 15, y: 90 },
  },
  {
    id: "crab",
    name: "Beach Crab",
    price: 60,
    icon: <GiCrab className="w-10 h-10" />,
    position: { x: 45, y: 80 },
  },
  {
    id: "sailboat",
    name: "Sailboat",
    price: 300,
    icon: <GiSailboat className="w-10 h-10" />,
    position: { x: 20, y: 20 },
  },
  {
    id: "dolphin",
    name: "Jumping Dolphin",
    price: 250,
    icon: <GiDolphin className="w-10 h-10" />,
    position: { x: 75, y: 15 },
  },
  {
    id: "coconut",
    name: "Fresh Coconut",
    price: 40,
    icon: <GiCoconuts className="w-10 h-10" />,
    position: { x: 85, y: 45 },
  },
  {
    id: "island",
    name: "Dream Island",
    price: 500,
    icon: <PiIsland className="w-10 h-10" />,
    position: { x: 50, y: 10 },
  },
  {
    id: "waves",
    name: "Ocean Waves",
    price: 120,
    icon: <GiWaves className="w-10 h-10" />,
    position: { x: 50, y: 40 },
  }
];

export function getItemById(id: string) {
  return SHOP_ITEMS.find(item => item.id === id);
}
