import React from "react";

function App() {
  const [counters, setCounters] = React.useState([]);

  async function getCountersWithCount() {
    const res = await fetch("http://localhost:5032/api/counter/with-count");
    const data = await res.json();
    setCounters(data);
  }

  React.useEffect(() => {
    getCountersWithCount();
  }, []);

  return (
    <>
      {counters.map((c) => (
        <div className="border p-4 m-4 rounded-sm flex gap-2">
          <div className="flex-1">{c.name}</div>
          <span className="text-5xl">{c.count}</span>
        </div>
      ))}
    </>
  );
}

export default App;
