import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCreateRequestMutation } from "../../hooks/use-create-request";
import { FileText, Loader2 } from "lucide-react";
interface CreateRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const schema = yup
  .object({
    documentType: yup.string().required("El tipo de documento es obligatorio"),
    documentNumber: yup
      .string()
      .required("El número de documento es obligatorio")
      .min(3, "El número de documento debe tener al menos 3 caracteres"),
    riskAmount: yup.string().required("El monto de riesgo es obligatorio"),
    flowType: yup.string().required("El tipo de flujo es obligatorio"),
    callBackUrl: yup
      .string()
      .url("Debe ser una URL válida")
      .required("La URL de solicitud es obligatoria"),
  })
  .required();

export function CreateRequestModal({
  open,
  onOpenChange,
}: CreateRequestModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      documentType: "",
      documentNumber: "",
      riskAmount: "",
      flowType: "",
      callBackUrl: "",
    },
  });
  const { mutate, isPending } = useCreateRequestMutation(onOpenChange, reset);

  const onSubmit = handleSubmit((data) => {
    mutate(data);
  });

  const handleOpenChange = (value: boolean) => {
    onOpenChange(value);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-xl">
        <DialogHeader className="p-6 bg-primary text-white">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5" /> Crear Nueva Solicitud
          </DialogTitle>
          <p className="text-secondary text-sm opacity-90">
            Ingresa los datos para registrar una nueva solicitud en el sistema.
          </p>
        </DialogHeader>

        <form
          onSubmit={onSubmit}
          className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {/* Tipo de Documento */}
            <div className="space-y-2">
              <Label htmlFor="documentType" className="text-sm font-medium">
                Tipo de Documento
              </Label>
              <Select
                value={watch("documentType")}
                onValueChange={(value) => setValue("documentType", value)}
              >
                <SelectTrigger
                  className={errors.documentType ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Seleccione tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Cedula</SelectItem>
                  <SelectItem value="2">Tarjeta de identidad</SelectItem>
                  <SelectItem value="4">Cedula de extrangeria</SelectItem>
                  <SelectItem value="11">Cedula chilena</SelectItem>
                  <SelectItem value="17">PPT</SelectItem>
                  <SelectItem value="20">Pasaporte</SelectItem>
                </SelectContent>
              </Select>
              {errors.documentType && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.documentType.message}
                </p>
              )}
            </div>

            {/* Documento */}
            <div className="space-y-2">
              <Label htmlFor="documentNumber" className="text-sm font-medium">
                Número de Documento
              </Label>
              <Input
                {...register("documentNumber")}
                placeholder="Ej: 1118205789"
                className={errors.documentNumber ? "border-red-500" : ""}
              />
              {errors.documentNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.documentNumber.message}
                </p>
              )}
            </div>

            {/* Monto de Riesgo */}
            <div className="space-y-2">
              <Label htmlFor="riskAmount" className="text-sm font-medium">
                Monto de Riesgo
              </Label>
              <Input
                type="number"
                {...register("riskAmount")}
                placeholder="Ej: 0"
                className={errors.riskAmount ? "border-red-500" : ""}
              />
              {errors.riskAmount && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.riskAmount.message}
                </p>
              )}
            </div>

            {/* Tipo de Flujo */}
            <div className="space-y-2">
              <Label htmlFor="flowType" className="text-sm font-medium">
                Tipo de Flujo
              </Label>
              <Select
                value={watch("flowType")}
                onValueChange={(value) => setValue("flowType", value)}
              >
                <SelectTrigger
                  className={errors.flowType ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Seleccione flujo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Flujo KYC</SelectItem>
                </SelectContent>
              </Select>
              {errors.flowType && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.flowType.message}
                </p>
              )}
            </div>

            {/* Callback URL */}
            <div className="space-y-2">
              <Label htmlFor="callBackUrl" className="text-sm font-medium">
                Callback URL
              </Label>
              <Input
                type="url"
                {...register("callBackUrl")}
                placeholder="https://api.example.com/..."
                className={errors.callBackUrl ? "border-red-500" : ""}
              />
              {errors.callBackUrl && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.callBackUrl.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-border/50">
            <Button
              type="button"
              variant="secondary"
              className="px-8 transition-all hover:bg-gray-100"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="px-10 bg-primary hover:bg-primary/80 text-white"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear Solicitud"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
