import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import SEO from "../components/SEO";
import WhatsAppButton from "../components/WhatsAppButton";
import InquiryModal from "../components/InquiryModal";
import { fetchProductBySlug } from "../services/api";
import { formatPrice } from "../config/site";

const CONDITION_LABEL = { used: "Used", refurbished: "Refurbished", new: "New" };
const AVAILABILITY_LABEL = { in_stock: "In Stock", reserved: "Reserved", sold: "Sold" };

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    fetchProductBySlug(slug)
      .then((d) => { setProduct(d.product); setActiveImage(0); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="section py-24 text-center text-ash">Loading…</div>;
  }

  if (notFound || !product) {
    return (
      <div className="section py-24 text-center">
        <p className="text-ash">This part is no longer available.</p>
        <Link to="/catalogue" className="btn-secondary mt-6 inline-flex">Back to catalogue</Link>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [];
  const mainImage = images[activeImage] || images[0];

  return (
    <>
      <SEO title={product.name} description={product.shortDescription} image={mainImage?.url} />
      <section className="section py-12">
        <Link to="/catalogue" className="font-display text-sm text-ash transition-colors hover:text-crimson">← Back to catalogue</Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="aspect-[4/3] overflow-hidden rounded-sm border border-steel bg-graphite">
              {mainImage ? (
                <img src={mainImage.url} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-ash">No image</div>
              )}
            </motion.div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-3 overflow-x-auto">
                {images.map((img, idx) => (
                  <button key={idx} onClick={() => setActiveImage(idx)} className={`h-20 w-20 shrink-0 overflow-hidden rounded-sm border transition-colors duration-300 ${idx === activeImage ? "border-burgundy" : "border-steel"}`}>
                    <img src={img.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <span className="font-display text-xs tracking-wide text-ash">{product.category}</span>
            <h1 className="mt-2 font-display text-3xl font-semibold text-alloy sm:text-4xl">{product.name}</h1>
            <p className="mt-3 font-display text-2xl font-semibold text-alloy">{formatPrice(product.price)}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-sm border border-steel px-3 py-1 font-display text-xs text-ash">{CONDITION_LABEL[product.condition]}</span>
              <span className="rounded-sm border border-steel px-3 py-1 font-display text-xs text-ash">{AVAILABILITY_LABEL[product.availability]}</span>
            </div>

            {(product.vehicleMake || product.vehicleModel) && (
              <div className="mt-6 border-t border-steel pt-4">
                <h2 className="font-display text-sm tracking-wide text-alloy">Compatibility</h2>
                <p className="mt-1 text-sm text-ash">{product.vehicleMake} {product.vehicleModel} {product.compatibleYears ? `· ${product.compatibleYears}` : ""}</p>
              </div>
            )}

            <div className="mt-6 border-t border-steel pt-4">
              <h2 className="font-display text-sm tracking-wide text-alloy">Description</h2>
              <p className="mt-2 text-sm leading-relaxed text-ash">{product.description}</p>
            </div>

            {product.specifications?.length > 0 && (
              <div className="mt-6 border-t border-steel pt-4">
                <h2 className="font-display text-sm tracking-wide text-alloy">Specifications</h2>
                <dl className="mt-2 grid grid-cols-2 gap-y-2 text-sm">
                  {product.specifications.map((s, i) => (
                    <div key={i} className="contents">
                      <dt className="text-ash">{s.label}</dt>
                      <dd className="text-alloy">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => setInquiryOpen(true)} className="btn-primary flex-1">
                Contact About This Part
              </button>
              <WhatsAppButton productName={product.name} />
            </div>
          </div>
        </div>

        <InquiryModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} partName={product.name} />
      </section>
    </>
  );
}
