// LUMINA - Sistema do Jogador
// Controla movimento, pulo, ataques e efeitos visuais

import { CONFIG } from './config.js';

export class Player {
    constructor(x = 50, y = 480, effectsSystem = null) {
        // Posição e física
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.radius = CONFIG.PLAYER.RADIUS;
        
        // Estados
        this.grounded = false;
        this.facingRight = true;
        this.jumpBuffered = false;
        this.wasGrounded = false;
        
        // Efeitos visuais
        this.glowIntensity = 0;
        this.attackCooldown = 0;
        this.lightRadius = CONFIG.PLAYER.LIGHT_RADIUS;
        this.effects = effectsSystem;
        
        // Input buffer
        this.jumpBufferTime = 0;
        this.frameCount = 0;
        
        console.log('👤 Player criado com sistema de efeitos:', !!this.effects);
    }
    
    update(keys, platforms) {
        this.handleInput(keys);
        this.updatePhysics();
        this.handleCollisions(platforms);
        this.updateEffects();
        this.constrainToWorld();
        this.frameCount++;
    }
    
    handleInput(keys) {
        // Movimento horizontal
        if (keys['a'] || keys['arrowleft']) {
            this.vx = Math.max(this.vx - 0.5, -CONFIG.PLAYER.SPEED);
            this.facingRight = false;
            
            // Partículas de movimento
            if (this.frameCount % 6 === 0 && this.effects) {
                this.effects.addPlayerTrailParticle(this.x, this.y, this.vx, this.vy);
            }
        }
        if (keys['d'] || keys['arrowright']) {
            this.vx = Math.min(this.vx + 0.5, CONFIG.PLAYER.SPEED);
            this.facingRight = true;
            
            // Partículas de movimento
            if (this.frameCount % 6 === 0 && this.effects) {
                this.effects.addPlayerTrailParticle(this.x, this.y, this.vx, this.vy);
            }
        }
        
        // Pulo com buffer
        if (keys[' '] && !this.jumpBuffered) {
            this.jump();
            this.jumpBuffered = true;
            this.jumpBufferTime = 10; // frames
        }
        
        if (!keys[' ']) {
            this.jumpBuffered = false;
        }
    }
    
    updatePhysics() {
        // Atrito
        this.vx *= CONFIG.PLAYER.FRICTION;
        
        // Gravidade
        if (!this.grounded) {
            this.vy += CONFIG.PHYSICS.GRAVITY;
        }
        
        // Movimento
        this.x += this.vx;
        this.y += this.vy;
        
        // Buffer de pulo
        if (this.jumpBufferTime > 0) {
            this.jumpBufferTime--;
            if (this.grounded && this.jumpBufferTime > 0) {
                this.vy = CONFIG.PLAYER.JUMP_FORCE;
                this.grounded = false;
                this.jumpBufferTime = 0;
                
                // Efeito de pulo
                if (this.effects) {
                    this.effects.addJumpParticles(this.x, this.y);
                }
            }
        }
    }
    
    handleCollisions(platforms) {
        this.wasGrounded = this.grounded;
        this.grounded = false;
        
        platforms.forEach(platform => {
            if (this.x + this.radius > platform.x && 
                this.x - this.radius < platform.x + platform.width &&
                this.y + this.radius >= platform.y &&
                this.y + this.radius <= platform.y + platform.height + CONFIG.PHYSICS.GROUND_DETECTION &&
                this.vy >= 0) {
                
                this.y = platform.y - this.radius;
                this.vy = 0;
                this.grounded = true;
                
                // Efeito de aterrissagem (apenas se estava caindo rápido)
                if (!this.wasGrounded && Math.abs(this.vy) > 3 && this.effects) {
                    this.effects.addLandingParticles(this.x, this.y);
                }
            }
        });
    }
    
    jump() {
        if (this.grounded) {
            this.vy = CONFIG.PLAYER.JUMP_FORCE;
            this.grounded = false;
            
            // Efeito de pulo
            if (this.effects) {
                this.effects.addJumpParticles(this.x, this.y);
            }
            
            return true;
        }
        return false;
    }
    
