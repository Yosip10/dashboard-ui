import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";
import { Checkbox } from "@/shared/ui/checkbox";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { Role } from "../../types/roles";
import { ShieldUser } from "lucide-react";

interface RoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role | null;
}

const schema = yup
  .object({
    name: yup
      .string()
      .required("El usuario es obligatorio")
      .min(3, "El nombre debe tener al menos 3 caracteres"),
    modules: yup
      .array()
      .required("Los módulos son obligatorios")
      .min(1, "Debe seleccionar al menos un módulo"),
    active: yup.boolean().required("El estado es obligatorio"),
  })
  .required();

const availableModules = [
  "Usuarios",
  "Roles",
  "Configuración",
  "Reportes",
  "Contenido",
  "Medios",
  "Publicaciones",
  "Dashboard",
  "Logs",
  "Auditoría",
];

export function CreateRoleModal({ open, onOpenChange, role }: RoleModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      modules: [],
      active: true,
    },
    resolver: yupResolver(schema),
  });

  const isEditing = !!role;

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-xl">
        <DialogHeader className="p-6 bg-primary text-white">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <ShieldUser className="w-5 h-5" /> Crear Nuevo Rol
          </DialogTitle>
          <p className="text-secondary text-sm opacity-90">
            Ingresa los datos para registrar un nuevo rol en el sistema.
          </p>
        </DialogHeader>
        <form
          onSubmit={onSubmit}
          className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Rol</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Ingrese el nombre del rol"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label>Módulos Asignados</Label>
            <div className="grid grid-cols-2 gap-3 p-4 bg-muted/30 rounded-xl max-h-48 overflow-y-auto">
              {availableModules.map((module) => (
                <div key={module} className="flex items-center gap-2">
                  <Checkbox
                    id={module}
                    checked={watch("modules").includes(module)}
                    onCheckedChange={() =>
                      setValue(
                        "modules",
                        watch("modules").includes(module)
                          ? watch("modules").filter((m) => m !== module)
                          : [...watch("modules"), module],
                      )
                    }
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor={module} className="text-sm cursor-pointer">
                    {module}
                  </Label>
                </div>
              ))}
            </div>
            {errors.modules && (
              <p className="text-red-500 text-sm">{errors.modules.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="active">Rol Activo</Label>
            <Switch
              id="active"
              {...register("active")}
              checked={watch("active")}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-border/50">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              className="px-8 transition-all hover:bg-gray-100"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="px-10 bg-primary hover:bg-primary/80 text-white"
            >
              {isEditing ? "Guardar Cambios" : "Crear Rol"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
