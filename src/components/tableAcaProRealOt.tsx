import './tablestyle.css';
import Modal from './Modal';
import { useState } from 'react';

export interface AcaProOtReal {
    CODIGO:string,
    Orden: number,
    ACABADOMANUAL:string,
    Elemento: string,
    CANTPRE: number,
    COSTOUNDPRE: number,
    SubTotalPRE: number,
    CANTREAL:number,
    COSTOUNDREAL:number,
    SubtotalReal:number,
}

export interface OtDataProAca {
    acaProOt: AcaProOtReal[];
    listado :  ()=> void;
}


export const AcaProOtTableReal : React.FC<OtDataProAca> = ({acaProOt,listado}) => {


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
        <Modal  isOpen={isModalOpen} onClose={handleCloseModal} codigo={codigo} item={item}  titulo='Acabados Propios'  cantidad={cantidad} costoReal={costoReal} /> 
         </div>}
        <table className="table">
        <thead>
        <tr>
                <th style={{backgroundColor:'blue',color:"white",textAlign: 'center',width:'10%'}}>
                   Orden
                </th>
                <th style={{backgroundColor:'blue',color:"white",textAlign: 'center',width:'25%'}}>
                   Acabado Manual
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
                <th style={{backgroundColor:'blue',color:"white",textAlign: 'center',width:'10%'}}>
                    Acción
                </th>
              </tr>
        </thead>
        <tbody>
            {acaProOt.map((aca,index) => (
                <tr key={index}>
                    <td style={{width:'10%',textAlign: 'center'}}>{aca.Orden}</td>
                    <td  style={{width:'25%',textAlign: 'center'}}>{aca.ACABADOMANUAL}</td>
                    <td style={{textAlign: 'center'}}>{aca.Elemento}</td>
                    <td  style={{textAlign: 'center'}}>{aca.CANTPRE}</td>
                    <td  style={{textAlign: 'center'}}>{aca.COSTOUNDPRE}</td>
                    <td  style={{textAlign: 'center'}}>{aca.SubTotalPRE}</td>
                    <td  style={{textAlign: 'center'}}>{aca.CANTREAL}</td>
                    <td  style={{textAlign: 'center'}}>{aca.COSTOUNDREAL}</td>
                    <td  style={{textAlign: 'center'}}>{aca.SubtotalReal}</td>
                    <td style={{textAlign: 'center'}}>
                    <button onClick={() => handleOpenModal(aca.CODIGO,aca.ACABADOMANUAL,aca.CANTREAL,aca.COSTOUNDREAL)}>Editar</button>
                    </td>

                </tr>
            ))}
        </tbody>

        </table>
        </>
    )

}