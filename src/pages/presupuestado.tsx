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
import { AudioProps,Audio } from 'react-loader-spinner'
import {supabase} from '../services/fetch'
import {useUserStore} from '../store/UserStore'
import { Button } from 'primereact/button';


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
    const {User} = useUserStore();




    //console.log(User[0].image);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>)=> {

      setOt(Number((event.target.value)));
  
    }
   
    const handleCOSTOUNDChange = (id: number, newCOSTOUND: string) => {
     const COSTOUND = parseFloat(newCOSTOUND);
     if (!isNaN(COSTOUND)) {
    setData(prevData =>
       prevData.map((item,index) => (index === id ? { ...item, PrecioUni: COSTOUND } : item))
     );
   }
   };
   
   const handleCantidadChange = (id: number, newCantidad: number) => {
     setData(prevData =>
       prevData.map((item,index) => (index === id ? { ...item, Cantidad: newCantidad } : item))
     );
   };

   const handleCOSTOUNDChangePlan = (id: number, newCOSTOUND: string) => {
    const COSTOUND = parseFloat(newCOSTOUND);
    if (!isNaN(COSTOUND)) {
      setDataPlan(prevData =>
      prevData.map((item,index) => (index === id ? { ...item, PrecioUni: COSTOUND } : item))
    );
  }
  };
  
  const handleCantidadChangePlan = (id: number, newCantidad: number) => {
    setDataPlan(prevData =>
      prevData.map((item,index) => (index === id ? { ...item, Cantidad: newCantidad } : item))
    );
  };

  const handleCOSTOUNDChangeTin = (id: number, newCOSTOUND: string) => {
    const COSTOUND = parseFloat(newCOSTOUND);
    if (!isNaN(COSTOUND)) {
    setDataTin(prevData =>
      prevData.map((item,index) => (index === id ? { ...item, PrecioUni: COSTOUND } : item))
    );
  }
  };
  
  const handleCantidadChangeTin = (id: number, newCantidad: number) => {
    setDataTin(prevData =>
      prevData.map((item,index) => (index === id ? { ...item, Cantidad: newCantidad } : item))
    );
  };

  const handleCOSTOUNDChangeAca = (id: number, newCOSTOUND: string) => {
    const COSTOUND = parseFloat(newCOSTOUND);
    if (!isNaN(COSTOUND)) {
        setDataAca(prevData =>
      prevData.map((item,index) => (index === id ? { ...item, PrecioUni: COSTOUND } : item))
    );
  }
  };
  
  const handleCantidadChangeAcaPro = (id: number, newCantidad: number) => {
    setdataAcaProp(prevData =>
      prevData.map((item,index) => (index === id ? { ...item, Cantidad: newCantidad } : item))
    );
  };

  const handleCOSTOUNDChangeAcaPro = (id: number, newCOSTOUND: string) => {
    const COSTOUND = parseFloat(newCOSTOUND);
    if (!isNaN(COSTOUND)) {
        setdataAcaProp(prevData =>
      prevData.map((item,index) => (index === id ? { ...item, PrecioUni: COSTOUND } : item))
    );
  }
  };
  
  const handleCantidadChangeAca = (id: number, newCantidad: number) => {
    setDataAca(prevData =>
      prevData.map((item,index) => (index === id ? { ...item, Cantidad: newCantidad } : item))
    );
  };


  const handleCOSTOUNDChangeBar = (id: number, newCOSTOUND: string) => {
    const COSTOUND = parseFloat(newCOSTOUND);
    if (!isNaN(COSTOUND)) {
        setDataBar(prevData =>
      prevData.map((item,index) => (index === id ? { ...item, PrecioUni: COSTOUND } : item))
    );
  }
  };
  
  const handleCantidadChangeBar = (id: number, newCantidad: number) => {
    setDataBar(prevData =>
      prevData.map((item,index) => (index === id ? { ...item, Cantidad: newCantidad } : item))
    );
  };

   

   const handleSearch = async () => {

    setLoading(true);

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
   

       const responseMat  = await  supabase.from('OrdTCosto').select().match({ OdtCod: Ot, Tipo: 'CODMAT' });  /*fetch(`http://192.168.18.7:3001/matot/${Ot}`)*/
       const responsePlan = await  supabase.from('OrdTCosto').select().match({ OdtCod: Ot, Tipo: 'PLANCHAS' });
       const responseTinta = await  supabase.from('OrdTCosto').select().match({ OdtCod: Ot, Tipo: 'TINTA' });
       const responseBarniz = await  supabase.from('OrdTCosto').select().match({ OdtCod: Ot, Tipo: 'BARNIZ' });
       const responseAca = await  supabase.from('OrdTCosto').select().match({ OdtCod: Ot, Tipo: 'Actcod' });
       const responseAcaProp = await  supabase.from('OrdTCosto').select().match({ OdtCod: Ot, Tipo: 'Amacod' });
       const responseOt = await supabase.from('Ordt').select().match({OdtCod: Ot});
       console.log(responseOt);

       if(!responseMat.data){
         throw new Error('Error al buscar la Orden');
       }

       if(!responsePlan.data){
        
        throw new Error('Error al buscar la Orden');
       }

       if(!responseTinta.data){

         
        throw new Error('Error al buscar la Orden');
       }


       if(!responseBarniz.data){

         
        throw new Error('Error al buscar la Orden');
       }


       if(!responseAca.data){

         
        throw new Error('Error al buscar la Orden');
       }


       if(!responseAcaProp.data){

         
        throw new Error('Error al buscar la Orden');
       }

       if(!responseOt.data){
        throw new Error('Error a buscar la Orden');
       }


       // const info = await fecthDat(String(Ot),'CODMAT');
        setData(responseMat.data);
        setDataPlan(responsePlan.data)
        setDataTin(responseTinta.data);
        setDataAca(responseAca.data);
        setdataAcaProp(responseAcaProp.data);
        setDataBar(responseBarniz.data);
        console.log(responseOt.data[0].OdtDescrip);
        setProducto(responseOt.data[0].OdtDescrip);
        setOp(responseOt.data[0].OdtCod)
        setMoneda(responseOt.data[0].OdtMon);

        if(responseMat.data){
           setLoading(false);
        }
       
    }catch(error){

    }

}


