//===================================================
// CONFIGURAÇÃO DA API E DADOS LOCAIS
// Quando o backend FastAPI estiver ativo, os dados podem ser
// sincronizados via API. Caso contrário, carrega as fotos locais.
// ===================================================
const API_BASE_URL = "http://localhost:8000";

// Figurinhas padrão locais (as 5 fotos da pasta fotos/, posicionadas na última página do álbum - slots #21 a #25)
const FIGURINHAS_PADRAO = [
    { id: 1, nome: "Alan Turing", imagem_url: "fotos/alan.jpg" },
    { id: 2, nome: "Ada Lovelace", imagem_url: "fotos/ada.jpg" },
    { id: 3, nome: "John McCarthy", imagem_url: "fotos/john.jpg" },
    { id: 4, nome: "Geoffrey Hinton", imagem_url: "fotos/geoffrey.jpg" },
    { id: 5, nome: "Claude Shannon", imagem_url: "fotos/claude.jpg" },
    { id: 6, nome: "Guido van Rossum", imagem_url: "fotos/guido.jpg" },
    { id: 7, nome: "Dennis Ritchie", imagem_url: "fotos/dennis.jpg" },
    { id: 8, nome: "Bjarne Stroustrup", imagem_url: "fotos/bjarme.jpg" },
    { id: 9, nome: "Brendan Eich", imagem_url: "fotos/brendan.jpg" },
    { id: 10, nome: "Grace Hopper", imagem_url: "fotos/grace.jpeg" },
    { id: 11, nome: "Linus Torvalds", imagem_url: "fotos/linus.jpeg" },
    { id: 12, nome: "Ken Thompson", imagem_url: "fotos/ken.jpeg" },
    { id: 13, nome: "Tim Berners-Lee", imagem_url: "fotos/tim.jpeg" },
    { id: 14, nome: "Margaret Hamilton", imagem_url: "fotos/margaret.jpeg" },
    { id: 15, nome: "Richard Stallman", imagem_url: "fotos/richard.jpeg" },
    { id: 16, nome: "Edgar F. Codd", imagem_url: "fotos/edgar.jpeg" },
    { id: 17, nome: "Barbara Liskov", imagem_url: "fotos/barbara.jpeg" },
    { id: 18, nome: "Donald Knuth", imagem_url: "fotos/donald.jpeg" },
    { id: 19, nome: "James Gosling", imagem_url: "fotos/james.jpeg" },
    { id: 20, nome: "Satoshi Nakamoto", imagem_url: "fotos/nakamoto.jpeg" },

    { id: 21, nome: "Gustavo", imagem_url: "fotos/gustavo.jpeg" },
    { id: 22, nome: "Bruno", imagem_url: "fotos/Bruno.jpeg" },
    { id: 23, nome: "Kauan", imagem_url: "fotos/kauan.jpeg" },
    { id: 24, nome: "Jose", imagem_url: "fotos/Jose.jpeg" },
    { id: 25, nome: "Joaquim", imagem_url: "fotos/Joaquim.jpeg" }
];

// ===================================================
// FUNÇÃO: Preenche os slots do álbum com imagens
// Tenta buscar na API e mescla/recorre às fotos locais da pasta fotos/
// ===================================================
async function preencherFigurinhas() {
    let figurinhas = [...FIGURINHAS_PADRAO];

    try {
        // 1. Tenta buscar figurinhas disponíveis na API
        const response = await fetch(`${API_BASE_URL}/figurinhas`);

        if (response.ok) {
            const apiFigurinhas = await response.json();
            if (Array.isArray(apiFigurinhas) && apiFigurinhas.length > 0) {
                // Mescla as figurinhas da API com as locais
                const mapa = new Map(figurinhas.map(f => [f.id, f]));
                for (const item of apiFigurinhas) {
                    mapa.set(item.id, item);
                }
                figurinhas = Array.from(mapa.values());
                console.log(`✅ ${figurinhas.length} figurinhas carregadas com suporte da API!`);
            }
        }
    } catch (erro) {
        console.info("ℹ️  Backend API não detectado no momento. Carregando as 5 fotos locais de 'fotos/'.");
    }

    // 2. Cria um Map de id → figurinha para lookup rápido
    const porId = new Map(figurinhas.map(f => [f.id, f]));

    // 3. Percorre todos os slots do HTML
    const slots = document.querySelectorAll(".sticker-slot");

    for (const slot of slots) {
        const slotNumeroEl = slot.querySelector(".slot-number");
        if (!slotNumeroEl) continue;

        // Extrai o número do slot: "#01" → 1
        const id = parseInt(slotNumeroEl.textContent.replace("#", ""), 10);

        let figurinha = porId.get(id);

        const slotNomeEl = slot.querySelector(".slot-name");
        if (!figurinha && slotNomeEl) {
            const nomeSlot = slotNomeEl.textContent.trim().toLowerCase();
            figurinha = figurinhas.find(f => f.nome && f.nome.toLowerCase() === nomeSlot);
        }

        if (!figurinha) continue;

        // Atualiza o nome da pessoa no slot se fornecido
        if (slotNomeEl && figurinha.nome) {
            slotNomeEl.textContent = figurinha.nome;
        }

        // Se o slot já tiver imagem inserida, não duplica
        if (slot.querySelector(".sticker-img")) continue;

        const img = document.createElement("img");
        
        let src = figurinha.imagem_url;
        if (src.startsWith("/fotos/") || src.startsWith("/imgs/")) {
            src = `${API_BASE_URL}${src}`;
        }

        img.src = src;
        img.alt = figurinha.nome;
        img.className = "sticker-img";

        img.onload = () => {
            slot.classList.add("slot-preenchido");
            slot.style.setProperty("--slot-bg-img", `url("${src}")`);
        };
        img.onerror = () => console.warn(`Imagem não encontrada: ${figurinha.nome} em ${src}`);

        slot.insertBefore(img, slot.firstChild);
    }

    console.log(`✅ Figurinhas dos primeiros slots preenchidas com sucesso!`);
}

