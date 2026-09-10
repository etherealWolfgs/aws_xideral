// ----- INTERACCIÓN MEMORY CARD -----
            const memoryBtn = document.getElementById('btnMemoryCard');
            const memoryData = document.getElementById('memoryData');

            if(memoryBtn && memoryData) {
                memoryBtn.addEventListener('click', () => {
                    // Alterna la clase para simular que se inserta
                    memoryBtn.classList.toggle('inserted');
                    // Abre o cierra el contenedor de datos
                    memoryData.classList.toggle('open');
                });
            }