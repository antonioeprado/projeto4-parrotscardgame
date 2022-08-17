let inicio = false;

while(!inicio){

    const quantidadeCartas = prompt("Quantas cartas deseja jogar?");
    
    if(quantidadeCartas > 14 || quantidadeCartas < 4) {
        alert("Só podem ser jogados valores entre 4 e 14!")
    } else {
        inicio = true;
    }

}