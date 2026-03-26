import { MapPin, Phone, Clock } from "lucide-react";

const Contact = () => {
  return (
    <section id="kontakt" className="py-24 px-6 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <MapPin className="w-8 h-8 text-primary mx-auto mb-4" />
          <h2 className="text-4xl md:text-5xl font-heading font-semibold mb-4">
            Hitta <span className="text-gradient-gold">Hit</span>
          </h2>
          <p className="text-muted-foreground text-lg">Välkommen till S Barbershop i Solna</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-primary mt-1 shrink-0" />
              <div>
                <h3 className="font-heading text-lg font-medium mb-1">Adress</h3>
                <p className="text-muted-foreground">
                  S Barbershop
                  <br />
                  Rådjursstigen 7, 170 76 Solna
                </p>
                <a
                  href="https://maps.app.goo.gl/SKQbtgeGRWNutWBB7?g_st=aw"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-2 text-primary hover:underline"
                >
                  Öppna i Google Maps
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="w-5 h-5 text-primary mt-1 shrink-0" />
              <div>
                <h3 className="font-heading text-lg font-medium mb-1">Öppettider</h3>
                <div className="text-muted-foreground space-y-1">
                  <p>Måndag – Lördag: 09.30 – 17.00</p>
                  <p>Söndag: 11.00 – 19.00</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="w-5 h-5 text-primary mt-1 shrink-0" />
              <div>
                <h3 className="font-heading text-lg font-medium mb-1">Kontakt</h3>
                <a href="tel:0769541157" className="text-muted-foreground hover:text-primary transition-colors">
                  07 6954 11 57
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden border border-border h-72 md:h-auto">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8143.14!2d18.0327!3d59.3818!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465f9d12a5e8a34b%3A0x4020b28eb2b3b0!2sBergshamra%2C%20Solna!5e0!3m2!1ssv!2sse!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "288px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="S Klipning location"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
