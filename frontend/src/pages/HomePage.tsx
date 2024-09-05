import React, { useState, useEffect } from "react";
import { ParallaxProvider, Parallax } from "react-scroll-parallax";
import { Element } from "react-scroll";

interface Card {
  title: string;
  image: string;
}

const cards: Card[] = [
  {
    title: "Fintech Platform",
    image:
      "https://images.unsplash.com/photo-1560185127-6a8c1f75b22c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
  {
    title: "Digital Banking",
    image:
      "https://images.unsplash.com/photo-1573164574472-cb89e39749d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
  {
    title: "AI in Finance",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
];

const HomePage: React.FC = () => {
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      // Calculate scroll thresholds for card changes
      const cardChangePoints = Array.from(
        { length: cards.length },
        (_, i) => (i + 1) * windowHeight * 0.5
      );

      // Determine which card should be active based on scroll position
      const newActiveCard = cardChangePoints.findIndex(
        (point) => scrollPosition < point
      );

      if (newActiveCard !== -1 && newActiveCard !== activeCard) {
        setActiveCard(newActiveCard);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeCard]);

  return (
    <ParallaxProvider>
      {/* Hero Section */}
      <Element name="hero">
        <Parallax
          speed={-30}
          className="h-screen flex items-center justify-center bg-gray-900"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1532614338840-ab30cf10ed22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600')",
            backgroundSize: "cover",
          }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white">
            Fintech Innovation
          </h1>
        </Parallax>
      </Element>

      {/* Services Section with Parallax */}
      <Element name="services">
        <section className="relative min-h-screen flex items-center justify-center bg-gray-800 p-10">
          <div className="max-w-2xl text-white">
            <h2 className="text-4xl font-semibold mb-6">Our Services</h2>
            <p className="text-lg leading-relaxed text-gray-300">
              Discover our range of innovative financial solutions that help you
              grow your business.
            </p>
          </div>

          {/* Service Card with Parallax Effect */}
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2 w-80">
            <Parallax
              translateY={[0, 30]}
              className="w-80 h-96 shadow-lg rounded-lg overflow-hidden"
            >
              {cards.map((card, index) => (
                <div
                  key={index}
                  className={`w-full h-full bg-cover bg-center transition-opacity duration-500 ${
                    index === activeCard ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ backgroundImage: `url(${card.image})` }}
                >
                  <div className="p-10 bg-white bg-opacity-80 h-full flex items-center justify-center">
                    <h3 className="text-xl font-bold">{card.title}</h3>
                  </div>
                </div>
              ))}
            </Parallax>
          </div>
        </section>
      </Element>

      {/* Security Section with Parallax */}
      <Element name="security">
        <section className="relative min-h-screen flex items-center justify-center bg-gray-700 p-10">
          <div className="max-w-2xl text-white">
            <h2 className="text-4xl font-semibold mb-6">Security</h2>
            <p className="text-lg leading-relaxed text-gray-300">
              Secure your financial transactions with cutting-edge blockchain
              technology.
            </p>
          </div>

          {/* Security Card with Parallax Effect */}
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2 w-80">
            <Parallax
              translateY={[0, 30]}
              className="w-80 h-96 shadow-lg rounded-lg overflow-hidden"
            >
              {cards.map((card, index) => (
                <div
                  key={index}
                  className={`w-full h-full bg-cover bg-center transition-opacity duration-500 ${
                    index === activeCard ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ backgroundImage: `url(${card.image})` }}
                >
                  <div className="p-10 bg-white bg-opacity-80 h-full flex items-center justify-center">
                    <h3 className="text-xl font-bold">{card.title}</h3>
                  </div>
                </div>
              ))}
            </Parallax>
          </div>
        </section>
      </Element>

      {/* FAQ Section */}
      <Element name="faq">
        <section className="min-h-screen flex items-center justify-center bg-gray-600 p-10">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-semibold mb-6 text-white">
              Get in Touch
            </h2>
            <p className="text-lg leading-relaxed text-gray-300">
              Have questions or want to learn more about our services? FAQ us
              today.
            </p>
          </div>
        </section>
      </Element>
    </ParallaxProvider>
  );
};

export default HomePage;
