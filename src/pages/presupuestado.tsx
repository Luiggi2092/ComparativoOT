import React, { useState } from 'react';
import { OtData } from '../components/tableMatOt';
import { MatOtTable } from '../components/tableMatOt';
import { PlanOtTable } from '../components/tablePlanOt';
import { PlanOt } from '../components/tablePlanOt';
import { TinOtTable } from '../components/tableTintasOt';
import { TinOt } from '../components/tableTintasOt';
import { AcaOt } from '../components/tableAcaOt';
import { AcaOtTable } from '../components/tableAcaOt';
import { AcaProPOt } from '../components/tableAcaProOt';
import { AcaPropOtTable } from '../components/tableAcaProOt';
import { BarOt } from '../components/tableBarnizOt';
import { BarOtTable } from '../components/tableBarnizOt';
import { Toaster, toast } from 'sonner';
import { IoSearch } from "react-icons/io5";
import { RiSave3Fill } from "react-icons/ri";
import { AudioProps,Audio } from 'react-loader-spinner'

interface FormattedDataItem {
    ImaPro: number;
    ImaDes1: string;
    ImaSel: string;
    Imatra: string;
    Imapro1:string;
    ImaCan: number;
    ImaPun: number;
    ImaSer: string;
  }


const Presupuestado : React.FC<AudioProps> = () => {

    const [data,setData]= useState<OtData[]>([]);
    const [dataPlan,setDataPlan]= useState<PlanOt[]>([]);
    const [dataTin,setDataTin] = useState<TinOt[]>([]);
    const [dataAca,setDataAca] = useState<AcaOt[]>([]);
    const [dataBar,setDataBar] = useState<BarOt[]>([]);
    const [Ot,setOt] = useState<number>(0);
    const [producto,setProducto] = useState<string>('');
    const [op,setOp] = useState<string>('');
    const [moneda,setMoneda] = useState<string>('');
    const [loading,setLoading] = useState<boolean>(false);
    const [dataAcaProp,setdataAcaProp] = useState<AcaProPOt[]>([]);


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>)=> {

      setOt(Number((event.target.value)));
  
    }
   
    const handleCOSTOUNDChange = (id: number, newCOSTOUND: string) => {
     const COSTOUND = parseFloat(newCOSTOUND);
     if (!isNaN(COSTOUND)) {
    setData(prevData =>
       prevData.map((item,index) => (index === id ? { ...item, COSTOUND } : item))
     );
   }
   };
   
   const handleCantidadChange = (id: number, newCantidad: number) => {
     setData(prevData =>
       prevData.map((item,index) => (index === id ? { ...item, CANTIDAD: newCantidad } : item))
     );
   };

   const handleCOSTOUNDChangePlan = (id: number, newCOSTOUND: string) => {
    const COSTOUND = parseFloat(newCOSTOUND);
    if (!isNaN(COSTOUND)) {
      setDataPlan(prevData =>
      prevData.map((item,index) => (index === id ? { ...item, COSTOUND } : item))
    );
  }
  };
  
  const handleCantidadChangePlan = (id: number, newCantidad: number) => {
    setDataPlan(prevData =>
      prevData.map((item,index) => (index === id ? { ...item, CANTIDAD: newCantidad } : item))
    );
  };

  const handleCOSTOUNDChangeTin = (id: number, newCOSTOUND: string) => {
    const COSTOUND = parseFloat(newCOSTOUND);
    if (!isNaN(COSTOUND)) {
    setDataTin(prevData =>
      prevData.map((item,index) => (index === id ? { ...item, COSTOUND } : item))
    );
  }
  };
  
  const handleCantidadChangeTin = (id: number, newCantidad: number) => {
    setDataTin(prevData =>
      prevData.map((item,index) => (index === id ? { ...item, CANTIDAD: newCantidad } : item))
    );
  };

  const handleCOSTOUNDChangeAca = (id: number, newCOSTOUND: string) => {
    const COSTOUND = parseFloat(newCOSTOUND);
    if (!isNaN(COSTOUND)) {
        setDataAca(prevData =>
      prevData.map((item,index) => (index === id ? { ...item, COSTOUND } : item))
    );
  }
  };
  
  const handleCantidadChangeAcaPro = (id: number, newCantidad: number) => {
    setdataAcaProp(prevData =>
      prevData.map((item,index) => (index === id ? { ...item, CANTIDAD: newCantidad } : item))
    );
  };

  const handleCOSTOUNDChangeAcaPro = (id: number, newCOSTOUND: string) => {
    const COSTOUND = parseFloat(newCOSTOUND);
    if (!isNaN(COSTOUND)) {
        setdataAcaProp(prevData =>
      prevData.map((item,index) => (index === id ? { ...item, COSTOUND } : item))
    );
  }
  };
  
  const handleCantidadChangeAca = (id: number, newCantidad: number) => {
    setDataAca(prevData =>
      prevData.map((item,index) => (index === id ? { ...item, CANTIDAD: newCantidad } : item))
    );
  };


  const handleCOSTOUNDChangeBar = (id: number, newCOSTOUND: string) => {
    const COSTOUND = parseFloat(newCOSTOUND);
    if (!isNaN(COSTOUND)) {
        setDataBar(prevData =>
      prevData.map((item,index) => (index === id ? { ...item, COSTOUND } : item))
    );
  }
  };
  
  const handleCantidadChangeBar = (id: number, newCantidad: number) => {
    setDataBar(prevData =>
      prevData.map((item,index) => (index === id ? { ...item, CANTIDAD: newCantidad } : item))
    );
  };

   

   const handleSearch = async () => {

    try{

        if(!Ot){
            toast.warning('Ingrese Orden');
            setProducto("");
            setOp("");
            setData([]);
            setDataPlan([]);
            setDataTin([]);
            setDataAca([]);
            setdataAcaProp([]);
            setMoneda('');
            return;
       }
   

        const response  = await fetch(`http://192.168.18.7:3001/matot/${Ot}`)
        if(!response.ok){
         throw new Error('Error al buscar la Orden');
        }

        const userData = await response.json();
        setData(userData.Materiales);
        setDataPlan(userData.Planchas)
        setDataTin(userData.Tintas);
        setDataAca(userData.AcabadosExternos);
        setdataAcaProp(userData.AcabadosPropios);
        setDataBar(userData.Barniz);
        setProducto(userData.Producto[0].PRODUCTO);
        setOp(userData.Producto[0].OT)
        setMoneda(userData.Producto[0].MONEDA);
       
    }catch(error){

    }

}


