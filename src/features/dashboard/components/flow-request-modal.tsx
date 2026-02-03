


import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"

interface FlowRequestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FlowRequestModal({ open, onOpenChange }: FlowRequestModalProps) {
  const [formData, setFormData] = useState({
    docType: "",
    document: "",
    key: "",
    url: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Nueva Solicitud de Flujo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="docType">Tipo de Documento</Label>
            <Select value={formData.docType} onValueChange={(value) => setFormData({ ...formData, docType: value })}>
              <SelectTrigger className="h-11 bg-muted/50 border-transparent focus:border-blue-500">
                <SelectValue placeholder="Seleccione tipo de documento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Factura">Factura</SelectItem>
                <SelectItem value="Orden de Compra">Orden de Compra</SelectItem>
                <SelectItem value="Nota de Crédito">Nota de Crédito</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="document">Número de Documento</Label>
            <Input
              id="document"
              value={formData.document}
              onChange={(e) => setFormData({ ...formData, document: e.target.value })}
              placeholder="Ej: FAC-2025-0001"
              className="h-11 bg-muted/50 border-transparent focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="key">Clave de Acceso</Label>
            <Input
              id="key"
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              placeholder="Ingrese la clave de acceso"
              className="h-11 bg-muted/50 border-transparent focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL de Solicitud</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://api.example.com/flow/..."
              className="h-11 bg-muted/50 border-transparent focus:border-blue-500"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1 h-11">
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25"
            >
              Crear Solicitud
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
