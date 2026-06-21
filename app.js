// Credenciales de Supabase
const supabaseUrl = 'https://kvntozwuwnyluzqxzqsp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2bnRvend1d255bHV6cXh6cXNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5OTg0MjgsImV4cCI6MjA5NzU3NDQyOH0.nS3uqEYmrIRqF8y4p4V5fKTCXeRxZKXoB-iOJyIdOxo';

// Inicializar cliente
let supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
console.log("AIRHVAC: Supabase inicializado y listo.");

// Conectar con el NUEVO formulario
const form = document.getElementById('hvac-form');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Obtener los datos del cliente
        const nombre = document.getElementById('nombre').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const servicio = document.getElementById('servicio').value;
        const submitBtn = form.querySelector('button[type="submit"]');

        // 2. Cambiar el botón a estado "Enviando..."
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="relative z-10 flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-widest py-1">Enviando...</span>`;

        try {
            // 3. Enviar a Supabase
            const { data, error } = await supabaseClient
                .from('solicitudes_presupuesto')
                .insert([
                    {
                        nombre: nombre,
                        telefono: telefono,
                        correo: correo,
                        servicio_requerido: servicio
                    }
                ]);

            if (error) {
                console.error("Error de Supabase:", error);
                throw error;
            }

            // 4. Si todo sale bien, mostrar el mensaje verde de éxito
            document.getElementById('mensaje-exito').classList.remove('hidden');
            form.reset(); // Limpiar el formulario

        } catch (err) {
            console.error("Error al enviar:", err);
            alert("Hubo un error de conexión con la base de datos. Verifica tu internet o intenta de nuevo.");
        } finally {
            // 5. Regresar el botón a la normalidad si hay error
            if (submitBtn.disabled) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `
                    <span class="relative z-10 flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-widest py-1">
                        Solicitar Cotización
                        <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </span>
                    <div class="absolute inset-0 w-full h-full bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
                `;
            }
        }
    });
}