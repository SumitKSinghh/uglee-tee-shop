import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { getCart, saveCart, removeFromCart, clearCart, type CartItem } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Minus, ShoppingBag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface ShippingInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const Cart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState<"cart" | "shipping">("cart");
  const [loading, setLoading] = useState(false);
  const [shipping, setShipping] = useState<ShippingInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

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

  const validateShipping = (): boolean => {
    const { name, email, phone, address, city, state, pincode } = shipping;
    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      toast.error("Please fill all fields");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email");
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }
    if (!/^\d{6}$/.test(pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return false;
    }
    return true;
  };

  const handleCheckout = async () => {
    if (!validateShipping()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("razorpay-order", {
        body: {
          action: "create_order",
          amount: total,
          customer: shipping,
          items: cart.map((item) => ({
            product_id: item.product.id,
            product_name: item.product.name,
            color: item.color,
            size: item.size,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      });

      if (error || data?.error) {
        toast.error(data?.error || "Failed to create order. Please try again.");
        setLoading(false);
        return;
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Uglee",
        description: "T-shirt Purchase",
        order_id: data.razorpay_order_id,
        handler: async function (response: any) {
          // Verify payment
          const { data: verifyData, error: verifyError } = await supabase.functions.invoke("razorpay-order", {
            body: {
              action: "verify_payment",
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: data.order_id,
            },
          });

          if (verifyError || verifyData?.error) {
            toast.error("Payment verification failed. Contact support.");
            return;
          }

          clearCart();
          setCart([]);
          setStep("cart");
          toast.success("Payment successful! Your order has been placed. 🎉");
        },
        prefill: {
          name: shipping.name,
          email: shipping.email,
          contact: shipping.phone,
        },
        theme: {
          color: "#d4952a",
        },
        modal: {
          ondismiss: function () {
            toast.info("Payment cancelled");
          },
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error("Payment gateway loading. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
        <h1 className="text-5xl mb-8">{step === "cart" ? "YOUR CART" : "SHIPPING DETAILS"}</h1>

        {step === "cart" && (
          <>
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
                onClick={() => setStep("shipping")}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display text-lg tracking-wider py-6"
              >
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}

        {step === "shipping" && (
          <div className="space-y-6">
            <button
              onClick={() => setStep("cart")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Cart
            </button>

            <div className="p-6 rounded-xl bg-card border border-border space-y-5">
              <h2 className="font-display text-2xl tracking-wider">CONTACT INFORMATION</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={shipping.name}
                    onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={shipping.email}
                    onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="9876543210"
                    value={shipping.phone}
                    onChange={(e) => setShipping({ ...shipping, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                    className="bg-background border-border"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border space-y-5">
              <h2 className="font-display text-2xl tracking-wider">SHIPPING ADDRESS</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    placeholder="House No, Street, Locality"
                    value={shipping.address}
                    onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="Mumbai"
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      placeholder="Maharashtra"
                      value={shipping.state}
                      onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      placeholder="400001"
                      value={shipping.pincode}
                      onChange={(e) => setShipping({ ...shipping, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                      className="bg-background border-border"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border space-y-4">
              <h2 className="font-display text-2xl tracking-wider">ORDER SUMMARY</h2>
              {cart.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.product.name} ({item.color}, {item.size}) × {item.quantity}
                  </span>
                  <span>₹{item.product.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t border-border pt-4 flex justify-between text-lg">
                <span className="text-muted-foreground">Total</span>
                <span className="font-display text-2xl text-primary">₹{total}</span>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display text-lg tracking-wider py-6"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                  </span>
                ) : (
                  `Pay ₹${total} with Razorpay`
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
