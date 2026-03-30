import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { product } from "@/lib/store";
import { ArrowRight, Truck, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => (
  <Layout>
    {/* Hero */}
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium">New Drop</p>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl leading-none text-gradient">
            UGLY IS<br />THE NEW<br />COOL
          </h1>
          <p className="text-lg text-muted-foreground max-w-md">
            Bold. Unapologetic. Oversized acid-wash tees that redefine streetwear.
          </p>
          <div className="flex gap-4">
            <Link to="/products">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-display text-lg tracking-wider px-8 py-6">
                Shop Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-3xl" />
          <img
            src={product.images[0]}
            alt={product.name}
            className="relative w-full max-w-lg mx-auto rounded-2xl shadow-glow"
          />
        </div>
      </div>
    </section>

    {/* Featured Product */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h2 className="text-4xl sm:text-5xl text-center mb-4">FEATURED DROP</h2>
      <p className="text-center text-muted-foreground mb-12">Limited edition acid-wash collection</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {product.colors.map((color) => (
          <Link to="/products" key={color.name} className="group">
            <div className="relative overflow-hidden rounded-xl bg-card border border-border group-hover:border-primary/50 transition-all duration-300">
              <img src={color.image} alt={color.name} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4">
                <p className="text-sm font-medium">{color.name}</p>
                <p className="text-primary font-display text-xl">₹{product.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>

    {/* Trust Badges */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Truck, title: "Free Shipping", desc: "On orders above ₹999" },
          { icon: Shield, title: "Secure Payments", desc: "Powered by Razorpay" },
          { icon: RotateCcw, title: "Easy Returns", desc: "7-day return policy" },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-4 p-6 rounded-xl bg-card border border-border">
            <div className="p-3 rounded-lg bg-primary/10">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-xl">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  </Layout>
);

export default Index;
