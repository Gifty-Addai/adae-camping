import { Button } from "@/components/ui/button";
import { Separator } from "./separator";
import { Icons } from "./icons";

const Footer = () => {
  return (
    <footer className="bg-card-foreground text-white py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* About Section */}
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-bold mb-4">Adae Akoben Adventure</h3>
          <p className="text-xs">
            Explore the world with our curated outdoor experiences, connecting you
            to nature in its purest form.
          </p>
        </div>

        {/* Quick Links */}
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-bold mb-4">Quick Links</h3>
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
        </div>

        {/* Social Media Links */}
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-bold mb-4">Follow Us</h3>
          <div className="flex justify-center sm:justify-start space-x-4">
            <Button
              variant="ghost"
              className="hover:bg-blue-500"
              asChild
            >
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Icons.facebook className="h-6 w-6 text-gray-400 hover:text-white" />
              </a>
            </Button>
            <Button
              variant="ghost"
              className="hover:bg-blue-400"
              asChild
            >
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Icons.twitter className="h-6 w-6 text-gray-400 hover:text-white" />
              </a>
            </Button>
            <Button
              variant="ghost"
              className="hover:bg-pink-500"
              asChild
            >
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Icons.instagram className="h-6 w-6 text-gray-400 hover:text-white" />
              </a>
            </Button>
            <Button
              variant="ghost"
              className="hover:bg-blue-600"
              asChild
            >
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Icons.linkedin className="h-6 w-6 text-gray-400 hover:text-white" />
              </a>
            </Button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-bold mb-4">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <Icons.mapPin className="h-5 w-5 mr-2" />  Accra City, Earth
            </li>
            <li className="flex items-center">
              <Icons.phone className="h-5 w-5 mr-2" /> +1 (233) 123-4567
            </li>

            <Button
              variant="ghost"
              className="hover:bg-pink-500 flex items-center"
              asChild
            >
               <Icons.mail className="h-5 w-5 mr-2" />
              <a
                href="mailto:info@adaeakobenadventure.com"
                className="hover:text-green-400 transition-colors"
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
      <Separator className="my-8 bg-gray-800" />

      {/* Bottom Footer */}
      <div className="text-center text-sm text-gray-400">
        <p>
          &copy; 2024 Adae Akoben Adventure. All rights reserved.{" "}
          <a
            href="/terms"
            className="hover:text-green-400 transition-colors"
          >
            Terms of Service
          </a>{" "}
          |{" "}
          <a
            href="/privacy"
            className="hover:text-green-400 transition-colors"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
