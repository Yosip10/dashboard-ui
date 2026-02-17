import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Switch } from "@/shared/ui/switch"
import { Checkbox } from "@/shared/ui/checkbox"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

interface RoleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role?: {
    id: string
    name: string
    modules: string[]
    active: boolean
  } | null
}

const schema = yup.object({
  name: yup.string().required("El usuario es obligatorio").min(3, "El nombre debe tener al menos 3 caracteres"),
  modules: yup.array().required("Los módulos son obligatorios").min(1, "Debe seleccionar al menos un módulo"),
  active: yup.boolean().required("El estado es obligatorio"),
}).required();

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
]

export function RoleModal({ open, onOpenChange, role }: RoleModalProps) {

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


  const isEditing = !!role




  const onSubmit = handleSubmit((data) => {
    console.log(data)
    onOpenChange(false)

  })



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{isEditing ? "Editar Rol" : "Nuevo Rol"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Rol</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Ingrese el nombre del rol"
              className="h-11 bg-muted/50 border-transparent focus:border-primary"
              required
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div className="space-y-3">
            <Label>Módulos Asignados</Label>
            <div className="grid grid-cols-2 gap-3 p-4 bg-muted/30 rounded-xl max-h-48 overflow-y-auto">
              {availableModules.map((module) => (
                <div key={module} className="flex items-center gap-2">
                  <Checkbox
                    id={module}
                    checked={watch("modules").includes(module)}
                    onCheckedChange={() => setValue("modules", watch("modules").includes(module) ? watch("modules").filter((m) => m !== module) : [...watch("modules"), module])}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor={module} className="text-sm cursor-pointer">
                    {module}
                  </Label>
                </div>
              ))}
            </div>
            {errors.modules && <p className="text-red-500 text-sm">{errors.modules.message}</p>}
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

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} className="flex-1 h-11">
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/25"
            >
              {isEditing ? "Guardar Cambios" : "Crear Rol"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
