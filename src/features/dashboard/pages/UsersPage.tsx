import { useState } from "react";
import { Eye, Pencil, Trash2, Plus, X, Loader2 } from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Switch } from "@/shared/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { UpdateUserModal } from "../components/update-user-modal";
import { UserDetailsModal } from "../components/user-details-modal";
import { CreateUserModal } from "../components/create-user-modal";
import { DeleteUserAlert } from "../components/delete-user-alert";
import { useUsers } from "../hooks/use-users";
import {
  PaginationControls
} from "@/shared/components/pagination-controls";
import { MOCK_USERS } from "../data/mock-users";


export function UsersPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [isSimulatingLoading, setIsSimulatingLoading] = useState(false);

  const { data: response, isLoading, isError } = useUsers({
    limit: pageSize,
    skip: (page - 1) * pageSize
  }, true); // Enabled mock for simulation

  const [modalOpen, setModalOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const usersData = response?.data?.users || [];
  const totalUsers = MOCK_USERS.length;
  const totalPages = Math.ceil(totalUsers / pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setIsSimulatingLoading(true);
      setTimeout(() => {
        setPage(newPage);
        setIsSimulatingLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 800);
    }
  };


  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleView = (user: any) => {
    setSelectedUser(user);
    setDetailsOpen(true);
  };

  const handleDelete = (user: any) => {
    setSelectedUser(user);
    setDeleteAlertOpen(true);
  };

  const handleNew = () => {
    setCreateModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Cargando usuarios...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <X className="w-8 h-8 mr-2" />
        <span>Error al cargar los usuarios.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UpdateUserModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        user={selectedUser}
      />

      <UserDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        user={selectedUser}
      />

      <CreateUserModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />

      <DeleteUserAlert
        open={deleteAlertOpen}
        onOpenChange={setDeleteAlertOpen}
        user={selectedUser}
      />


      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Usuarios</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona los usuarios del sistema
          </p>
        </div>
        <Button
          onClick={handleNew}
          className="bg-primary hover:bg-primary/80 shadow-lg shadow-primary/25 transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>


      {/* Table */}
      <div className="overflow-hidden rounded-xs relative">
        {isSimulatingLoading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-lg">
            <div className="bg-background p-4 rounded-full shadow-lg border border-primary/20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          </div>
        )}
        <CardHeader className="py-3 bg-muted-foreground/5 rounded mt-2 rounded-t-lg border-t border-l border-r border-gray-200">
          <CardTitle className="text-xl">Lista de Usuarios</CardTitle>
        </CardHeader>
        <CardContent className="p-0 border border-gray-200">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-gray-200">
                  <TableHead className="font-semibold pl-5">Código</TableHead>
                  <TableHead className="font-semibold">Usuario</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Rol</TableHead>
                  <TableHead className="font-semibold">Activo</TableHead>
                  <TableHead className="font-semibold text-right">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersData.map((user) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-primary/5 transition-colors duration-150 border-gray-200"
                  >
                    <TableCell className="text-xs text-muted-foreground max-w-25 truncate pl-5">
                      {user.username}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.firstName} {user.lastName}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles && user.roles.length > 0 ? (
                          user.roles.map((role: any) => (
                            <Badge
                              key={role.id}
                              variant="secondary"
                              className="bg-primary/10 text-primary hover:bg-primary/20 whitespace-nowrap"
                            >
                              {role.name.replace("ROLE-", "")}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-xs">Sin rol</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={user.enabled}
                        disabled
                        className="data-[state=checked]:bg-primary"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                          onClick={() => handleView(user)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                          onClick={() => handleEdit(user)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-red-500/10 hover:text-red-600"
                          onClick={() => handleDelete(user)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalUsers}
          itemsPerPage={pageSize}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}