const handleSubmit = async() => {


           
     
    try{
      if (data || dataPlan) {

        let formattedData: FormattedDataItem[] = [];
        
        if (data) {
            formattedData = data.map(mat => ({
                ImaPro: mat.Orden,
                ImaDes1: mat.Concepto,
                ImaSel: "S",
                Imatra: mat.Tipo,
                Imapro1: mat.TipoDet,
                ImaCan: mat.Cantidad,
                ImaPun: mat.PrecioUni,
                ImaSer: String(Ot)
            }));
        }
    
       if (dataPlan) {
            const formattedDataPlan = dataPlan.map(plan => ({
                ImaPro: plan.Orden,
                ImaDes1: plan.Concepto,
                ImaSel: "S",
                Imatra: plan.Tipo,
                Imapro1:plan.TipoDet,
                ImaCan: plan.Cantidad,
                ImaPun: plan.PrecioUni,
                ImaSer: String(Ot)
            }));

            
            formattedData.push(...formattedDataPlan);
        }  

        if(dataTin){
            const FormattedDataTin = dataTin.map(tin => ({
                 ImaPro: tin.Orden,
                 ImaDes1: tin.Concepto,
                 ImaSel: "S",
                 Imatra: tin.Tipo,
                 Imapro1: tin.TipoDet,
                 ImaCan: tin.Cantidad,
                 ImaPun: tin.PrecioUni,
                 ImaSer: String(Ot)
            }));

            formattedData.push(...FormattedDataTin);

        }

        if(dataBar){
          const FormmattedDataBar = dataBar.map(bar => ({
                 ImaPro: bar.Orden,
                 ImaDes1: bar.Concepto,
                 ImaSel: "S",
                 Imatra: bar.Tipo,
                 Imapro1:bar.TipoDet,
                 ImaCan: bar.Cantidad,
                 ImaPun: bar.PrecioUni,
                 ImaSer: String(Ot)
          }));

           formattedData.push(...FormmattedDataBar);
        }

        if(dataAca){
           const FormattedDataAca = dataAca.map(aca => ({
                 ImaPro: aca.Orden,
                 ImaDes1: aca.Concepto,
                 ImaSel: "S",
                 Imatra: aca.Tipo,
                 Imapro1: aca.TipoDet,
                 ImaCan: aca.Cantidad,
                 ImaPun: aca.PrecioUni,
                 ImaSer: String(Ot)
           }))


           formattedData.push(...FormattedDataAca);
        }

        if(dataAcaProp){
          const FormattedDataAcaProp = dataAcaProp.map(aca => ({
                ImaPro: aca.Orden,
                ImaDes1: aca.Concepto,
                ImaSel: "S",
                Imatra: aca.Tipo,
                Imapro1: aca.TipoDet,
                ImaCan: aca.Cantidad,
                ImaPun: aca.PrecioUni,
                ImaSer: String(Ot)
          }))


          formattedData.push(...FormattedDataAcaProp);
       }
    
      

       const response2 = await supabase.from('ItMovimientos').select().eq('ImaSer', Ot);

       if(response2.data && response2?.data.length > 0){
        toast.error('Error la Orden ya existe'); 
      }else{
        
       const response =  await supabase.from("ItMovimientos").insert(formattedData);
       
       if(!response){
        return;  
       }

       
       toast.success('Datos enviados correctamente');
      }

       };

      
    
         
    
      

     }catch(error){
        
     }finally{
 
      //setLoading(false);
     }
     
    
 };

   return (
    <>
    <Toaster richColors/>
    {/* // <img src={Logo} style={{display:'flex',position:'absolute',marginTop:'-5px',height:'100px'}}/> */}
    <div style={{padding: '2rem'}}>
    <div style={{display:'flex',justifyContent:'space-between',gap:20}}>
   
   <div style={{zIndex:'10'}}> 
    { op && <h2> Orden : {op} - PRODUCTO : {producto}</h2>} 
    { op && <span>Moneda: {moneda}</span>}
    {op &&  <h4>Precios sin IGV</h4>}
    </div>
    <div style={{display:'flex',gap:'15px',justifyContent:'flex-end'}}>
    <input placeholder='Ingrese OT' onChange={handleInputChange} style={{height:'3rem'}} />
    <div style={{height:'3rem'}}>
    <Button onClick={handleSearch} label="Buscar" style={{margin:' 0 1em'}} icon="pi pi-search" loading={loading}/>
    <Button onClick={handleSubmit} /*disabled={data.length === 0 }*/ label="Guardar" severity="danger" raised icon="pi pi-save" />
    </div>
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
   { User[0].chkpreMat && <h1>Materiales</h1>}
   { User[0].chkpreMat && <MatOtTable matot={data} onChangeCantidad={handleCantidadChange} onChangeCOSTOUND={handleCOSTOUNDChange} />}
   { User[0].chkprePlan && <h1>Planchas</h1>}
   { User[0].chkprePlan && <PlanOtTable planot={dataPlan} onChangeCantidad={handleCantidadChangePlan} onChangeCOSTOUND={handleCOSTOUNDChangePlan} />}
   { User[0].chkpreTin && <h1>Tintas</h1>}
   { User[0].chkpreTin && <TinOtTable tinot={dataTin}  onChangeCantidad={handleCantidadChangeTin} onChangeCOSTOUND={handleCOSTOUNDChangeTin} />}
   { User[0].chkpreBar && <h1>Barniz</h1>}
   { User[0].chkpreBar && <BarOtTable barot={dataBar} onChangeCantidad={handleCantidadChangeBar} onChangeCOSTOUND={handleCOSTOUNDChangeBar} />}
   { User[0].chkpreAcaPro && <h1>Acabados Manuales Propios</h1>}
   { User[0].chkpreAcaPro &&  <AcaPropOtTable acaproot={dataAcaProp} onChangeCantidad={handleCantidadChangeAcaPro} onChangeCOSTOUND={handleCOSTOUNDChangeAcaPro}/>}
   { User[0].chkpreAcaEx && <h1>Acabados Manuales Externos</h1>}
   { User[0].chkpreAcaEx && <AcaOtTable acaot={dataAca} onChangeCantidad={handleCantidadChangeAca} onChangeCOSTOUND={handleCOSTOUNDChangeAca} />}
    </div>
    </>
   )

                                                                    
}
              
          
                                                
export default Presupuestado                                    
                                                                        