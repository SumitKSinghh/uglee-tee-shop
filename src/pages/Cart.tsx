import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { getCart, saveCart, removeFromCart, clearCart, type CartItem } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Cart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const updateQty = (index: number, delta: number) => {
    const updated = [...cart];
    updated[index].quantity = Math.max(1, updated[index].quantity + delta);
    saveCart(updated);
    setCart(updated);
  };

  const remove = (index: number) => {
    removeFromCart(index);
    setCart(getCart());
    toast.success("Item removed");
  };

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = () => {
    const options = {
      key: "rzp_test_XXXXXXXXXXXXXXX", // Replace with your Razorpay key
      amount: total * 100,
      currency: "INR",
      name: "Uglee",
      description: "T-shirt Purchase",
      image: "",
      handler: function () {
        clearCart();
        setCart([]);
        toast.success("Payment successful! Order placed.");
      },
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      theme: {
        color: "#d4952a",
      },
    };

    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      toast.error("Payment gateway loading. Please try again.");
    }
  };

  if (cart.length === 0) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-5xl mb-4">YOUR CART IS EMPTY</h1>
          <p className="text-muted-foreground mb-8">Looks like you haven't added anything yet.</p>
          <Link to="/products">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-display text-lg tracking-wider px-8 py-6">
              Shop Now
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-5xl mb-8">YOUR CART</h1>

        <div className="space-y-4">
          {cart.map((item, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl bg-card border border-border">
              <img
                src={item.product.colors.find((c) => c.name === item.color)?.image || item.product.images[0]}
                alt={item.product.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-xl truncate">{item.product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.color} · {item.size}
                </p>
                <p className="text-primary font-display text-xl mt-1">₹{item.product.price * item.quantity}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 border border-border rounded-lg">
                  <button onClick={() => updateQty(i, -1)} className="p-2 hover:text-primary transition-colors">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQty(i, 1)} className="p-2 hover:text-primary transition-colors">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 rounded-xl bg-card border border-border space-y-4">
          <div className="flex justify-between text-lg">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-display text-2xl">₹{total}</span>
          </div>
          <p className="text-sm text-muted-foreground">Shipping calculated at checkout</p>
          <Button
            onClick={handleCheckout}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display text-lg tracking-wider py-6"
          >
            Pay with Razorpay · ₹{total}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
