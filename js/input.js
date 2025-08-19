// LUMINA - Sistema de Input
// Gerencia entrada de teclado e controles

export class InputManager {
    constructor() {
        this.keys = {};
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            
            // Prevenir comportamento padrão para espaço
            if (key === ' ') {
                e.preventDefault();
            }
            
            this.keys[key] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            this.keys[key] = false;
        });
        
        // Garantir que o canvas tenha foco
        document.addEventListener('click', () => {
            document.getElementById('gameCanvas').focus();
        });
    }
    
    isPressed(key) {
        return !!this.keys[key.toLowerCase()];
    }
    
    getKeys() {
        return this.keys;
    }
    
    // Verificar se uma tecla foi pressionada neste frame
    wasJustPressed(key) {
        // Para implementação futura de "just pressed"
        return this.isPressed(key);
    }
}