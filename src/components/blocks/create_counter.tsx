import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Spinner } from "../ui/spinner";

interface CreateCounterProps {
  onCounterCreated?: () => void;
}

export default function CreateCounter({
  onCounterCreated,
}: CreateCounterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    createdBy: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (!formData.name.trim() || !formData.createdBy.trim()) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}api/counter`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            description: formData.description.trim(),
            createdBy: formData.createdBy.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Resetear formulario y cerrar sheet
      setFormData({
        name: "",
        description: "",
        createdBy: "",
      });
      setIsOpen(false);

      // Notificar al componente padre
      onCounterCreated?.();
    } catch (error) {
      console.error("Error creating counter:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Resetear formulario cuando se cierra
      setFormData({
        name: "",
        description: "",
        createdBy: "",
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex-1">
          Crear contador
        </Button>
      </SheetTrigger>
      <SheetContent>
        <form onSubmit={handleSubmit}>
          <SheetHeader className="mb-6">
            <SheetTitle>Crear contador</SheetTitle>
            <SheetDescription>
              Añade tu propio contador y permite que los demás vean que andas
              contando ;)
            </SheetDescription>
          </SheetHeader>

          <FieldGroup className="space-y-4 px-4 mb-6">
            <Field>
              <FieldLabel htmlFor="name">
                Nombre del contador <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="name"
                placeholder="Ej: Días sin café"
                value={formData.name}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Descripción</FieldLabel>
              <Input
                id="description"
                placeholder="Ej: Contando los días sin tomar café..."
                value={formData.description}
                onChange={handleInputChange}
                disabled={loading}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="createdBy">
                Creado por <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="createdBy"
                placeholder="Deja tu huella"
                value={formData.createdBy}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            </Field>
          </FieldGroup>

          <SheetFooter className="flex gap-2 sm:justify-end">
            <Button
              type="submit"
              disabled={
                loading || !formData.name.trim() || !formData.createdBy.trim()
              }
              className="gap-2"
            >
              {loading ? (
                <>
                  <Spinner className="h-4 w-4" />
                  Creando...
                </>
              ) : (
                <>
                  Crear contador <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
            <SheetClose asChild>
              <Button type="button" variant="outline" disabled={loading}>
                Cancelar
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
