// LUMINA - Sistema de Input
// Gerencia entrada de teclado e controles

export class InputManager {
    constructor() {
        this.keys = {};
        this.previousKeys = {};
        this.setupEventListeners();
        
        // 🐛 DEBUG: Log para verificar se input está funcionando
        console.log('⌨️ Sistema de input inicializado');
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            
            // Prevenir comportamento padrão para espaço
            if (key === ' ') {
                e.preventDefault();
            }
            
            // 🐛 DEBUG: Log para Q e E
            if (key === 'q' || key === 'e') {
                console.log(`🎮 Tecla ${key.toUpperCase()} pressionada`);
            }
            
            this.keys[key] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            this.keys[key] = false;
        });
        
        // Garantir que o canvas tenha foco
        document.addEventListener('click', () => {
            const canvas = document.getElementById('gameCanvas');
            if (canvas) {
                canvas.focus();
            }
        });
        
        // 🔧 CORREÇÃO: Garantir foco no canvas ao carregar
        window.addEventListener('load', () => {
            const canvas = document.getElementById('gameCanvas');
            if (canvas) {
                canvas.setAttribute('tabindex', '0');
                canvas.focus();
            }
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
        const justPressed = this.keys[k] && !this.previousKeys[k];
        
        // 🐛 DEBUG: Log específico para ataques
        if (justPressed && (k === 'q' || k === 'e')) {
            console.log(`⚡ Ataque ${k.toUpperCase()} executado!`);
        }
        
        return justPressed;
    }
    
    getKeys() {
        return this.keys;
    }
}