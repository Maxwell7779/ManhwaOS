import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function VisitorCount() {
  const [count, setCount] = useState("...");

  useEffect(() => {
    async function incrementAndFetch() {
      const { data, error } = await supabase.rpc("increment_visitors");
      console.log("visitor data:", data, "error:", error);
      if (!error && data !== null) setCount(data);
      else setCount("?");
    }
    incrementAndFetch();
  }, []);

  return (
    <div className="visitor-count">
      <div>
        <div className="visitor-count-number">
          {typeof count === "number" ? count.toLocaleString() : count}
        </div>

        <div className="visitor-count-label">visitors</div>
      </div>
    </div>
  );
}
