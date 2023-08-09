import React from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";

const Hero = () => {
  return (
    <div
      className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-repeat ${styles.noramlFlex}`}
      style={{
        backgroundImage:
          "url(https://wallpapers.com/images/featured/blue-color-background-9u7nhq72leu6xf5w.jpg)",
      }}
    >
      <div className={`${styles.section} w-[90%] 800px:w-[60%]`}>
        <h1
          className={`text-[35px] leading-[1.2] 800px:text-[60px] text-[#3d3a3a] font-[600] capitalize`}
        >
          Best Place to <br /> Buy Gadgets Online
        </h1>
        <p className="pt-5 text-[16px] font-[Poppins] font-[400] text-[#000000ba]">
        Discover a world of cutting-edge technology and innovative gadgets at TechHaven,
         where the future comes to life. We are your premier online destination for all things tech,
          offering an unparalleled selection of the latest gadgets and electronic marvels that will 
          elevate your lifestyle to a whole new level.{" "}
          <br /> We know you can't wait to get your hands on your new gadget. That's why we've partnered 
          with reliable shipping services to deliver your orders swiftly and securely.
           Sit back and relax while we take care of the rest.
        </p>
        <Link to="/products" className="inline-block">
            <div className={`${styles.button} mt-5`}>
                 <span className="text-[#fff] font-[Poppins] text-[18px]">
                    Shop Now
                 </span>
            </div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
