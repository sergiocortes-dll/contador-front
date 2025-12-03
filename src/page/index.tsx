import Counter from "@/components/counters";
import SavedCounter from "@/components/saved-counters";
import React from "react";

function Index() {
  const [favs, setFavs] = React.useState<number[]>([]);

  React.useEffect(() => {
    const storage = localStorage.getItem("favs");
    setFavs(storage ? JSON.parse(storage) : []);
  }, []);

  const updateFavs = (updated: number[]) => {
    setFavs(updated);
    localStorage.setItem("favs", JSON.stringify(updated));
  };

  return (
    <div className="flex gap-2 justify-center">
      <Counter favs={favs} setFavs={updateFavs} />
      <SavedCounter favs={favs} setFavs={setFavs} />
    </div>
  );
}

export default Index;
