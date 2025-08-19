// LUMINA - Sistema de Efeitos
// Partículas, pulsos de luz e ataques especiais

import { CONFIG } from './config.js';

export class EffectsSystem {
    constructor() {
        this.particles = [];
        this.pulses = [];
        this.slashAttacks = [];
    }
    
    update() {
        // Atualizar partículas
        this.particles = this.particles.filter(particle => particle.update());
        
        // Atualizar pulsos
        this.pulses = this.pulses.filter(pulse => pulse.update());
        
        // Atualizar ataques slash
        this.slashAttacks = this.slashAttacks.filter(slash => slash.update());
    }
    
    addPlayerTrailParticle(x, y, vx, vy) {
        this.particles.push(new LightParticle(
            x + Math.random() * 8 - 4,
            y + Math.random() * 8 - 4,
            vx * 0.3 + Math.random() * 0.5 - 0.25,
            vy * 0.3 + Math.random() * 0.5 - 0.25,
            CONFIG.COLORS.PLAYER_GLOW,
            30,
            1.5
        ));
    }
    
    addJumpParticles(x, y) {
        for (let i = 0; i < 8; i++) {
            this.particles.push(new LightParticle(
                x + Math.random() * 16 - 8,
                y + 8,
                Math.random() * 4 - 2,
                Math.random() * 2,
                CONFIG.COLORS.LIFE,
                35,
                2
            ));
        }
    }
    
    addLandingParticles(x, y) {
        for (let i = 0; i < 5; i++) {
            this.particles.push(new LightParticle(
                x + Math.random() * 12 - 6,
                y + 8,
                Math.random() * 3 - 1.5,
                Math.random() * -1.5,
                CONFIG.COLORS.MAGIC,
                25,
                1.8
            ));
        }
    }
    
    addEssenceCollectEffect(x, y, type) {
        const count = type === 'crystal' ? 15 : type === 'large' ? 12 : 8;
        const color = type === 'crystal' ? CONFIG.COLORS.LIFE : 
                     type === 'large' ? CONFIG.COLORS.ESSENCE : CONFIG.COLORS.MAGIC;
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            this.particles.push(new LightParticle(
                x,
                y,
                Math.cos(angle) * 3,
                Math.sin(angle) * 3,
                color,
                40,
                2.5
            ));
        }
    }
    
    addLightPulse(x, y) {
        this.pulses.push(new LightPulse(x, y));
        
        // Partículas do pulso
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 * i) / 12;
            this.particles.push(new LightParticle(
                x + Math.cos(angle) * 15,
                y + Math.sin(angle) * 15,
                Math.cos(angle) * 2.5,
                Math.sin(angle) * 2.5,
                CONFIG.COLORS.MAGIC,
                35,
                2
            ));
        }
    }
    
    addSlashAttack(x, y, direction) {
        this.slashAttacks.push(new LightSlash(x, y, direction));
        
        // Partículas do slash
        const dir = direction ? 1 : -1;
        const impactX = x + (dir * 35);
        const impactY = y - 8;
        
        for (let i = 0; i < 10; i++) {
            this.particles.push(new LightParticle(
                impactX + Math.random() * 20 - 10,
                impactY + Math.random() * 20 - 10,
                dir * (Math.random() * 3 + 1),
                Math.random() * 4 - 2,
                CONFIG.COLORS.WARMTH,
                30,
                2.2
            ));
        }
        
        // Partículas brilhantes
        for (let i = 0; i < 5; i++) {
            this.particles.push(new LightParticle(
                impactX + Math.random() * 15 - 7.5,
                impactY + Math.random() * 15 - 7.5,
                dir * (Math.random() * 2 + 0.5),
                Math.random() * 3 - 1.5,
                '#ffffff',
                20,
                1.8
            ));
        }
    }
    
    draw(ctx, camera) {
        ctx.save();
        ctx.translate(-camera.x, -camera.y);
        
        // Desenhar partículas
        this.particles.forEach(particle => particle.draw(ctx));
        
        // Desenhar pulsos
        this.pulses.forEach(pulse => pulse.draw(ctx));
        
        // Desenhar ataques slash
        this.slashAttacks.forEach(slash => slash.draw(ctx));
        
        ctx.restore();
    }
}

