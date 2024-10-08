import { useLoading } from "../context/LoadingContext";

const LoadingBar = () => {
  const { progress } = useLoading();

  return (
    <div className="loading-container">
      {progress >= 0 && (
        <div className="loading-bar" style={{ width: `${progress}%` }}></div>
      )}
    </div>
  );
};

export default LoadingBar;
