import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { product, addToCart } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Check } from "lucide-react";
import { toast } from "sonner";

const Products = () => {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    addToCart({
      product,
      color: product.colors[selectedColor].name,
      size: selectedSize,
      quantity: 1,
    });
    setAdded(true);
    toast.success("Added to cart!");
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-5xl mb-8">OUR PRODUCTS</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl bg-card border border-border">
              <img
                src={product.colors[selectedColor].image}
                alt={product.colors[selectedColor].name}
                className="w-full aspect-square object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.colors.map((color, i) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(i)}
                  className={`rounded-xl overflow-hidden border-2 transition-all ${
                    i === selectedColor ? "border-primary shadow-glow" : "border-border"
                  }`}
                >
                  <img src={color.image} alt={color.name} className="w-full aspect-square object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-primary mb-2">Uglee Originals</p>
              <h2 className="text-4xl mb-2">{product.name}</h2>
              <p className="font-display text-5xl text-gradient">₹{product.price}</p>
              <p className="text-sm text-muted-foreground mt-1">Inclusive of all taxes</p>
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Color */}
            <div>
              <p className="text-sm font-medium mb-3 uppercase tracking-wider">
                Color: <span className="text-primary">{product.colors[selectedColor].name}</span>
              </p>
              <div className="flex gap-3">
                {product.colors.map((color, i) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(i)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      i === selectedColor ? "border-primary scale-110" : "border-border"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <p className="text-sm font-medium mb-3 uppercase tracking-wider">Size</p>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 rounded-lg border-2 font-display text-lg transition-all ${
                      size === selectedSize
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2">
              {product.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary" />
                  {f}
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleAdd}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-display text-lg tracking-wider py-6"
              >
                <ShoppingBag className="mr-2 w-5 h-5" />
                {added ? "Added!" : "Add to Cart"}
              </Button>
              <Button
                onClick={() => {
                  handleAdd();
                  if (selectedSize) navigate("/cart");
                }}
                variant="outline"
                className="flex-1 border-primary text-primary hover:bg-primary/10 font-display text-lg tracking-wider py-6"
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
