import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useDeleteUserMutation } from "../hooks/use-delete-user";

interface DeleteUserAlertProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: { id: string; username: string } | null;
}

export function DeleteUserAlert({ open, onOpenChange, user }: DeleteUserAlertProps) {
    const { mutate: deleteUser, isPending } = useDeleteUserMutation();

    const handleDelete = () => {
        if (user) {
            deleteUser(user.id, {
                onSuccess: () => {
                    onOpenChange(false);
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] border-none shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <Trash2 className="w-5 h-5" /> Confirmar Eliminación
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                        ¿Estás seguro que deseas eliminar al usuario <span className="font-semibold text-foreground">@{user?.username}</span>?
                        <br />
                        Esta acción no se puede deshacer.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                    <Button
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isPending}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Eliminando...
                            </>
                        ) : (
                            "Eliminar Usuario"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
