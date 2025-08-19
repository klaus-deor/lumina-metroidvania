// LUMINA - Configurações Globais
// Baseado na imagem exata do Klaus

export const CONFIG = {
    // Dimensões do mundo (baseado na imagem)
    WORLD: {
        WIDTH: 1000,
        HEIGHT: 600
    },
    
    // Dimensões do canvas
    CANVAS: {
        WIDTH: 1200,
        HEIGHT: 700
    },
    
    // Configurações do jogador
    PLAYER: {
        RADIUS: 8,  // Menor para ficar proporcional à imagem
        SPEED: 5,
        JUMP_FORCE: -10,
        FRICTION: 0.88,
        LIGHT_RADIUS: 100
    },
    
    // Configurações da câmera
    CAMERA: {
        SMOOTHING: 0.06
    },
    
    // Paleta de cores
    COLORS: {
        // Fundo
        BG_FAR: '#000000',
        BG_MID: '#0a0a0a', 
        BG_NEAR: '#1a1a1a',
        
        // Plataformas (baseado na imagem - cinza)
        PLATFORM_DARK: '#404040',
        PLATFORM_MID: '#606060',
        PLATFORM_LIGHT: '#808080',
        
        // Personagem (círculo branco da imagem)
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
        COLLISION_BUFFER: 5,
        GROUND_DETECTION: 8,
        GRAVITY: 0.4
    }
};