import './tablestyle.css';
import Modal from './Modal';
import { useState } from 'react';
import {OtReal} from '../types/OtReal'
import { Button } from 'primereact/button';


export interface BarnizDataOtReal {
    barot: OtReal[];
    listado :  ()=> void;
}


export const BarOtTableReal: React.FC<BarnizDataOtReal> = ({barot,listado}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [codigo,setCodigo] = useState<bigint>();
    const [item,setItem] = useState('');
    const [cantidad,setCantidad] = useState<number>(0);
    const [costoReal,setCostoReal] = useState<number>(0);

    const handleOpenModal = (cod:bigint,item:string,cant:number,cost:number) => {
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
        <Modal  isOpen={isModalOpen} onClose={handleCloseModal} codigo={codigo} item={item}  titulo='Barniz'  cantidad={cantidad} costoReal={costoReal}  /> 
        </div>}
        <table className='table'>
            <thead>
                <tr>
                <th style={{backgroundColor:'blue',color:"white",textAlign: 'center',width:'10%'}}
                >
                    Orden
                </th>
                <th style={{backgroundColor:'blue',color:"white",textAlign: 'center',width:'25%'}} >
                    Barniz
                </th>
                <th style={{backgroundColor:'blue',color:"white",textAlign: 'center',width:'10%'}}>
                    Elemento
                </th>
                <th style={{backgroundColor:'gray',color:"white",textAlign: 'center'}} >
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
                    {barot.map((bar,index) => (
                        <tr key={index}>
                            <td style={{width:'10%',textAlign: 'center'}}>{bar.Orden}</td>
                            <td style={{width:'25%',textAlign: 'center'}}>{bar.Concepto}</td>
                            <td style={{width:'10%',textAlign: 'center'}}>{bar.Elemento}</td>
                            <td style={{textAlign: 'center'}}>{bar.Cantidad}</td>
                            <td style={{textAlign: 'center'}}>{bar.PrecioUni}</td>
                            <td style={{textAlign: 'center'}}>{bar.SubtotalPre}</td>
                            <td style={{textAlign: 'center'}}>{bar.ImaCan}</td>
                            <td style={{textAlign: 'center'}}>{bar.ImaPun}</td>
                            <td style={{textAlign: 'center'}}>{bar.SubtotalReal}</td>
                            <td style={{textAlign: 'center'}}>
                           <Button onClick={() => handleOpenModal(bar.id,bar.Concepto,bar.ImaCan,bar.ImaPun)} label='Editar' icon="pi pi-pencil" severity="success" rounded/>
                          </td>
                        </tr>
                    ))}
                </tbody>
         
        </table>
        </>
    )

}