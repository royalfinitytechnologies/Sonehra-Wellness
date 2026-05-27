export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold text-foreground">Sonehra Wellness</p>
            <p className="text-xs text-muted-foreground">Professional Fee Management System</p>
          </div>

          <div className="text-center md:text-right">
            <p className="text-xs text-muted-foreground">
              © {currentYear} Sonehra Wellness. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground mt-1">Faridabad, Haryana</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
