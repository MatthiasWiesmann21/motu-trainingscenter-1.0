// hooks/useContainerData.ts
import { useEffect, useState } from "react";

export const useContainerData = () => {
  const [container, setContainer] = useState<any>(); // Replace `any` with the actual type if known
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/auth/container", {
          method: "GET",
        });
        const data = await response.json();
        setContainer(data);
      } catch (error) {
        console.error("Error fetching container data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { container, loading };
};
