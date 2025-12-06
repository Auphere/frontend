import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface PopularTimesChartProps {
  popularTimes?: { [key: string]: number };
}

export const PopularTimesChart = ({ popularTimes }: PopularTimesChartProps) => {
  if (!popularTimes || Object.keys(popularTimes).length === 0) {
    return null;
  }

  const currentHour = new Date().getHours();
  const currentTimeKey = `${currentHour.toString().padStart(2, "0")}:00`;

  const maxValue = Math.max(...Object.values(popularTimes));

  const getBusyLevel = (value: number) => {
    if (value < 30) return { label: "Quiet", color: "bg-green-500" };
    if (value < 60) return { label: "Moderate", color: "bg-yellow-500" };
    if (value < 80) return { label: "Busy", color: "bg-orange-500" };
    return { label: "Very Busy", color: "bg-red-500" };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Popular Times
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(popularTimes).map(([time, value]) => {
            const isCurrent = time === currentTimeKey;
            const busyLevel = getBusyLevel(value);
            const heightPercentage = (value / maxValue) * 100;

            return (
              <div key={time} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className={`${isCurrent ? "font-bold text-primary" : "text-muted-foreground"}`}>
                    {time}
                    {isCurrent && " (Now)"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {busyLevel.label}
                  </span>
                </div>
                <div className="h-8 bg-muted rounded-md overflow-hidden relative">
                  <div
                    className={`h-full ${busyLevel.color} transition-all duration-300 ${
                      isCurrent ? "opacity-100" : "opacity-70"
                    }`}
                    style={{ width: `${heightPercentage}%` }}
                  />
                  {isCurrent && (
                    <div className="absolute inset-0 border-2 border-primary rounded-md" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-green-500" />
            <span className="text-muted-foreground">Quiet</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-yellow-500" />
            <span className="text-muted-foreground">Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-orange-500" />
            <span className="text-muted-foreground">Busy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-red-500" />
            <span className="text-muted-foreground">Very Busy</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
