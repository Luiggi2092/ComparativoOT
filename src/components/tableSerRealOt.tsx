import './tablestyle.css';
import ModalServicio from './ModalServicio';
import { useState } from 'react';
import { Button } from 'primereact/button';


export interface OtDataSer {
    id:string,
    SERVICIO:string,
    Elemento:string,
    FACTURA:string,
    Cantidad: number,
    PrecioUni: number,
    SubtotalPre: number,
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
    

    console.log(otSer);

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
                    Acción
                </th>
                </tr>
               
            </thead>
            <tbody>
                {otSer.map((ser,index) => (
                    <tr key={index}>
                        <td style={{width:'10%',textAlign: 'center'}}>
                            {ser.id}
                        </td> 
                        <td style={{width:'25%',textAlign: 'center'}}>
                            {ser.SERVICIO}
                        </td>
                        <td style={{width:'10%',textAlign: 'center'}}>
                            {ser.FACTURA}
                        </td>
                        <td style={{textAlign: 'center'}}>
                            {ser.Cantidad}
                        </td>
                        <td style={{textAlign: 'center'}}>
                            {ser.PrecioUni}
                        </td>
                        <td style={{textAlign: 'center'}}>
                            {ser.SubtotalPre}
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
                        <Button onClick={ () => handleOpenModal(ser.id)} label='Editar' icon="pi pi-pencil" severity="success" rounded/>
                     
                         </td>   
                    </tr>
                ))}
            </tbody>
        </table>
        </>
    )
}