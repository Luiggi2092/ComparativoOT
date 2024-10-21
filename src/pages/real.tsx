import React, { useEffect, useState } from 'react';
import { OtRealtabla } from "../components/tableRealOt";
import {OtReal} from '../types/OtReal'
import { PlanOtTableReal } from '../components/tablePlanOtReal';
import { TinOtTableReal } from '../components/tableTintasOtReal';
import { BarOtTableReal } from '../components/tableBarnizOtReal';
import { AcaOtTableReal } from '../components/tableAcaOtReal';
import { AcaProOtReal } from '../components/tableAcaProRealOt';
import { AcaProOtTableReal } from '../components/tableAcaProRealOt';
import { OtRealSerTable } from '../components/tableSerRealOt';
import { Toaster, toast } from 'sonner';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable'
import { AudioProps,Audio } from 'react-loader-spinner'
import {supabase} from '../services/fetch';
import {useUserStore} from '../store/UserStore';
import { Button } from 'primereact/button';



const Real : React.FC<AudioProps> = ({}) =>{
   
    const [data,setData]= useState<OtReal[]>([]);
    const [dataPlan,setDataPlan]= useState<OtReal[]>([]);
    const [dataTin,setDataTin] = useState<OtReal[]>([]);
    const [dataBar,setDataBar] = useState<OtReal[]>([]);
    const [dataAca,setDataAca] = useState<OtReal[]>([]);
    const [dataAcaProp,setDataAcaProp] = useState<AcaProOtReal[]>([]);
    const [dataSer,setDataSer] = useState<any[]>([]);
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
       let responseSer = await supabase.rpc('get_itmovcostser', { p_ot: Ot, p_tip: 'SERVICIO'})
       const responseOt = await supabase.from('Ordt').select().match({OdtCod: Ot});
       
       console.log(responseSer);
       

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
            setDataBar(responseBar.data);
            setDataSer(responseSer.data);
            setDataAcaProp(responsePro.data);
            
            setProducto(responseOt.data[0].OdtDescrip);
            setOp(responseOt.data[0].OdtCod)
            setMoneda(responseOt.data[0].OdtMon);
           }
        }catch(error){
        }finally{
          setLoading(false);
        }
    
    }

    
    const handleDownloadPDF = () => {
      const doc = new jsPDF()
  
      const now = new Date()
      const date = now.toLocaleDateString()
      doc.setFontSize(10)
      doc.text(date, 190, 10, { align: 'right' })
  
      doc.setFontSize(16)
      doc.text(`Presupuestado vs Real OT - ${op}`, 105, 20, { align: 'center' })
      doc.setFontSize(12)
      doc.text(`Producto: ${producto}`, 85, 30, { align: 'center' })
  
      let yOffset = 40 // Initial Y offset for the first table
  
      const addDataToTable = (dataArray: any[], title: string) => {
        const titleHeight = 10 // Approximate height of the title
        const tableHeight = dataArray.length * 8 + 15 // Approximate height of the table (8 per row + 15 for header)
        
        // Check if the title and table fit on the current page
        if (yOffset + titleHeight + tableHeight > doc.internal.pageSize.height - 20) {
          doc.addPage()
          yOffset = 20
        }
  
        doc.setFontSize(14)
        doc.setTextColor(0, 128, 0) // Green color for title
        doc.text(title, 105, yOffset, { align: 'center' })
        
        doc.setFontSize(10)
        doc.setTextColor(0, 0, 0) // Reset to black for table content
        
        const headers = [['Concepto', 'Elemento', 'CANTPRE', 'COSTOUNDPRE', 'CANTREAL', 'COSTOUNDREAL']]
        const data = dataArray.map(item => [
          item.Concepto,
          item.Elemento,
          item.Cantidad.toString(),
          item.PrecioUni.toString(),
          item.ImaCan.toString(),
          item.ImaPun.toString()
        ])
  
        autoTable(doc, {
          head: headers,
          body: data,
          startY: yOffset + 5,
          theme: 'grid',
          styles: { fontSize: 8 },
          headStyles: { 
            fillColor: [0, 123, 255], // Blue
            textColor: [255, 255, 255], // White
            fontStyle: 'bold'
          },
          alternateRowStyles: { fillColor: [240, 240, 240] },
          didDrawPage: (data) => {
            // Prevent header repetition
            data.settings.showHead = 'firstPage'
          }
        })
  
        yOffset = (doc as any).lastAutoTable.finalY + 15
      }
  
      const sections = [
        { title: 'Materiales', data: data },
        { title: 'Planchas', data: dataPlan },
        { title: 'Tintas', data: dataTin},
        { title: 'Barniz', data:dataBar },
        { title: 'Acabados Manuales Propios', data: dataAcaProp },
        { title: 'Acabados Manuales Externos', data: dataAca },
      ]
  
      sections.forEach(section => addDataToTable(section.data, section.title))
  
      doc.save(`RealOt-${op}.pdf`)
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
    <Button onClick={handleSearch} label="Buscar" style={{margin:' 0 1em'}} icon="pi pi-search" loading={loading}/>
    <Button disabled={data.length === 0 } onClick={handleDownloadPDF} label='Imprimir' icon="pi pi-print" severity="success" raised />
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
    <OtRealSerTable otSer={dataSer} listado={handleSearch} /> 
    </div>
    </>
    )


}



export default Real;