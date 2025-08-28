import Image from "next/image";
import React from "react";
import line from "@/assets/images/line.png";
import rec from "@/assets/images/Recommended.png";
import best from "@/assets/images/best_deals.png";

const Recommended = () => {
  return (
    <div className="px-4 pt-4 lg:px-20">
      <div className="relative h-[70vh]  rounded-xl overflow-hidden">
        {/* Background Line Image #EBEBEB */}
        <div className="absolute inset-0 bg-[#636161b6]   rounded-md ">
          <Image
            src={line}
            alt="line background"
            className="object-cover w-full h-full z-0"
          />
        </div>

        {/* Foreground Content */}
        <div className="relative  z-10 h-full flex items-center">
          {/* Cards Container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 p-4 lg:p-10   w-full h-full">
            {/* Card 1 */}
            <div className="relative    w-full  h-full">
              <Image
                src={rec}
                alt="Recommended image"
                className=" object-cover z-0 rounded-xl"
                fill
              ></Image>
              <h3 className="text-lg absolute py-1 lg:py-2 bottom-5 lg:bottom-10 w-[95%] left-1/2 transform -translate-x-1/2 rounded-md bg-[#ffffff1a] backdrop-blur-lg border-2 border-white text-white  text-center font-semibold z-10">
                Recommended
              </h3>
            </div>

            {/* Card 2 */}
            <div className="relative    w-full  h-full ">
              <Image
                src={best}
                alt="best deals"
                className=" object-cover z-0 rounded-xl"
                fill
              ></Image>
              <h3 className="text-lg absolute py-1 lg:py-2 bottom-5 lg:bottom-10 w-[95%] left-1/2 transform -translate-x-1/2 rounded-md bg-[#ffffff1a] backdrop-blur-lg border-2 border-white text-white  text-center font-semibold z-10">
                Best Deals
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommended;
