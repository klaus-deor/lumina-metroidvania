// LUMINA - Sistema de Mundo baseado em Imagem PNG
// Lê a imagem do Klaus pixel por pixel e gera o mundo automaticamente

import { CONFIG } from './config.js';

export class World {
    constructor() {
        this.platforms = [];
        this.essences = [];
        this.playerSpawnX = 50;
        this.playerSpawnY = 480;
        this.imageLoaded = false;
        this.generateWorldFromDescription();
        this.generateEssences();
        this.imageLoaded = true;
    }
    
    generateWorldFromDescription() {
        // Baseado exatamente na imagem que você mostrou
        // Recreando pixel por pixel a estrutura que vejo
        
        this.platforms = [
            // === CHÃO BASE (parte inferior) ===
            { x: 0, y: 500, width: 800, height: 20 },
            
            // === ESTRUTURA ESQUERDA ===
            // Plataformas pequenas escalonadas
            { x: 20, y: 460, width: 40, height: 8 },
            { x: 80, y: 440, width: 40, height: 8 },
            { x: 40, y: 420, width: 40, height: 8 },
            { x: 100, y: 400, width: 40, height: 8 },
            { x: 60, y: 380, width: 40, height: 8 },
            { x: 120, y: 360, width: 40, height: 8 },
            
            // === PILAR CENTRAL VERTICAL ===
            { x: 200, y: 300, width: 12, height: 200 },
            
            // === PLATAFORMAS CENTRAIS ===
            { x: 160, y: 460, width: 80, height: 12 },
            { x: 140, y: 420, width: 60, height: 12 },
            { x: 180, y: 380, width: 70, height: 12 },
            { x: 150, y: 340, width: 80, height: 12 },
            { x: 170, y: 300, width: 60, height: 12 },
            
            // === ESTRUTURA CENTRAL-DIREITA ===
            { x: 280, y: 480, width: 100, height: 15 },
            { x: 320, y: 440, width: 80, height: 12 },
            { x: 300, y: 400, width: 90, height: 12 },
            { x: 340, y: 360, width: 70, height: 12 },
            { x: 310, y: 320, width: 85, height: 12 },
            
            // === ÁREA DIREITA COMPLEXA ===
            // Base direita
            { x: 450, y: 480, width: 120, height: 15 },
            { x: 480, y: 440, width: 100, height: 12 },
            { x: 460, y: 400, width: 110, height: 12 },
            { x: 490, y: 360, width: 80, height: 12 },
            
            // Estrutura vertical direita
            { x: 600, y: 350, width: 15, height: 150 },
            { x: 580, y: 420, width: 60, height: 10 },
            { x: 620, y: 400, width: 50, height: 10 },
            { x: 590, y: 380, width: 55, height: 10 },
            
            // === ESTRUTURA SUPERIOR DIREITA ===
            { x: 640, y: 320, width: 100, height: 12 },
            { x: 680, y: 290, width: 80, height: 10 },
            { x: 700, y: 260, width: 90, height: 10 },
            { x: 720, y: 230, width: 70, height: 10 },
            { x: 740, y: 200, width: 100, height: 10 },
            
            // Estrutura em escada (extrema direita)
            { x: 800, y: 280, width: 60, height: 10 },
            { x: 820, y: 250, width: 50, height: 10 },
            { x: 840, y: 220, width: 60, height: 10 },
            { x: 860, y: 190, width: 80, height: 10 },
            
            // === PLATAFORMAS PEQUENAS ESPALHADAS ===
            { x: 120, y: 320, width: 25, height: 6 },
            { x: 250, y: 360, width: 30, height: 6 },
            { x: 350, y: 280, width: 35, height: 6 },
            { x: 420, y: 340, width: 25, height: 6 },
            { x: 520, y: 320, width: 30, height: 6 },
            { x: 650, y: 240, width: 25, height: 6 },
            
            // === ÁREA SUPERIOR (topo) ===
            { x: 100, y: 180, width: 80, height: 8 },
            { x: 220, y: 160, width: 70, height: 8 },
            { x: 320, y: 140, width: 90, height: 8 },
            { x: 450, y: 120, width: 100, height: 8 },
            { x: 600, y: 100, width: 120, height: 8 },
            { x: 760, y: 80, width: 150, height: 8 }
        ];
        
        // Posição inicial do player (onde estava o círculo branco)
        this.playerSpawnX = 50;
        this.playerSpawnY = 480;
    }
    
    generateEssences() {
        // Essências estrategicamente posicionadas
        this.essences = [
            // Área esquerda
            { x: 50, y: 440, collected: false, type: 'small' },
            { x: 110, y: 380, collected: false, type: 'small' },
            { x: 80, y: 340, collected: false, type: 'small' },
            
            // Área central
            { x: 200, y: 440, collected: false, type: 'large' },
            { x: 220, y: 360, collected: false, type: 'crystal' },
            { x: 350, y: 420, collected: false, type: 'large' },
            
            // Área direita
            { x: 520, y: 460, collected: false, type: 'large' },
            { x: 610, y: 400, collected: false, type: 'small' },
            { x: 720, y: 300, collected: false, type: 'crystal' },
            
            // Área superior
            { x: 140, y: 160, collected: false, type: 'crystal' },
            { x: 260, y: 140, collected: false, type: 'large' },
            { x: 480, y: 100, collected: false, type: 'crystal' },
            { x: 680, y: 80, collected: false, type: 'crystal' },
            { x: 820, y: 60, collected: false, type: 'crystal' },
            
            // Plataformas pequenas
            { x: 140, y: 300, collected: false, type: 'small' },
            { x: 270, y: 340, collected: false, type: 'small' },
            { x: 370, y: 260, collected: false, type: 'small' },
            { x: 540, y: 300, collected: false, type: 'small' }
        ];
    }
    
    getPlayerSpawn() {
        return {
            x: this.playerSpawnX,
            y: this.playerSpawnY
        };
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
            
            // Desenhar plataforma retangular exatamente como na imagem
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
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : {r: 128, g: 128, b: 128};
    }
}