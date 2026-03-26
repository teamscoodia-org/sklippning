const Footer = () => {
  return (
    <footer className="py-8 px-6 border-t border-border text-center">
      <p className="text-muted-foreground text-sm">
        © {new Date().getFullYear()} S Barbershop - Rådjursstigen 7, 170 76 Solna
      </p>
    </footer>
  );
};

export default Footer;
