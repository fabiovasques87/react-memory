import { useEffect,useState } from 'react';
import * as  C from './App.styles';
import logoImage from './assets/devmemory_logo.png';
import RestartIcon from './svgs/restart.svg';

import { Button } from './components/Button';
import { InfoItem } from './components/InfoItem';
import { GridItemType } from './types/GridItemType';

import { GridItem } from './components/GridItem';
import { items } from './data/items';
import { formatTimeElapsed } from './helpers/formatTimeElapsed';

function App() {

  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);//Quantidade de segundos que passaram do jogo
  const [moveCount, setMoveCount] = useState<number>(0);//Quantidade de movimentos até o momento
  const [showCount, setShowCount] =  useState<number>(0);//Quanas cartas sendo exibidas na jogada
  const [gridItems,setGridItems] = useState<GridItemType[]>([]);//grid



  useEffect(()=>{
    resetAndCreateGrid();
  },[]);


  useEffect (() => {
    const timer = setInterval(()=> {
     if(playing) setTimeElapsed(timeElapsed + 1); //se o playing for true..
    }, 1000);
    return () => clearInterval(timer);  
  }, [playing, timeElapsed]);
  

  useEffect(()=> {
    if(showCount === 2){
      //agora pega os itens que estão abertos
      let opned = gridItems.filter(item => item.shown === true);
      if(opned.length ===2 ){

        if( opned[0].item === opned[1].item){
          //verificação 1: Se forem iguais, torna-los permanentes
          let tmpGrid = [...gridItems];
          for(let i in tmpGrid){
            if(tmpGrid[i].shown){
              tmpGrid[i].permanentShown = true;
              tmpGrid[i].shown = false;
            }
          }
          setGridItems(tmpGrid);
          setShowCount(0);
  
        } else {
  
          //Se não forem iguais, fecha todos
          setTimeout(()=>{
            let tmpGrid = [...gridItems];
            for (let i in tmpGrid){
              tmpGrid[i].shown = false;
            }
            setGridItems(tmpGrid);
            setShowCount(0);           
  
          },1000);
        }


        //Aumentar a contagem de movimentos
        setMoveCount(moveCount => moveCount + 1);

      }
    }
  }, [showCount,gridItems]); //monitorar os arrays;

  //Verifica se o jogo acabou
  useEffect(()=> {
    if(moveCount > 0 && gridItems.every(item => item.permanentShown === true)){ //every, significa, todos é uma função auxiliar de array
          setPlaying(false);
    }   
  }, [moveCount,gridItems]);

  const resetAndCreateGrid = () => {
    //passo 1- reseta o jogo
    setTimeElapsed(0);
    setMoveCount(0);
    setShowCount(0);


    // passo 2- Cria o Grid e comeca  o jogo
    // 2.1 Criar um grid vázio
    let tmpGrid: GridItemType[] = [];
    for (let i = 0; i < (items.length * 2); i++){
      tmpGrid.push({
        item: null,
        shown: false,
        permanentShown: false
      });
    }
    // 2.2 Preencher o grid
    for(let w = 0; w < 2; w++){
      for (let i = 0; i < items.length; i++){
        let pos = -1; //não comeca co zero pq zero já é uma posição do grid
        while (pos < 0 || tmpGrid[pos].item !== null){
          pos = Math.floor(Math.random() * (items.length * 2));
        }
        tmpGrid[pos].item = i;
      }
    }

    // 2.3 Jogar no state
    setGridItems(tmpGrid);

    //Passo 3, comecar o jogo
    setPlaying(true);


  }

  const handleItemClick = (index: number) => {
       if(playing && index !== null && showCount < 2){ //Se o jogo estiver rolando...
          let tmpGrid = [...gridItems];  //mudar o grid, cria um clone do tmpGrid

          //Verificar se o card está de costas...
          if (tmpGrid[index].permanentShown === false && tmpGrid[index].shown === false){
              tmpGrid[index].shown = true; //está exibindo uma Carta...
              setShowCount(showCount +1);

          } 
       }         
  }

  return (
    <C.Container>
      <C.Info>
          <C.LogoLink href="">
            <img src={logoImage} width="200" alt="" />
          </C.LogoLink>
          Desenvolvido por Fábio Vasques
          <C.InfoArea>
            <InfoItem label='Tempo' value={formatTimeElapsed(timeElapsed)}/>
            <InfoItem label='Movimentos' value={moveCount.toString()}/>

          </C.InfoArea>

      <Button label='Reiniciar' icon={RestartIcon} onClick={resetAndCreateGrid} />
      </C.Info>
      <C.gridArea>
          <C.Grid>
              {gridItems.map((item, index)=>(
                <GridItem 
                  key={index}
                  item = {item}   //props
                  onClick={() => handleItemClick(index)}      //props
                />
              ))}
          </C.Grid>
      </C.gridArea>
    </C.Container>
  );    
}

export default App;
