// LUMINA - Configurações Globais
// Baseado no layout desenhado pelo Klaus

export const CONFIG = {
    // Dimensões do mundo
    WORLD: {
        WIDTH: 1600,
        HEIGHT: 1200
    },
    
    // Dimensões do canvas
    CANVAS: {
        WIDTH: 1200,
        HEIGHT: 700
    },
    
    // Configurações do jogador
    PLAYER: {
        RADIUS: 12,
        SPEED: 6,
        JUMP_FORCE: -11,
        GRAVITY: 0.45,
        FRICTION: 0.88,
        LIGHT_RADIUS: 120
    },
    
    // Configurações da câmera
    CAMERA: {
        SMOOTHING: 0.08
    },
    
    // Paleta de cores
    COLORS: {
        // Fundo
        BG_FAR: '#000000',
        BG_MID: '#0a0a0a', 
        BG_NEAR: '#1a1a1a',
        
        // Plataformas (baseado no desenho)
        PLATFORM_DARK: '#404040',
        PLATFORM_MID: '#606060',
        PLATFORM_LIGHT: '#808080',
        
        // Personagem
        PLAYER: '#ffffff',
        PLAYER_GLOW: '#f0f0f0',
        
        // Efeitos
        MAGIC: '#4a7c59',
        WARMTH: '#d2691e',
        ESSENCE: '#ffd700',
        LIFE: '#00ff7f'
    },
    
    // Configurações de física
    PHYSICS: {
        COLLISION_BUFFER: 10,
        GROUND_DETECTION: 10,
        GRAVITY: 0.45
    }
};