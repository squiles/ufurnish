export const LineSkeleton = ({ className }: { className?: string }) => {
  return <div className={`bg-gray-200 dark:bg-gray-600 animate-pulse ${className}`} />;
};
