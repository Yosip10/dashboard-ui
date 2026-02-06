import { Button } from "@/shared/ui/button"
import { Mail } from "lucide-react"
import { Link } from "react-router"

function NotFound() {
    return (
        <main className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 flex items-center justify-center px-4 py-12">
            <div className="max-w-2xl w-full text-center">
                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400/40 rounded-full blur-3xl" />
                    <div className="absolute bottom-[-50px] right-[-100px] w-100 h-100 bg-blue-400/40 rounded-full blur-3xl" />
                </div>

                {/* Content */}
                <div className="relative z-10 space-y-8">
                    {/* Robot Image */}
                    <div className="relative mx-auto w-72 md:w-80 animate-float border-b-2">
                        <img
                            src="/images/robot-404.png"
                            alt="Robot sosteniendo un cartel de error 404"
                            className="w-full h-auto drop-shadow-2xl"
                        />
                    </div>

                    {/* Text Content */}
                    <div className="space-y-4">
                        <p className="text-slate-500 text-lg mx-auto">
                            La dirección URL proporcionada parece ser incorrecta. Le sugerimos verificar el enlace e intentarlo nuevamente o, si lo prefiere, ponerse en contacto con nuestro equipo de soporte técnico para recibir asistencia personalizada.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                        {/*   <Button asChild size="lg" className="gap-2 px-6 bg-slate-800 hover:bg-slate-700">
                            <Link to="/">
                                <Home className="w-4 h-4" />
                                Ir al inicio
                            </Link>
                        </Button> */}
                        <Button asChild variant="outline" size="lg" className="gap-2 px-6 border-slate-300 hover:bg-slate-100 bg-transparent">
                            <Link to="javascript:history.back()">
                                <Mail className="w-4 h-4" />
                                Contactar
                            </Link>
                        </Button>
                    </div>

                </div>
            </div>
        </main>
    )
}
export default NotFound