import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Thermometer, Droplets, Wind } from "lucide-react";

const devices = [
  {
    id: 1,
    name: "Soil Moisture Sensor",
    location: "Field A",
    status: "online",
    value: "45%",
    icon: Droplets,
  },
  {
    id: 2,
    name: "Temperature Monitor",
    location: "Field B",
    status: "online",
    value: "28°C",
    icon: Thermometer,
  },
  {
    id: 3,
    name: "Weather Station",
    location: "Field C",
    status: "online",
    value: "15 km/h",
    icon: Wind,
  },
  {
    id: 4,
    name: "Crop Health Monitor",
    location: "Field A",
    status: "offline",
    value: "N/A",
    icon: Activity,
  },
];

const IoTDevices = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">IoT Devices</h1>
          <p className="text-muted-foreground">
            Monitor and manage your connected agricultural sensors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {devices.map((device) => {
            const Icon = device.icon;
            return (
              <Card key={device.id} className="border-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-foreground">{device.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{device.location}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={device.status === 'online' ? 'default' : 'secondary'}
                      className={device.status === 'online' ? 'bg-primary' : ''}
                    >
                      {device.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{device.value}</div>
                  <p className="text-sm text-muted-foreground mt-2">Current reading</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IoTDevices;
