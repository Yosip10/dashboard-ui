import { Building2 } from "lucide-react";

function CompanyNotFound() {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
                <div className="max-w-2xl w-full text-center">
                    <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-neutral-900">
                        <Building2 className="h-12 w-12 text-[#f5f5f0]" strokeWidth={1.5} />
                    </div>

                    <h1 className="font-serif text-5xl md:text-7xl font-normal text-neutral-900 mb-6 leading-tight text-balance">
                        Empresa no encontrada
                    </h1>
                    <p className="text-lg md:text-xl text-neutral-600 mb-12 leading-relaxed max-w-lg mx-auto">
                        Lo sentimos, la empresa que buscas no existe en nuestro directorio o
                        ha sido eliminada.
                    </p>


                </div>
            </main>


        </div>
    );
}

export default CompanyNotFound
