// Variáveis de Estado do Jogo
let perguntas = [];
let respostas = {};
let sessaoId = "";
let indiceAtual = 0;
let rodadaAtual = 1;

// Elementos do DOM
const telas = {
    boot: document.getElementById('tela-boot'),
    quiz: document.getElementById('tela-quiz'),
    processando: document.getElementById('tela-processando'),
    resultado: document.getElementById('tela-resultado')
};

// Inicialização do Relógio do Sistema
setInterval(() => {
    const agora = new Date();
    document.getElementById('hora-sys').innerText = agora.toLocaleTimeString('pt-BR');
}, 1000);

// Inicia a aplicação quando a página carrega
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('rodada-num').innerText = rodadaAtual;
    iniciarBoot();
    configurarBotoes();
});

// 1. Fase de Boot e Busca de Dados
async function iniciarBoot() {
    mostrarTela('boot');
    
    try {
        // Faz a requisição para o Node.js sortear as 10 perguntas
        const response = await fetch('/api/perguntas');
        const dados = await response.json();
        
        perguntas = dados.perguntas;
        sessaoId = dados.sessaoId;
        
        // Simula um tempo de carregamento de terminal (estético)
        setTimeout(() => {
            document.getElementById('sessao-badge').innerText = `SID: ${sessaoId.toUpperCase()}`;
            prepararQuiz();
        }, 2000);

    } catch (erro) {
        document.getElementById('boot-loading').innerHTML = `<span style="color:red">> ERRO CRÍTICO: FALHA AO CONECTAR COM BACKEND NODE.JS</span>`;
        console.error(erro);
    }
}

// 2. Preparação do Quiz
function prepararQuiz() {
    indiceAtual = 0;
    respostas = {};
    document.getElementById('barra-progresso').style.display = 'flex';
    
    gerarDots();
    renderizarQuestao();
    mostrarTela('quiz');
}

function gerarDots() {
    const dotsNav = document.getElementById('dots-nav');
    dotsNav.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        const dot = document.createElement('span');
        dot.innerText = '○ '; // Ponto vazio
        dot.id = `dot-${i}`;
        dotsNav.appendChild(dot);
    }
}

// 3. Renderização da Questão Atual
function renderizarQuestao() {
    const q = perguntas[indiceAtual];
    
    document.getElementById('questao-num').innerText = `QUESTÃO ${String(indiceAtual + 1).padStart(2, '0')} DE 10`;
    document.getElementById('questao-texto').innerText = q.pergunta;
    
    // Renderiza as alternativas
    const grid = document.getElementById('opcoes-grid');
    grid.innerHTML = '';
    
    for (const [letra, texto] of Object.entries(q.opcoes)) {
        const isChecked = respostas[q.id] === letra ? 'checked' : '';
        
        const div = document.createElement('div');
        div.innerHTML = `
            <label style="display:flex; align-items:center; gap:10px; cursor:pointer; padding:10px; border:1px solid #444;">
                <input type="radio" name="questao" value="${letra}" ${isChecked} onchange="salvarResposta(${q.id}, '${letra}')">
                <span>[${letra}] ${texto}</span>
            </label>
        `;
        grid.appendChild(div);
    }

    atualizarInterfaceNavegacao();
    esconderAlerta();
}

function salvarResposta(idQuestao, letra) {
    respostas[idQuestao] = letra;
    esconderAlerta();
    atualizarInterfaceNavegacao();
}

// 4. Controles de Navegação
function configurarBotoes() {
    document.getElementById('btn-anterior').addEventListener('click', () => {
        if (indiceAtual > 0) {
            indiceAtual--;
            renderizarQuestao();
        }
    });

    document.getElementById('btn-proximo').addEventListener('click', () => {
        if (!respostas[perguntas[indiceAtual].id]) {
            mostrarAlerta();
            return;
        }
        
        if (indiceAtual < perguntas.length - 1) {
            indiceAtual++;
            renderizarQuestao();
        }
    });

    document.getElementById('btn-enviar').addEventListener('click', () => {
        if (Object.keys(respostas).length < 10) {
            mostrarAlerta();
            return;
        }
        enviarParaCobol();
    });

    document.querySelector('.btn-reiniciar').addEventListener('click', () => {
        rodadaAtual++;
        document.getElementById('rodada-num').innerText = rodadaAtual;
        iniciarBoot();
    });
}

