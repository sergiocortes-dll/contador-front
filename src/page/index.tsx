import Counter from "@/components/counters";
import SavedCounter from "@/components/saved-counters";

function Index() {
  return (
    <div className="flex gap-2 justify-center">
      <Counter />
      <SavedCounter />
    </div>
  );
}

export default Index;
