import AddAnonCount from "@/components/blocks/add_anon_count";
import AddCount from "@/components/blocks/add_count";
import CreateCounter from "@/components/blocks/create_counter";
import React from "react";
import { Separator } from "../components/ui/separator";
import { Spinner } from "../components/ui/spinner";
import type { CounterWithCount } from "../types";

function Index() {
  const [counters, setCounters] = React.useState<CounterWithCount[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | unknown>("");
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  const getCountersWithCount = React.useCallback(async () => {
    try {
      setError("");
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}api/counter/with-count`
      );
      const data = await res.json();
      setCounters(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    getCountersWithCount();
  }, [getCountersWithCount, refreshTrigger]); // Añadimos refreshTrigger como dependencia

  // Función para refrescar los contadores desde los componentes hijos
  const refreshCounters = React.useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4 p-4">
        <CreateCounter onCounterCreated={refreshCounters} />

        <Separator />

        {error !== "" && (
          <p className="text-red-400">
            {typeof error === "string"
              ? error
              : error instanceof Error
              ? error.message
              : String(error)}
          </p>
        )}

        {loading ? (
          <div className="flex justify-center p-4">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {counters.map((c) => (
              <div
                key={c.id}
                className="border p-4 h-auto gap-4 flex flex-col items-start rounded-md hover:bg-[rgba(255,255,255,.025)]"
              >
                <div className="items-start rounded-sm flex gap-2 w-full">
                  <div className="flex-1 flex flex-col gap-2">
                    <span className="text-2xl">{c.name}</span>
                    <span>{c.description}</span>
                    <span className="text-zinc-400">Por: {c.createdBy}</span>
                  </div>
                  <span className="text-5xl">{c.count}</span>
                </div>

                <Separator />

                <div className="flex items-center h-8 gap-2 justify-end w-full">
                  <AddAnonCount counter={c} onCountAdded={refreshCounters} />
                  <Separator orientation="vertical" />
                  <AddCount
                    counter={c}
                    onCountAdded={refreshCounters} // Pasamos la función de refresco
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Index;