class LightParticle {
    constructor(x, y, vx, vy, color, life, size = 2) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.size = size;
        this.glow = Math.random() * 2 + 1;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.life--;
        return this.life > 0;
    }
    
    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.save();
        
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.glow * 6;
        ctx.globalAlpha = alpha * 0.8;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * alpha, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

class LightPulse {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = 60;
        this.life = 20;
        this.maxLife = 20;
    }
    
    update() {
        this.life--;
        this.radius = (1 - this.life / this.maxLife) * this.maxRadius;
        return this.life > 0;
    }
    
    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.save();
        
        ctx.globalAlpha = alpha * 0.4;
        ctx.strokeStyle = CONFIG.COLORS.MAGIC;
        ctx.lineWidth = 3;
        ctx.shadowColor = CONFIG.COLORS.MAGIC;
        ctx.shadowBlur = 8;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Anel interno
        ctx.globalAlpha = alpha * 0.2;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.restore();
    }
}

class LightSlash {
    constructor(x, y, direction) {
        this.startX = x;
        this.startY = y;
        this.direction = direction;
        this.life = 15;
        this.maxLife = 15;
        this.trailPoints = [];
        this.maxPoints = 6;
        this.currentPoint = 0;
        this.frameCount = 0;
        
        this.generateSlashPath();
    }
    
    generateSlashPath() {
        const direction = this.direction ? 1 : -1;
        const radius = 40;
        const startAngle = this.direction ? -Math.PI/2.5 : Math.PI + Math.PI/2.5;
        const endAngle = this.direction ? Math.PI/5 : Math.PI - Math.PI/5;
        
        this.fullPath = [];
        for (let i = 0; i < this.maxPoints; i++) {
            const progress = i / (this.maxPoints - 1);
            const angle = startAngle + (endAngle - startAngle) * progress;
            
            const x = this.startX + Math.cos(angle) * radius;
            const y = this.startY + Math.sin(angle) * radius * 0.8;
            
            this.fullPath.push({ x, y });
        }
    }
    
    update() {
        this.life--;
        this.frameCount++;
        
        if (this.frameCount % 2 === 0 && this.currentPoint < this.fullPath.length) {
            const newPoint = this.fullPath[this.currentPoint];
            this.trailPoints.push({
                x: newPoint.x,
                y: newPoint.y,
                age: 0,
                maxAge: 8
            });
            this.currentPoint++;
        }
        
        this.trailPoints.forEach(point => {
            point.age++;
        });
        
        this.trailPoints = this.trailPoints.filter(point => point.age < point.maxAge);
        
        return this.life > 0 || this.trailPoints.length > 0;
    }
    
    draw(ctx) {
        if (this.trailPoints.length < 2) {
            if (this.trailPoints.length === 1) {
                const point = this.trailPoints[0];
                const alpha = 1 - (point.age / point.maxAge);
                
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.fillStyle = CONFIG.COLORS.WARMTH;
                ctx.shadowColor = CONFIG.COLORS.WARMTH;
                ctx.shadowBlur = 6;
                ctx.beginPath();
                ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            return;
        }
        
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        for (let i = 0; i < this.trailPoints.length - 1; i++) {
            const point = this.trailPoints[i];
            const nextPoint = this.trailPoints[i + 1];
            
            if (!point || !nextPoint) continue;
            
            const avgAge = (point.age + nextPoint.age) / 2;
            const avgMaxAge = (point.maxAge + nextPoint.maxAge) / 2;
            const alpha = Math.max(0, 1 - (avgAge / avgMaxAge));
            
            const thickness = 6 + (this.trailPoints.length - i) * 0.5;
            
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = CONFIG.COLORS.WARMTH;
            ctx.lineWidth = thickness;
            ctx.shadowColor = CONFIG.COLORS.WARMTH;
            ctx.shadowBlur = 8;
            
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(nextPoint.x, nextPoint.y);
            ctx.stroke();
            
            // Núcleo brilhante
            ctx.globalAlpha = alpha * 0.7;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = thickness * 0.3;
            ctx.shadowBlur = 3;
            ctx.stroke();
            
            ctx.restore();
        }
    }
}