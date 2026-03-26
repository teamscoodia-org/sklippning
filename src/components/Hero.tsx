import Image from "next/image";
import heroImage from "@/assets/hero-barbershop.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt="S Barbershop i Bergshamra Solna"
          fill
          priority
          sizes="100vw"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-background/75" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <Image
          src="/logo.svg"
          alt="S Barbershop logo"
          width={144}
          height={144}
          className="mx-auto mb-8 h-28 w-28 animate-fade-in-up border-2 border-primary/30 p-2 md:h-36 md:w-36"
        />
        <h1 className="text-5xl md:text-7xl font-heading font-bold mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
          S <span className="text-gradient-gold">Barbershop</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-light mb-2 animate-fade-in-up" style={{ animationDelay: "0.2s", opacity: 0 }}>
          Herrklippning i Bergshamra och Solna
        </p>
        <p className="text-muted-foreground mb-10 animate-fade-in-up" style={{ animationDelay: "0.3s", opacity: 0 }}>
          Stil, precision och kvalitet sedan dag ett.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.4s", opacity: 0 }}>
          <a
            href="#tjanster"
            className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded hover:opacity-90 transition-opacity"
          >
            Våra Tjänster
          </a>
          <a
            href="#kontakt"
            className="px-8 py-3 border border-primary text-primary font-medium rounded hover:bg-primary/10 transition-colors"
          >
            Hitta Hit
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
