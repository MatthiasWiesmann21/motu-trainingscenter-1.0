import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Administartion',
}

const AdministrationLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>
}
 
export default AdministrationLayout;