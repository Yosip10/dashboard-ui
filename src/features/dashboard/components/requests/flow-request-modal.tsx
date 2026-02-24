import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
interface FlowRequestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const schema = yup.object({
  docType: yup.string().required("El tipo de documento es obligatorio"),
  document: yup.string().required("El número de documento es obligatorio").min(3, "El número de documento debe tener al menos 3 caracteres"),
  key: yup.string().required("La clave de acceso es obligatoria").min(3, "La clave de acceso debe tener al menos 3 caracteres"),
  url: yup.string().required("La URL de solicitud es obligatoria").min(3, "La URL de solicitud debe tener al menos 3 caracteres"),
}).required();

export function FlowRequestModal({ open, onOpenChange }: FlowRequestModalProps) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      docType: "",
      document: "",
      key: "",
      url: "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data)
    onOpenChange(false)

  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Nueva Solicitud de Flujo</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="docType">Tipo de Documento</Label>
            <Select value={watch("docType")} onValueChange={(value) => setValue("docType", value)}>
              <SelectTrigger className="h-11 bg-muted/50 border-transparent focus:border-primary">
                <SelectValue placeholder="Seleccione tipo de documento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Factura">Factura</SelectItem>
                <SelectItem value="Orden de Compra">Orden de Compra</SelectItem>
                <SelectItem value="Nota de Crédito">Nota de Crédito</SelectItem>
              </SelectContent>
            </Select>
            {errors.docType && !watch("docType") && <p className="text-red-500 text-sm">{errors.docType.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="document">Número de Documento</Label>
            <Input
              {...register("document")}
              placeholder="Ej: FAC-2025-0001"
              className="h-11 bg-muted/50 border-transparent focus:border-primary"
            />
            {errors.document && <p className="text-red-500 text-sm">{errors.document.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="key">Clave de Acceso</Label>
            <Input
              {...register("key")}
              placeholder="Ingrese la clave de acceso"
              className="h-11 bg-muted/50 border-transparent focus:border-primary"
            />
            {errors.key && <p className="text-red-500 text-sm">{errors.key.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL de Solicitud</Label>
            <Input
              type="url"
              {...register("url")}
              placeholder="https://api.example.com/flow/..."
              className="h-11 bg-muted/50 border-transparent focus:border-primary"
            />
            {errors.url && <p className="text-red-500 text-sm">{errors.url.message}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} className="flex-1 h-11">
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 bg-linear-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary shadow-lg shadow-primary/25"
            >
              Crear Solicitud
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
