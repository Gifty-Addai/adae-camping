import { Page } from "../ui/page";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Images } from "@/assets/assets";

const LandingPage = () => {

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-between">
        {/* <img
          className="absolute inset-0 w-full h-full object-cover sm:object-cover md:object-cover"
          src={Images.Background}
          alt="background"
        /> */}
        {/* Overlay */}
        <div className="absolute inset-0 bg-landing bg-opacity-50"></div>
        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 flex flex-col items-center text-center px-4 flex-grow justify-center"
        >
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="text-md sm:text-lg text-white font-bold mb-2"
          >
            Your Adventure Begins Here!
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-xs sm:text-sm mb-6 text-card-foreground"
          >
            Discover the great outdoors.
          </motion.p>

        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 1.5 }}
          className="z-0 flex flex-col items-center text-center px-4 mb-32"
        >
          <div className="flex flex-col sm:flex-row sm:space-x-24">
            <Link to="/products">
              <Button variant="default" className="px-8 text-lg">
                Shop Gears
              </Button>
            </Link>

            {/* <Link to="/booking/page">
              <Button variant="default" className="px-8 py-4 mt-5 sm:mt-0 text-lg">
                Reserve a Spot
              </Button>
            </Link> */}
          </div>

          {/* <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
            className="mt-4 text-sm text-white"
          >
            Starts at GHS 299 / night
          </motion.p> */}
        </motion.div>


      </section>
      <Page
        pageTitle="Landing"
        renderBody={() => (
          <div>
            <>
              {/* Explore Section */}
              <section className="py-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="container mx-auto px-4"
                >
                  <h2 className="text-md sm:text-lg font-semibold text-center text-card-foreground mb-8">
                    Explore Special Camping Spots
                  </h2>
                  <div className="grid grid-cols-1 bg-card sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                      {
                        title: "The Great Outdoors Awaits!",
                        description: "Escape the hustle and bustle—find your zen under the stars. Whether it's hiking or hammock naps, there's an adventure waiting for you!"
                      },
                      {
                        title: "Camp Like a Pro",
                        description: "Forget the tents that take forever to pitch—experience camping made easy, with fireside chats and s'mores ready in minutes."
                      },
                      {
                        title: "Wild at Heart, Comfortable by Choice",
                        description: "Roughing it doesn't mean *roughing* it. Enjoy the great outdoors with all the cozy comforts of home... except with way more fresh air!"
                      },
                    ].map((spot, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-background p-6 rounded-md shadow-lg"
                      >
                        <h3 className="text-lg font-semibold text-card-foreground mb-2">{spot.title}</h3>
                        <p className="text-card-foreground">{spot.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </section>


              {/* Wildlife Section */}
              <section className="text-white py-16">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="container mx-auto px-4 text-center"
                >
                  <h2 className="text-3xl sm:text-4xl text-card-foreground font-semibold mb-6">
                    Discover Captivating Wildlife
                  </h2>
                  <p className="text-lg text-card-foreground mb-8">
                    Immerse yourself in nature's beauty and capture unforgettable
                    moments.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {["https://images.pexels.com/photos/47547/squirrel-animal-cute-rodents-47547.jpeg",
                      "https://images.pexels.com/photos/733090/pexels-photo-733090.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                      "https://images.pexels.com/photos/1829979/pexels-photo-1829979.jpeg?auto=compress&cs=tinysrgb&w=600"].map(
                        (image, index) => (
                          <motion.img
                            key={index}
                            whileHover={{ scale: 1.1 }}
                            src={`${image}`}
                            alt={`Wildlife ${index + 1}`}
                            className="rounded-lg shadow-lg w-full h-64 object-cover"
                          />
                        )
                      )}
                  </div>
                </motion.div>
              </section>

              {/* Call-to-Action Section */}
              {/* <section className="bg-gradient-to-r from-green-400 to-blue-600 text-white py-16 text-center">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="text-3xl sm:text-4xl font-bold mb-4"
                >
                  Ready to Start Your Adventure?
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="text-lg mb-6"
                >
                  Book your spot today and embark on the journey of a lifetime!
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 1 }}
                >
                  <Button variant="destructive-outline" className="px-8 py-4 text-lg">
                    Reserve Now
                  </Button>
                </motion.div>
              </section> */}


            </>
          </div>

        )}
      />

    </>
  );
};

export default LandingPage;