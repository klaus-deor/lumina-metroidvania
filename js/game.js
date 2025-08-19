// LUMINA - Game Loop Principal
// Conecta todos os sistemas e controla o jogo

import { CONFIG } from './config.js';
import { Player } from './player.js';
import { World } from './world.js';
import { Camera } from './camera.js';
import { InputManager } from './input.js';
import { EffectsSystem } from './effects.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.minimapCanvas = document.getElementById('minimap');
        this.minimapCtx = this.minimapCanvas.getContext('2d');
        
        // Sistemas do jogo
        this.effects = new EffectsSystem();
        this.world = new World();
        this.camera = new Camera();
        this.input = new InputManager();
        
        // Player com posição inicial baseada na imagem
        const spawn = this.world.getPlayerSpawn();
        this.player = new Player(spawn.x, spawn.y, this.effects);
        
        // Estado do jogo
        this.animationFrame = 0;
        this.essenceCount = 0;
        this.running = false;
        
        this.init();
    }
    
    init() {
        console.log('🎮 LUMINA iniciando...');
        console.log('📍 Layout baseado EXATAMENTE na sua imagem PNG');
        console.log(`🗺️ Mundo: ${CONFIG.WORLD.WIDTH}x${CONFIG.WORLD.HEIGHT}`);
        console.log(`👤 Player spawn: ${this.player.x}, ${this.player.y}`);
        this.running = true;
        this.gameLoop();
    }
    
    update() {
        // Atualizar input primeiro
        this.input.update();
        
        // Atualizar sistemas de efeitos
        this.effects.update();
        
        // Atualizar jogador
        this.player.update(this.input.getKeys(), this.world.platforms);
        
        // Atualizar câmera
        this.camera.update(this.player);
        
        // Verificar coleta de essências
        const collectedEssences = this.world.checkEssenceCollection(this.player);
        if (collectedEssences.length > 0) {
            collectedEssences.forEach(({ essence }) => {
                this.player.collectEssence(essence);
            });
            this.essenceCount += collectedEssences.length;
            this.updateUI();
        }
        
        // Ataques especiais - usar wasJustPressed para não disparar continuamente
        if (this.input.wasJustPressed('q')) {
            this.player.lightPulse();
        }
        
        if (this.input.wasJustPressed('e')) {
            this.player.slashAttack();
        }
        
        this.animationFrame++;
    }
    
    render() {
        // Limpar canvas principal
        this.ctx.fillStyle = CONFIG.COLORS.BG_FAR;
        this.ctx.fillRect(0, 0, CONFIG.CANVAS.WIDTH, CONFIG.CANVAS.HEIGHT);
        
        // Desenhar fundo gradiente
        this.drawBackground();
        
        // Desenhar mundo
        this.world.drawPlatforms(this.ctx, this.camera, this.player);
        this.world.drawEssences(this.ctx, this.camera, this.animationFrame);
        
        // Desenhar efeitos (atrás do player)
        this.effects.draw(this.ctx, this.camera);
        
        // Desenhar jogador
        this.player.draw(this.ctx, this.camera);
        
        // Desenhar minimapa
        this.drawMinimap();
        
        // Atualizar UI
        this.updateUI();
    }
    
    drawBackground() {
        this.ctx.save();
        
        // Gradiente baseado na posição da câmera
        const gradient = this.ctx.createLinearGradient(0, 0, 0, CONFIG.CANVAS.HEIGHT);
        gradient.addColorStop(0, CONFIG.COLORS.BG_FAR);
        gradient.addColorStop(0.5, CONFIG.COLORS.BG_MID);
        gradient.addColorStop(1, CONFIG.COLORS.BG_NEAR);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, CONFIG.CANVAS.WIDTH, CONFIG.CANVAS.HEIGHT);
        
        this.ctx.restore();
    }
    
    drawMinimap() {
        // Limpar minimapa
        this.minimapCtx.fillStyle = 'rgba(0,0,0,0.9)';
        this.minimapCtx.fillRect(0, 0, this.minimapCanvas.width, this.minimapCanvas.height);
        
        const scaleX = this.minimapCanvas.width / CONFIG.WORLD.WIDTH;
        const scaleY = this.minimapCanvas.height / CONFIG.WORLD.HEIGHT;
        
        // Desenhar plataformas no minimapa
        this.minimapCtx.fillStyle = CONFIG.COLORS.PLATFORM_MID;
        this.world.platforms.forEach(platform => {
            const x = platform.x * scaleX;
            const y = platform.y * scaleY;
            const w = Math.max(1, platform.width * scaleX);
            const h = Math.max(1, platform.height * scaleY);
            this.minimapCtx.fillRect(x, y, w, h);
        });
        
        // Desenhar essências no minimapa
        this.world.essences.forEach(essence => {
            if (!essence.collected) {
                const x = essence.x * scaleX;
                const y = essence.y * scaleY;
                
                let color = CONFIG.COLORS.MAGIC;
                if (essence.type === 'large') color = CONFIG.COLORS.ESSENCE;
                if (essence.type === 'crystal') color = CONFIG.COLORS.LIFE;
                
                this.minimapCtx.fillStyle = color;
                this.minimapCtx.fillRect(x-1, y-1, 3, 3);
            }
        });
        
        // Desenhar jogador no minimapa
        const playerX = this.player.x * scaleX;
        const playerY = this.player.y * scaleY;
        this.minimapCtx.fillStyle = CONFIG.COLORS.PLAYER;
        this.minimapCtx.beginPath();
        this.minimapCtx.arc(playerX, playerY, 3, 0, Math.PI * 2);
        this.minimapCtx.fill();
        
        // Desenhar área visível da câmera
        const cameraX = this.camera.x * scaleX;
        const cameraY = this.camera.y * scaleY;
        const cameraW = CONFIG.CANVAS.WIDTH * scaleX;
        const cameraH = CONFIG.CANVAS.HEIGHT * scaleY;
        
        this.minimapCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.minimapCtx.lineWidth = 1;
        this.minimapCtx.strokeRect(cameraX, cameraY, cameraW, cameraH);
    }
    
    updateUI() {
        document.getElementById('essenceCount').textContent = this.essenceCount;
        document.getElementById('posX').textContent = Math.floor(this.player.x);
        document.getElementById('posY').textContent = Math.floor(this.player.y);
    }
    
    gameLoop() {
        if (!this.running) return;
        
        this.update();
        this.render();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    // Métodos para controle do jogo
    pause() {
        this.running = false;
    }
    
    resume() {
        if (!this.running) {
            this.running = true;
            this.gameLoop();
        }
    }
    
    reset() {
        const spawn = this.world.getPlayerSpawn();
        this.player = new Player(spawn.x, spawn.y, this.effects);
        this.camera = new Camera();
        this.effects = new EffectsSystem();
        this.essenceCount = 0;
        this.animationFrame = 0;
        
        // Resetar essências coletadas
        this.world.essences.forEach(essence => {
            essence.collected = false;
        });
        
        this.updateUI();
    }
}

// Iniciar o jogo quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌟 Carregando LUMINA...');
    console.log('🎯 Versão baseada na imagem PNG do Klaus');
    new Game();
});

// Adicionar controles de debug
window.addEventListener('keydown', (e) => {
    if (e.key === 'r' && e.ctrlKey) {
        e.preventDefault();
        location.reload();
    }
});