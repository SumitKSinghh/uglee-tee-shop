import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-card border-t border-border mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-display text-3xl text-gradient mb-3">UGLEE</h3>
          <p className="text-sm text-muted-foreground">Embrace the ugly-cool. Streetwear that speaks louder than words.</p>
        </div>
        <div>
          <h4 className="font-display text-lg mb-3 text-foreground">Shop</h4>
          <div className="space-y-2">
            <Link to="/products" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">All Products</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display text-lg mb-3 text-foreground">Company</h4>
          <div className="space-y-2">
            <Link to="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link>
            <Link to="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display text-lg mb-3 text-foreground">Policies</h4>
          <div className="space-y-2">
            <Link to="/privacy" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/refund" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-border text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Uglee. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
