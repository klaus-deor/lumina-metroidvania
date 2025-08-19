// LUMINA - Sistema de Mundo
// Recria exatamente o layout desenhado pelo Klaus

import { CONFIG } from './config.js';

export class World {
    constructor() {
        this.platforms = [];
        this.essences = [];
        this.generateWorld();
    }
    
    generateWorld() {
        // Baseado na imagem desenhada pelo Klaus
        // Estrutura metroidvania com múltiplos caminhos
        
        this.platforms = [
            // === CHÃO BASE (parte inferior larga do desenho) ===
            { x: 0, y: 1000, width: 600, height: 40 },
            
            // === ÁREA ESQUERDA - Plataformas pequenas em sequência ===
            { x: 50, y: 900, width: 80, height: 15 },
            { x: 30, y: 850, width: 60, height: 10 },
            { x: 80, y: 800, width: 70, height: 10 },
            { x: 40, y: 750, width: 60, height: 10 },
            { x: 90, y: 700, width: 80, height: 10 },
            { x: 60, y: 650, width: 50, height: 10 },
            { x: 100, y: 600, width: 70, height: 10 },
            
            // === PILAR CENTRAL GRANDE (estrutura vertical do desenho) ===
            { x: 280, y: 500, width: 25, height: 500 },
            
            // === PLATAFORMAS MÉDIAS (área central-esquerda) ===
            { x: 180, y: 850, width: 120, height: 20 },
            { x: 200, y: 780, width: 100, height: 15 },
            { x: 150, y: 720, width: 90, height: 15 },
            { x: 180, y: 660, width: 80, height: 15 },
            { x: 160, y: 600, width: 100, height: 15 },
            { x: 200, y: 540, width: 80, height: 15 },
            
            // === ÁREA CENTRAL-DIREITA ===
            { x: 350, y: 900, width: 150, height: 20 },
            { x: 400, y: 820, width: 120, height: 15 },
            { x: 370, y: 760, width: 100, height: 15 },
            { x: 420, y: 700, width: 90, height: 15 },
            { x: 380, y: 640, width: 110, height: 15 },
            
            // === ESTRUTURA SUPERIOR DIREITA (área complexa do desenho) ===
            
            // Base direita
            { x: 550, y: 850, width: 180, height: 20 },
            { x: 600, y: 780, width: 140, height: 15 },
            { x: 570, y: 720, width: 120, height: 15 },
            { x: 620, y: 660, width: 100, height: 15 },
            
            // Estrutura vertical direita
            { x: 750, y: 600, width: 25, height: 250 },
            { x: 700, y: 700, width: 80, height: 15 },
            { x: 780, y: 650, width: 70, height: 15 },
            { x: 720, y: 600, width: 60, height: 15 },
            
            // Área superior direita - estrutura em escada
            { x: 800, y: 500, width: 150, height: 20 },
            { x: 850, y: 450, width: 120, height: 15 },
            { x: 900, y: 400, width: 100, height: 15 },
            { x: 950, y: 350, width: 80, height: 15 },
            { x: 1000, y: 300, width: 120, height: 15 },
            
            // === ESTRUTURA SUPERIOR CENTRAL ===
            { x: 350, y: 450, width: 120, height: 15 },
            { x: 400, y: 400, width: 100, height: 15 },
            { x: 450, y: 350, width: 80, height: 15 },
            { x: 500, y: 300, width: 90, height: 15 },
            
            // === PLATAFORMAS PEQUENAS ESPALHADAS (linhas pequenas do desenho) ===
            { x: 120, y: 550, width: 40, height: 8 },
            { x: 140, y: 500, width: 35, height: 8 },
            { x: 110, y: 450, width: 45, height: 8 },
            { x: 130, y: 400, width: 40, height: 8 },
            { x: 100, y: 350, width: 50, height: 8 },
            
            // Plataformas médias espalhadas
            { x: 520, y: 580, width: 60, height: 8 },
            { x: 540, y: 530, width: 55, height: 8 },
            { x: 510, y: 480, width: 65, height: 8 },
            { x: 560, y: 430, width: 50, height: 8 },
            
            // === ESTRUTURA FINAL DIREITA (extremidade) ===
            { x: 1100, y: 700, width: 120, height: 20 },
            { x: 1150, y: 650, width: 100, height: 15 },
            { x: 1120, y: 600, width: 90, height: 15 },
            { x: 1180, y: 550, width: 80, height: 15 },
            { x: 1140, y: 500, width: 100, height: 15 },
            { x: 1200, y: 450, width: 120, height: 15 },
            
            // Estrutura em escada final (canto superior direito)
            { x: 1250, y: 400, width: 80, height: 15 },
            { x: 1300, y: 350, width: 70, height: 15 },
            { x: 1350, y: 300, width: 60, height: 15 },
            { x: 1400, y: 250, width: 100, height: 15 },
            
            // === ÁREA SUPERIOR (topo do desenho) ===
            { x: 200, y: 280, width: 120, height: 12 },
            { x: 350, y: 260, width: 100, height: 12 },
            { x: 480, y: 240, width: 90, height: 12 },
            { x: 600, y: 220, width: 120, height: 12 },
            { x: 750, y: 200, width: 150, height: 12 },
            { x: 950, y: 180, width: 200, height: 12 }
        ];
        
        // Essências estrategicamente posicionadas
        this.essences = [
            // Área inicial esquerda
            { x: 90, y: 860, collected: false, type: 'small' },
            { x: 70, y: 760, collected: false, type: 'small' },
            { x: 130, y: 660, collected: false, type: 'small' },
            
            // Área central
            { x: 240, y: 810, collected: false, type: 'large' },
            { x: 220, y: 620, collected: false, type: 'crystal' },
            { x: 430, y: 780, collected: false, type: 'large' },
            
            // Área direita
            { x: 640, y: 810, collected: false, type: 'large' },
            { x: 730, y: 660, collected: false, type: 'small' },
            { x: 870, y: 510, collected: false, type: 'crystal' },
            
            // Área superior
            { x: 260, y: 240, collected: false, type: 'crystal' },
            { x: 410, y: 220, collected: false, type: 'large' },
            { x: 530, y: 200, collected: false, type: 'crystal' },
            { x: 820, y: 160, collected: false, type: 'crystal' },
            { x: 1050, y: 140, collected: false, type: 'crystal' },
            
            // Extremidade direita
            { x: 1180, y: 510, collected: false, type: 'large' },
            { x: 1320, y: 310, collected: false, type: 'crystal' },
            { x: 1450, y: 210, collected: false, type: 'crystal' },
            
            // Plataformas pequenas secretas
            { x: 150, y: 460, collected: false, type: 'small' },
            { x: 120, y: 360, collected: false, type: 'small' },
            { x: 550, y: 490, collected: false, type: 'small' },
            { x: 580, y: 390, collected: false, type: 'small' }
        ];
    }
    
