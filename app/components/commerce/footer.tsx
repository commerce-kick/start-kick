import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      // Here you would typically send this to your API
      setTimeout(() => {
        setSubscribed(false);
      }, 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="border-t bg-muted/30">
      {/* Newsletter Section */}
      <div className="bg-primary/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8  container mx-auto py-12 ">
          <div className="max-w-md">
            <h2 className="text-2xl font-bold mb-2">Stay in the loop</h2>
            <p className="text-muted-foreground">
              Subscribe to our newsletter for the latest products, promotions,
              and exclusive offers.
            </p>
          </div>
          <div className="w-full md:w-auto">
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                className="min-w-[240px]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" disabled={subscribed}>
                {subscribed ? "Subscribed!" : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-primary"
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
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Find a Store</h4>
                    <p className="text-sm text-muted-foreground">
                      Use our store locator to find the closest store near you.
                    </p>
                    <Link
                      to="/"
                      className="text-sm text-primary hover:underline inline-block mt-1"
                    >
                      Find stores
                    </Link>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Call Us</h4>
                    <p className="text-sm text-muted-foreground">
                      Mon-Fri: 8am-8pm, Sat-Sun: 9am-6pm
                    </p>
                    <a
                      href="tel:+18001234567"
                      className="text-sm text-primary hover:underline inline-block mt-1"
                    >
                      1-800-123-4567
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Email Us</h4>
                    <p className="text-sm text-muted-foreground">
                      We'll respond within 24 hours
                    </p>
                    <a
                      href="mailto:support@acme.com"
                      className="text-sm text-primary hover:underline inline-block mt-1"
                    >
                      support@acme.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h3 className="font-bold text-lg mb-4">Account</h3>
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
              <h3 className="font-bold text-lg mb-4">Customer Service</h3>
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
              <h3 className="font-bold text-lg mb-4">About</h3>
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
          <div className="mt-12 pt-8 border-t">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  We accept:
                </span>
                <div className="flex gap-2">
                  {/* Payment Icons */}
                  <div className="h-8 w-12 bg-muted rounded flex items-center justify-center">
                    <span className="text-xs font-medium">Visa</span>
                  </div>
                  <div className="h-8 w-12 bg-muted rounded flex items-center justify-center">
                    <span className="text-xs font-medium">MC</span>
                  </div>
                  <div className="h-8 w-12 bg-muted rounded flex items-center justify-center">
                    <span className="text-xs font-medium">Amex</span>
                  </div>
                  <div className="h-8 w-12 bg-muted rounded flex items-center justify-center">
                    <span className="text-xs font-medium">PayPal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t py-6 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left text-sm text-muted-foreground">
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
        className="fixed bottom-6 right-6 h-10 w-10 rounded-full shadow-md z-20"
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </footer>
  );
}
