import { GridItemType } from '../../types/GridItemType';
import * as C from './styles';
import b7Svg from '../../svgs/b7.svg';
import { items } from '../../data/items';


type Props ={
    item: GridItemType,
    onClick: ()=>void
}

export const GridItem = ({item, onClick}: Props) => {   //recebe as props
    return (
        <C.Container 
            showBackground={item.permanentShown || item.shown} //passando props para o styled components, se showBackground for true...mostra o background azulado
            onClick={onClick}>
            {item.permanentShown === false && item.shown === false && 

                <C.Icon src={b7Svg}  alt="" opacity={.1} />
            }
            {
                //Condições para exibir o item
            }
            {(item.permanentShown || item.shown) && item.item !== null && 
                <C.Icon src={items[item.item].icon} alt="" />
            }
        </C.Container>
    );

}