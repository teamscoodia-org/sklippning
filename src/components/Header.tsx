import Image from "next/image";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="S Barbershop logo"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          <span className="font-heading text-xl font-semibold tracking-wide">S Barbershop</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-body">
          <a href="#tjanster" className="text-muted-foreground hover:text-primary transition-colors">Tjänster</a>
          <a href="#om" className="text-muted-foreground hover:text-primary transition-colors">Om oss</a>
          <a href="#kontakt" className="text-muted-foreground hover:text-primary transition-colors">Kontakt</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
