import Image from "next/image";
import house from "@/assets/images/house.png";
import Link from "next/link";

const Invest = () => {
  return (
    <div className="lg:h-screen h-auto relative pt-20">
      {/* Main section with background and image */}
      <div className="relative bg-secondary h-[150vh] lg:h-[80vh] grid grid-cols-1 lg:grid-cols-2 justify-between items-center">
        {/* Positioned image */}
        <div className="relative order-2 lg:order-1 bottom-0 lg:top-0  w-full h-full">
          <Image
            src={house}
            alt="house"
            className="w-[90%] absolute left-0 bottom-0 lg:-top-[48px] "
          />
        </div>
        {/* content layout adjustment */}
        <div className="w-full order-1 lg:order-2 h-full space-y-5 px-4  flex flex-col justify-center text-white">
          <h2 className="lg:text-5xl text-3xl">
            Beat the dollar rise invest in real estate
          </h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipinlit. Maureis volutpat,
            arcu ac congue faucibus, nisi lacusmpulacus, ac egestas libero dolor
            nec purus. Class aptenttaciti sciosequ ad litora torquent per
            conubia nostra.
          </p>
          <div className="">
            <Link href={"/invest"}>
              <button className="bg-primary text-white py-2 px-6 rounded-md hover:bg-hover transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Invest Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invest;
