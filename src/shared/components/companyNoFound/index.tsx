"use client";

import { useState } from "react";
import { Building2, Search, ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

export default function CompanyNotFound() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="min-h-screen flex flex-col">


            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
                <div className="max-w-2xl w-full text-center">
                    {/* Icon */}
                    <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-neutral-900">
                        <Building2 className="h-12 w-12 text-[#f5f5f0]" strokeWidth={1.5} />
                    </div>

                    {/* Title */}
                    <h1 className="font-serif text-5xl md:text-7xl font-normal text-neutral-900 mb-6 leading-tight text-balance">
                        Empresa no encontrada
                    </h1>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-neutral-600 mb-12 leading-relaxed max-w-lg mx-auto">
                        Lo sentimos, la empresa que buscas no existe en nuestro directorio o
                        ha sido eliminada.
                    </p>


                </div>
            </main>


        </div>
    );
}
