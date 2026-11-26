from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn

app = FastAPI(
    title="API do Álbum de Figurinhas",
    description="Backend para fornecimento de figurinhas e fotos do projeto Albform",
    version="1.0.0"
)

# Configuração de CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Monta o diretório de fotos como arquivos estáticos acessíveis via /fotos
app.mount("/fotos", StaticFiles(directory="fotos"), name="fotos")

# Lista dos integrantes cadastrados para a última página do álbum (slots #21 a #25)
FIGURINHAS = [
    {
        "id": 21,
        "nome": "Gustavo",
        "imagem_url": "/fotos/gustavo.jpeg",
        "descricao": "Dev & Integrante do Projeto"
    },
    {
        "id": 22,
        "nome": "Bruno",
        "imagem_url": "/fotos/Bruno.jpeg",
        "descricao": "Dev & Integrante do Projeto"
    },
    {
        "id": 23,
        "nome": "Kauan",
        "imagem_url": "/fotos/kauan.jpeg",
        "descricao": "Dev & Integrante do Projeto"
    },
    {
        "id": 24,
        "nome": "Jose",
        "imagem_url": "/fotos/Jose.jpeg",
        "descricao": "Dev & Integrante do Projeto"
    },
    {
        "id": 25,
        "nome": "Joaquim",
        "imagem_url": "/fotos/Joaquim.jpeg",
        "descricao": "Dev & Integrante do Projeto"
    }
]

@app.get("/")
def home():
    return {
        "status": "online",
        "mensagem": "API do Álbum de Figurinhas rodando com sucesso!",
        "rotas_disponiveis": ["/figurinhas", "/docs", "/fotos"]
    }

@app.get("/figurinhas")
def listar_figurinhas():
    """Retorna todas as figurinhas cadastradas para o álbum."""
    return FIGURINHAS

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
