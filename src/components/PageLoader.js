import { useEffect, useState } from "react";

export default function PageLoader() {

  const [dots, setDots] = useState("");
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots === "...") return "";
        return prevDots + ".";
      });
    }, 500);
    return () => clearInterval(intervalId);
  }, []);
  
    return (
            <div className="bg-white h-[100vh] flex flex-col justify-center items-center py-6 h-52">
              <div className="h-36 w-40 flex items-center gap-2">
                <div className="flex items-center justify-center">
                  <div className="text-4xl font-bold animate-pulse">
                    Loading{dots}
                  </div>
                </div>
              </div>
            </div>
    )
}