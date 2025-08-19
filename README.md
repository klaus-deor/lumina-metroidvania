# LUMINA - Metroidvania Game

Jogo metroidvania desenvolvido em HTML5/JavaScript com arquitetura modular.

## Estrutura do Projeto

```
LUMINA/
├── index.html          # Arquivo principal
├── js/
│   ├── config.js       # Configurações globais
│   ├── player.js       # Sistema do jogador
│   ├── world.js        # Sistema de mundo/mapas
│   ├── camera.js       # Sistema de câmera
│   ├── effects.js      # Partículas e efeitos
│   ├── input.js        # Sistema de controles
│   ├── ui.js          # Interface/HUD
│   └── game.js        # Game loop principal
└── assets/
    ├── sprites/       # Sprites e imagens
    └── audio/         # Música e efeitos sonoros
```

## Como Executar

1. Clone o repositório
2. Abra `index.html` no navegador
3. Ou sirva localmente com um servidor HTTP

## Controles

- **WASD** - Movimento
- **SPACE** - Pular
- **Q** - Pulso de Luz
- **E** - Ataque Slash

## Desenvolvimento

Este projeto usa ES6 modules para organização modular do código.
Cada sistema é independente e pode ser desenvolvido separadamente.
