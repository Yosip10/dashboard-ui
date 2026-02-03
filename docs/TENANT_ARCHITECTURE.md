# Documentación de Arquitectura Multi-Empresa (Multi-Tenant)

Este documento explica cómo funciona el sistema de múltiples empresas en la aplicación, cómo se cargan los colores dinámicamente y cómo se maneja la seguridad en las URLs.

---

## 1. Concepto General

La aplicación está diseñada para funcionar como una **Sola Aplicación para Múltiples Empresas**. Esto significa que el mismo código sirve para "Company A" y "Company B", pero cada una ve sus propios colores, logos y configuraciones.

### ¿Cómo sabe la aplicación qué empresa es?
La aplicación identifica a la empresa a través de un **parámetro en la URL** llamado `tenant` (inquilino/empresa).
*   Ejemplo Empresa A: `tudominio.com/?tenant=companyA`
*   Ejemplo Empresa B: `tudominio.com/?tenant=companyB`

---

## 2. Flujo de Carga (Paso a Paso)

Cuando un usuario entra a la aplicación, ocurre el siguiente proceso automático:

1.  **Intercepción ("El Guardia")**:
    Antes de mostrar cualquier página, un componente llamado `TenantGuard` (El Guardia) detiene el proceso y revisa la URL.

2.  **Validación**:
    *   **¿Existe el parámetro `tenant`?**
        *   NO: Redirige a una página de Error 404.
        *   SI: Continúa al siguiente paso.

3.  **Verificación de Caché (Memoria Local)**:
    El sistema revisa si ya tiene guardada la configuración de esa empresa en el navegador (LocalStorage) para no descargarla otra vez.
    *   **Caso A: Ya la tenemos y coincide.** -> Carga inmediata (0 segundos).
    *   **Caso B: El usuario cambió la empresa manualmente.** -> El sistema detecta que la empresa en la URL es diferente a la guardada. **Cierra la sesión (Logout)** por seguridad, borra la configuración anterior y busca la nueva.
    *   **Caso C: Es la primera vez.** -> Va al paso 4.

4.  **Descarga de Configuración (Backend)**:
    La aplicación se conecta al servidor (simulado) y pide los datos de la empresa (Colores, Logo, Nombre).
    *   *Durante este tiempo se muestra un círculo de carga.*
    *   Si la empresa no existe: Muestra pantalla de "Empresa No Encontrada".

5.  **Aplicación de Estilos**:
    Una vez obtenidos los datos, la aplicación "pintura" toda la interfaz con los colores de esa empresa instantáneamente.

---

## 3. Temas Dinámicos (Colores)

No tenemos archivos de estilos separados para cada empresa. Usamos una técnica llamada **Variables CSS**.

Imagina que en lugar de pintar una pared de "Azul", la reglas dicen "Pintar del color: `Color-Primario`".
Cuando carga la empresa, le decimos al navegador:
*   "Para esta empresa, `Color-Primario` es **Azul**".
*   "Para esta otra, `Color-Primario` es **Verde**".

Esto permite cambiar toda la apariencia sin cambiar el código.

**Datos que se configuran:**
*   **Primary**: Color principal (botones, barras).
*   **Secondary**: Color de soporte.
*   **Accent**: Color para detalles o énfasis.
*   **Background/Foreground**: Colores de fondo y texto.

---

## 4. Manejo de URLs y Seguridad

### ¿Por qué el `?tenant=` está en todas partes?
Necesitamos saber en todo momento en qué empresa está el usuario. Si el usuario recarga la página, el parámetro en la URL es la única forma de "recordar" dónde estaba.

### Protección de Cambio Manual
Si un usuario intenta "hackear" o simplemente cambiar de empresa manualmente editando la URL (cambiando `companyA` por `companyB`):
1.  El sistema detecta el cambio.
2.  **Cierra la sesión inmediatamente**.
3.  Carga la nueva empresa.
4.  Muestra el Login de la nueva empresa.

Esto evita que un usuario logueado en la Empresa A pueda ver datos de la Empresa B simplemente cambiando la URL.

---

## Resumen Técnico (Para Desarrolladores)

*   **TenantGuard (`TenantGuard.tsx`)**: Componente principal que orquesta la lógica.
*   **TenantService (`tenant.service.ts`)**: Simula el API backend.
*   **TenantContext**: Distribuye la data de la empresa a los componentes.
*   **LocalStorage Key**: `current_tenant_config` (Solo se guarda una config a la vez).
*   **CSS Injection**: Se hace directo al `document.documentElement` via JS en el Guard.
