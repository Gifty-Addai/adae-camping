import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "../navigation-menu"
import { Button } from "../button"
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react"


const DesktopMenu: React.FC = () => {

  return (
    <>
      <div className="flex justify-between w-full">
        <Link to="/">
          <div className="flex items-center space-x-4">
            <img
              // src={Images.AcsLogo}
              alt="Logo"
              className="h-8 w-8"
            />
            <div className="text-lg font-bold text-white">Adae Camping</div>
          </div>
        </Link>


        <div className="flex items-center space-x-4 ml-auto">
          {/* <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Camping Guides</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4  md:w-[300px] lg:w-[400px] lg:grid-cols-[.75fr_1fr]">
                    <ListItem href="/gear-checklist" title="Gear Checklist">
                      Prepare your gear for the adventures ahead.
                    </ListItem>
                    <ListItem href="/locations" title="Locations">
                      Let's explore amazing camping locations around the world together.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu> */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/gallery">
                  <Button>
                    Gallery
                  </Button>
                </Link>

              </NavigationMenuItem>
              <Link to="/products">
                <Button >
                  Products
                </Button>
              </Link>

              <Link to={"/cart"}>
                <Button
                  className="bg-gray-400 "
                >
                  <ShoppingCart size={24} />
                </Button>
              </Link>

            </NavigationMenuList>
          </NavigationMenu>

          {/* Sign In / Sign Up Section */}
          {/* <div className="flex space-x-4">
            {auth ? (
              <Link to="/settings">
                <Avatar>
                  <AvatarImage src="path/to/user/avatar.png" alt="User Avatar" />
                  <AvatarFallback>UA</AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Button className="secondary" onClick={() => setSignIn(true)}>
                Sign In
              </Button>
            )}
          </div> */}
        </div>
      </div>
    </>
  );
};

export default DesktopMenu;
