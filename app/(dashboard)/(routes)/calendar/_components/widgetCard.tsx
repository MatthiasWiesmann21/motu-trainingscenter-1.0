import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

export function WidgetCard() {
    return ( 
        <Card className="w-full m-4">
        <CardHeader>
          <CardTitle>Training</CardTitle>
          <CardDescription>Training findet am 13.06.2024 19:00 statt</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <div>
                <h4 className="block text-sm font-medium text-gray-700">
                    Trainings Name
                </h4>
                <p>
                    Boxen - Positioning
                </p>
                </div>
                <div>
                <div>
                <h4 className="block text-sm font-medium text-gray-700">
                    Trainings Beschreibung
                </h4>
                <p>
                    Boxen - Positioning,
                    Basics und Techniken
                </p>
                </div>
                </div>
            </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">nicht Teilnehmen</Button>
          <Button>Teilnehmen</Button>
        </CardFooter>
      </Card>
     );
}