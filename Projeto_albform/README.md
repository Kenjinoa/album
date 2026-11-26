# 📖 Álbum de Figurinhas Tech (Projeto Albform)

Um álbum virtual interativo e colecionável que homenageia pioneiros, tecnologias e marcos históricos da ciência da computação e da tecnologia. 

A aplicação combina uma experiência rica de folheio físico realista (efeito de dobra de página 3D e áudio procedural de papel) com o consumo dinâmico de figurinhas a partir de uma API backend.

---

## 🎯 Objetivo do Projeto

O objetivo do projeto é criar uma experiência imersiva de álbum de figurinhas digital onde o usuário pode:
* Folhear páginas como em uma revista ou livro físico, com suporte a mouse, toque em tela (*touch*) e teclado.
* Conectar-se a um servidor backend para carregar figurinhas dinamicamente nos slots correspondentes.
* Desfrutar de uma interface moderna e imersiva com estética tecnológica, animações temáticas e efeitos sonoros gerados em tempo real sem dependências externas de áudio.

---

## 📂 Arquivos do Projeto e Suas Funcionalidades

### 1. `app.js` (Lógica da Aplicação)
Responsável por toda a interatividade, integração com a API e manipulação multimídia:
* **Integração com a API (`preencherFigurinhas`)**: Faz requisições HTTP `GET` para o endpoint `/figurinhas`, mapeia os identificadores dos slots (`#01`, `#02`, ...) e injeta as imagens das figurinhas nos locais corretos, aplicando o status de preenchimento.
* **Mecanismo de Folheio 3D (`St.PageFlip`)**: Inicializa e gerencia a biblioteca de virada de páginas, ajustando limites de escala, sombras e transições.
* **Gesto de Arraste Manual**: Detecta o movimento de arrastar (*drag*) com o mouse ou tela sensível ao toque a partir de uma distância mínima (10px), permitindo segurar e dobrar a folha livremente.
* **Áudio Procedural com Web Audio API**: Sintetiza em tempo de execução o efeito sonoro de papel raspando e virando usando ruído branco (*white noise*) e filtros passa-faixa dinâmicos. Dispensa o carregamento de arquivos de áudio pesados e conta com controle de mudo (*mute*).
* **Navegação**: Gerencia atalhos via setas do teclado (`ArrowLeft` e `ArrowRight`) e botões visuais, alternando a visibilidade na capa e contracapa.

### 2. `style.css` (Estilização e Design)
Define a identidade visual, temas, tipografia e responsividade da interface:
* **Paleta de Cores e Identidade Visual**: Variáveis CSS personalizadas com paleta escura e tons de azul elétrico (`--color-blue-universe`, `--color-dev-blue`, etc.) com gradiente radial de fundo.
* **Sombras de Lombada e Profundidade**: Aplicação de sombras sutis nas junções das páginas para simular o vinco central de encadernação.
* **Slots e Efeito de "Colar"**: Estilização dos compartimentos das figurinhas com bordas tracejadas quando vazios e animação fluida (`sticker-aparecer`) com sobreposição de legenda quando preenchidos.
* **Capa e Contracapa Estilizadas**:
  * Efeito de texto com falha digital (*glitch*).
  * Selo com brilho holográfico deslizante.
  * Orbe tecnológica 3D animada com anéis orbitais.
  * Contracapa com código de barras estilizado e resumo.
* **Responsividade**: Adaptação para tablets e dispositivos móveis com visualização em página única (*single-page*).

### 3. `index.html` (Estrutura de Marcação - Previsto)
Contém a estrutura das páginas do álbum, incluindo a capa, páginas internas de categorias com os slots numerados (`.sticker-slot`), contracapa e importação das fontes e da biblioteca `st-page-flip`.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
* Navegador moderno (Chrome, Firefox, Edge, Safari).
* Python 3.10+ (para executar o backend FastAPI).

### 1. Iniciar o Backend (API)
Se o backend estiver localizado na estrutura do curso/projeto:
```bash
cd backend/dia-3
uvicorn main:app --reload
```
A API será inicializada por padrão em: `http://localhost:8000`

### 2. Abrir o Frontend
Você pode abrir o arquivo `index.html` usando uma extensão como **Live Server** no VS Code ou servindo os arquivos estáticos diretamente pelo FastAPI.

---

## 🎮 Controles de Navegação

| Ação | Como Utilizar |
| :--- | :--- |
| **Folhear manualmente** | Clique e arraste na borda ou canto da página |
| **Avançar / Voltar página** | Clique nos botões laterais ou use as setas `←` e `→` do teclado |
| **Mutar / Ativar som** | Clique no botão circular no canto superior direito |
