import { Button } from "@/components/ui/button";
import { Separator } from "./separator";
import { Icons } from "./icons";
import { Logo } from "./developer/logo";

const Footer = () => {
  return (
    <footer className="bg-[#1d1d1d] text-white py-12 border-t border-[#2d2d2d]">
      <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* About Section */}
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-bold mb-4 text-gray-100">The Ancestral Tallow</h3>
          <p className="text-xs text-gray-400">
            Pure, ancestral tallow products crafted with respect for tradition and the earth.
          </p>
        </div>

        {/* Quick Links */}
        {/* <div className="text-center sm:text-left">
          <h3 className="text-lg font-bold mb-4 text-card-foreground">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Button variant="link" >
                About Us
              </Button>
            </li>
            <li>
              <Button variant="link" >
                Our Services
              </Button>
            </li>
           
            <li>
              <Button variant="link">
                Contact Us
              </Button>
            </li>
          </ul>
        </div> */}

        {/* Social Media Links */}
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-bold mb-4 text-gray-100">Follow Us</h3>
          <div className="flex justify-center sm:justify-start space-x-4">
            {/* <Button
              variant="ghost"
              className="hover:bg-blue-500"
              asChild
            >
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Icons.facebook className="h-6 w-6 text-card-foreground hover:text-white" />
              </a>
            </Button> */}
            {/* <Button
              variant="ghost"
              className="hover:bg-blue-400"
              asChild
            >
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Icons.twitter className="h-6 w-6 text-card-foreground hover:text-white" />
              </a>
            </Button> */}
            <Button
              variant="ghost"
              className="hover:bg-pink-500"
              asChild
            >
              <a href="https://www.instagram.com/outdoorscamps?igsh=MnF5YmRlbjA2YWd3" target="_blank" rel="noopener noreferrer">
                <Icons.instagram className="h-6 w-6 text-gray-300 hover:text-white" />
              </a>
            </Button>
            <Button
              variant="ghost"
              className="hover:bg-blue-600"
              asChild
            >
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Icons.linkedin className="h-6 w-6 text-gray-300 hover:text-white" />
              </a>
            </Button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-bold mb-4 text-gray-100">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            {/* <li className="flex items-center text-card-foreground">
              <Icons.mapPin className="h-5 w-5 mr-2 " />  Accra City, Earth
            </li>
            <li className="flex items-center text-card-foreground">
              <Icons.phone className="h-5 w-5 mr-2" /> +1 (233) 123-4567
            </li> */}

            <Button
              variant="ghost"
              className="hover:bg-pink-500 flex items-center"
              asChild
            >
              <Icons.mail className="h-5 w-5" />
              <a
                href="mailto:info@adaeakobenadventure.com"
                className="hover:text-white transition-colors text-gray-300"
              >
                info@adaeakobenadventure.com
              </a>
            </Button>
            <li className="flex items-center">

            </li>
          </ul>
        </div>
      </div>

      {/* Separator */}
      <Separator className="my-8 bg-[#2d2d2d]" />

      {/* Bottom Footer */}
      <div className="text-center text-sm text-gray-100">
        {/* developer logo and name */}
        <div className="flex flex-col items-center justify-center gap-2 mb-6">
          <span className="text-xs text-gray-500 uppercase tracking-widest">Designed & Developed with ❤️ by</span>
          <a
            href="https://schriftflow.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-105 transition-transform duration-300 decoration-0"
          >
            <Logo />
          </a>
        </div>

        <p className="text-gray-400">
          &copy; 2024 The Ancestral Tallow. All rights reserved.{" "}
          <a
            // href="/terms"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Terms of Service
          </a>{" "}
          |{" "}
          <a
            // href="/privacy"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