    drawPlatforms(ctx, camera, player) {
        ctx.save();
        ctx.translate(-camera.x, -camera.y);
        
        this.platforms.forEach(platform => {
            // Calcular iluminação baseada na distância do jogador
            const dist = Math.sqrt(
                (player.x - (platform.x + platform.width/2)) ** 2 + 
                (player.y - (platform.y + platform.height/2)) ** 2
            );
            
            let lightEffect = 1;
            if (dist < player.lightRadius) {
                lightEffect = 1 + (1 - dist / player.lightRadius) * 0.4;
            }
            
            // Cor baseada na iluminação
            const baseColor = CONFIG.COLORS.PLATFORM_LIGHT;
            const rgb = this.hexToRgb(baseColor);
            const litColor = `rgb(${Math.min(255, Math.floor(rgb.r * lightEffect))}, ${Math.min(255, Math.floor(rgb.g * lightEffect))}, ${Math.min(255, Math.floor(rgb.b * lightEffect))})`;
            
            ctx.fillStyle = litColor;
            
            // Desenhar plataforma retangular simples
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            
            // Borda sutil
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 1;
            ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
        });
        
        ctx.restore();
    }
    
    drawEssences(ctx, camera, animationFrame) {
        ctx.save();
        ctx.translate(-camera.x, -camera.y);
        
        this.essences.forEach(essence => {
            if (!essence.collected) {
                const time = animationFrame * 0.08;
                const float = Math.sin(time + essence.x * 0.01) * 2;
                const glow = Math.sin(time * 1.5 + essence.y * 0.01) * 0.3 + 0.7;
                
                ctx.save();
                ctx.translate(essence.x, essence.y + float);
                
                let color, size;
                if (essence.type === 'small') {
                    color = CONFIG.COLORS.MAGIC;
                    size = 5;
                } else if (essence.type === 'large') {
                    color = CONFIG.COLORS.ESSENCE;
                    size = 7;
                } else {
                    color = CONFIG.COLORS.LIFE;
                    size = 9;
                }
                
                ctx.shadowColor = color;
                ctx.shadowBlur = 12 * glow;
                ctx.globalAlpha = glow;
                ctx.fillStyle = color;
                
                if (essence.type === 'crystal') {
                    // Hexágono para cristais
                    ctx.beginPath();
                    for (let i = 0; i < 6; i++) {
                        const angle = (Math.PI * 2 * i) / 6;
                        const x = Math.cos(angle) * size;
                        const y = Math.sin(angle) * size;
                        if (i === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.closePath();
                    ctx.fill();
                } else {
                    // Círculo para outras essências
                    ctx.beginPath();
                    ctx.arc(0, 0, size, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                ctx.restore();
            }
        });
        
        ctx.restore();
    }
    
    checkEssenceCollection(player) {
        let collected = [];
        
        this.essences.forEach((essence, index) => {
            if (!essence.collected) {
                const dist = Math.sqrt((player.x - essence.x) ** 2 + (player.y - essence.y) ** 2);
                if (dist < 30) {
                    essence.collected = true;
                    collected.push({ index, essence });
                }
            }
        });
        
        return collected;
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : {r: 128, g: 128, b: 128};
    }
}