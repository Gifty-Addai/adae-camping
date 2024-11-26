import { Page } from "../ui/page";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import SignInModal from "./signin.modal";
import { Vid } from "@/assets/assets";

const LandingPage = () => {

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen bg-cover bg-center flex flex-col justify-between">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={Vid.LandingGif}
          autoPlay
          loop
          muted
          playsInline
        ></video>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
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
            className="text-xs sm:text-sm mb-6 text-white"
          >
            Discover the great outdoors.
          </motion.p>

        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 1.5 }}
          className="z-0 flex flex-col items-center text-center px-4 mb-6"
        >
          <Link to="/booking/page">
            <Button variant="default" className="px-8 py-4 text-lg" >
              Reserve a Spot
            </Button>
          </Link>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
            className="mt-4 text-sm text-white"
          >
            Starts at GHS 299 / night
          </motion.p>
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
                  <h2 className="text-md sm:text-lg font-semibold text-center mb-8">
                    Explore Special Camping Spots
                  </h2>
                  <div className="grid grid-cols-1 card-foreground sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                      {
                        title: "Bois-de-Liesse",
                        description: "Serene trails and breathtaking views await.",
                      },
                      {
                        title: "Shinrin Yoku",
                        description: "Reconnect with nature through forest bathing.",
                      },
                      {
                        title: "Rocky Highlands",
                        description: "Stunning landscapes perfect for adventure.",
                      },
                    ].map((spot, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-card p-6 rounded-md shadow-lg"
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
                  <h2 className="text-3xl sm:text-4xl font-semibold mb-6">
                    Discover Captivating Wildlife
                  </h2>
                  <p className="text-lg text-gray-300 mb-8">
                    Immerse yourself in nature's beauty and capture unforgettable
                    moments.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {["wildlife1.jpg", "wildlife2.jpg", "wildlife3.jpg"].map(
                      (image, index) => (
                        <motion.img
                          key={index}
                          whileHover={{ scale: 1.1 }}
                          src={`/images/${image}`}
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