import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      action,
      amount,
      customer,
      items,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id,
    } = await req.json();

    const RAZORPAY_KEY_ID = "rzp_live_RnQCHNCLW8cnMI";
    const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!RAZORPAY_KEY_SECRET) {
      return new Response(
        JSON.stringify({ error: "Razorpay secret not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // CREATE ORDER
    if (action === "create_order") {
      // Validate inputs
      if (!amount || !customer || !items || !Array.isArray(items) || items.length === 0) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { name, email, phone, address, city, state, pincode } = customer;
      if (!name || !email || !phone || !address || !city || !state || !pincode) {
        return new Response(
          JSON.stringify({ error: "All customer fields are required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Create Razorpay order
      const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " + btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`),
        },
        body: JSON.stringify({
          amount: amount * 100,
          currency: "INR",
          receipt: `order_${Date.now()}`,
        }),
      });

      if (!rzpRes.ok) {
        const err = await rzpRes.text();
        console.error("Razorpay error:", err);
        return new Response(
          JSON.stringify({ error: "Failed to create Razorpay order" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const rzpOrder = await rzpRes.json();

      // Save order to DB
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          razorpay_order_id: rzpOrder.id,
          total_amount: amount,
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          shipping_address: address,
          shipping_city: city,
          shipping_state: state,
          shipping_pincode: pincode,
        })
        .select()
        .single();

      if (orderErr) {
        console.error("DB error:", orderErr);
        return new Response(
          JSON.stringify({ error: "Failed to save order" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Save order items
      const orderItems = items.map((item: any) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsErr } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsErr) {
        console.error("Items DB error:", itemsErr);
      }

      return new Response(
        JSON.stringify({
          razorpay_order_id: rzpOrder.id,
          order_id: order.id,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          key: RAZORPAY_KEY_ID,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // VERIFY PAYMENT
    if (action === "verify_payment") {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order_id) {
        return new Response(
          JSON.stringify({ error: "Missing payment verification fields" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Verify signature using HMAC SHA256
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(RAZORPAY_KEY_SECRET),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );

      const data = `${razorpay_order_id}|${razorpay_payment_id}`;
      const signatureBuffer = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(data)
      );

      const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      if (expectedSignature !== razorpay_signature) {
        return new Response(
          JSON.stringify({ error: "Payment verification failed" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Update order status
      const { error: updateErr } = await supabase
        .from("orders")
        .update({
          status: "paid",
          razorpay_payment_id,
        })
        .eq("id", order_id);

      if (updateErr) {
        console.error("Update error:", updateErr);
        return new Response(
          JSON.stringify({ error: "Failed to update order" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: "Payment verified" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
