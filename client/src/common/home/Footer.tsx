function Footer() {
  return (
    <footer className="px-8 py-12 bg-slate-900 text-slate-300">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            {/* <Sprout className="text-emerald-500" size={24} /> */}
            <span className="text-3xl italic font-bold text-white">
              AgriBridge
            </span>
          </div>
          <p className="max-w-xs">
            Making agriculture transparent, profitable, and accessible through
            technology.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Roles</h4>
          <ul className="space-y-2 text-sm">
            <li>Farmers</li>
            <li>Merchants</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li>About Us</li>
            <li>Contact</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
