import './tablestyle.css';
import Modal from './Modal';
import { useState } from 'react';


export interface OtDataReal {
    CODIGO: string,
    Orden : number,
    MAT: string,
    Elemento: string,
    CANTPRE: number,
    COSTOUNDPRE: number,
    SubTotalPRE: number,
    CANTREAL:number,
    COSTOUNDREAL:number,
    SubtotalReal:number,
}

export interface otDataRealTable {
    otreal : OtDataReal[],
    listado :  ()=> void;
}


export const OtRealtabla : React.FC<otDataRealTable> = ({otreal,listado}) => {

    
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [codigo,setCodigo] = useState('');
    const [item,setItem] = useState('');
    const [cantidad,setCantidad] = useState<number>(0);
    const [costoReal,setCostoReal] = useState<number>(0);

    const handleOpenModal = (cod:string,item:string,cant:number,cost:number) => {
        
        setCodigo(cod);
        setItem(item);
        setCantidad(cant);
        setIsModalOpen(true);
        setCostoReal(cost);
        
      };
    
      const handleCloseModal = () => {
        listado();
        setIsModalOpen(false);
      };


    
  
    

    return (
       <>
       { isModalOpen && <div style={{zIndex:1,position:'fixed',top:'0',left:'0',width:'100%',height:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
       <Modal  isOpen={isModalOpen} onClose={handleCloseModal} codigo={codigo} item={item}  titulo='Material'  cantidad={cantidad} costoReal={costoReal} /> 
        
       </div>}     
       <table className='table'>
           <thead>
              <tr>
                <th style={{backgroundColor:'blue',color:"white",textAlign: 'center',width:'10%'}}>
                   Orden
                </th>
                <th style={{backgroundColor:'blue',color:"white",textAlign: 'center',width:'25%'}}>
                   Material
                </th>
                <th style={{backgroundColor:'blue',color:"white",textAlign: 'center',width:'10%'}}>
                    Elemento
                </th>
                <th style={{backgroundColor:'gray',color:"white",textAlign: 'center'}}>
                   CANT.PRE
                </th>
                <th style={{backgroundColor:'gray',color:"white",textAlign: 'center'}}>
                   COSTOUND.PRE
                </th>
                <th style={{backgroundColor:'gray',color:"white",textAlign: 'center'}}>
                   Subtotal.PRE 
                </th>
                <th style={{backgroundColor:'green',color:"white",textAlign: 'center'}}>
                    CANT.REAL
                </th>
                <th style={{backgroundColor:'green',color:"white",textAlign: 'center'}}>
                    COSTOUND.REAL
                </th>
                <th style={{backgroundColor:'green',color:"white",textAlign: 'center'}}>
                    Subtotal.REAL
                </th>
                <th style={{backgroundColor:'blue',color:"white",textAlign: 'center',width:'10%'}} >
 
                    Acción
                </th>
              </tr>
           </thead> 
           <tbody>
            {otreal.map((mat,index) =>(
                <tr key={index}>
                    <td style={{width:'10%',textAlign: 'center'}}>{mat.Orden}</td>
                    <td style={{width:'25%',textAlign: 'center'}}>{mat.MAT}</td>
                    <td style={{width:'10%',textAlign: 'center'}}>{mat.Elemento}</td>
                    <td style={{textAlign: 'center'}}>{mat.CANTPRE}</td>
                    <td style={{textAlign: 'center'}}>{mat.COSTOUNDPRE}</td>
                    <td style={{textAlign: 'center'}}>{mat.SubTotalPRE}</td>
                    <td style={{textAlign: 'center'}}>{mat.CANTREAL}</td>
                    <td style={{textAlign: 'center'}}>{mat.COSTOUNDREAL}</td>
                    <td style={{textAlign: 'center'}}>{mat.SubtotalReal}</td>
                    <td style={{textAlign: 'center'}}>
                    <button onClick={() => handleOpenModal(mat.CODIGO,mat.MAT,mat.CANTREAL,mat.COSTOUNDREAL)}>Editar</button>
                    </td>
                </tr>
                
            ))
            }
           </tbody>

    </table>
        </>
)
}