import React, { useEffect, useState } from 'react';
import './modalstyle.css';
import Swal from 'sweetalert2'
import {supabase} from '../services/fetch'



interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    codigo?:bigint;
    item?:string;
    titulo?:string;
    cantidad:number;
    costoReal:number;
    
  }

  
const Modal : React.FC<ModalProps> = ({isOpen = false,onClose,codigo,item,titulo,cantidad,costoReal}:ModalProps)=> {
    
  const [newCant,setNewCant] = useState<number>(cantidad);
  const [newCost,setNewCost] = useState<number>(costoReal);
  const [newFact,setNewFact] = useState<string>('');

  console.log(codigo);
  


  useEffect(()=>{
      setNewCant(cantidad);
      setNewCost(costoReal);
      setNewFact('');
  },[codigo])




  const handleCOSTOUNDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const COSTOUND = parseFloat(event.target.value);
    if (!isNaN(COSTOUND)) {
      setNewCost(COSTOUND);

  }
  };
  
  const handleCantidadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewCant(Number(event.target.value));
    
  };


  const handleFactChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewFact(event.target.value);
    
  };




    if (!isOpen) return null; 

  const handleSubmit = async(event: any) => {
    event.preventDefault();

    try{

     /*const response = await fetch(`http://localhost:3001/movot/update/${codigo}?cant=${newCant}&pu=${newCost}&fact=${newFact}`,
        {
          method: 'PATCH',
          headers:{
            'Content-Type': 'application/json',
          },
        }
      );

      if(!response.ok){
        throw new Error ('Error al enviar los datos');
      }else{
        
        Swal.fire({
          title:`Datos Actualizados correctamente`,
           icon:'success',
           confirmButtonText:'Ok'});
        onClose();
      }*/

       const {error} = await supabase.from('ItMovimientos').update({ImaCan: newCant,ImaPun: newCost}).eq('id',codigo);   


       if(!error){
        Swal.fire({
          title:`Datos Actualizados correctamente`,
           icon:'success',
           confirmButtonText:'Ok'});
           onClose();
       }
           
    }catch(error){
    }

  }




    return (
    <div style={{display:'flex',alignItems:'center',flexDirection: 'column'}}>    
    <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)',left: '0',top: '0',width: '100%',height:'100%'}}> 
    <span onClick={onClose} style={{color: '#aaa',float: 'right',marginTop:'-8px',marginRight:'5px',fontSize: '28px',fontWeight: 'bold'}}>x</span> 
    <div className='modal-content' style={{backgroundColor: '#fefefe',margin: '1% auto',padding: '20px', border: '1px solid #888',width: '100%'}}>
           <h5>{titulo}</h5>
           <span>{item}</span>
           <form style={{margin: '8px'}}>
            <label>Cantidad :<input type='number' value={newCant} onChange={handleCantidadChange} style={{margin: '10px'}} /></label>
            <label>Precio Und :<input type='number' value={newCost} onChange={handleCOSTOUNDChange} style={{margin: '10px'}} /></label>
            {titulo == "Acabados Externos" && <label>Nº Factura :<input type='text' value={newFact} onChange={handleFactChange}  style={{margin: '10px'} } /></label> }
            <br/>
            <br/>
           <button style={{backgroundColor:'Blue',color:'white'}} onClick={handleSubmit}>Actualizar</button>
           </form>
        </div>
    </div>
    </div>
    )


};


export default Modal;