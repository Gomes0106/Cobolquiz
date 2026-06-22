const express = require('express');
const cors = require('cors');
const { execFile } = require('child_process');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─────────────────────────────────────────────────────────────────────────────
// BANCO COM 50 PERGUNTAS
// Cada pergunta: { id, pergunta, opcoes: {A,B,C,D}, correta: "A"|"B"|"C"|"D" }
// ─────────────────────────────────────────────────────────────────────────────

const BANCO = [
  // GEOGRAFIA
  { id:1,  pergunta:"Qual camada da atmosfera contém a maior parte dos fenômenos meteorológicos?",
    opcoes:{A:"Mesosfera",B:"Troposfera",C:"Estratosfera",D:"Exosfera"}, correta:"B" },
  { id:2,  pergunta:"Qual é o maior bioma brasileiro?",
    opcoes:{A:"Mata Atlântica",B:"Pantanal",C:"Cerrado",D:"Amazônia"}, correta:"D" },
  { id:3,  pergunta:"O processo de crescimento das cidades é chamado de:",
    opcoes:{A:"Industrialização",B:"Urbanização",C:"Globalização",D:"Desertificação"}, correta:"B" },
  { id:4,  pergunta:"Qual é a principal fonte de energia utilizada nas usinas hidrelétricas?",
    opcoes:{A:"Vento",B:"Sol",C:"Água",D:"Biomassa"}, correta:"C" },
  { id:5,  pergunta:"O Brasil está localizado em qual continente?",
    opcoes:{A:"América do Norte",B:"América Central",C:"América do Sul",D:"Europa"}, correta:"C" },
  { id:6,  pergunta:"Qual linha imaginária divide a Terra em hemisfério norte e sul?",
    opcoes:{A:"Trópico de Câncer",B:"Meridiano de Greenwich",C:"Linha Internacional da Data",D:"Equador"}, correta:"D" },
  { id:7,  pergunta:"O efeito estufa é um fenômeno:",
    opcoes:{A:"Exclusivamente artificial",B:"Natural e essencial à vida",C:"Restrito às áreas urbanas",D:"Causado apenas por indústrias"}, correta:"B" },
  { id:8,  pergunta:"Qual é a capital de Minas Gerais?",
    opcoes:{A:"Uberlândia",B:"Juiz de Fora",C:"Belo Horizonte",D:"Contagem"}, correta:"C" },
  { id:9,  pergunta:"O Cerrado é caracterizado principalmente por:",
    opcoes:{A:"Vegetação rasteira e árvores retorcidas",B:"Floresta densa e úmida",C:"Vegetação de mangue",D:"Vegetação polar"}, correta:"A" },
  { id:10, pergunta:"A globalização intensificou principalmente:",
    opcoes:{A:"O isolamento entre países",B:"A integração econômica e cultural",C:"A diminuição da tecnologia",D:"A redução dos transportes"}, correta:"B" },

  // CIÊNCIAS / NATUREZA
  { id:11, pergunta:"Qual organela celular é responsável pela produção de energia?",
    opcoes:{A:"Lisossomo",B:"Núcleo",C:"Mitocôndria",D:"Ribossomo"}, correta:"C" },
  { id:12, pergunta:"Qual é a fórmula química da água?",
    opcoes:{A:"CO₂",B:"H₂O",C:"O₂",D:"H₂SO₄"}, correta:"B" },
  { id:13, pergunta:"A unidade de medida da força no Sistema Internacional é:",
    opcoes:{A:"Watt",B:"Pascal",C:"Newton",D:"Joule"}, correta:"C" },
  { id:14, pergunta:"Qual gás é mais abundante na atmosfera terrestre?",
    opcoes:{A:"Oxigênio",B:"Nitrogênio",C:"Gás Carbônico",D:"Hidrogênio"}, correta:"B" },
  { id:15, pergunta:"A fotossíntese ocorre principalmente em qual estrutura da planta?",
    opcoes:{A:"Raiz",B:"Caule",C:"Folha",D:"Flor"}, correta:"C" },
  { id:16, pergunta:"Qual planeta é conhecido como Planeta Vermelho?",
    opcoes:{A:"Vênus",B:"Marte",C:"Júpiter",D:"Saturno"}, correta:"B" },
  { id:17, pergunta:"A velocidade da luz é aproximadamente:",
    opcoes:{A:"300 km/s",B:"3.000 km/s",C:"30.000 km/s",D:"300.000 km/s"}, correta:"D" },
  { id:18, pergunta:"O pH 7 indica uma solução:",
    opcoes:{A:"Ácida",B:"Básica",C:"Neutra",D:"Concentrada"}, correta:"C" },
  { id:19, pergunta:"O DNA é responsável por:",
    opcoes:{A:"Produzir oxigênio",B:"Armazenar informações genéticas",C:"Produzir energia",D:"Fazer digestão celular"}, correta:"B" },
  { id:20, pergunta:"A Lei da Gravitação Universal foi formulada por:",
    opcoes:{A:"Galileu",B:"Einstein",C:"Newton",D:"Tesla"}, correta:"C" },

  // TECNOLOGIA / INFORMÁTICA
  { id:21, pergunta:"O que significa CPU?",
    opcoes:{A:"Central Processing Unit",B:"Computer Personal Unit",C:"Central Program Utility",D:"Computer Processing Utility"}, correta:"A" },
  { id:22, pergunta:"Qual componente armazena dados temporariamente?",
    opcoes:{A:"SSD",B:"HD",C:"RAM",D:"Fonte"}, correta:"C" },
  { id:23, pergunta:"Qual linguagem é utilizada para estruturar páginas web?",
    opcoes:{A:"CSS",B:"HTML",C:"SQL",D:"Python"}, correta:"B" },
  { id:24, pergunta:"Qual é a principal função de um banco de dados?",
    opcoes:{A:"Editar imagens",B:"Armazenar e organizar informações",C:"Criar sistemas operacionais",D:"Controlar impressoras"}, correta:"B" },
  { id:25, pergunta:"O protocolo utilizado para navegação web é:",
    opcoes:{A:"FTP",B:"SMTP",C:"HTTP",D:"POP3"}, correta:"C" },
  { id:26, pergunta:"Em redes de computadores, o IP identifica:",
    opcoes:{A:"O monitor",B:"Um dispositivo na rede",C:"O teclado",D:"O sistema operacional"}, correta:"B" },
  { id:27, pergunta:"O sistema binário utiliza apenas:",
    opcoes:{A:"0 e 1",B:"1 e 2",C:"0 a 9",D:"A e B"}, correta:"A" },
  { id:28, pergunta:"Qual área da informática é responsável pelo levantamento de requisitos e desenvolvimento de software?",
    opcoes:{A:"Redes",B:"Hardware",C:"Engenharia de Software",D:"Banco de Dados"}, correta:"C" },
  { id:29, pergunta:"O SQL é utilizado para:",
    opcoes:{A:"Criar apresentações",B:"Gerenciar bancos de dados",C:"Editar vídeos",D:"Programar microcontroladores"}, correta:"B" },
  { id:30, pergunta:"Um firewall tem como principal função:",
    opcoes:{A:"Melhorar o áudio",B:"Resfriar o computador",C:"Proteger a rede contra acessos indevidos",D:"Aumentar a memória RAM"}, correta:"C" },

  // HISTÓRIA
  { id:31, pergunta:"Em que ano ocorreu a Independência do Brasil?",
    opcoes:{A:"1500",B:"1822",C:"1889",D:"1964"}, correta:"B" },
  { id:32, pergunta:"Quem proclamou a República no Brasil?",
    opcoes:{A:"Dom Pedro I",B:"Getúlio Vargas",C:"Deodoro da Fonseca",D:"Juscelino Kubitschek"}, correta:"C" },
  { id:33, pergunta:"A Revolução Francesa ocorreu em:",
    opcoes:{A:"1789",B:"1822",C:"1889",D:"1914"}, correta:"A" },
  { id:34, pergunta:"A Primeira Guerra Mundial ocorreu entre:",
    opcoes:{A:"1914 e 1918",B:"1939 e 1945",C:"1900 e 1904",D:"1945 e 1950"}, correta:"A" },
  { id:35, pergunta:"O período conhecido como Idade Média ocorreu entre:",
    opcoes:{A:"Antiguidade e Idade Moderna",B:"Pré-História e Antiguidade",C:"Idade Moderna e Contemporânea",D:"Renascimento e Revolução Industrial"}, correta:"A" },
  { id:36, pergunta:"Quem foi o primeiro presidente do Brasil?",
    opcoes:{A:"Getúlio Vargas",B:"Prudente de Morais",C:"Deodoro da Fonseca",D:"Floriano Peixoto"}, correta:"C" },
  { id:37, pergunta:"O Renascimento teve início em:",
    opcoes:{A:"França",B:"Itália",C:"Alemanha",D:"Inglaterra"}, correta:"B" },
  { id:38, pergunta:"A escravidão foi oficialmente abolida no Brasil em:",
    opcoes:{A:"1808",B:"1822",C:"1888",D:"1889"}, correta:"C" },
  { id:39, pergunta:"O Muro de Berlim foi derrubado em:",
    opcoes:{A:"1961",B:"1989",C:"1991",D:"2000"}, correta:"B" },
  { id:40, pergunta:"A Segunda Guerra Mundial terminou em:",
    opcoes:{A:"1918",B:"1939",C:"1945",D:"1950"}, correta:"C" },

  // MATEMÁTICA / LÓGICA
  { id:41, pergunta:"Quanto é 25% de 200?",
    opcoes:{A:"25",B:"40",C:"50",D:"75"}, correta:"C" },
  { id:42, pergunta:"Qual é a raiz quadrada de 144?",
    opcoes:{A:"10",B:"11",C:"12",D:"14"}, correta:"C" },
  { id:43, pergunta:"Quanto vale π aproximadamente?",
    opcoes:{A:"2,14",B:"3,14",C:"4,13",D:"5,14"}, correta:"B" },
  { id:44, pergunta:"Em uma função do 1º grau, a forma geral é:",
    opcoes:{A:"ax² + bx + c",B:"a/x",C:"ax + b",D:"x³ + y"}, correta:"C" },
  { id:45, pergunta:"Qual é o resultado de 7 × 8?",
    opcoes:{A:"54",B:"56",C:"58",D:"64"}, correta:"B" },

  // CULTURA GERAL
  { id:46, pergunta:"Qual é o idioma mais falado no mundo considerando falantes nativos?",
    opcoes:{A:"Inglês",B:"Espanhol",C:"Mandarim",D:"Português"}, correta:"C" },
  { id:47, pergunta:"Quantos continentes existem tradicionalmente?",
    opcoes:{A:"5",B:"6",C:"7",D:"8"}, correta:"C" },
  { id:48, pergunta:"Qual é o maior oceano do planeta?",
    opcoes:{A:"Atlântico",B:"Índico",C:"Ártico",D:"Pacífico"}, correta:"D" },
  { id:49, pergunta:"Quem escreveu \"Dom Casmurro\"?",
    opcoes:{A:"José de Alencar",B:"Machado de Assis",C:"Carlos Drummond",D:"Monteiro Lobato"}, correta:"B" },
  { id:50, pergunta:"Qual evento esportivo ocorre a cada quatro anos e reúne países de todo o mundo?",
    opcoes:{A:"Copa Libertadores",B:"Fórmula 1",C:"Jogos Olímpicos",D:"Campeonato Brasileiro"}, correta:"C" },
];


