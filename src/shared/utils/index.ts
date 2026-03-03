export const formatDate = (date: string) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getStatus = (status: number) => {
  switch (status) {
    case 1:
      return "Creado";
    case 2:
      return "En Proceso";
    case 3:
      return "Finalizado";
    default:
      return "Pendiente";
  }
};
