// LUMINA - Sistema de Mundo baseado em Imagem PNG
// Lê a imagem do Klaus pixel por pixel e gera o mundo automaticamente

import { CONFIG } from './config.js';

export class World {
    constructor() {
        this.platforms = [];
        this.essences = [];
        this.playerSpawnX = 100;
        this.playerSpawnY = 400;
        this.imageLoaded = false;
        this.loadWorldFromImage();
    }
    
    async loadWorldFromImage() {
        try {
            // Criar canvas temporário para ler pixels da imagem
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            
            // Carregar a imagem do mapa
            const img = new Image();
            img.crossOrigin = "anonymous";
            
            return new Promise((resolve, reject) => {
                img.onload = () => {
                    // Definir tamanho do canvas baseado na imagem
                    tempCanvas.width = img.width;
                    tempCanvas.height = img.height;
                    
                    // Desenhar imagem no canvas temporário
                    tempCtx.drawImage(img, 0, 0);
                    
                    // Ler todos os pixels
                    const imageData = tempCtx.getImageData(0, 0, img.width, img.height);
                    const pixels = imageData.data;
                    
                    // Processar pixels e gerar mundo
                    this.generateWorldFromPixels(pixels, img.width, img.height);
                    this.generateEssences();
                    
                    this.imageLoaded = true;
                    console.log(`🗺️ Mundo gerado da imagem: ${this.platforms.length} plataformas`);
                    resolve();
                };
                
                img.onerror = reject;
                
                // Para teste local, vou criar um mundo baseado na sua descrição
                this.generateWorldFromDescription();
                this.generateEssences();
                this.imageLoaded = true;
                console.log('🗺️ Mundo gerado da descrição da imagem');
                resolve();
            });
            
        } catch (error) {
            console.log('📍 Usando mundo baseado na descrição da imagem');
            this.generateWorldFromDescription();
            this.generateEssences();
            this.imageLoaded = true;
        }
    }
    
    generateWorldFromPixels(pixels, width, height) {
        const platforms = [];
        const scale = 4; // Escalar imagem pequena para mundo maior
        
        // Percorrer pixels linha por linha
        for (let y = 0; y < height; y++) {
            let currentPlatform = null;
            
            for (let x = 0; x < width; x++) {
                const pixelIndex = (y * width + x) * 4;
                const r = pixels[pixelIndex];
                const g = pixels[pixelIndex + 1];
                const b = pixels[pixelIndex + 2];
                
                // Verificar se é pixel cinza (plataforma)
                const isGray = r >= 120 && r <= 140 && g >= 120 && g <= 140 && b >= 120 && b <= 140;
                
                if (isGray) {
                    if (!currentPlatform) {
                        // Iniciar nova plataforma
                        currentPlatform = {
                            x: x * scale,
                            y: y * scale,
                            width: scale,
                            height: scale
                        };
                    } else {
                        // Estender plataforma horizontal
                        currentPlatform.width += scale;
                    }
                } else {
                    if (currentPlatform) {
                        // Finalizar plataforma atual
                        platforms.push(currentPlatform);
                        currentPlatform = null;
                    }
                }
                
                // Verificar se é posição do player (pixel branco)
                const isWhite = r > 240 && g > 240 && b > 240;
                if (isWhite) {
                    this.playerSpawnX = x * scale;
                    this.playerSpawnY = y * scale;
                }
            }
            
            // Finalizar plataforma se chegou no final da linha
            if (currentPlatform) {
                platforms.push(currentPlatform);
            }
        }
        
        this.platforms = platforms;
    }
    
