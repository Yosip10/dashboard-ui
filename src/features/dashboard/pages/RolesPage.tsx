import { useState } from "react";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Switch } from "@/shared/ui/switch";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import { RoleModal } from "../components/role-modal";
import { RoleDetailsModal } from "../components/role-details-modal";
import DeleteRolesAlert from "../components/delete-roles-alert";
import { PaginationControls } from "@/shared/components/pagination-controls";
import { Loader2, X } from "lucide-react";
import { MOCK_ROLES } from "../data/mock-roles";
import { useRoles } from "../hooks/use-roles";
import { useSearch } from "@/shared/hooks";

export function RolesPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [isSimulatingLoading, setIsSimulatingLoading] = useState(false);
  const { search, column } = useSearch();

  const { data: response, isLoading, isError } = useRoles({
    limit: pageSize,
    skip: (page - 1) * pageSize,
    search,
    column
  }, true);

  const rolesData = response?.data?.roles || [];
  const totalRoles = MOCK_ROLES.length;
  const totalPages = Math.ceil(totalRoles / pageSize);

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

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<(typeof MOCK_ROLES)[0] | null>(
    null,
  );
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewRole, setViewRole] = useState<(typeof MOCK_ROLES)[0] | null>(null);

  const handleViewDetails = (role: (typeof MOCK_ROLES)[0]) => {
    setViewRole(role);
    setDetailsModalOpen(true);
  };

  const handleEdit = (role: (typeof MOCK_ROLES)[0]) => {
    setSelectedRole(role);
    setModalOpen(true);
  };

  const handleNew = () => {
    setSelectedRole(null);
    setModalOpen(true);
  };

  const handleDelete = (role: (typeof MOCK_ROLES)[0]) => {
    setSelectedRole(role);
    setDeleteModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Cargando roles...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <X className="w-8 h-8 mr-2" />
        <span>Error al cargar los roles.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RoleModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        role={selectedRole}
      />
      <RoleDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        role={viewRole}
      />
      <DeleteRolesAlert
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        role={selectedRole}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Roles</h1>
          <p className="text-muted-foreground mt-1">
            Administra los roles y permisos
          </p>
        </div>
        <Button
          onClick={handleNew}
          className="bg-primary hover:bg-primary/80 shadow-lg shadow-primary/25 transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Rol
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
          <CardTitle className="text-xl">Lista de Roles</CardTitle>
        </CardHeader>
        <CardContent className="p-0 border border-gray-200">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-gray-200">
                  <TableHead className="font-semibold pl-5">Código</TableHead>
                  <TableHead className="font-semibold">Nombre del Rol</TableHead>
                  <TableHead className="font-semibold">Usuarios</TableHead>
                  <TableHead className="font-semibold">Módulos</TableHead>
                  <TableHead className="font-semibold">Activo</TableHead>
                  <TableHead className="font-semibold text-right">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rolesData.length ? rolesData.map((role, index) => (
                  <TableRow
                    key={role.id}
                    className="hover:bg-primary/5 transition-colors duration-150 border-gray-200"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell className="font-mono text-sm text-muted-foreground pl-5">
                      {role.id}
                    </TableCell>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>
                      <div className="flex -space-x-2">
                        {role.users.map((user, i) => (
                          <Avatar
                            key={i}
                            className="w-8 h-8 border-2 border-background"
                          >
                            <AvatarFallback
                              className={`${user.color} text-white text-xs`}
                            >
                              {user.initials}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {role.modules.slice(0, 3).map((module) => (
                          <Badge
                            key={module}
                            variant="secondary"
                            className="bg-primary/10 text-primary hover:bg-primary/20 text-xs"
                          >
                            {module}
                          </Badge>
                        ))}
                        {role.modules.length > 3 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant="secondary"
                                className="bg-muted text-muted-foreground text-xs cursor-help"
                              >
                                +{role.modules.length - 3}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="flex flex-col gap-1">
                                {role.modules.slice(3).map((module) => (
                                  <span key={module}>{module}</span>
                                ))}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={role.active}
                        className="data-[state=checked]:bg-primary"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                          onClick={() => handleViewDetails(role)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                          onClick={() => handleEdit(role)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-red-500/10 hover:text-red-600"
                          onClick={() => handleDelete(role)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No se encontraron roles
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

          </div>

        </CardContent>

        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalRoles}
          itemsPerPage={pageSize}
          onPageChange={handlePageChange}
        />
      </div>

    </div>
  );
}
