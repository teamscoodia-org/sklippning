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
                  <p>Varje dag: 09.30 – 19.00</p>
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
              src="https://maps.google.com/maps?q=R%C3%A5djursstigen%207%2C%20170%2076%20Solna&z=15&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "288px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="S Barbershop location"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
