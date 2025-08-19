// LUMINA - Sistema de Input
// Gerencia entrada de teclado e controles

export class InputManager {
    constructor() {
        this.keys = {};
        this.previousKeys = {};
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
    
    update() {
        // Atualizar estado anterior das teclas
        this.previousKeys = { ...this.keys };
    }
    
    isPressed(key) {
        return !!this.keys[key.toLowerCase()];
    }
    
    wasJustPressed(key) {
        const k = key.toLowerCase();
        return this.keys[k] && !this.previousKeys[k];
    }
    
    getKeys() {
        return this.keys;
    }
}