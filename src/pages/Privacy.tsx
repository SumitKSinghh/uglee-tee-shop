import Layout from "@/components/Layout";

const Privacy = () => (
  <Layout>
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-5xl mb-6">PRIVACY POLICY</h1>
      <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground text-sm leading-relaxed">
        <p>Last updated: March 2026</p>
        <p>At Uglee, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information when you visit our website or make a purchase.</p>

        <h2 className="text-2xl text-foreground mt-8">Information We Collect</h2>
        <p>We collect information you provide directly, including: name, email address, shipping address, phone number, and payment information. We also automatically collect certain information about your device and browsing behavior.</p>

        <h2 className="text-2xl text-foreground mt-8">How We Use Your Information</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>To process and fulfill your orders</li>
          <li>To communicate with you about your orders</li>
          <li>To send promotional offers (with your consent)</li>
          <li>To improve our website and services</li>
          <li>To prevent fraud and ensure security</li>
        </ul>

        <h2 className="text-2xl text-foreground mt-8">Payment Security</h2>
        <p>All payments are processed securely through Razorpay. We do not store your credit/debit card details on our servers. Razorpay complies with PCI DSS standards for secure payment processing.</p>

        <h2 className="text-2xl text-foreground mt-8">Data Sharing</h2>
        <p>We do not sell your personal information. We may share data with trusted service providers (shipping partners, payment processors) solely for order fulfillment.</p>

        <h2 className="text-2xl text-foreground mt-8">Your Rights</h2>
        <p>You may request access to, correction of, or deletion of your personal data by contacting us at privacy@uglee.in.</p>

        <h2 className="text-2xl text-foreground mt-8">Contact</h2>
        <p>For privacy-related inquiries, email us at <span className="text-primary">privacy@uglee.in</span>.</p>
      </div>
    </div>
  </Layout>
);

export default Privacy;
