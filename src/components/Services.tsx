import { Scissors, Clock, MapPin, Phone } from "lucide-react";

const services = [
  { name: "Herrklippning", price: "350 kr", desc: "Klassisk herrklippning med konsultation" },
  { name: "Skägg trimning", price: "200 kr", desc: "Formning och trimning av skägg" },
  { name: "Klippning & Skägg", price: "500 kr", desc: "Komplett paket med klippning och skägg" },
  { name: "Maskinklippning", price: "250 kr", desc: "Kort klippning med maskin" },
  { name: "Barnklippning", price: "250 kr", desc: "Klippning för barn under 12 år" },
  { name: "Huvudrakning", price: "200 kr", desc: "Slät rakning av huvud" },
];

const Services = () => {
  return (
    <section id="tjanster" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <Scissors className="w-8 h-8 text-primary mx-auto mb-4" />
          <h2 className="text-4xl md:text-5xl font-heading font-semibold mb-4">
            Våra <span className="text-gradient-gold">Tjänster</span>
          </h2>
          <p className="text-muted-foreground text-lg">Kvalitet och stil i varje klipp</p>
        </div>

        <div className="grid gap-1">
          {services.map((service, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-6 px-4 border-b border-border hover:bg-secondary/50 transition-colors group"
            >
              <div>
                <h3 className="text-xl font-heading font-medium group-hover:text-primary transition-colors">
                  {service.name}
                </h3>
                <p className="text-muted-foreground text-sm mt-1">{service.desc}</p>
              </div>
              <span className="text-2xl font-heading text-primary font-semibold whitespace-nowrap ml-4">
                {service.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
