import './tablestyle.css';
import ModalServicio from './ModalServicio';
import { useState } from 'react';

export interface OtDataSer {
    Orden:string,
    SERVICIO:string,
    Elemento:string,
    FACTURA:string,
    CANTPRE: number,
    COSTOUNPRE: number,
    SubTotalPRE: number,
    CANTREAL:number,
    COSTOUNDREAL:number,
    SubtotalReal:number,

}

export interface otDataRealTableSer {
    otSer : OtDataSer[];
    listado :  ()=> void;
    
}


export const OtRealSerTable : React.FC<otDataRealTableSer> = ({otSer,listado}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [codigo,setCodigo] = useState('');
    

    const handleOpenModal = (cod:string) => {
        setIsModalOpen(true);
        setCodigo(cod);
        
      };

    const handleCloseModal = () => {
           listado();
           setIsModalOpen(false);
      };

    return (
        <>
        { isModalOpen && <div style={{zIndex:1,position:'fixed',top:'0',left:'0',width:'100%',height:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
         <ModalServicio  isOpen={isModalOpen} onClose={handleCloseModal} codigo={codigo} titulo='Registro Factura' /> 
         </div>}
        <table className='table'>
            <thead>
                <tr>
                <th style={{backgroundColor:'blue',color:"white",textAlign: 'center',width:'10%'}}>
                    Orden
                </th>
                <th style={{backgroundColor:'blue',color:"white",textAlign: 'center',width:'25%'}} >
                    Servicio
                </th>
                <th style={{backgroundColor:'blue',color:"white",textAlign: 'center',width:'10%'}}>
                    Elemento
                </th>
                <th style={{backgroundColor:'blue',color:"white",textAlign: 'center',width:'10%'}}>
                    N° Factura
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
                    Subtotal.Real
                </th>
                <th style={{backgroundColor:'blue',color:"white",textAlign: 'center',width:'10%'}}>
                    FACTURA
                </th>
                </tr>
               
            </thead>
            <tbody>
                {otSer.map((ser,index) => (
                    <tr key={index}>
                        <td style={{width:'10%',textAlign: 'center'}}>
                            {ser.Orden}
                        </td> 
                        <td style={{width:'25%',textAlign: 'center'}}>
                            {ser.SERVICIO}
                        </td>
                        <td style={{width:'10%',textAlign: 'center'}}>
                            {ser.Elemento}
                        </td>
                        <td style={{width:'10%',textAlign: 'center'}}>
                            {ser.FACTURA}
                        </td>
                        <td style={{textAlign: 'center'}}>
                            {ser.CANTPRE}
                        </td>
                        <td style={{textAlign: 'center'}}>
                            {ser.COSTOUNPRE}
                        </td>
                        <td style={{textAlign: 'center'}}>
                            {ser.SubTotalPRE}
                        </td>
                        <td style={{textAlign: 'center'}}>
                            {ser.CANTREAL}
                        </td>
                        <td style={{textAlign: 'center'}}>
                            {ser.COSTOUNDREAL}
                        </td>
                        <td style={{textAlign: 'center'}}>
                            {ser.SubtotalReal}
                        </td>
                        <td style={{textAlign: 'center'}}>
                         <button onClick={ () => handleOpenModal(ser.Orden)}>Agregar</button>
                         </td>   
                    </tr>
                ))}
            </tbody>
        </table>
        </>
    )
}