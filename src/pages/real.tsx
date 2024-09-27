import React, { useEffect, useState } from 'react';
import { OtRealtabla } from "../components/tableRealOt";
import {OtReal} from '../types/OtReal'
import { PlanOtTableReal } from '../components/tablePlanOtReal';
import { TinOtTableReal } from '../components/tableTintasOtReal';
import { BarOtTableReal } from '../components/tableBarnizOtReal';
import { AcaOtTableReal } from '../components/tableAcaOtReal';
/*import { OtDataSer} from '../components/tableSerRealOt';
import { OtRealSerTable } from '../components/tableSerRealOt';*/
import { AcaProOtReal } from '../components/tableAcaProRealOt';
import { AcaProOtTableReal } from '../components/tableAcaProRealOt';
import { Toaster, toast } from 'sonner';
import { IoSearch } from "react-icons/io5";
import { IoPrintSharp } from "react-icons/io5";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AudioProps,Audio } from 'react-loader-spinner'
import {supabase} from '../services/fetch';
import {useUserStore} from '../store/UserStore';



const Real : React.FC<AudioProps> = ({}) =>{
   
    const [data,setData]= useState<OtReal[]>([]);
    const [dataPlan,setDataPlan]= useState<OtReal[]>([]);
    const [dataTin,setDataTin] = useState<OtReal[]>([]);
    const [dataBar,setDataBar] = useState<OtReal[]>([]);
    const [dataAca,setDataAca] = useState<OtReal[]>([]);
    const [dataAcaProp,setDataAcaProp] = useState<AcaProOtReal[]>([]);
    //const [dataSer,setDataSer] = useState<OtDataSer[]>([]);
    const [Ot,setOt] = useState<number>(0);
    const [producto,setProducto] = useState<string>('');
    const [op,setOp] = useState<string>('');
    const [moneda,setMoneda] = useState<string>('');
    const [loading,setLoading] = useState<boolean>(false);
    const {User} = useUserStore();


    /*const titleStyle: React.CSSProperties = {
      backgroundColor: '#CCCCCC',
      // Otros estilos según sea necesario
    };*/


    useEffect(()=> {
      console.log('cambio');

    },[User])

    
   

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>)=> {

        setOt(Number((event.target.value)));
        setOp(' ');
         
    }

    const handleSearch = async () => {

        try{

          setLoading(true);

          if(!Ot){
            toast.warning('Ingrese Orden');
            setProducto("");
            setOp("");
            setData([]);
            setDataPlan([]);
            setDataTin([]);
            setDataAca([]);
            return;
       }

      let { data, error } = await supabase.rpc('get_itmovcost', { p_ot: Ot, p_tip: 'CODMAT'})
       if (error) console.error(error)
       else console.log(data)

       let responsePlan = await supabase.rpc('get_itmovcost', { p_ot: Ot, p_tip: 'PLANCHAS'})
       let responseTin = await supabase.rpc('get_itmovcost', { p_ot: Ot, p_tip: 'TINTA'})
       let responseBar = await supabase.rpc('get_itmovcost', { p_ot: Ot, p_tip: 'BARNIZ'})
       let responseEx = await supabase.rpc('get_itmovcost', { p_ot: Ot, p_tip: 'Actcod'})
       let responsePro = await supabase.rpc('get_itmovcost', { p_ot: Ot, p_tip: 'Amacod'})
       const responseOt = await supabase.from('Ordt').select().match({OdtCod: Ot});
       
       

       if(!responseOt.data){
        throw new Error('Error a buscar la Orden');
       }

               
            

          // console.log(response); 
           //const userData = await response.json();

           

           if(Ot > 0){
            setData(data);
            setDataPlan(responsePlan.data);
            setDataTin(responseTin.data);
            setDataAca(responseEx.data);  
            setDataBar(responseBar.data);/*
            setDataSer(userData.Servicios);*/
            setDataAcaProp(responsePro.data);/*
            */
            setProducto(responseOt.data[0].OdtDescrip);
            setOp(responseOt.data[0].OdtCod)
            setMoneda(responseOt.data[0].OdtMon);
           }
        }catch(error){
        }finally{
          setLoading(false);
        }
    
    }

    
    const handleDownloadPDF = async () => {
        
          const doc: jsPDF = new jsPDF();

          // Agregar fecha y hora en la esquina superior derecha
          const now = new Date();
          const date = now.toLocaleDateString();
  
          // Agregar fecha y hora en la esquina superior derecha
          const dateAndTime = `${date}`;
  
         
          // Dibujar el texto en la posición calculada
          doc.text(dateAndTime, 180, 10);


          
          doc.text(`Presupuestado vs Real OT - ${op}`, 10, 10);
          doc.text(`Producto : ${producto}`,10,17);
  
          // Definir datos de la tabla
          const tableData = [
              ['Concepto', 'Elemento','CANTPRE','COSTOUNDPRE','CANTREAL','COSTOUNDREAL'] 
            ];

            


            const addDataToTable = (dataArray: any[],title: string )=> {
              if (dataArray.length > 0) {
                  // Agregar título
                  
                
                  //doc.text(title.text,12,10);
                  //const titu = title.text;
                  
                  doc.setFillColor('#000000'); // Establecer el color de fondo
                  doc.setTextColor('#CD5C5C'); // Establecer el color del texto

                  //const styledTitleText = `<span style="color: red;">${title.text}</span>`
                  tableData.push(['****' + title + '***************']);

                 
               
                  
                  //doc.setFontStyle('bold'); // Establecer el estilo de fuente en negrita
                  //doc.autoTableText(title.text, 10, (doc as any).previous.finalY + 10, { styles: { valign: 'middle' } }); 
                  //doc.autoTableText(title.text, 10, (doc as any).autoTable.previous.finalY + 10, { styles: { valign: 'middle' } }); // Agregar el título de la tabla
                  //doc.text([title.text], 10, (doc as any).autoTable.previous.finalY + 10); 
                  //tableData.push([title.text]);
                  // Agregar datos
                  dataArray.forEach(item => {
                    if(dataArray == data){
                      tableData.push([item.Concepto, item.Elemento, item.Cantidad.toString(), item.PrecioUni.toString(), item.ImaCan.toString(), item.ImaPun.toString()]);
                    }
                    else if (dataArray == dataPlan){
                      tableData.push([item.Concepto, item.Elemento, item.Cantidad.toString(), item.PrecioUni.toString(), item.ImaCan.toString(), item.ImaPun.toString()]);
                    }
                    else if (dataArray == dataTin){
                      tableData.push([item.Concepto, item.Elemento, item.Cantidad.toString(), item.PrecioUni.toString(), item.ImaCan.toString(), item.ImaPun.toString()]);
                    }
                    else if (dataArray == dataBar){
                      tableData.push([item.Concepto, item.Elemento, item.Cantidad.toString(), item.PrecioUni.toString(), item.ImaCan.toString(), item.ImaPun.toString()]);
                    }
                    else if (dataArray == dataAcaProp){
                      tableData.push([item.Concepto, item.Elemento, item.Cantidad.toString(), item.PrecioUni.toString(), item.ImaCan.toString(), item.ImaPun.toString()]);
                    }
                    else if (dataArray == dataAca){
                      tableData.push([item.Concepto, item.Elemento, item.Cantidad.toString(), item.PrecioUni.toString(), item.ImaCan.toString(), item.ImaPun.toString()]);
                    }
                    /*else if (dataArray == dataSer){
                      tableData.push([item.SERVICIO,item.Elemento,item.CANTPRE.toString(),item.COSTOUNPRE.toString(),item.CANTREAL.toString(),item.COSTOUNDREAL.toString()]);
                    }*/
                    });
              }
          };

          //const subtitleStyle = { fillColor: '#CCCCCC', textColor: '#000000' };
          

    //const subtitleStyle = { fillColor: '#CCCCCC', textColor: '#000000' };
          
          //Agregar datos y titulos a a tabla
          addDataToTable(data, 'Materiales');
          addDataToTable(dataPlan, 'Planchas');
          addDataToTable(dataTin, 'Tintas');
          addDataToTable(dataBar,'Barniz');
          addDataToTable(dataAcaProp, 'Acabados Manuales Propios');
          addDataToTable(dataAca, 'Acabados Manuales Externos' );
          //addDataToTable(dataSer,  "Servicios",);
  
          // Dibujar la tabla
          (doc as any).autoTable({
            head: tableData.slice(0, 1),
            body: tableData.slice(1),
            startY: 20
        });

  
          // Guardar el PDF
          doc.save(`RealOt-${op}.pdf`);
      }
  
    



    
    return (
     <>   
    <Toaster richColors/>
    <div style={{padding: '2rem'}}>
    <div style={{display:'flex',justifyContent:'space-between',gap:20,margin:'35px 0px'}}>
     <div> 
     { op && <h2> Orden : {op} - PRODUCTO : {producto}</h2>}  
     {op && <span>{`Moneda : ${moneda}`}</span>}
     {op &&  <h4>Precios sin IGV</h4>}
    </div>
    <div style={{display:'flex',gap:'5px'}}>
    <input placeholder='Ingrese OT' onChange={handleInputChange} style={{height:'3rem'}} />
    <div style={{height:'3rem'}}>
    <button onClick={handleSearch} style={{backgroundColor:'blue',color:'white'}}><IoSearch style={{marginRight:'8px'}}></IoSearch>Buscar</button>
    <button disabled={data.length === 0 } onClick={handleDownloadPDF}  ><IoPrintSharp style={{marginRight:'8px'}}></IoPrintSharp>Imprimir</button> 
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
    {User[0].chkreMat && <h1>Materiales</h1>}
    {User[0].chkreMat && <OtRealtabla otreal={data} listado={handleSearch} />}
    {User[0].chkrePlan && <h1>Planchas</h1>}
    {User[0].chkrePlan && <PlanOtTableReal planot={dataPlan} listado={handleSearch}/>}
    {User[0].chkreTin &&<h1>Tintas</h1>}
    {User[0].chkreTin && <TinOtTableReal tinot={dataTin} listado={handleSearch}/>}
    {User[0].chkreBar && <h1>Barniz</h1>}
    {User[0].chkreBar && <BarOtTableReal barot={dataBar} listado={handleSearch} />}
    {User[0].chkreAcaPro && <h1>Acabados Manuales Propias</h1>}
    {User[0].chkpreAcaPro && <AcaProOtTableReal acaProOt={dataAcaProp} listado={handleSearch}/>}
    {User[0].chkpreAcaEx && <h1>Acabados Manuales Externos</h1>}
    {User[0].chkpreAcaEx && <AcaOtTableReal acaot={dataAca} listado={handleSearch} />}
     <h1>Servicios</h1>
     {/* <OtRealSerTable otSer={''} listado={handleSearch} /> */}
    </div>
    </>
    )


}



export default Real;