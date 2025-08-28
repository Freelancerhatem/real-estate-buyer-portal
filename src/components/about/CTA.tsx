const CTA: React.FC = () => {
  return (
    <section className="bg-white text-black py-20 text-center">
      <h2 className="text-3xl font-semibold mb-6">
        Ready to Find Your Dream Home?
      </h2>
      <p className="text-lg mb-6">
        Contact us today to start your real estate journey.
      </p>
      <a
        href="/contact"
        className="bg-primary text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#FF7D8C] hover:text-white transition-colors"
      >
        Get in Touch
      </a>
    </section>
  );
};

export default CTA;
