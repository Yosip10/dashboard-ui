"use client";

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

const roles = [
  {
    id: "ROL001",
    name: "Administrador",
    users: [
      { initials: "JS", color: "bg-blue-500" },
      { initials: "PM", color: "bg-purple-500" },
    ],
    modules: ["Usuarios", "Roles", "Configuración", "Reportes", "Logs", "Auditoría", "Contenido", "Medios", "Publicaciones", "Dashboard"],
    active: true,
  },
  {
    id: "ROL002",
    name: "Editor",
    users: [
      { initials: "MG", color: "bg-green-500" },
      { initials: "RR", color: "bg-orange-500" },
    ],
    modules: ["Contenido", "Medios", "Publicaciones", "Dashboard", "Reportes"],
    active: true,
  },
  {
    id: "ROL003",
    name: "Viewer",
    users: [
      { initials: "AL", color: "bg-pink-500" },
      { initials: "CF", color: "bg-teal-500" },
    ],
    modules: ["Dashboard", "Reportes"],
    active: true,
  },
  {
    id: "ROL004",
    name: "Auditor",
    users: [{ initials: "JD", color: "bg-indigo-500" }],
    modules: ["Logs", "Auditoría", "Reportes"],
    active: false,
  },
];

export function RolesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<(typeof roles)[0] | null>(
    null,
  );
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewRole, setViewRole] = useState<(typeof roles)[0] | null>(null);

  const handleViewDetails = (role: (typeof roles)[0]) => {
    setViewRole(role);
    setDetailsModalOpen(true);
  };

  const handleEdit = (role: (typeof roles)[0]) => {
    setSelectedRole(role);
    setModalOpen(true);
  };

  const handleNew = () => {
    setSelectedRole(null);
    setModalOpen(true);
  };

  const handleDelete = (role: (typeof roles)[0]) => {
    setSelectedRole(role);
    setDeleteModalOpen(true);
  };

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
      <div className="overflow-hidden rounded-xs">
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
                {roles.map((role, index) => (
                  <TableRow
                    key={role.id}
                    className="hover:bg-primary/5 transition-colors duration-150"
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
                ))}
              </TableBody>
            </Table>

          </div>

        </CardContent>
      </div>

    </div>
  );
}
