# 📖 Diário de Lugares

Aplicativo em React Native com Expo para registo de lugares com fotos e geolocalização.

## 📱 Canvas do Projeto
- **Q1: O que cada registo guarda?** Título, comentário/nota, foto (URI), latitude, longitude e data de criação.
- **Q2: Quais telas existem?** Tela única com formulário de registo e lista persistente de lugares.
- **Q3: Qual a regra de aceite?** É obrigatório o título e ter pelo menos uma foto OU a localização via GPS.
- **Q4: O que foi reutilizado?** Repositório com AsyncStorage e hook customizado de GPS com limite de tempo de 20s.

## 🚀 Como executar

1. Instalar dependências:
   ```bash
   npm install