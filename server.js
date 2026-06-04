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
  { id:1,  pergunta:"Qual é a capital do Brasil?",
    opcoes:{A:"São Paulo",B:"Rio de Janeiro",C:"Salvador",D:"Brasília"}, correta:"D" },
  { id:2,  pergunta:"Qual é o maior país do mundo em área territorial?",
    opcoes:{A:"China",B:"Estados Unidos",C:"Rússia",D:"Canadá"}, correta:"C" },
  { id:3,  pergunta:"Qual é o rio mais longo do mundo?",
    opcoes:{A:"Amazonas",B:"Nilo",C:"Yangtzé",D:"Mississippi"}, correta:"B" },
  { id:4,  pergunta:"Em que continente fica o Egito?",
    opcoes:{A:"Ásia",B:"Europa",C:"África",D:"Oceania"}, correta:"C" },
  { id:5,  pergunta:"Qual é a capital da Austrália?",
    opcoes:{A:"Sydney",B:"Melbourne",C:"Brisbane",D:"Canberra"}, correta:"D" },
  { id:6,  pergunta:"Qual é o menor país do mundo?",
    opcoes:{A:"Mônaco",B:"Vaticano",C:"San Marino",D:"Liechtenstein"}, correta:"B" },
  { id:7,  pergunta:"O Deserto do Saara fica em qual continente?",
    opcoes:{A:"Ásia",B:"América do Sul",C:"África",D:"Oceania"}, correta:"C" },
  { id:8,  pergunta:"Qual é a capital da Argentina?",
    opcoes:{A:"Santiago",B:"Lima",C:"Montevidéu",D:"Buenos Aires"}, correta:"D" },
  { id:9,  pergunta:"Qual é o oceano mais profundo do mundo?",
    opcoes:{A:"Atlântico",B:"Índico",C:"Ártico",D:"Pacífico"}, correta:"D" },
  { id:10, pergunta:"Em que país fica a Torre Eiffel?",
    opcoes:{A:"Itália",B:"França",C:"Espanha",D:"Alemanha"}, correta:"B" },

  // CIÊNCIAS / NATUREZA
  { id:11, pergunta:"Qual é o planeta mais próximo do Sol?",
    opcoes:{A:"Vênus",B:"Terra",C:"Marte",D:"Mercúrio"}, correta:"D" },
  { id:12, pergunta:"Qual é o maior planeta do sistema solar?",
    opcoes:{A:"Júpiter",B:"Saturno",C:"Urano",D:"Netuno"}, correta:"A" },
  { id:13, pergunta:"Quantos ossos tem o corpo humano adulto?",
    opcoes:{A:"186",B:"206",C:"256",D:"306"}, correta:"B" },
  { id:14, pergunta:"Qual gás as plantas absorvem na fotossíntese?",
    opcoes:{A:"Oxigênio",B:"Nitrogênio",C:"Dióxido de carbono",D:"Hidrogênio"}, correta:"C" },
  { id:15, pergunta:"Qual é o elemento químico mais abundante no universo?",
    opcoes:{A:"Hélio",B:"Oxigênio",C:"Carbono",D:"Hidrogênio"}, correta:"D" },
  { id:16, pergunta:"A velocidade da luz é aproximadamente:",
    opcoes:{A:"300.000 km/s",B:"150.000 km/s",C:"500.000 km/s",D:"100.000 km/s"}, correta:"A" },
  { id:17, pergunta:"Quantos cromossomos tem uma célula humana normal?",
    opcoes:{A:"23",B:"36",C:"46",D:"48"}, correta:"C" },
  { id:18, pergunta:"Qual é a fórmula química da água?",
    opcoes:{A:"HO",B:"H2O",C:"H2O2",D:"OH"}, correta:"B" },
  { id:19, pergunta:"A gravidade na Terra é aproximadamente:",
    opcoes:{A:"8,5 m/s²",B:"9,8 m/s²",C:"10,5 m/s²",D:"11,2 m/s²"}, correta:"B" },
  { id:20, pergunta:"Qual é o animal mais rápido do mundo?",
    opcoes:{A:"Guepardo",B:"Águia",C:"Falcão-peregrino",D:"Leão"}, correta:"C" },

  // TECNOLOGIA / INFORMÁTICA
  { id:21, pergunta:"Qual linguagem foi criada em 1959 para aplicações comerciais?",
    opcoes:{A:"FORTRAN",B:"BASIC",C:"COBOL",D:"Pascal"}, correta:"C" },
  { id:22, pergunta:"Quantos bytes tem 1 Kilobyte?",
    opcoes:{A:"512",B:"1024",C:"2048",D:"256"}, correta:"B" },
  { id:23, pergunta:"O que significa a sigla CPU?",
    opcoes:{A:"Central Program Unit",B:"Computer Processing Utility",C:"Core Processing Unit",D:"Central Processing Unit"}, correta:"D" },
  { id:24, pergunta:"Qual empresa criou o sistema operacional Windows?",
    opcoes:{A:"Apple",B:"Google",C:"Microsoft",D:"IBM"}, correta:"C" },
  { id:25, pergunta:"O que é HTML?",
    opcoes:{A:"Linguagem de programação",B:"Linguagem de marcação",C:"Banco de dados",D:"Sistema operacional"}, correta:"B" },
  { id:26, pergunta:"Qual é o maior site de buscas do mundo?",
    opcoes:{A:"Bing",B:"Yahoo",C:"DuckDuckGo",D:"Google"}, correta:"D" },
  { id:27, pergunta:"O que significa 'IP' em redes de computadores?",
    opcoes:{A:"Internet Protocol",B:"Internal Process",C:"Input Port",D:"Index Page"}, correta:"A" },
  { id:28, pergunta:"Qual linguagem é usada principalmente para estilizar páginas web?",
    opcoes:{A:"JavaScript",B:"Python",C:"CSS",D:"SQL"}, correta:"C" },
  { id:29, pergunta:"O que é um algoritmo?",
    opcoes:{A:"Um tipo de vírus",B:"Uma sequência de instruções para resolver um problema",C:"Um hardware",D:"Um sistema operacional"}, correta:"B" },
  { id:30, pergunta:"Qual foi o primeiro computador eletrônico digital?",
    opcoes:{A:"UNIVAC",B:"ENIAC",C:"IBM 360",D:"Apple I"}, correta:"B" },

  // HISTÓRIA
  { id:31, pergunta:"Em que ano o Brasil proclamou sua independência?",
    opcoes:{A:"1789",B:"1808",C:"1822",D:"1889"}, correta:"C" },
  { id:32, pergunta:"Quem foi o primeiro presidente dos Estados Unidos?",
    opcoes:{A:"Abraham Lincoln",B:"Thomas Jefferson",C:"Benjamin Franklin",D:"George Washington"}, correta:"D" },
  { id:33, pergunta:"Em que ano começou a Primeira Guerra Mundial?",
    opcoes:{A:"1912",B:"1914",C:"1916",D:"1918"}, correta:"B" },
  { id:34, pergunta:"Quem pintou a Mona Lisa?",
    opcoes:{A:"Rafael",B:"Michelangelo",C:"Leonardo da Vinci",D:"Botticelli"}, correta:"C" },
  { id:35, pergunta:"Em que país ocorreu a Revolução Francesa?",
    opcoes:{A:"Inglaterra",B:"Alemanha",C:"Itália",D:"França"}, correta:"D" },
  { id:36, pregunta:"Qual civilização construiu as pirâmides do Egito?",
    pergunta:"Qual civilização construiu as pirâmides do Egito?",
    opcoes:{A:"Grega",B:"Romana",C:"Egípcia",D:"Mesopotâmica"}, correta:"C" },
  { id:37, pergunta:"Em que ano ocorreu a queda do Muro de Berlim?",
    opcoes:{A:"1985",B:"1987",C:"1989",D:"1991"}, correta:"C" },
  { id:38, pergunta:"Quem foi o líder da Revolução Cubana?",
    opcoes:{A:"Che Guevara",B:"Fidel Castro",C:"Raúl Castro",D:"Camilo Cienfuegos"}, correta:"B" },
  { id:39, pergunta:"Em que ano o homem pisou na Lua pela primeira vez?",
    opcoes:{A:"1965",B:"1967",C:"1969",D:"1971"}, correta:"C" },
  { id:40, pergunta:"Qual império foi o maior da história em extensão territorial?",
    opcoes:{A:"Romano",B:"Britânico",C:"Mongol",D:"Otomano"}, correta:"C" },

  // MATEMÁTICA / LÓGICA
  { id:41, pergunta:"Quanto é a raiz quadrada de 144?",
    opcoes:{A:"11",B:"12",C:"13",D:"14"}, correta:"B" },
  { id:42, pergunta:"Qual é o valor de Pi (aproximado)?",
    opcoes:{A:"3,14159",B:"3,14129",C:"3,14199",D:"3,14110"}, correta:"A" },
  { id:43, pergunta:"Quantos lados tem um hexágono?",
    opcoes:{A:"5",B:"7",C:"6",D:"8"}, correta:"C" },
  { id:44, pergunta:"Qual é o resultado de 15% de 200?",
    opcoes:{A:"25",B:"30",C:"35",D:"40"}, correta:"B" },
  { id:45, pergunta:"Qual é o número primo mais próximo de 20?",
    opcoes:{A:"19",B:"21",C:"23",D:"17"}, correta:"A" },

  // CULTURA GERAL
  { id:46, pergunta:"Qual é o esporte mais popular do mundo?",
    opcoes:{A:"Basquete",B:"Tênis",C:"Futebol",D:"Cricket"}, correta:"C" },
  { id:47, pergunta:"Quantas cordas tem um violão clássico?",
    opcoes:{A:"4",B:"5",C:"6",D:"7"}, correta:"C" },
  { id:48, pergunta:"Qual é o instrumento principal do jazz?",
    opcoes:{A:"Violino",B:"Saxofone",C:"Flauta",D:"Acordeão"}, correta:"B" },
  { id:49, pergunta:"Quem escreveu Dom Quixote?",
    opcoes:{A:"Dante Alighieri",B:"William Shakespeare",C:"Miguel de Cervantes",D:"Luís de Camões"}, correta:"C" },
  { id:50, pergunta:"Qual é o idioma mais falado no mundo?",
    opcoes:{A:"Inglês",B:"Espanhol",C:"Mandarim",D:"Hindi"}, correta:"C" },
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
