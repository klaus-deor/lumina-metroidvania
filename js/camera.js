// LUMINA - Sistema de Câmera
// Controla movimento suave da câmera seguindo o jogador

import { CONFIG } from './config.js';

export class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.smoothing = 0.15; // 🎯 AUMENTADO de 0.06 para 0.15 - câmera mais próxima e responsiva
    }
    
    update(player) {
        // Centralizar câmera no jogador
        this.targetX = player.x - CONFIG.CANVAS.WIDTH / 2;
        this.targetY = player.y - CONFIG.CANVAS.HEIGHT / 2;
        
        // Limitar câmera aos limites do mundo
        this.targetX = Math.max(0, Math.min(this.targetX, CONFIG.WORLD.WIDTH - CONFIG.CANVAS.WIDTH));
        this.targetY = Math.max(0, Math.min(this.targetY, CONFIG.WORLD.HEIGHT - CONFIG.CANVAS.HEIGHT));
        
        // Movimento suave mais responsivo
        this.x += (this.targetX - this.x) * this.smoothing;
        this.y += (this.targetY - this.y) * this.smoothing;
    }
    
    // Verificar se um objeto está visível na tela
    isVisible(x, y, width = 0, height = 0) {
        return (
            x + width >= this.x &&
            x <= this.x + CONFIG.CANVAS.WIDTH &&
            y + height >= this.y &&
            y <= this.y + CONFIG.CANVAS.HEIGHT
        );
    }
    
    // Converter coordenadas do mundo para coordenadas da tela
    worldToScreen(worldX, worldY) {
        return {
            x: worldX - this.x,
            y: worldY - this.y
        };
    }
    
    // Converter coordenadas da tela para coordenadas do mundo
    screenToWorld(screenX, screenY) {
        return {
            x: screenX + this.x,
            y: screenY + this.y
        };
    }
}