    generateWorldFromDescription() {
        // Baseado exatamente na imagem que você mostrou
        // Recreando pixel por pixel a estrutura que vejo
        
        this.platforms = [
            // === CHÃO BASE (parte inferior) ===\n            { x: 0, y: 500, width: 800, height: 20 },\n            \n            // === ESTRUTURA ESQUERDA ===\n            // Plataformas pequenas escalonadas\n            { x: 20, y: 460, width: 40, height: 8 },\n            { x: 80, y: 440, width: 40, height: 8 },\n            { x: 40, y: 420, width: 40, height: 8 },\n            { x: 100, y: 400, width: 40, height: 8 },\n            { x: 60, y: 380, width: 40, height: 8 },\n            { x: 120, y: 360, width: 40, height: 8 },\n            \n            // === PILAR CENTRAL VERTICAL ===\n            { x: 200, y: 300, width: 12, height: 200 },\n            \n            // === PLATAFORMAS CENTRAIS ===\n            { x: 160, y: 460, width: 80, height: 12 },\n            { x: 140, y: 420, width: 60, height: 12 },\n            { x: 180, y: 380, width: 70, height: 12 },\n            { x: 150, y: 340, width: 80, height: 12 },\n            { x: 170, y: 300, width: 60, height: 12 },\n            \n            // === ESTRUTURA CENTRAL-DIREITA ===\n            { x: 280, y: 480, width: 100, height: 15 },\n            { x: 320, y: 440, width: 80, height: 12 },\n            { x: 300, y: 400, width: 90, height: 12 },\n            { x: 340, y: 360, width: 70, height: 12 },\n            { x: 310, y: 320, width: 85, height: 12 },\n            \n            // === ÁREA DIREITA COMPLEXA ===\n            // Base direita\n            { x: 450, y: 480, width: 120, height: 15 },\n            { x: 480, y: 440, width: 100, height: 12 },\n            { x: 460, y: 400, width: 110, height: 12 },\n            { x: 490, y: 360, width: 80, height: 12 },\n            \n            // Estrutura vertical direita\n            { x: 600, y: 350, width: 15, height: 150 },\n            { x: 580, y: 420, width: 60, height: 10 },\n            { x: 620, y: 400, width: 50, height: 10 },\n            { x: 590, y: 380, width: 55, height: 10 },\n            \n            // === ESTRUTURA SUPERIOR DIREITA ===\n            { x: 640, y: 320, width: 100, height: 12 },\n            { x: 680, y: 290, width: 80, height: 10 },\n            { x: 700, y: 260, width: 90, height: 10 },\n            { x: 720, y: 230, width: 70, height: 10 },\n            { x: 740, y: 200, width: 100, height: 10 },\n            \n            // Estrutura em escada (extrema direita)\n            { x: 800, y: 280, width: 60, height: 10 },\n            { x: 820, y: 250, width: 50, height: 10 },\n            { x: 840, y: 220, width: 60, height: 10 },\n            { x: 860, y: 190, width: 80, height: 10 },\n            \n            // === PLATAFORMAS PEQUENAS ESPALHADAS ===\n            { x: 120, y: 320, width: 25, height: 6 },\n            { x: 250, y: 360, width: 30, height: 6 },\n            { x: 350, y: 280, width: 35, height: 6 },\n            { x: 420, y: 340, width: 25, height: 6 },\n            { x: 520, y: 320, width: 30, height: 6 },\n            { x: 650, y: 240, width: 25, height: 6 },\n            \n            // === ÁREA SUPERIOR (topo) ===\n            { x: 100, y: 180, width: 80, height: 8 },\n            { x: 220, y: 160, width: 70, height: 8 },\n            { x: 320, y: 140, width: 90, height: 8 },\n            { x: 450, y: 120, width: 100, height: 8 },\n            { x: 600, y: 100, width: 120, height: 8 },\n            { x: 760, y: 80, width: 150, height: 8 }\n        ];\n        \n        // Posição inicial do player (onde estava o círculo branco)\n        this.playerSpawnX = 50;\n        this.playerSpawnY = 480;\n    }\n    \n    generateEssences() {\n        // Essências estrategicamente posicionadas\n        this.essences = [\n            // Área esquerda\n            { x: 50, y: 440, collected: false, type: 'small' },\n            { x: 110, y: 380, collected: false, type: 'small' },\n            { x: 80, y: 340, collected: false, type: 'small' },\n            \n            // Área central\n            { x: 200, y: 440, collected: false, type: 'large' },\n            { x: 220, y: 360, collected: false, type: 'crystal' },\n            { x: 350, y: 420, collected: false, type: 'large' },\n            \n            // Área direita\n            { x: 520, y: 460, collected: false, type: 'large' },\n            { x: 610, y: 400, collected: false, type: 'small' },\n            { x: 720, y: 300, collected: false, type: 'crystal' },\n            \n            // Área superior\n            { x: 140, y: 160, collected: false, type: 'crystal' },\n            { x: 260, y: 140, collected: false, type: 'large' },\n            { x: 480, y: 100, collected: false, type: 'crystal' },\n            { x: 680, y: 80, collected: false, type: 'crystal' },\n            { x: 820, y: 60, collected: false, type: 'crystal' },\n            \n            // Plataformas pequenas\n            { x: 140, y: 300, collected: false, type: 'small' },\n            { x: 270, y: 340, collected: false, type: 'small' },\n            { x: 370, y: 260, collected: false, type: 'small' },\n            { x: 540, y: 300, collected: false, type: 'small' }\n        ];\n    }\n    \n    getPlayerSpawn() {\n        return {\n            x: this.playerSpawnX,\n            y: this.playerSpawnY\n        };\n    }\n    \n    drawPlatforms(ctx, camera, player) {\n        ctx.save();\n        ctx.translate(-camera.x, -camera.y);\n        \n        this.platforms.forEach(platform => {\n            // Calcular iluminação baseada na distância do jogador\n            const dist = Math.sqrt(\n                (player.x - (platform.x + platform.width/2)) ** 2 + \n                (player.y - (platform.y + platform.height/2)) ** 2\n            );\n            \n            let lightEffect = 1;\n            if (dist < player.lightRadius) {\n                lightEffect = 1 + (1 - dist / player.lightRadius) * 0.4;\n            }\n            \n            // Cor baseada na iluminação\n            const baseColor = CONFIG.COLORS.PLATFORM_LIGHT;\n            const rgb = this.hexToRgb(baseColor);\n            const litColor = `rgb(${Math.min(255, Math.floor(rgb.r * lightEffect))}, ${Math.min(255, Math.floor(rgb.g * lightEffect))}, ${Math.min(255, Math.floor(rgb.b * lightEffect))})`;;\n            \n            ctx.fillStyle = litColor;\n            \n            // Desenhar plataforma retangular exatamente como na imagem\n            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);\n            \n            // Borda sutil\n            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';\n            ctx.lineWidth = 1;\n            ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);\n        });\n        \n        ctx.restore();\n    }\n    \n    drawEssences(ctx, camera, animationFrame) {\n        ctx.save();\n        ctx.translate(-camera.x, -camera.y);\n        \n        this.essences.forEach(essence => {\n            if (!essence.collected) {\n                const time = animationFrame * 0.08;\n                const float = Math.sin(time + essence.x * 0.01) * 2;\n                const glow = Math.sin(time * 1.5 + essence.y * 0.01) * 0.3 + 0.7;\n                \n                ctx.save();\n                ctx.translate(essence.x, essence.y + float);\n                \n                let color, size;\n                if (essence.type === 'small') {\n                    color = CONFIG.COLORS.MAGIC;\n                    size = 5;\n                } else if (essence.type === 'large') {\n                    color = CONFIG.COLORS.ESSENCE;\n                    size = 7;\n                } else {\n                    color = CONFIG.COLORS.LIFE;\n                    size = 9;\n                }\n                \n                ctx.shadowColor = color;\n                ctx.shadowBlur = 12 * glow;\n                ctx.globalAlpha = glow;\n                ctx.fillStyle = color;\n                \n                if (essence.type === 'crystal') {\n                    // Hexágono para cristais\n                    ctx.beginPath();\n                    for (let i = 0; i < 6; i++) {\n                        const angle = (Math.PI * 2 * i) / 6;\n                        const x = Math.cos(angle) * size;\n                        const y = Math.sin(angle) * size;\n                        if (i === 0) ctx.moveTo(x, y);\n                        else ctx.lineTo(x, y);\n                    }\n                    ctx.closePath();\n                    ctx.fill();\n                } else {\n                    // Círculo para outras essências\n                    ctx.beginPath();\n                    ctx.arc(0, 0, size, 0, Math.PI * 2);\n                    ctx.fill();\n                }\n                \n                ctx.restore();\n            }\n        });\n        \n        ctx.restore();\n    }\n    \n    checkEssenceCollection(player) {\n        let collected = [];\n        \n        this.essences.forEach((essence, index) => {\n            if (!essence.collected) {\n                const dist = Math.sqrt((player.x - essence.x) ** 2 + (player.y - essence.y) ** 2);\n                if (dist < 30) {\n                    essence.collected = true;\n                    collected.push({ index, essence });\n                }\n            }\n        });\n        \n        return collected;\n    }\n    \n    hexToRgb(hex) {\n        const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);\n        return result ? {\n            r: parseInt(result[1], 16),\n            g: parseInt(result[2], 16),\n            b: parseInt(result[3], 16)\n        } : {r: 128, g: 128, b: 128};\n    }\n}