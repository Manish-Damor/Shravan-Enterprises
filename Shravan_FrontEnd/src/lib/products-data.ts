import fiberglass from "@/assets/fiberglass.jpg";
import resin from "@/assets/resin.jpg";
import vacuum from "@/assets/vacuum.jpg";
import accessories from "@/assets/accessories.jpg";
import stonecare from "@/assets/stonecare.jpg";

export type Category = {
  slug: string;
  title: string;
  tagline: string;
  image: string;
  items: string[];
};

export const categories: Category[] = [
  {
    slug: "fiber-reinforcement",
    title: "Fiber Reinforcement",
    tagline: "Industrial-grade fiberglass reinforcements for high-performance composites.",
    image: fiberglass,
    items: ["CSM (Chopped Strand Mat)", "Woven Fabric", "Roving Yarn", "Chopped Strands", "Knitted Infusion Mesh"],
  },
  {
    slug: "resin-chemicals",
    title: "Resin & Chemicals",
    tagline: "Premium polyester, vinyl ester and epoxy resins with full chemistry support.",
    image: resin,
    items: ["Unsaturated Polyester Resin", "GP Resin", "Rooflite Resin", "Isophthalic Resin", "Vinyl Ester Resin", "Gelcoat Products", "Catalyst (M.E.K.P)", "Cobalt Octate", "Acetone", "Pigments"],
  },
  {
    slug: "vacuum-infusion",
    title: "Vacuum Infusion",
    tagline: "Complete vacuum bagging and infusion consumables for premium composite layups.",
    image: vacuum,
    items: ["Vacuum Bond Epoxy", "Vacuum Bagging Film", "Sealant Tape", "Vacuum Inlet Port", "Feed Hose Pipe"],
  },
  {
    slug: "frp-accessories",
    title: "FRP Accessories",
    tagline: "Professional tools and consumables for clean, efficient FRP fabrication.",
    image: accessories,
    items: ["Air Removal Rollers", "Paint Tray", "Foam Roller", "Fur Roller", "Paint Brushes", "Adhesive Tape", "Mould Wax", "PVA Powder", "Fillers", "Release Agents"],
  },
  {
    slug: "stone-Pro",
    title: "Stone Pro & Surface",
    tagline: "Sealers and protection systems engineered for Italian marble & granite.",
    image: stonecare,
    items: ["Top Surface Sealer", "Stone Protection Products", "Vacuum Bond Solutions", "Marble & Granite Surface Products"],
  },
];