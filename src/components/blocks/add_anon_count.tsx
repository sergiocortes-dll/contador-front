import type { CounterWithCount } from "@/types";
import { ArrowUp, ArrowUpFromDot } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Spinner } from "../ui/spinner";

interface AddAnonCountProps {
  counter: CounterWithCount;
  onCountAdded?: () => void;
}

export default function AddAnonCount({
  counter,
  onCountAdded,
}: AddAnonCountProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleIncrement = async () => {
    try {
      setLoading(true);

      // Enviar petición POST con reasonId = 0
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}api/reason/increment/0/${
          counter.id
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Cerrar el drawer y notificar al componente padre
      setIsOpen(false);
      onCountAdded?.();
    } catch (error) {
      console.error("Error incrementing count:", error);
      // No mostrar toast como se solicitó
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button variant="secondary">Añadir anonimamente <ArrowUpFromDot /></Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{counter.name}</DrawerTitle>
            <DrawerDescription>{counter.description}</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <div className="flex-1 text-center">
                <div className="text-7xl font-bold tracking-tighter">
                  {counter.count}
                </div>
                <div className="text-muted-foreground text-[0.70rem] uppercase">
                  Contadas
                </div>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Button
              onClick={handleIncrement}
              disabled={loading}
              className="gap-2"
            >
              {loading ? (
                <>
                  <Spinner className="h-4 w-4" />
                  Añadiendo...
                </>
              ) : (
                <>
                  Añadir <ArrowUp />
                </>
              )}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" disabled={loading}>
                Cancelar
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
