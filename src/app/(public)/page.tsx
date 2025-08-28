import About from "@/components/home/about/About";
import Favorite from "@/components/home/favorite/Favorite";
import Featured from "@/components/home/featured/Featured";
import Banner from "@/components/home/hero/Hero";
import Invest from "@/components/home/invest/Invest";
import New from "@/components/home/new/New";
import Ours from "@/components/home/ours/Ours";
import Recommended from "@/components/home/recomended/Recomended";
import Reviews from "@/components/home/reviews/Reviews";

export default function Home() {
  return (
    <div>
      <Banner />
      <Favorite />
      <About />
      <Ours />
      <New />
      <Recommended />
      <Featured />
      <Invest />
      <Reviews />
    </div>
  );
}
