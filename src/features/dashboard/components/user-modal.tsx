

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import { Switch } from "@/shared/ui/switch"

interface UserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: {
    id: string
    username: string
    role: string
    branch: string
    active: boolean
  } | null
}

export function UserModal({ open, onOpenChange, user }: UserModalProps) {
  const isEditing = !!user
  const [formData, setFormData] = useState({
    username: user?.username || "",
    role: user?.role || "",
    branch: user?.branch || "",
    password: "",
    active: user?.active ?? true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{isEditing ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="username">Nombre de Usuario</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Ingrese el nombre de usuario"
              className="h-11 bg-muted/50 border-transparent focus:border-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger className="h-11 bg-muted/50 border-transparent focus:border-primary">
                <SelectValue placeholder="Seleccione un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Administrador">Administrador</SelectItem>
                <SelectItem value="Editor">Editor</SelectItem>
                <SelectItem value="Viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch">Sucursal</Label>
            <Select value={formData.branch} onValueChange={(value) => setFormData({ ...formData, branch: value })}>
              <SelectTrigger className="h-11 bg-muted/50 border-transparent focus:border-primary">
                <SelectValue placeholder="Seleccione una sucursal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Central">Central</SelectItem>
                <SelectItem value="Norte">Norte</SelectItem>
                <SelectItem value="Sur">Sur</SelectItem>
                <SelectItem value="Este">Este</SelectItem>
                <SelectItem value="Oeste">Oeste</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{isEditing ? "Nueva Contraseña (opcional)" : "Contraseña"}</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={isEditing ? "Dejar en blanco para no cambiar" : "Ingrese la contraseña"}
              className="h-11 bg-muted/50 border-transparent focus:border-primary"
              required={!isEditing}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="active">Usuario Activo</Label>
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} className="flex-1 h-11">
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 bg-linear-to-r from-primary/20 to-red/50 hover:from-primary/80 hover:to-primary/90 shadow-lg shadow-primary/25"
            >
              {isEditing ? "Guardar Cambios" : "Crear Usuario"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
