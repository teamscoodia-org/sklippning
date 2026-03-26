const About = () => {
  return (
    <section id="om" className="py-24 px-6 bg-secondary/30">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-heading font-semibold mb-6">
          Om <span className="text-gradient-gold">Oss</span>
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          S Barbershop ligger på Rådjursstigen 7 i Solna. Vi erbjuder klassiska och
          moderna klippningar samt behandlingar i en avslappnad miljö. Hos oss får du
          alltid en personlig upplevelse med fokus på kvalitet och stil.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Välkommen in – bokning eller drop-in gäller!
        </p>
      </div>
    </section>
  );
};

export default About;
