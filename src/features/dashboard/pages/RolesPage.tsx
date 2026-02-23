import { useState } from "react";
import { Eye, Pencil, Trash2, Plus, Shield } from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Avatar, AvatarFallback, AvatarGroup } from "@/shared/ui/avatar";
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
import { RolePermissionsModal } from "../components/role-permissions-modal";
import DeleteRolesAlert from "../components/delete-roles-alert";
import { PaginationControls } from "@/shared/components/pagination-controls";
import { Loader2, X } from "lucide-react";
import { MOCK_ROLES } from "../data/mock-roles";
import { useRoles } from "../hooks/use-roles";
import { useSearch } from "@/shared/hooks";
import { useRoleMembers } from "../hooks/use-role-members";
import type { Role } from "../types/roles";

const formatName = (name: string) =>
  name.replace(/^MODULE[- ]/i, "").replace(/^\w/, (c: string) => c.toUpperCase());

/* Sub-component: fetches & renders member avatars for a single role */
function RoleMembersCell({ roleId }: { roleId: string }) {
  const { data: members, isLoading } = useRoleMembers(roleId);
  const MAX = 4;

  if (isLoading) {
    return <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />;
  }
  if (!members || members.length === 0) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  const visible = members.slice(0, MAX);
  const rest = members.slice(MAX);

  function initials(m: { firstName?: string; lastName?: string; username: string }) {
    if (m.firstName && m.lastName) return `${m.firstName[0]}${m.lastName[0]}`.toUpperCase();
    return m.username.slice(0, 2).toUpperCase();
  }

  const BG_COLORS = ["bg-sky-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500"];

  return (
    <div className="flex items-center gap-1">
      <AvatarGroup>
        {visible.map((m, i) => (
          <Tooltip key={m.id}>
            <TooltipTrigger asChild>
              <Avatar className="w-8 h-8 border-2 border-background cursor-pointer">
                <AvatarFallback className={`${BG_COLORS[i % BG_COLORS.length]} text-white text-xs`}>
                  {initials(m)}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{m.firstName ? `${m.firstName} ${m.lastName ?? ""}`.trim() : m.username}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </AvatarGroup>
      {rest.length > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary" className="text-xs cursor-help ml-1">
              +{rest.length}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex flex-col gap-1">
              {rest.map((m) => (
                <span key={m.id}>
                  {m.firstName ? `${m.firstName} ${m.lastName ?? ""}`.trim() : m.username}
                </span>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}


export function RolesPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [isSimulatingLoading, setIsSimulatingLoading] = useState(false);
  const { search, column } = useSearch();

  const { data: roles, isLoading, isError } = useRoles({
    limit: pageSize,
    skip: (page - 1) * pageSize,
    search,
    column
  }, true);

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
  const [selectedRole, setSelectedRole] = useState<Role | null>(
    null,
  );
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewRole, setViewRole] = useState<Role | null>(null);
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);
  const [permissionsRole, setPermissionsRole] = useState<Role | null>(null);

  const handleViewDetails = (role: Role) => {
    setViewRole(role);
    setDetailsModalOpen(true);
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setModalOpen(true);
  };

  const handleNew = () => {
    setSelectedRole(null);
    setModalOpen(true);
  };

  const handleDelete = (role: Role) => {
    setSelectedRole(role);
    setDeleteModalOpen(true);
  };

  const handlePermissions = (role: Role) => {
    setPermissionsRole(role);
    setPermissionsModalOpen(true);
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
      <RolePermissionsModal
        open={permissionsModalOpen}
        onOpenChange={setPermissionsModalOpen}
        role={permissionsRole}
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
                  <TableHead className="font-semibold">Nombre del Rol</TableHead>
                  <TableHead className="font-semibold">Usuarios</TableHead>
                  <TableHead className="font-semibold">Módulos</TableHead>
                  <TableHead className="font-semibold">Descripción</TableHead>
                  <TableHead className="font-semibold text-right">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles?.length ? roles.map((role, index) => (
                  <TableRow
                    key={role.id}
                    className="hover:bg-primary/5 transition-colors duration-150 border-gray-200"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >

                    <TableCell className="font-medium">
                      {formatName(role.name.split("-")[1])}
                    </TableCell>
                    <TableCell>
                      <RoleMembersCell roleId={role.id} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <AvatarGroup>
                          {role.attributes.modulesLinked.slice(0, 5).map((module) => {
                            const moduleData = JSON.parse(module);
                            const formattedName = formatName(moduleData.name);
                            return (
                              <Tooltip key={module}>
                                <TooltipTrigger asChild>
                                  <Avatar className="w-8 h-8 border-2 border-background cursor-pointer">
                                    <AvatarFallback className="bg-primary text-white text-xs">
                                      {formattedName[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{formattedName}</p>
                                </TooltipContent>
                              </Tooltip>
                            );
                          })}
                        </AvatarGroup>
                        {role.attributes.modulesLinked.length > 5 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant="secondary"
                                className="bg-muted text-muted-foreground text-xs cursor-help ml-1"
                              >
                                +{role.attributes.modulesLinked.length - 5}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="flex flex-col gap-1">
                                {role.attributes.modulesLinked.slice(5).map((module) => {
                                  const moduleData = JSON.parse(module);
                                  return (
                                    <span key={module}>
                                      {formatName(moduleData.name)}
                                    </span>
                                  );
                                })}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <p>{role.attributes.description.join(", ")}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                              onClick={() => handlePermissions(role)}
                            >
                              <Shield className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Gestionar permisos</TooltipContent>
                        </Tooltip>
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
