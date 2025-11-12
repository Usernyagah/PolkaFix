export const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
          <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-full mb-2"></div>
          <div className="h-4 bg-muted rounded w-5/6 mb-4"></div>
          <div className="flex justify-between items-center">
            <div className="h-8 bg-muted rounded w-24"></div>
            <div className="h-6 bg-muted rounded-full w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
