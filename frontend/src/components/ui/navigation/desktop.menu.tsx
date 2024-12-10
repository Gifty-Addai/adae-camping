import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "../navigation-menu"
import { Button } from "../button"
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react"
import { Label } from "../label";
import { useSelector } from "react-redux";
import { RootState } from "@/core/store/store";


const DesktopMenu: React.FC = () => {
  const totalItems = useSelector((state: RootState) => state.cart.totalItems);


  return (
    <>
      <div className="flex justify-between w-full">
        <Link to="/" className="no-underline items-center">
          <div className="flex justify-center items-center rounded-lg bg-yellow-300">
            {/* <img
      // src={Images.AcsLogo}
      alt="Logo"
      className="h-8 w-8"
    /> */}
            <Label className="text-lg w-28 font-bold text-black text-center">
              FieNeFie
            </Label>
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
              {/* <NavigationMenuItem>
                <Link to="/gallery">
                  <Button>
                    Gallery
                  </Button>
                </Link>

              </NavigationMenuItem> */}
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
                  {totalItems > 0 && (
                    <span className="absolute top-0 right-0 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center -mt-1 -mr-1">
                      {totalItems}
                    </span>
                  )}
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
