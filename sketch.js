var JOGAR = 2;
var ENCERRAR = 1;
var INICIAR = 0;

var estadoJogo = INICIAR;

var trex, trex_correndo, trex_colidiu;

var solo, soloinvisivel, imagemdosolo;

var rand, rand2;

var nuvem, imagemdanuvem;

var obstaculo, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

var pontuacao = 0;

var grupodeobstaculos, grupodenuvens;

var gameOver, restart, imagemGameOver, imagemRestart;

var somPulo, somDerrota, somCheckpoint; 

function preload(){
  
  //carrega as animacoes e imagens em variaveis
  trex_correndo = loadAnimation("trex1.png","trex3.png","trex4.png");
  
  trex_colidiu = loadAnimation("trex_collided.png");
  
  imagemdosolo = loadImage("ground2.png");
  
  imagemdanuvem = loadImage("cloud.png");
  
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
  
  imagemGameOver = loadImage("gameOver.png");
  imagemRestart = loadImage("restart.png");
  
  somPulo = loadSound("jump.mp3");
  somDerrota = loadSound("die.mp3");
  somCheckpoint = loadSound("checkPoint.mp3");
}

function setup() {

  createCanvas(600,200)
  
  //criar um sprite do trex
  trex = createSprite(50,160,20,10)
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("colidiu", trex_colidiu);
  
  trex.scale = 0.5;
  trex.setCollider("circle", 0, 0, 50);
  
  //criar um sprite do solo
  solo = createSprite(200,180,400,20);
  solo.addImage("ground",imagemdosolo);
  solo.x = solo.width /2;
  
  //criando solo invisível
  soloinvisivel = createSprite(200,190,400,10);
  soloinvisivel.visible = false;
  
  gameOver = createSprite(300,60,10,10);
  restart = createSprite(300,140,10,10);
  gameOver.addImage(imagemGameOver);
  restart.addImage(imagemRestart);
  gameOver.visible = false;
  restart.visible = false;
  
  gameOver.scale = 1;
  restart.scale = 0.9;
  
  grupodeobstaculos = new Group();
  grupodenuvens = new Group();
}

function draw() {

  //definir cor de fundo
  background(180);
  
  fill("black");
  
  if(estadoJogo === INICIAR) {
    
    textSize(20);
    text("Aperte espaço para iniciar", 170, 100);
    
    if(keyWentDown("space") && trex.y >= 160) {
      
      somPulo.play();
      trex.velocityY = -12;
      estadoJogo = JOGAR;
    }
  }
  
  //executa comandos baseado no estado de jogo
  if(estadoJogo === JOGAR) {
    
    solo.velocityX = -(6 + pontuacao/100);
    
    grupodeobstaculos.setVelocityXEach(-(6 + pontuacao/100));
    
    //sistema de pontuacao
    pontuacao = pontuacao + Math.round(frameRate()/60);
    
    if(pontuacao%100 === 0 && pontuacao > 0) {
    
    //somCheckpoint.play();
  }
    
    gerarNuvens();
    
    gerarObstaculos();
    
    //faz o trex pular quando espaço é pressionado
    if(trex.y === 160 && keyDown("space")) {
      
    trex.velocityY = -12;
    somPulo.play();
    } 
    
    //atualiza a imagem do solo
    if(solo.x < 0) {
      
    solo.x = solo.width/2;
    }
    
    if(pontuacao%100 === 0 && pontuacao > 0) {
      
      somCheckpoint.play();
    }
    
    //muda o estado de jogo se o jogador perder
    if(grupodeobstaculos.isTouching(trex)) {
      
      estadoJogo = ENCERRAR;
      somDerrota.play();
    }
    
  //executa comandos baseado no estado de jogo  
  } else if(estadoJogo === ENCERRAR) {
    
     solo.velocityX = 0;
     
     //reseta a velocidade do grupo de obstaculos
     grupodeobstaculos.setVelocityXEach(0);
     grupodeobstaculos.setLifetimeEach(-1); 
    
     //reseta a velocidade do grupo de nuvens
     grupodenuvens.setVelocityXEach(0);
     grupodenuvens.setLifetimeEach(-1);
    
    trex.changeAnimation("colidiu", trex_colidiu);
    
    gameOver.visible = true;
    restart.visible = true;
    
    if(mousePressedOver(restart)) {
      
      reset();
     }
   }
  
  //adiciona gravidade ao trex
  trex.velocityY = trex.velocityY + 0.8
  
  //impedir o trex de cair 
  trex.collide(soloinvisivel);
  
  //mostrar a quantidade de frames exibidos
  //console.log(frameCount);
  
  textSize(12);
  text("Pontuação:" + pontuacao, 500, 50);
  
  drawSprites();
}

//função para gerar as nuvens
function gerarNuvens() {
  
  //gerar números aleatórios numa variavel
  rand =  Math.round(random(20,100));
  
  //cria nuvens em posicoes aleatorias
  if(frameCount%90 === 0) {
    
    nuvem = createSprite(630,rand,15,15);
    nuvem.velocityX = -2;
    nuvem.addImage("nuvem",imagemdanuvem);
    nuvem.scale = 0.7;
    
    //altera a camada do trex
    trex.depth = nuvem.depth + 1;
    
    nuvem.lifetime = 320;
    
    grupodenuvens.add(nuvem);
    
    //nuvem.y = Math.round(random(20,100));
  }
}

function gerarObstaculos() {
  
  if(frameCount%90 === 0) {
    
    obstaculo = createSprite(620,170,20,20);
    obstaculo.velocityX = -(6 + pontuacao/500);
    rand2 = Math.round(random(1,6));
    switch(rand2) {
        
      case 1: obstaculo.addImage(obstaculo1);
      break;
      
      case 2: obstaculo.addImage(obstaculo2);
      break;
      
      case 3: obstaculo.addImage(obstaculo3);
      break;
      
      case 4: obstaculo.addImage(obstaculo4);
      break;
      
      case 5: obstaculo.addImage(obstaculo5);
      break;
      
      case 6: obstaculo.addImage(obstaculo6);
      break;
      
      default: break;
    }
    
    obstaculo.scale = 0.55;
    obstaculo.lifetime = 160;
    
    grupodeobstaculos.add(obstaculo);
  }
}

function reset() {
  
  grupodenuvens.destroyEach();
  grupodeobstaculos.destroyEach();
  estadoJogo = JOGAR;
  
  gameOver.visible = false;
  restart.visible = false;
  
  trex.changeAnimation("running", trex_correndo);
  
  pontuacao = 0;
}