
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-muted/30 border-t">
      {/* Newsletter Section */}
      <div className="bg-primary/5">
        <div className="container mx-auto flex flex-col items-center justify-between gap-8 py-12 md:flex-row">
          <div className="max-w-md">
            <h2 className="mb-2 text-2xl font-bold">Stay in the loop</h2>
            <p className="text-muted-foreground">
              Subscribe to our newsletter for the latest products, promotions,
              and exclusive offers.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <div className="mb-6 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary h-8 w-8"
                >
                  <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                  <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                  <path d="M12 3v6" />
                </svg>
                <span className="text-xl font-bold">Acme Inc.</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                We're dedicated to providing quality products and exceptional
                customer service. Shop with confidence and discover why
                customers love our selection.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="text-primary mt-0.5 h-5 w-5" />
                  <div>
                    <h4 className="font-medium">Find a Store</h4>
                    <p className="text-muted-foreground text-sm">
                      Use our store locator to find the closest store near you.
                    </p>
                    <Link
                      to="/"
                      className="text-primary mt-1 inline-block text-sm hover:underline"
                    >
                      Find stores
                    </Link>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="text-primary mt-0.5 h-5 w-5" />
                  <div>
                    <h4 className="font-medium">Call Us</h4>
                    <p className="text-muted-foreground text-sm">
                      Mon-Fri: 8am-8pm, Sat-Sun: 9am-6pm
                    </p>
                    <a
                      href="tel:+18001234567"
                      className="text-primary mt-1 inline-block text-sm hover:underline"
                    >
                      1-800-123-4567
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="text-primary mt-0.5 h-5 w-5" />
                  <div>
                    <h4 className="font-medium">Email Us</h4>
                    <p className="text-muted-foreground text-sm">
                      We'll respond within 24 hours
                    </p>
                    <a
                      href="mailto:support@acme.com"
                      className="text-primary mt-1 inline-block text-sm hover:underline"
                    >
                      support@acme.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h3 className="mb-4 text-lg font-bold">Account</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    My Account
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Order History
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Wishlist
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Returns
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-bold">Customer Service</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Gift Certificates
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Shipping & Delivery
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Site Map
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-bold">About</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social and Payment */}
          <div className="mt-12 border-t pt-8">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground text-sm">
                  We accept:
                </span>
                <div className="flex gap-2">
                  {/* Payment Icons */}
                  <div className="bg-muted flex h-8 w-12 items-center justify-center rounded">
                    <span className="text-xs font-medium">Visa</span>
                  </div>
                  <div className="bg-muted flex h-8 w-12 items-center justify-center rounded">
                    <span className="text-xs font-medium">MC</span>
                  </div>
                  <div className="bg-muted flex h-8 w-12 items-center justify-center rounded">
                    <span className="text-xs font-medium">Amex</span>
                  </div>
                  <div className="bg-muted flex h-8 w-12 items-center justify-center rounded">
                    <span className="text-xs font-medium">PayPal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-muted/50 border-t py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-muted-foreground text-center text-sm md:text-left">
              <p>© 2004-2024 Acme Inc. All Rights Reserved.</p>
              <p className="mt-1">
                This is a demo store only. Orders made will NOT be processed.
              </p>
            </div>
            <div className="flex gap-6 text-sm">
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Accessibility
              </Link>
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Cookie Settings
              </Link>
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <Button
        onClick={scrollToTop}
        size="icon"
        className="fixed right-6 bottom-6 z-20 h-10 w-10 rounded-full shadow-md"
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </footer>
  );
}