function atualizarInterfaceNavegacao() {
    // Atualiza Barra de Progresso
    const totalRespondidas = Object.keys(respostas).length;
    document.getElementById('prog-texto').innerText = `${totalRespondidas}/10`;
    document.getElementById('prog-fill').style.width = `${(totalRespondidas / 10) * 100}%`;

    // Atualiza Dots
    for (let i = 0; i < 10; i++) {
        const dot = document.getElementById(`dot-${i}`);
        if (i === indiceAtual) {
            dot.innerText = '◈ '; // Dot atual
        } else if (respostas[perguntas[i].id]) {
            dot.innerText = '● '; // Dot respondido
        } else {
            dot.innerText = '○ '; // Dot vazio
        }
    }

    // Controle de Botões
    document.getElementById('btn-anterior').style.visibility = indiceAtual === 0 ? 'hidden' : 'visible';
    
    if (indiceAtual === 9) {
        document.getElementById('btn-proximo').style.display = 'none';
        document.getElementById('btn-enviar').style.display = 'inline-block';
    } else {
        document.getElementById('btn-proximo').style.display = 'inline-block';
        document.getElementById('btn-enviar').style.display = 'none';
    }
}

function mostrarAlerta() {
    document.getElementById('alerta-selecao').style.display = 'block';
}

function esconderAlerta() {
    document.getElementById('alerta-selecao').style.display = 'none';
}

// 5. Comunicação com o COBOL
async function enviarParaCobol() {
    mostrarTela('processando');
    document.getElementById('barra-progresso').style.display = 'none';
    
    const logArea = document.getElementById('cobol-log');
    logArea.innerHTML = "> COMPILANDO DADOS DE ENTRADA...<br>> INICIANDO CHILD_PROCESS NODE.JS...<br>";
    
    try {
        const response = await fetch('/api/avaliar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ respostas, sessaoId })
        });
        
        const resultado = await response.json();
        
        // Simula o tempo de leitura do log para efeito visual
        setTimeout(() => {
            logArea.innerHTML += `> SAÍDA DO COMPILADOR:<br><br>${resultado.saidaCobol.replace(/\n/g, '<br>')}<br><br>> PROCESSAMENTO CONCLUÍDO.`;
            
            setTimeout(() => {
                exibirResultadoFinal(resultado);
            }, 1500);
        }, 1000);

    } catch (erro) {
        logArea.innerHTML += `<br><span style="color:red">> ERRO FATAL: FALHA DE COMUNICAÇÃO COM QUIZ-EVALUATOR.COB</span>`;
        console.error(erro);
    }
}

// 6. Tela de Resultado
function exibirResultadoFinal(resultado) {
    // Formata a pontuação com zeros à esquerda (ex: 080)
    document.getElementById('score-display').innerText = String(resultado.pontuacao).padStart(3, '0');
    document.getElementById('classificacao-display').innerText = resultado.classificacao;
    
    const gabaritoLine = document.getElementById('gabarito-line');
    gabaritoLine.innerHTML = `<div>RESPOSTAS: ${resultado.respostasEnviadas}</div><div>GABARITO:  ${resultado.gabarito}</div>`;
    
    mostrarTela('resultado');
}

// Utilitário de Troca de Telas
function mostrarTela(telaAtiva) {
    for (const [nome, elemento] of Object.entries(telas)) {
        if (elemento) elemento.style.display = 'none';
    }
    telas[telaAtiva].style.display = 'block';
}