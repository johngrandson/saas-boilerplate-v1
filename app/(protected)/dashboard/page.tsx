import { currentUser } from "@/lib/auth";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "./(tabs)/overview";
import { AnalyticsTab } from "./(tabs)/analytics";

export default async function Page() {
  const user = await currentUser();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight ml-4">
          Hi, {user?.name}. Welcome back 👋
        </h2>
        <div className="hidden items-center space-x-2 md:flex mr-4">
          <CalendarDateRangePicker />
          <Button>Apply</Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="ml-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <OverviewTab />
        <AnalyticsTab />
      </Tabs>
    </div>
  );
}
