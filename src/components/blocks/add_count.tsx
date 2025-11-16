import type { CounterWithCount, Reason } from "@/types";
import { ArrowUp, Plus } from "lucide-react";
import * as React from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";

interface AddCountProps {
  counter: CounterWithCount;
  onCountAdded?: () => void;
}

export default function AddCount({ counter, onCountAdded }: AddCountProps) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [reasons, setReasons] = React.useState<Reason[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [selectedReasonId, setSelectedReasonId] = React.useState<number | null>(
    null
  );
  const [createdBy, setCreatedBy] = React.useState<string>("");
  const [showNewReasonInput, setShowNewReasonInput] =
    React.useState<boolean>(false);
  const [newReasonName, setNewReasonName] = React.useState<string>("");
  const [creatingReason, setCreatingReason] = React.useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = React.useState<number>(0);

  const fetchReasons = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}api/reason/by-counter/${
          counter.id
        }`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data: Reason[] = await response.json();
      setReasons(data);

      // Seleccionar automáticamente la primera razón si existe
      if (data.length > 0) {
        setSelectedReasonId(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching reasons:", error);
    } finally {
      setLoading(false);
    }
  }, [counter.id, refreshTrigger]); // Añadimos refreshTrigger como dependencia

  React.useEffect(() => {
    if (isOpen) {
      fetchReasons();
    }
  }, [isOpen, fetchReasons]);

  // Función para forzar refresco de datos
  const refreshData = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleCreateReason = async () => {
    if (!newReasonName.trim() || !createdBy.trim()) {
      return;
    }

    try {
      setCreatingReason(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}api/reason`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newReasonName.trim(),
            counterId: counter.id,
            count: 1
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const newReason: Reason = await response.json();

      // Refrescar los datos para obtener la lista actualizada
      refreshData();

      // Seleccionar la nueva razón automáticamente
      setSelectedReasonId(newReason.id);
      setNewReasonName("");
      setShowNewReasonInput(false);

      // Cerrar el diálogo y notificar
      setIsOpen(false);
      onCountAdded?.();
    } catch (error) {
      console.error("Error creating reason:", error);
    } finally {
      setCreatingReason(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Si estamos mostrando el input de nueva razón, crear la razón
    if (showNewReasonInput) {
      await handleCreateReason();
      return;
    }

    // Flujo normal: incrementar razón existente
    if (!selectedReasonId || !createdBy.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }api/reason/increment/${selectedReasonId}/${counter.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ createdBy: createdBy.trim() }), // Añadir el cuerpo con createdBy
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Refrescar los datos para obtener los contadores actualizados
      refreshData();

      // Resetear formulario y cerrar diálogo
      setCreatedBy("");
      setIsOpen(false);

      // Notificar al componente padre
      onCountAdded?.();
    } catch (error) {
      console.error("Error updating count:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // Al abrir, refrescar los datos para tener la información más reciente
      refreshData();
    } else {
      // Resetear estado cuando se cierra el diálogo
      setCreatedBy("");
      setSelectedReasonId(null);
      setShowNewReasonInput(false);
      setNewReasonName("");
    }
  };

  const shouldShowNewReasonInput = showNewReasonInput || reasons.length === 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button disabled variant="outline" className="gap-2">
          Añadir <ArrowUp className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{counter.name}</DialogTitle>
            <DialogDescription>{counter.description}</DialogDescription>
          </DialogHeader>

          <FieldGroup className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-6">
                <Spinner className="h-8 w-8" />
              </div>
            ) : (
              <>
                <FieldSet>
                  <Field>
                    <FieldLabel htmlFor="createdBy">
                      Enviado por: <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id="createdBy"
                      placeholder="Escribe tu nombre ;)"
                      value={createdBy}
                      onChange={(e) => setCreatedBy(e.target.value)}
                      disabled={submitting || creatingReason}
                    />
                  </Field>
                </FieldSet>

                {/* Mostrar input de nueva razón si no hay razones o el usuario quiere añadir una */}
                {shouldShowNewReasonInput && (
                  <FieldSet>
                    <Field>
                      <FieldLabel htmlFor="newReason">
                        Nueva razón: <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        id="newReason"
                        placeholder="Describe la razón..."
                        value={newReasonName}
                        onChange={(e) => setNewReasonName(e.target.value)}
                        disabled={submitting || creatingReason}
                      />
                    </Field>
                  </FieldSet>
                )}

                {/* Mostrar lista de razones existentes si hay razones y no estamos en modo nueva razón */}
                {!shouldShowNewReasonInput && reasons.length > 0 && (
                  <FieldSet>
                    <div className="flex justify-between items-center">
                      <FieldLabel>
                        Selecciona una razón:{" "}
                        <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowNewReasonInput(true)}
                        className="gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Nueva razón
                      </Button>
                    </div>
                    <FieldGroup className="max-h-60 overflow-y-auto gap-2">
                      {reasons.map((reason) => (
                        <div
                          key={reason.id}
                          className="flex items-center space-x-2 p-2 rounded-2xl mr-3 border"
                        >
                          <input
                            type="radio"
                            id={`reason-${reason.id}`}
                            name="reason"
                            value={reason.id}
                            checked={selectedReasonId === reason.id}
                            onChange={() => setSelectedReasonId(reason.id)}
                            disabled={submitting}
                            className="h-4 w-4"
                          />
                          <FieldLabel
                            htmlFor={`reason-${reason.id}`}
                            className="flex-1 font-normal cursor-pointer"
                          >
                            {reason.name}
                          </FieldLabel>
                          <span className="text-sm bg-secondary border px-2 py-1 rounded-2xl">
                            {reason.count}
                          </span>
                        </div>
                      ))}
                    </FieldGroup>
                  </FieldSet>
                )}

                {/* Mostrar botón para añadir primera razón si no hay razones */}
                {!shouldShowNewReasonInput &&
                  reasons.length === 0 &&
                  !loading && (
                    <div className="text-center py-4 space-y-3">
                      <div className="text-gray-500">
                        No hay razones disponibles para este contador
                      </div>
                      <Button
                        type="button"
                        onClick={() => setShowNewReasonInput(true)}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Crear primera razón
                      </Button>
                    </div>
                  )}
              </>
            )}
          </FieldGroup>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={submitting || creatingReason}
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={
                submitting ||
                creatingReason ||
                loading ||
                !createdBy.trim() ||
                (shouldShowNewReasonInput
                  ? !newReasonName.trim()
                  : !selectedReasonId)
              }
              className="gap-2"
            >
              {submitting || creatingReason ? (
                <>
                  <Spinner className="h-4 w-4" />
                  {creatingReason ? "Creando..." : "Procesando..."}
                </>
              ) : (
                <>
                  {shouldShowNewReasonInput ? "Crear razón" : "Añadir"}
                  <ArrowUp className="h-4 w-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
