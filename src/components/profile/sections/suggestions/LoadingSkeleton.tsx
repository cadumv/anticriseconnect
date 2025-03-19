
import { Card, CardContent } from "@/components/ui/card";

export const LoadingSkeleton = () => {
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </CardContent>
    </Card>
  );
};
