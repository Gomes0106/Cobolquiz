# QUIZ-COBOL v2.0 

Quiz interativo com **50 questões no banco**, **10 sorteadas aleatoriamente** por rodada, avaliadas por um programa **COBOL** via backend **Node.js**.

---

##  Estrutura

```
quiz-cobol/
├── cobol/
│   ├── quiz.cob        ← Código-fonte COBOL (avalia 10 respostas)
│   └── quiz            ← Binário compilado
├── public/
│   └── index.html      ← Frontend visual retrô de terminal
├── server.js           ← Backend Node.js (50 questões, sorteio, sessões)
└── README.md
```

---

##  Como rodar

Tem que fazer o cobol 
  
### 1. Instalar Node e rodar

```bash
npm install
node server.js
```

### 4. Acessar: http://localhost:3000

---

##  Fluxo completo

```
[Frontend]
  GET /api/perguntas
    → Node sorteia 10 do banco de 50
    → Cria sessão com o gabarito (seguro, não exposto)
    → Retorna perguntas sem gabarito

  POST /api/avaliar { respostas, sessaoId }
    → Node recupera gabarito da sessão
    → Monta arg: "RESPOSTAS GABARITO" (21 chars)
    → execFile('./cobol/quiz', [arg])
    → COBOL compara letra a letra, calcula pontuação
    → Node parseia saída e retorna JSON

[Frontend exibe resultado]
```

---

##  Categorias das 50 questões

| Categoria | Questões |
|---|---|
| Geografia | 1–10 |
| Ciências / Natureza | 11–20 |
| Tecnologia / Informática | 21–30 |
| História | 31–40 |
| Matemática | 41–45 |
| Cultura Geral | 46–50 |

---

Cada questão vale **10 pontos**. Total: **100 pontos**.
