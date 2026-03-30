import Layout from "@/components/Layout";

const About = () => (
  <Layout>
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-5xl mb-6">ABOUT UGLEE</h1>
      <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
        <p className="text-lg leading-relaxed">
          Born from the streets and bred in rebellion, <span className="text-foreground font-semibold">Uglee</span> is more than a clothing brand — it's a movement. We believe that true style doesn't conform to beauty standards. It breaks them.
        </p>
        <p className="leading-relaxed">
          Founded in 2024, Uglee was created for those who dare to stand out. Our oversized, acid-washed tees are designed for the bold, the creative, and the unapologetically different. Every piece tells a story of individuality and self-expression.
        </p>
        <p className="leading-relaxed">
          We source premium fabrics and use eco-conscious production methods to ensure our tees are not only head-turners but also kind to the planet. Each design is a limited drop, making every piece as unique as the person wearing it.
        </p>
        <h2 className="text-3xl text-foreground mt-10">OUR MISSION</h2>
        <p className="leading-relaxed">
          To redefine streetwear by celebrating imperfection. We make clothes for people who don't follow trends — they set them. Ugly is the new cool.
        </p>
        <h2 className="text-3xl text-foreground mt-10">OUR VALUES</h2>
        <ul className="space-y-3">
          <li><span className="text-primary font-semibold">Authenticity</span> — We keep it real, always.</li>
          <li><span className="text-primary font-semibold">Quality</span> — Premium materials, zero compromise.</li>
          <li><span className="text-primary font-semibold">Sustainability</span> — Fashion that respects the earth.</li>
          <li><span className="text-primary font-semibold">Community</span> — Built by misfits, for misfits.</li>
        </ul>
      </div>
    </div>
  </Layout>
);

export default About;
