const Mission: React.FC = () => {
  return (
    <section className="bg-white py-20 text-center text-gray-800">
      <div className="max-w-screen-xl mx-auto px-6">
        {/* Mission Section */}
        <h2 className="text-4xl font-semibold mb-6 text-[#FF4C5A]">
          Our Mission
        </h2>

        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed text-gray-600">
          Our mission is to provide seamless, transparent, and customer-centered
          real estate services that make your property journey as simple and
          enjoyable as possible.
        </p>

        {/* Divider */}
        <div className="w-24 h-1 bg-[#FF4C5A] mx-auto my-12 rounded-full" />

        {/* Vision Section */}
        <h2 className="text-4xl font-semibold mb-6 text-[#FF4C5A]">
          Our Vision
        </h2>

        <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-gray-600">
          We aim to be the leading real estate agency in the region, trusted for
          our integrity, professionalism, and commitment to making home-buying
          and selling easy for everyone.
        </p>
      </div>
    </section>
  );
};

export default Mission;
