/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CounterWithCount } from "@/types";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

type SavedCounterProps = {
  favs: number[];
  setFavs: (favs: number[]) => void;
};

function SavedCounter({ favs, setFavs }: SavedCounterProps) {
  const [counters, setCounters] = React.useState<CounterWithCount[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchFavs = async () => {
      try {
        setLoading(true);

        // solo 4 elementos máximo
        const limitedFavs = favs.slice(0, 4);

        const results = await Promise.all(
          limitedFavs.map(async (id) => {
            const res = await fetch(
              `${import.meta.env.VITE_API_BASE_URL}api/counter/with-count/${id}`
            );
            return res.json() as Promise<CounterWithCount>;
          })
        );

        setCounters(results);
      } finally {
        setLoading(false);
      }
    };

    fetchFavs();
  }, [favs]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = favs.indexOf(active.id);
    const newIndex = favs.indexOf(over.id);

    const reordered = arrayMove(favs, oldIndex, newIndex).slice(0, 4);

    setFavs(reordered);
  };

  return (
    <div className="p-4 w-full max-w-md sticky top-0 max-h-dvh overflow-y-auto h-max">
      <div className="rounded-md w-full">
        <h2 className="text-2xl">Contadores favoritos</h2>
      </div>

      {loading ? (
        <p className="p-4">Cargando...</p>
      ) : counters.length === 0 ? (
        <p className="p-4 text-zinc-400">Aún no tienes favoritos.</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={counters.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-4 mt-4">
              {counters.map((c) => (
                <SortableItem key={c.id} id={c.id} counter={c} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

function SortableItem({
  id,
  counter,
}: {
  id: number;
  counter: CounterWithCount;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border p-4 rounded-md cursor-grab active:cursor-grabbing hover:bg-[rgba(255,255,255,.025)]"
    >
      <span className="text-2xl">{counter.name}</span>
      <p>{counter.description}</p>
      <span className="text-zinc-400">Por: {counter.createdBy}</span>
      <div className="text-4xl mt-2">{counter.count}</div>
    </div>
  );
}

export default SavedCounter;
