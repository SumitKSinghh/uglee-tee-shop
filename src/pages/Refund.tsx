import Layout from "@/components/Layout";

const Refund = () => (
  <Layout>
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-5xl mb-6">REFUND POLICY</h1>
      <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground text-sm leading-relaxed">
        <p>Last updated: March 2026</p>
        <p>We want you to love your Uglee tee. If something isn't right, we've got you covered.</p>

        <h2 className="text-2xl text-foreground mt-8">Returns</h2>
        <p>We accept returns within <span className="text-foreground font-semibold">7 days</span> of delivery. Items must be unworn, unwashed, and in original packaging with all tags attached.</p>

        <h2 className="text-2xl text-foreground mt-8">Refund Process</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Contact us at returns@uglee.in with your order number</li>
          <li>We'll provide a return shipping label</li>
          <li>Once received and inspected, refunds are processed within 5-7 business days</li>
          <li>Refunds are credited to your original payment method</li>
        </ul>

        <h2 className="text-2xl text-foreground mt-8">Exchange</h2>
        <p>We offer free exchanges for size or color swaps (subject to availability). Contact us within 7 days of delivery.</p>

        <h2 className="text-2xl text-foreground mt-8">Non-Returnable Items</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Items worn, washed, or altered</li>
          <li>Items without original tags</li>
          <li>Items returned after 7 days</li>
        </ul>

        <h2 className="text-2xl text-foreground mt-8">Damaged or Defective Products</h2>
        <p>If you receive a damaged or defective item, contact us within 48 hours of delivery with photos. We'll send a replacement or full refund at no extra cost.</p>

        <h2 className="text-2xl text-foreground mt-8">Contact</h2>
        <p>For return/refund queries: <span className="text-primary">returns@uglee.in</span></p>
      </div>
    </div>
  </Layout>
);

export default Refund;
