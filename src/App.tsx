import React from "react";
import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";
import { Spinner } from "./components/ui/spinner";
import type { CounterWithCount } from "./types";

function App() {
  const [counters, setCounters] = React.useState<CounterWithCount[]>([]);
  const [loading, setLoading] = React.useState(true);

  async function getCountersWithCount() {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5032/api/counter/with-count");
      const data = await res.json();
      setCounters(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    getCountersWithCount();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4 p-4">
        <Button>Añadir contador</Button>

        <Separator />

        {loading ? (
          <div className="flex justify-center p-4">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {counters.map((c) => (
              <Button asChild key={c.id} variant="ghost">
                <div className="border p-4 h-auto items-start rounded-sm flex gap-2">
                  <div className="flex-1 flex flex-col gap-2">
                    <span className="text-2xl">{c.name}</span>
                    <span>{c.description}</span>
                    <span className="text-zinc-400">Por: {c.createdBy}</span>
                  </div>
                  <span className="text-5xl">{c.count}</span>
                </div>
              </Button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
