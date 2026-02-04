import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Switch } from "@/shared/ui/switch"
import { Checkbox } from "@/shared/ui/checkbox"

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
  const isEditing = !!role
  const [formData, setFormData] = useState({
    name: role?.name || "",
    modules: role?.modules || [],
    active: role?.active ?? true,
  })

  const toggleModule = (module: string) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.includes(module) ? prev.modules.filter((m) => m !== module) : [...prev.modules, module],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{isEditing ? "Editar Rol" : "Nuevo Rol"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Rol</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ingrese el nombre del rol"
              className="h-11 bg-muted/50 border-transparent focus:border-primary"
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Módulos Asignados</Label>
            <div className="grid grid-cols-2 gap-3 p-4 bg-muted/30 rounded-xl max-h-48 overflow-y-auto">
              {availableModules.map((module) => (
                <div key={module} className="flex items-center gap-2">
                  <Checkbox
                    id={module}
                    checked={formData.modules.includes(module)}
                    onCheckedChange={() => toggleModule(module)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor={module} className="text-sm cursor-pointer">
                    {module}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="active">Rol Activo</Label>
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1 h-11">
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
