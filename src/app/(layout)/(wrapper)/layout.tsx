import Card from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative h-dvh w-full space-y-6 overflow-x-hidden overflow-y-auto px-6 py-4">
      <Card>
        <Card.Content>
          <SidebarTrigger />
        </Card.Content>
      </Card>
      {children}
    </div>
  );
};