const handleSubmit = async() => {


      
     
    try{
      if (data || dataPlan) {
        let formattedData: FormattedDataItem[] = [];
        
        if (data) {
            formattedData = data.map(mat => ({
                ImaPro: mat.CODMAT,
                ImaDes1: mat.MAT,
                ImaSel: "S",
                Imatra: mat.Tipo,
                Imapro1: mat.TipoDet,
                ImaCan: mat.CANTIDAD,
                ImaPun: mat.COSTOUND,
                ImaSer: String(Ot)
            }));
        }
    
       if (dataPlan) {
            const formattedDataPlan = dataPlan.map(plan => ({
                ImaPro: plan.CODPLAN,
                ImaDes1: plan.PLANCHA,
                ImaSel: "S",
                Imatra: plan.Tipo,
                Imapro1:plan.TipoDet,
                ImaCan: plan.CANTIDAD,
                ImaPun: plan.COSTOUND,
                ImaSer: String(Ot)
            }));

            
            formattedData.push(...formattedDataPlan);
        }  

        if(dataTin){
            const FormattedDataTin = dataTin.map(tin => ({
                 ImaPro: tin.CODTIN,
                 ImaDes1: tin.TINTA,
                 ImaSel: "S",
                 Imatra: tin.Tipo,
                 Imapro1: tin.TipoDet,
                 ImaCan: tin.CANTIDAD,
                 ImaPun: tin.COSTOUND,
                 ImaSer: String(Ot)
            }));

            formattedData.push(...FormattedDataTin);

        }

        if(dataBar){
          const FormmattedDataBar = dataBar.map(bar => ({
                 ImaPro: bar.CODBAR,
                 ImaDes1: bar.BARNIZ,
                 ImaSel: "S",
                 Imatra: bar.Tipo,
                 Imapro1:bar.TipoDet,
                 ImaCan: bar.CANTIDAD,
                 ImaPun: bar.COSTOUND,
                 ImaSer: String(Ot)
          }));

           formattedData.push(...FormmattedDataBar);
        }

        if(dataAca){
           const FormattedDataAca = dataAca.map(aca => ({
                 ImaPro: aca.CODACA,
                 ImaDes1: aca.ACABADOMANUAL,
                 ImaSel: "S",
                 Imatra: aca.Tipo,
                 Imapro1: aca.TipoDet,
                 ImaCan: aca.CANTIDAD,
                 ImaPun: aca.COSTOUND,
                 ImaSer: String(Ot)
           }))


           formattedData.push(...FormattedDataAca);
        }

        if(dataAcaProp){
          const FormattedDataAcaProp = dataAcaProp.map(aca => ({
                ImaPro: aca.CODACA,
                ImaDes1: aca.ACABADOMANUAL,
                ImaSel: "S",
                Imatra: aca.Tipo,
                Imapro1: aca.TipoDet,
                ImaCan: aca.CANTIDAD,
                ImaPun: aca.COSTOUND,
                ImaSer: String(Ot)
          }))


          formattedData.push(...FormattedDataAcaProp);
       }
    
        
    
        const response = await fetch('http://localhost:3001/movot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formattedData)
        });
    
        if (!response.ok) {
            toast.error('Error la Orden ya existe');
        } else {
            toast.success('Datos enviados correctamente');
        }
    } else {
    }

     }catch(error){
        
     }finally{
 
      setLoading(false);
     }

    
 };

   return (
    <>
    <Toaster richColors/>
    {/* // <img src={Logo} style={{display:'flex',position:'absolute',marginTop:'-5px',height:'100px'}}/> */}
    <div style={{padding: '2rem'}}>
    <div style={{display:'flex',justifyContent:'space-between',gap:20,margin:'35px 0px'}}>
   
     <div> 
    { op && <h2> Orden : {op} - PRODUCTO : {producto}</h2>} 
    { op && <span>Moneda: {moneda}</span>}
    {op &&  <h4>Precios sin IGV</h4>}
    </div>
    <div style={{display:'flex',gap:'15px'}}>
    <input placeholder='Ingrese OT' onChange={handleInputChange} style={{height:'3rem'}}  />
    <button onClick={handleSearch} style={{backgroundColor:'blue',color:'white',padding: '8px 16px'}}><IoSearch style={{marginRight: '8px'}}></IoSearch>Buscar</button>
    <button onClick={handleSubmit} /*disabled={data.length === 0 }*/ ><RiSave3Fill style={{marginRight:'8px'}}></RiSave3Fill>Guardar</button> 
    </div>
     </div>
     { loading && <><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '1' }}>
            <Audio
              height="80"
              width="80"
              color="green"
              ariaLabel="three-dots-loading" />
          </div><span>Cargando...</span></>
     }
     <h1>Materiales</h1>
    <MatOtTable matot={data} onChangeCantidad={handleCantidadChange} onChangeCOSTOUND={handleCOSTOUNDChange} />
    <h1>Planchas</h1>
    <PlanOtTable planot={dataPlan} onChangeCantidad={handleCantidadChangePlan} onChangeCOSTOUND={handleCOSTOUNDChangePlan} />
    <h1>Tintas</h1>
    <TinOtTable tinot={dataTin}  onChangeCantidad={handleCantidadChangeTin} onChangeCOSTOUND={handleCOSTOUNDChangeTin} />
    <h1>Barniz</h1>
    <BarOtTable barot={dataBar} onChangeCantidad={handleCantidadChangeBar} onChangeCOSTOUND={handleCOSTOUNDChangeBar} />
    <h1>Acabados Manuales Propios</h1>
     <AcaPropOtTable acaproot={dataAcaProp} onChangeCantidad={handleCantidadChangeAcaPro} onChangeCOSTOUND={handleCOSTOUNDChangeAcaPro}/>
    <h1>Acabados Manuales Externos</h1>
    <AcaOtTable acaot={dataAca} onChangeCantidad={handleCantidadChangeAca} onChangeCOSTOUND={handleCOSTOUNDChangeAca} />
    </div>
    </>
   )

                                                                    
}
              
          
                                                
export default Presupuestado                                    
                                                                        