document.addEventListener("DOMContentLoaded", () => {
    const bookElement = document.getElementById("book");
    const btnPrev = document.getElementById("btn-prev");
    const btnNext = document.getElementById("btn-next");
    const soundToggle = document.getElementById("sound-toggle");
    const iconOn = soundToggle.querySelector(".sound-icon-on");
    const iconOff = soundToggle.querySelector(".sound-icon-off");

    let isMuted = false;
    let pageFlip = null;

    // 1. Initialize St.PageFlip
    try {
        pageFlip = new St.PageFlip(bookElement, {
            width: 550, // Base page width
            height: 800, // Base page height
            size: "stretch",
            minWidth: 315,
            maxWidth: 1000,
            minHeight: 420,
            maxHeight: 1350,
            drawShadow: true,
            maxShadowOpacity: 0.4, // Aumenta levemente contraste da sombra
            showCover: true,
            mobileScrollSupport: true,
            useMouseEvents: false, // Desativa gestos padrão do StPageFlip para evitar cliques indesejados nas bordas/páginas
            showPageCorners: false, // Remove dobras dos cantos no hover
            disableFlipByClick: true, // Garante que a virada por cliques simples esteja desativada
            flippingTime: 800 // Transição mais ágil e snappier (800ms em vez de 1000ms)
        });

        // Load pages from HTML
        pageFlip.loadFromHTML(document.querySelectorAll(".page"));

        // Estado de arraste personalizado
        let activeDragPage = null;
        let isClicking = false;
        let startX = 0;
        let startY = 0;
        let dragStarted = false;

        // Monitora o mousedown/touchstart em cada página para iniciar a intenção de arraste
        document.querySelectorAll(".page").forEach((page, index) => {
            page.addEventListener("mousedown", (e) => {
                if (e.target.closest("button") || e.target.closest("a")) return;
                isClicking = true;
                startX = e.clientX;
                startY = e.clientY;
                dragStarted = false;
                activeDragPage = { page, index };
            });

            page.addEventListener("touchstart", (e) => {
                if (e.target.closest("button") || e.target.closest("a")) return;
                const touch = e.touches[0];
                isClicking = true;
                startX = touch.clientX;
                startY = touch.clientY;
                dragStarted = false;
                activeDragPage = { page, index };
            });
        });

        // Executa o movimento de dobra apenas se o mouse/dedo se mover além de um limiar (threshold)
        const handleMove = (clientX, clientY, isTouch = false) => {
            if (!isClicking || !activeDragPage) return;

            const deltaX = clientX - startX;
            const deltaY = clientY - startY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            const bookRect = bookElement.getBoundingClientRect();

            // Só ativa o flip se mover mais de 10px (evita disparar ao clicar e soltar estático)
            if (distance > 10 && !dragStarted) {
                dragStarted = true;
                let cornerX, cornerY;

                // Determina canto vertical (topo vs base) em coordenadas relativas ao livro
                const centerY = bookRect.top + bookRect.height / 2;
                if (startY < centerY) {
                    cornerY = 0; // Canto superior
                } else {
                    cornerY = bookRect.height; // Canto inferior
                }

                // Determina canto horizontal (direita vs esquerda) em coordenadas relativas ao livro
                if (activeDragPage.index % 2 === 0) {
                    cornerX = bookRect.width; // Canto direito
                } else {
                    cornerX = 0; // Canto esquerdo
                }

                document.body.classList.add("dragging");
                pageFlip.startUserTouch({ x: cornerX, y: cornerY });
            }

            if (dragStarted) {
                const relX = clientX - bookRect.left;
                const relY = clientY - bookRect.top;
                pageFlip.userMove({ x: relX, y: relY }, isTouch);
            }
        };

        const handleRelease = (clientX, clientY, isTouch = false) => {
            if (dragStarted) {
                const bookRect = bookElement.getBoundingClientRect();
                const relX = clientX - bookRect.left;
                const relY = clientY - bookRect.top;
                pageFlip.userStop({ x: relX, y: relY }, isTouch);
            }
            isClicking = false;
            dragStarted = false;
            activeDragPage = null;
            document.body.classList.remove("dragging");
        };

        window.addEventListener("mousemove", (e) => {
            handleMove(e.clientX, e.clientY, false);
        });

        window.addEventListener("touchmove", (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                handleMove(touch.clientX, touch.clientY, true);
            }
        });

        window.addEventListener("mouseup", (e) => {
            handleRelease(e.clientX, e.clientY, false);
        });

        window.addEventListener("touchend", (e) => {
            const touch = e.changedTouches[0] || e.touches[0];
            if (touch) {
                handleRelease(touch.clientX, touch.clientY, true);
            } else {
                handleRelease(startX, startY, true);
            }
        });

        // Show book after successful initialization
        bookElement.style.display = "block";

        // Dia 3: Busca as figurinhas da API e preenche o álbum
        // A função é async, chamamos sem await para não bloquear a inicialização do álbum
        preencherFigurinhas();

    } catch (error) {
        console.error("Erro ao inicializar a biblioteca PageFlip:", error);
    }

    // 2. Sound Effect Generator (Web Audio API)
    function playPaperTurnSound() {
        if (isMuted) return;

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;

            const audioCtx = new AudioContext();
            const duration = 0.45; // seconds
            const sampleRate = audioCtx.sampleRate;
            const bufferSize = sampleRate * duration;
            const buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
            const data = buffer.getChannelData(0);

            // Synthesize white noise with a custom page-flip volume envelope
            for (let i = 0; i < bufferSize; i++) {
                const progress = i / bufferSize;
                // Noise value between -1 and 1
                const noise = Math.random() * 2 - 1;

                // Volume envelope: smooth curve that peaks around 30% of the duration
                let envelope = 0;
                if (progress < 0.3) {
                    envelope = progress / 0.3; // Rapid ramp up
                } else {
                    envelope = (1 - progress) / 0.7; // Smooth decay
                }

                // Add minor irregular spikes to simulate paper friction/crackle
                const paperCrackle = Math.random() > 0.985 ? (Math.random() * 2 - 1) * 0.35 : 0;

                data[i] = (noise * 0.65 + paperCrackle) * envelope * 0.12;
            }

            // Create nodes
            const noiseNode = audioCtx.createBufferSource();
            noiseNode.buffer = buffer;

            // Bandpass filter to extract the "whoosh" sound of paper shuffling
            const bandpassFilter = audioCtx.createBiquadFilter();
            bandpassFilter.type = "bandpass";
            bandpassFilter.Q.value = 2.0;

            // Dynamic frequency sweep: starts at 1500Hz, sweeps down to 350Hz (sound of page moving away)
            bandpassFilter.frequency.setValueAtTime(1500, audioCtx.currentTime);
            bandpassFilter.frequency.exponentialRampToValueAtTime(350, audioCtx.currentTime + duration);

            // Lowpass filter to remove harsh high-frequency digital artifacts
            const lowpassFilter = audioCtx.createBiquadFilter();
            lowpassFilter.type = "lowpass";
            lowpassFilter.frequency.setValueAtTime(3800, audioCtx.currentTime);

            // Connect graph: Source -> Bandpass -> Lowpass -> Destination
            noiseNode.connect(bandpassFilter);
            bandpassFilter.connect(lowpassFilter);
            lowpassFilter.connect(audioCtx.destination);

            noiseNode.start();
        } catch (e) {
            console.warn("Falha ao tocar som de virada de página:", e);
        }
    }

    // 3. Audio State Controls
    soundToggle.addEventListener("click", () => {
        isMuted = !isMuted;
        if (isMuted) {
            iconOn.classList.add("hidden");
            iconOff.classList.remove("hidden");
        } else {
            iconOn.classList.remove("hidden");
            iconOff.classList.add("hidden");
        }
    });

    // 4. Navigation controls and events
    if (pageFlip) {
        // Play turn sound when page starts flipping
        pageFlip.on("changeState", (e) => {
            if (e.data === "flipping") {
                playPaperTurnSound();
            }
        });

        // Discrete arrow toggle depending on current page
        pageFlip.on("flip", (e) => {
            const currentPage = e.data;
            const totalPages = pageFlip.getPageCount();

            // Hide left button on cover page
            if (currentPage === 0) {
                btnPrev.classList.add("hidden");
            } else {
                btnPrev.classList.remove("hidden");
            }

            // Hide right button on back cover
            if (currentPage === totalPages - 1) {
                btnNext.classList.add("hidden");
            } else {
                btnNext.classList.remove("hidden");
            }
        });

        // Click events for navigational arrows
        btnPrev.addEventListener("click", () => {
            pageFlip.flipPrev();
        });

        btnNext.addEventListener("click", () => {
            pageFlip.flipNext();
        });

        // Keyboard events for navigational arrows
        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft") {
                pageFlip.flipPrev();
            } else if (e.key === "ArrowRight") {
                pageFlip.flipNext();
            }
        });

        // Hide left button initially since start page is 0
        btnPrev.classList.add("hidden");
    }
});
