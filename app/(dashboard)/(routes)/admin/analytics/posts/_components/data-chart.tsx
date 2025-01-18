import { 
    Card, 
    CardContent, 
    CardHeader,
    CardTitle
  } from "@/components/ui/card";
  
  interface DataCardProps {
    value: number;
    label: string;
  }
  
  export const DataCard = ({
    value,
    label,
  }: DataCardProps) => {
    return (
     <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold">
          {value}
        </div>
      </CardContent>
     </Card>
    )
  }  