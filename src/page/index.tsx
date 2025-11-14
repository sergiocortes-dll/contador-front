import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ArrowUp } from "lucide-react";
import React from "react";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Spinner } from "../components/ui/spinner";
import type { CounterWithCount } from "../types";

function Index() {
  const [counters, setCounters] = React.useState<CounterWithCount[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | unknown>("");

  async function getCountersWithCount() {
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
  }

  React.useEffect(() => {
    getCountersWithCount();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4 p-4">
        <Button variant="outline">Añadir contador</Button>

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
                className="border p-4 h-auto gap-4 flex flex-col items-start rounded-md hover:bg-accent cursor-pointer"
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

                <div className="flex gap-2 justify-end w-full">
                  <Button variant="ghost">Añadir anonimamente</Button>

                  <Dialog>
                    <form>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          Añadir <ArrowUp />
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>{c.name}</DialogTitle>
                          <DialogDescription>{c.description}</DialogDescription>
                        </DialogHeader>

                        <FieldGroup>
                          <FieldSet>
                            <FieldGroup>
                              <Field>
                                <FieldLabel htmlFor="createdBy">
                                  Enviado por:
                                </FieldLabel>
                                <Input
                                  id="createdBy"
                                  placeholder="Escribe tu nombre ;)"
                                />
                              </Field>
                            </FieldGroup>
                          </FieldSet>
                        </FieldGroup>

                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancelar</Button>
                          </DialogClose>

                          <Button type="submit">
                            Añadir <ArrowUp />
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </form>
                  </Dialog>
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