// ─── Shuffle Fisher-Yates ─────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Sessões ativas (sorteio por sessão) ─────────────────────────────────────
const sessoes = new Map();

// ─── GET /api/perguntas — sorteia 10 do banco de 50 ─────────────────────────
app.get('/api/perguntas', (req, res) => {
  const selecionadas = shuffle(BANCO).slice(0, 10);

  // Remapear IDs de 1..10 para o frontend e COBOL
  const sessaoId = Date.now().toString(36) + Math.random().toString(36).slice(2);
  const gabarito = selecionadas.map(p => p.correta).join('');

  // Guardar gabarito na sessão (sem expor ao frontend)
  sessoes.set(sessaoId, {
    gabarito,
    ids: selecionadas.map(p => p.id),
    criadaEm: Date.now()
  });

  // Limpar sessões antigas (>1h)
  for (const [k, v] of sessoes) {
    if (Date.now() - v.criadaEm > 3600000) sessoes.delete(k);
  }

  const perguntas = selecionadas.map((p, i) => ({
    id: i + 1,
    pergunta: p.pergunta,
    opcoes: p.opcoes
  }));

  res.json({ sessaoId, perguntas, total: 50, selecionadas: 10 });
});

// ─── POST /api/avaliar — envia para o COBOL avaliar ──────────────────────────
app.post('/api/avaliar', (req, res) => {
  const { respostas, sessaoId } = req.body;

  if (!respostas || typeof respostas !== 'object') {
    return res.status(400).json({ erro: 'Formato de respostas inválido.' });
  }

  const sessao = sessoes.get(sessaoId);
  if (!sessao) {
    return res.status(400).json({ erro: 'Sessão inválida ou expirada. Reinicie o quiz.' });
  }

  // Montar string de 10 letras na ordem 1..10
  let respostaStr = '';
  for (let i = 1; i <= 10; i++) {
    respostaStr += (respostas[i] || 'X').toUpperCase();
  }

  const gabarito = sessao.gabarito;
  // Formato para o COBOL: "RESPOSTAS GABARITO" (10 espaço 10)
  const argCobol = `${respostaStr} ${gabarito}`;

  const coboltBinary = path.join(__dirname, 'cobol', 'quiz');
  console.log(`[COBOL] Chamando: ./quiz "${argCobol}"`);

  execFile(coboltBinary, [argCobol], (error, stdout, stderr) => {
    if (error) {
      console.error('[COBOL] Erro:', error.message);
      return res.status(500).json({ erro: 'Erro ao executar COBOL.', detalhe: error.message });
    }

    console.log('[COBOL] Output:\n' + stdout);

    const linhas = stdout.trim().split('\n');
    const resultado = { detalhes: {} };

    linhas.forEach(linha => {
      linha = linha.trim();
      if (linha.startsWith('PONTUACAO:'))
        resultado.pontuacao = parseInt(linha.replace('PONTUACAO:', '').trim());
      else if (linha.startsWith('RESULTADO:'))
        resultado.classificacao = linha.replace('RESULTADO:', '').trim();
      else if (linha.startsWith('GABARITO:'))
        resultado.gabarito = linha.replace('GABARITO:', '').trim();
      else if (linha.startsWith('RESPOSTAS:'))
        resultado.respostasEnviadas = linha.replace('RESPOSTAS:', '').trim();
      else if (/^Q\d\d:/.test(linha)) {
        const qNum = parseInt(linha.slice(1, 3));
        resultado.detalhes[qNum] = linha.includes('CERTO') && !linha.includes('ERRADO');
      }
    });

    resultado.saidaCobol = stdout.trim();
    resultado.respostaStr = respostaStr;

    // Remover sessão usada
    sessoes.delete(sessaoId);

    res.json(resultado);
  });
});

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║   QUIZ COBOL SERVER - ONLINE             ║
║   http://localhost:${PORT}               ║
║   50 questoes | sorteio de 10 por rodada ║
║   Backend: Node.js + GnuCOBOL            ║
╚══════════════════════════════════════════╝
  `);
});
