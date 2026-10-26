import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { formatPrice } from "../config/site";

const CONDITION_LABEL = { used: "Used", refurbished: "Refurbished", new: "New" };
const AVAILABILITY_LABEL = { reserved: "Reserved", sold: "Sold" };

export default function ProductCard({ product, index = 0 }) {
  const mainImage = product.images?.find((i) => i.isMain) || product.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: Math.min(index * 0.05, 0.35) }}
    >
      <Link
        to={`/catalogue/${product.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-steel bg-graphite transition-all duration-300 ease-premium hover:-translate-y-1 hover:border-burgundy/70 hover:shadow-[0_24px_50px_-24px_rgba(122,30,44,0.45)]"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-onyx">
          {mainImage ? (
            <img
              src={mainImage.url}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.06]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-ash">No image</div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx/70 via-transparent to-transparent" />

          <span className="absolute left-3 top-3 border border-steel bg-onyx/80 px-2 py-1 font-display text-[10px] font-medium tracking-wide text-alloy backdrop-blur">
            {CONDITION_LABEL[product.condition]}
          </span>

          {product.availability !== "in_stock" && (
            <span className="absolute right-3 top-3 border border-steel bg-onyx/80 px-2 py-1 font-display text-[10px] font-medium tracking-wide text-ash backdrop-blur">
              {AVAILABILITY_LABEL[product.availability] || "Sold"}
            </span>
          )}

          <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center bg-burgundy py-2 font-display text-xs font-semibold tracking-wide text-alloy transition-transform duration-300 ease-premium group-hover:translate-y-0">
            View Details
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-4">
          <span className="font-display text-[11px] tracking-wide text-ash">{product.category}</span>
          <h3 className="font-display text-base font-medium leading-snug text-alloy">{product.name}</h3>
          {(product.vehicleMake || product.vehicleModel) && (
            <p className="text-xs text-ash">
              {product.vehicleMake} {product.vehicleModel} {product.compatibleYears ? `· ${product.compatibleYears}` : ""}
            </p>
          )}
          <div className="mt-auto flex items-center justify-between pt-2">
            <span className="font-display text-lg font-semibold text-alloy">{formatPrice(product.price)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
