// LUMINA - Sistema do Jogador
// Controla movimento, pulo, ataques e efeitos visuais

import { CONFIG } from './config.js';

export class Player {
    constructor(x = 100, y = 900) {
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
        
        // Efeitos visuais
        this.glowIntensity = 0;
        this.attackCooldown = 0;
        this.lightRadius = CONFIG.PLAYER.LIGHT_RADIUS;
        
        // Input buffer
        this.jumpBufferTime = 0;
    }
    
    update(keys, platforms) {
        this.handleInput(keys);
        this.updatePhysics();
        this.handleCollisions(platforms);
        this.updateEffects();
        this.constrainToWorld();
    }
    
    handleInput(keys) {
        // Movimento horizontal
        if (keys['a'] || keys['arrowleft']) {
            this.vx = Math.max(this.vx - 0.5, -CONFIG.PLAYER.SPEED);
            this.facingRight = false;
        }
        if (keys['d'] || keys['arrowright']) {
            this.vx = Math.min(this.vx + 0.5, CONFIG.PLAYER.SPEED);
            this.facingRight = true;
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
            }
        }
    }
    
    handleCollisions(platforms) {
        let wasGrounded = this.grounded;
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
            }
        });
    }
    
    jump() {
        if (this.grounded) {
            this.vy = CONFIG.PLAYER.JUMP_FORCE;
            this.grounded = false;
            return true;
        }
        return false;
    }
    
    lightPulse() {
        this.glowIntensity = 15;
        return {
            x: this.x,
            y: this.y,
            type: 'pulse'
        };
    }
    
    slashAttack() {
        if (this.attackCooldown > 0) return null;
        
        this.attackCooldown = 25;
        this.glowIntensity = 15;
        
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
    }
    
    constrainToWorld() {
        this.x = Math.max(this.radius, Math.min(CONFIG.WORLD.WIDTH - this.radius, this.x));
        
        // Respawn se cair muito
        if (this.y > CONFIG.WORLD.HEIGHT + 200) {
            this.x = 100;
            this.y = 900;
            this.vx = 0;
            this.vy = 0;
        }
    }
    
    draw(ctx, camera) {
        ctx.save();
        ctx.translate(-camera.x, -camera.y);
        
        // Aura de luz
        const auraGradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius + 15 + this.glowIntensity
        );
        auraGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        auraGradient.addColorStop(0.4, 'rgba(240, 240, 240, 0.3)');
        auraGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = auraGradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 20 + this.glowIntensity, 0, Math.PI * 2);
        ctx.fill();
        
        // Corpo principal
        ctx.shadowColor = CONFIG.COLORS.PLAYER;
        ctx.shadowBlur = 15;
        ctx.fillStyle = CONFIG.COLORS.PLAYER;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Núcleo brilhante
        ctx.shadowBlur = 3;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}