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
        this.loadWorldFromImage();
    }
    
    async loadWorldFromImage() {
        try {
            console.log('🗺️ Carregando mapa do GitHub...');
            
            // Criar canvas temporário para ler pixels da imagem
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            
            // Carregar a imagem do mapa diretamente do GitHub
            const img = new Image();
            img.crossOrigin = "anonymous";
            
            return new Promise((resolve, reject) => {
                img.onload = () => {
                    console.log(`📐 Imagem carregada: ${img.width}x${img.height}`);
                    
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
                    console.log(`✅ Mundo gerado: ${this.platforms.length} plataformas, spawn em (${this.playerSpawnX}, ${this.playerSpawnY})`);
                    resolve();
                };
                
                img.onerror = (error) => {
                    console.log('❌ Erro ao carregar imagem, usando fallback');
                    this.generateWorldFromDescription();
                    this.generateEssences();
                    this.imageLoaded = true;
                    resolve();
                };
                
                // URL da sua imagem no GitHub
                img.src = 'https://raw.githubusercontent.com/klaus-deor/lumina-metroidvania/main/assets/maps/cenário%201.png';
            });
            
        } catch (error) {
            console.log('📍 Erro no carregamento, usando mundo de fallback');
            this.generateWorldFromDescription();
            this.generateEssences();
            this.imageLoaded = true;
        }
    }
    
    generateWorldFromPixels(pixels, width, height) {
        const platforms = [];
        const scale = 1; // 🎯 REDUZIDO DE 3 PARA 1 - escala menor!
        let playerFound = false;
        
        console.log('🔍 Processando pixels...');
        
        // Agrupar pixels em blocos maiores para performance
        const blockSize = 2; // Processar em blocos de 2x2 pixels
        
        for (let y = 0; y < height; y += blockSize) {
            let currentPlatform = null;
            
            for (let x = 0; x < width; x += blockSize) {
                // Verificar o pixel principal do bloco
                const pixelIndex = (y * width + x) * 4;
                const r = pixels[pixelIndex] || 0;
                const g = pixels[pixelIndex + 1] || 0;
                const b = pixels[pixelIndex + 2] || 0;
                
                // Verificar se é pixel cinza (plataforma)
                const isGray = (r >= 100 && r <= 180) && 
                               (g >= 100 && g <= 180) && 
                               (b >= 100 && b <= 180) &&
                               Math.abs(r - g) < 30 && Math.abs(r - b) < 30 && Math.abs(g - b) < 30;
                
                if (isGray) {
                    if (!currentPlatform) {
                        // Iniciar nova plataforma
                        currentPlatform = {
                            x: x * scale,
                            y: y * scale,
                            width: blockSize * scale,
                            height: blockSize * scale
                        };
                    } else {
                        // Estender plataforma horizontal
                        currentPlatform.width += blockSize * scale;
                    }
                } else {
                    if (currentPlatform) {
                        // Finalizar plataforma atual
                        platforms.push(currentPlatform);
                        currentPlatform = null;
                    }
                }
                
                // Verificar se é posição do player (pixel branco)
                const isWhite = r > 200 && g > 200 && b > 200;
                if (isWhite && !playerFound) {
                    this.playerSpawnX = x * scale;
                    this.playerSpawnY = y * scale;
                    playerFound = true;
                    console.log(`👤 Player spawn encontrado em pixel (${x}, ${y}) = mundo (${this.playerSpawnX}, ${this.playerSpawnY})`);
                }
            }
            
            // Finalizar plataforma se chegou no final da linha
            if (currentPlatform) {
                platforms.push(currentPlatform);
            }
        }
        
        // 🚀 OTIMIZAÇÃO AGRESSIVA para performance
        const optimizedPlatforms = this.aggressiveOptimization(platforms);
        
        this.platforms = optimizedPlatforms;
        
        // Ajustar dimensões do mundo baseado na imagem
        CONFIG.WORLD.WIDTH = width * scale;
        CONFIG.WORLD.HEIGHT = height * scale;
        
        console.log(`🏗️ ${platforms.length} plataformas brutas → ${optimizedPlatforms.length} otimizadas`);
        console.log(`🌍 Mundo ajustado para ${CONFIG.WORLD.WIDTH}x${CONFIG.WORLD.HEIGHT}`);
        console.log(`🎮 Player spawn: (${this.playerSpawnX}, ${this.playerSpawnY})`);
    }
    
    aggressiveOptimization(platforms) {
        console.log('⚡ Otimização agressiva para performance...');
        
        // Primeira passada: combinar horizontalmente
        let optimized = [];
        platforms.sort((a, b) => a.y - b.y || a.x - b.x);
        
        for (let platform of platforms) {
            let merged = false;
            
            for (let opt of optimized) {
                // Combinar se na mesma linha e adjacente horizontalmente
                if (opt.y === platform.y && 
                    opt.height === platform.height &&
                    opt.x + opt.width === platform.x) {
                    opt.width += platform.width;
                    merged = true;
                    break;
                }
            }
            
            if (!merged) {
                optimized.push({ ...platform });
            }
        }
        
        // Segunda passada: combinar verticalmente
        let finalOptimized = [];
        optimized.sort((a, b) => a.x - b.x || a.y - b.y);
        
        for (let platform of optimized) {
            let merged = false;
            
            for (let opt of finalOptimized) {
                // Combinar se na mesma coluna e adjacente verticalmente
                if (opt.x === platform.x && 
                    opt.width === platform.width &&
                    opt.y + opt.height === platform.y) {
                    opt.height += platform.height;
                    merged = true;
                    break;
                }
            }
            
            if (!merged) {
                finalOptimized.push({ ...platform });
            }
        }
        
        console.log(`⚡ Otimização: ${platforms.length} → ${optimized.length} → ${finalOptimized.length}`);
        return finalOptimized;
    }
    
    generateWorldFromDescription() {
        // Fallback caso a imagem não carregue
        console.log('🔄 Usando mundo de fallback');
        this.platforms = [
            { x: 0, y: 500, width: 800, height: 20 },
            { x: 100, y: 450, width: 80, height: 15 },
            { x: 200, y: 400, width: 60, height: 15 },
            { x: 300, y: 350, width: 90, height: 15 },
            { x: 150, y: 300, width: 70, height: 15 }
        ];
        
        this.playerSpawnX = 50;
        this.playerSpawnY = 480;
    }
    
    generateEssences() {
        // Gerar essências baseadas nas plataformas (menos para performance)
        this.essences = [];
        
        // Colocar uma essência a cada 3 plataformas para não sobrecarregar
        this.platforms.slice(1).forEach((platform, index) => {
            if (index % 3 === 0 && platform.width > 30) { // Só em plataformas maiores
                const essenceX = platform.x + platform.width / 2;
                const essenceY = platform.y - 20;
                
                const types = ['small', 'large', 'crystal'];
                const type = types[index % types.length];
                
                this.essences.push({
                    x: essenceX,
                    y: essenceY,
                    collected: false,
                    type: type
                });
            }
        });
        
        console.log(`✨ ${this.essences.length} essências geradas`);
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
        
        // 🚀 OTIMIZAÇÃO: Só desenhar plataformas visíveis na tela
        const visiblePlatforms = this.platforms.filter(platform => {
            return platform.x + platform.width >= camera.x &&
                   platform.x <= camera.x + CONFIG.CANVAS.WIDTH &&
                   platform.y + platform.height >= camera.y &&
                   platform.y <= camera.y + CONFIG.CANVAS.HEIGHT;
        });
        
        visiblePlatforms.forEach(platform => {
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
            
            // Desenhar plataforma retangular
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            
            // Borda sutil (só em plataformas grandes para performance)
            if (platform.width > 20 && platform.height > 10) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.lineWidth = 1;
                ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
            }
        });
        
        ctx.restore();
    }
    
    drawEssences(ctx, camera, animationFrame) {
        ctx.save();
        ctx.translate(-camera.x, -camera.y);
        
        // 🚀 OTIMIZAÇÃO: Só desenhar essências visíveis
        const visibleEssences = this.essences.filter(essence => 
            !essence.collected &&
            essence.x >= camera.x - 50 &&
            essence.x <= camera.x + CONFIG.CANVAS.WIDTH + 50 &&
            essence.y >= camera.y - 50 &&
            essence.y <= camera.y + CONFIG.CANVAS.HEIGHT + 50
        );
        
        visibleEssences.forEach(essence => {
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