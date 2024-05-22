import { useState } from 'react';
import Swal from 'sweetalert2'



interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    codigo?:string;
    titulo?:string;
    
  }



  const ModalServicio : React.FC<ModalProps> = ({isOpen = false,onClose,titulo,codigo}:ModalProps)=> {
    
  
  
      
    const [newFact,setNewFact] = useState<string>('');


    const handleFactChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewFact(event.target.value);
      
    };
  
    
  
    if (!isOpen) return null; 
  
    const handleSubmit = async(event: any) => {
      event.preventDefault();
  
      try{
  
       const response = await fetch(`http://localhost:3001/movot/updateser/${codigo}?fact=${newFact}`,
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
             <form style={{margin: '8px'}}>
             <label>Nº Factura :<input type='text'  value={newFact} onChange={handleFactChange}  style={{margin: '10px'}} /></label> 
              <br/>
              <br/>
             <button style={{backgroundColor:'Blue',color:'white'}} onClick={handleSubmit}>Actualizar</button>
             </form>
          </div>
      </div>
      </div>
      )
  
  
  };
  
  
  export default ModalServicio;