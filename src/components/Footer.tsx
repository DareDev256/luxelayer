export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="#" className="text-2xl font-bold tracking-tight">
              <span className="text-gradient-gold">Luxe</span>
              <span className="text-white">Layer</span>
            </a>
            <p className="text-warm-gray/40 mt-3 max-w-sm text-sm leading-relaxed">
              Premium countertop protection using professional-grade PPF.
              Invisible defense for luxury surfaces — your investment stays
              flawless.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-warm-gray/50">
              <li>
                <a href="#services" className="hover:text-gold transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-gold transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#surfaces" className="hover:text-gold transition-colors">
                  Surface Types
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-gold transition-colors">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-gold transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-gold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-warm-gray/50">
              <li>Toronto & GTA</li>
              <li>
                <a
                  href="mailto:info@luxelayer.ca"
                  className="hover:text-gold transition-colors"
                >
                  info@luxelayer.ca
                </a>
              </li>
              <li>
                <a
                  href="tel:+16471234567"
                  className="hover:text-gold transition-colors"
                >
                  (647) 123-4567
                </a>
              </li>
              <li className="pt-2">
                <span className="text-warm-gray/30">Mon-Sat: 8am - 6pm</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-warm-gray/30 text-xs">
            &copy; {new Date().getFullYear()} LuxeLayer. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-warm-gray/30 text-xs">
            <a href="#" className="hover:text-gold transition-colors">
              Instagram
            </a>
            <a href="#" className="hover:text-gold transition-colors">
              Facebook
            </a>
            <a href="#" className="hover:text-gold transition-colors">
              Google Reviews
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
