// CRIANDO OBJETO COM O SELETORES PARA EVITAR REPETIÇÃO DE CÓDIGO
const seletoresDoJogo = {
    timer: document.querySelector(".timer"),
    area: document.querySelector(".area"),
    quantidade: 0
};

// ESTADOS DO JOGO PARA CONTROLE
const estados = {
    loop: null,
    começou: false,
    cartasViradas: 0,
    jogadas: 0,
    tempo: 0,
};

function iniciaJogo(qtd) {

    //CONFIGURANDO TEMPO DE JOGO
    //INCREMENTA O ESTADO DE TEMPO A CADA SEGUNDO, E ATUALIZA O TEXTO NO DOM
    estados.loop = setInterval(() => {
        estados.tempo++
        seletoresDoJogo.timer.innerText = `tempo: ${estados.tempo}s`
    }, 1000);

    const arrayCartas = ["bobrossparrot", "explodyparrot", "fiestaparrot", "metalparrot",
    "revertitparrot", "tripletsparrot", "unicornparrot"];

    // EMBARALHANDO AS ESCOLHAS DAS CARTAS
    const escolhas = arrayCartas.sort(() => Math.random() - 0.5).slice(0, qtd/2);
    // USANDO SPREAD PARA GERAR UMA LISTA COM VALORES COPIADOS
    const itens = embaralhar([...escolhas, ...escolhas]);

    // CRIANDO AS CARTAS PARA SEREM PASSADAS PARA O DOM
    const cartas=
                                            // SIM EU SEI QUE MAGIC NUMBER É FEIO, MAS ERA ISSO OU GRID :(
        `<div class="area" style="max-width: ${150*(qtd/2)}px">
            ${itens.map(item =>
                `<div class="carta" name="${item}">
                    <div class="frente"></div>
                    <div class="verso" style="background-image: url(/static/media/${item}.gif)"></div>
                </div>`
            ).join("")}
        </div>`;

    // PASSANDO AS CARTAS COMO STRING PARA O DOM
    const parser = new DOMParser().parseFromString(cartas, 'text/html');

    // ATUALIZANDO O OBJETO PARA O NOVO VALOR
    seletoresDoJogo.area.replaceWith(parser.querySelector(".area"));

    // ADICIONANDO A FUNÇÃO ONLICK NAS CARTAS: SE A CARTA FOR CLICADA E NÃO ESTIVER VIRADA, CHAMA A FUNÇÃO
    document.addEventListener("click", (event) => {
        if(event.target.className.includes("frente") && !event.target.parentElement.className.includes("virada")) {
            viraCarta(event.target.parentElement);
        }
    })

};

// ALGORITMO DE FISHER-YATES => https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
function embaralhar(lst) {
    const lstCopia = [...lst];

    for(let index = lstCopia.length -1; index > 0; index--) {
        const indiceAleatorio = Math.floor(Math.random() * (index + 1));
        const original = lstCopia[index];

        lstCopia[index] = lstCopia[indiceAleatorio];
        lstCopia[indiceAleatorio] = original;
    }
    return lstCopia;
}

function viraCarta(carta) {
    estados.cartasViradas++;

    // SE EXISTIREM DUAS OU MENOS CARTAS VIRADAS, ADICIONA A CLASSE VIRADA
    if(estados.cartasViradas <= 2) {
        carta.classList.add("virada");
        estados.jogadas++;

    }
    // SE EXISTIREM DUAS CARTAS VIRADAS, CRIA UMA ARRAY COM AS CARTAS QUE POSSUEM A CLASSE VIRADA
    // MAS NÃO POSSUEM A CLASSE COMBINA
    if(estados.cartasViradas === 2) {
        const cartasViradas = document.querySelectorAll(".virada:not(.combina)")

        // PERCORRE A ARRAY CRIADA PARA VERIFICAR SE AS BACKGROUNDIMAGES SÃO IGUAIS
        // SE FOREM IGUAIS, ADICIONA A CLASSE COMBINA
        if(cartasViradas[0].getAttribute("name") === cartasViradas[1].getAttribute("name")) {
            cartasViradas[0].classList.add("combina");
            cartasViradas[1].classList.add("combina");
            verificaVitoria();
        }
    // SE NÃO FOREM IGUAIS, CHAMA A FUNÇÃO PARA RETORNAR AS CARTAS EM 1s
        setTimeout(() => {
            viraDeVolta();
        }, 1000);
    }
}

function viraDeVolta() {
    document.querySelectorAll(".carta:not(.combina)").forEach(item => {
        item.classList.remove("virada")
    })
    estados.cartasViradas = 0;
}

function verificaVitoria() {
    if(document.querySelectorAll(".combina").length === seletoresDoJogo.quantidade) {
        alert(`Você ganhou em ${estados.jogadas} jogadas!\nSeu tempo de jogo foi ${estados.tempo} segundos`);
        clearInterval(estados.loop)
        const reset = prompt("Deseja jogar novamente?");
        if(reset === "sim"){
            location.reload();
        }
    }
}

while(!estados.começou) {
    let qtd = Number(prompt("Com quantas cartas quer jogar?"));
    seletoresDoJogo.quantidade = qtd;

    if(qtd > 14 || qtd < 4) {
        alert("Valores aceitos de cartas: entre 4 e 14!!");
    } else if(qtd % 2 !== 0) {
        alert("Só se pode jogar com um número par de cartas!!");
    } else {
        estados.começou = true;
        iniciaJogo(qtd);
    }
}