    lightPulse() {
        console.log('🌟 PULSO DE LUZ EXECUTADO - Sistema de efeitos:', !!this.effects);
        
        this.glowIntensity = 20; // Aumentado para ser mais visível
        
        // 🎯 GARANTIR QUE O EFEITO SEJA CRIADO
        if (this.effects) {
            console.log('✅ Criando efeito de pulso...');
            this.effects.addLightPulse(this.x, this.y);
        } else {
            console.log('❌ Sistema de efeitos não disponível!');
        }
        
        return {
            x: this.x,
            y: this.y,
            type: 'pulse'
        };
    }
    
    slashAttack() {
        if (this.attackCooldown > 0) {
            console.log('⏰ Slash em cooldown...');
            return null;
        }
        
        console.log('⚔️ SLASH ATTACK EXECUTADO - Sistema de efeitos:', !!this.effects);
        
        this.attackCooldown = 20;
        this.glowIntensity = 15; // Aumentado para ser mais visível
        
        // 🎯 GARANTIR QUE O EFEITO SEJA CRIADO
        if (this.effects) {
            console.log('✅ Criando efeito de slash...');
            this.effects.addSlashAttack(this.x, this.y, this.facingRight);
        } else {
            console.log('❌ Sistema de efeitos não disponível!');
        }
        
        return {
            x: this.x,
            y: this.y,
            direction: this.facingRight,
            type: 'slash'
        };
    }
    
    updateEffects() {
        if (this.glowIntensity > 0) this.glowIntensity--;
        if (this.attackCooldown > 0) this.attackCooldown--;
        
        // Partículas ambientes do personagem
        if (this.frameCount % 15 === 0 && this.effects) {
            this.effects.addPlayerTrailParticle(
                this.x + Math.random() * 8 - 4,
                this.y + Math.random() * 8 - 4,
                Math.random() * 0.5 - 0.25,
                Math.random() * 0.5 - 0.25
            );
        }
    }
    
    constrainToWorld() {
        this.x = Math.max(this.radius, Math.min(CONFIG.WORLD.WIDTH - this.radius, this.x));
        
        // Respawn se cair muito
        if (this.y > CONFIG.WORLD.HEIGHT + 100) {
            this.x = 50;
            this.y = 480;
            this.vx = 0;
            this.vy = 0;
        }
    }
    
    collectEssence(essence) {
        if (this.effects) {
            this.effects.addEssenceCollectEffect(essence.x, essence.y, essence.type);
        }
    }
    
    draw(ctx, camera) {
        ctx.save();
        ctx.translate(-camera.x, -camera.y);
        
        // 🎯 AURA MAIS VISÍVEL quando há glow
        const auraRadius = this.radius + 20 + (this.glowIntensity * 2); // Multiplicado por 2
        const auraGradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, auraRadius
        );
        auraGradient.addColorStop(0, `rgba(255, 255, 255, ${this.glowIntensity > 0 ? 0.9 : 0.6})`);
        auraGradient.addColorStop(0.3, `rgba(240, 240, 240, ${this.glowIntensity > 0 ? 0.6 : 0.4})`);
        auraGradient.addColorStop(0.7, `rgba(255, 255, 255, ${this.glowIntensity > 0 ? 0.3 : 0.1})`);
        auraGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = auraGradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, auraRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Corpo principal do personagem
        ctx.shadowColor = CONFIG.COLORS.PLAYER;
        ctx.shadowBlur = 12 + (this.glowIntensity * 2); // Sombra mais intensa
        ctx.fillStyle = CONFIG.COLORS.PLAYER;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Núcleo super brilhante
        ctx.shadowBlur = 5;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        // Ponto central
        ctx.shadowBlur = 2;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // 🎯 INDICADOR VISUAL DE GLOW (DEBUG)
        if (this.glowIntensity > 0) {
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            ctx.setLineDash([2, 2]);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + 30, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        
        ctx.restore();
    }
}