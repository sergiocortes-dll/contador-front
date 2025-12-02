function SavedCounter() {
  // const [counters, setCounters] = React.useState<CounterWithCount[]>([]);
  // const [loading, setLoading] = React.useState(true);
  // const [error, setError] = React.useState<string | unknown>("");
  // const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  // const getCountersWithCount = React.useCallback(async () => {
  //   try {
  //     setError("");
  //     setLoading(true);
  //     const res = await fetch(
  //       `${import.meta.env.VITE_API_BASE_URL}api/counter/with-count`
  //     );
  //     const data = await res.json();
  //     setCounters(data);
  //   } catch (err) {
  //     setError(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  // React.useEffect(() => {
  //   getCountersWithCount();
  // }, [getCountersWithCount, refreshTrigger]); // Añadimos refreshTrigger como dependencia

  // Función para refrescar los contadores desde los componentes hijos
  // const refreshCounters = React.useCallback(() => {
  //   setRefreshTrigger((prev) => prev + 1);
  // }, []);

  return (
    <div className="m-4 w-full max-w-md">
      <div className="border p-4 rounded-md w-full">
        <h2 className="text-2xl">Próximamente:</h2> <br />{" "}
        <span className="text-xl">contadores favoritos.</span>
      </div>
    </div>
  );
}

export default SavedCounter;
