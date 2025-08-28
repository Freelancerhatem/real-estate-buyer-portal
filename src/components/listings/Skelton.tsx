import SkeletonLib from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Skeleton = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <SkeletonLib height={180} className="rounded" />
      <SkeletonLib count={3} style={{ marginTop: "1rem" }} />
    </div>
  );
};

export default Skeleton;
