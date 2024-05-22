  import React, { useState } from 'react';
import { OtDataReal } from "../components/tableRealOt";
import { OtRealtabla } from "../components/tableRealOt";
import { PlanOtReal } from '../components/tablePlanOtReal';
import { PlanOtTableReal } from '../components/tablePlanOtReal';
import { TinOtReal } from '../components/tableTintasOtReal';
import { TinOtTableReal } from '../components/tableTintasOtReal';
import { BarnizOtReal } from '../components/tableBarnizOtReal'; 
import { BarOtTableReal } from '../components/tableBarnizOtReal';
import { AcaOtReal } from '../components/tableAcaOtReal';
import { AcaOtTableReal } from '../components/tableAcaOtReal';
import { OtDataSer} from '../components/tableSerRealOt';
import { OtRealSerTable } from '../components/tableSerRealOt';
import { AcaProOtReal } from '../components/tableAcaProRealOt';
import { AcaProOtTableReal } from '../components/tableAcaProRealOt';
import { Toaster, toast } from 'sonner';
import { IoSearch } from "react-icons/io5";
import { IoPrintSharp } from "react-icons/io5";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AudioProps,Audio } from 'react-loader-spinner'




const Real : React.FC<AudioProps> = ({}) =>{
   
    const [data,setData]= useState<OtDataReal[]>([]);
    const [dataPlan,setDataPlan]= useState<PlanOtReal[]>([]);
    const [dataTin,setDataTin] = useState<TinOtReal[]>([]);
    const [dataBar,setDataBar] = useState<BarnizOtReal[]>([]);
    const [dataAca,setDataAca] = useState<AcaOtReal[]>([]);
    const [dataAcaProp,setDataAcaProp] = useState<AcaProOtReal[]>([]);
    const [dataSer,setDataSer] = useState<OtDataSer[]>([]);
    const [Ot,setOt] = useState<number>(0);
    const [producto,setProducto] = useState<string>('');
    const [op,setOp] = useState<string>('');
    const [moneda,setMoneda] = useState<string>('');
    const [loading,setLoading] = useState<boolean>(false);

    /*const titleStyle: React.CSSProperties = {
      backgroundColor: '#CCCCCC',
      // Otros estilos según sea necesario
    };*/

   

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

   

            const response  =  await fetch(`http://192.168.18.7:3001/realot/${Ot}`)
            if(!response.ok){
            throw new Error('Error al buscar la Orden');
            }
    
           const userData = await response.json();

           

           if(Ot > 0){
            setData(userData.Materiales);
            setDataPlan(userData.Planchas)
            setDataTin(userData.Tintas);
            setDataAca(userData.AcabadosExternos);
            setProducto(userData.Producto[0].PRODUCTO);
            setDataBar(userData.Barniz);
            setDataSer(userData.Servicios);
            setDataAcaProp(userData.AcabadosPropios)
            setOp(userData.Producto[0].OT)
            setMoneda(userData.Producto[0].MONEDA);
           
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
                      tableData.push([item.MAT, item.Elemento, item.CANTPRE.toString(), item.COSTOUNDPRE.toString(), item.CANTREAL.toString(), item.COSTOUNDREAL.toString()]);
                    }
                    else if (dataArray == dataPlan){
                      tableData.push([item.PLANCHAS,item.Elemento,item.CANTPRE.toString(),item.COSTOUNDPRE.toString(),item.CANTREAL.toString(),item.COSTOUNDREAL.toString()]);
                    }
                    else if (dataArray == dataTin){
                      tableData.push([item.TINTAS,item.Elemento,item.CANTPRE.toString(),item.COSTOUNDPRE.toString(),item.CANTREAL.toString(),item.COSTOUNDREAL.toString()]);
                    }
                    else if (dataArray == dataBar){
                      tableData.push([item.BARNIZ,item.Elemento,item.CANTPRE.toString(),item.COSTOUNDPRE.toString(),item.CANTREAL.toString(),item.COSTOUNDREAL.toString()]);
                    }
                    else if (dataArray == dataAcaProp){
                      tableData.push([item.ACABADOMANUAL,item.Elemento,item.CANTPRE.toString(),item.COSTOUNDPRE.toString(),item.CANTREAL.toString(),item.COSTOUNDREAL.toString()]);
                    }
                    else if (dataArray == dataAca){
                      tableData.push([item.ACABADOMANUAL,item.Elemento,item.CANTPRE.toString(),item.COSTOUNDPRE.toString(),item.CANTREAL.toString(),item.COSTOUNDREAL.toString()]);
                    }
                    else if (dataArray == dataSer){
                      tableData.push([item.SERVICIO,item.Elemento,item.CANTPRE.toString(),item.COSTOUNPRE.toString(),item.CANTREAL.toString(),item.COSTOUNDREAL.toString()]);
                    }
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
          addDataToTable(dataSer,  "Servicios",);
  
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
    <button onClick={handleSearch} style={{backgroundColor:'blue',color:'white'}}><IoSearch style={{marginRight:'8px'}}></IoSearch>Buscar</button>
    <button disabled={data.length === 0 } onClick={handleDownloadPDF}  ><IoPrintSharp style={{marginRight:'8px'}}></IoPrintSharp>Imprimir</button> 
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
     <OtRealtabla otreal={data} listado={handleSearch} />
     <h1>Planchas</h1>
    <PlanOtTableReal planot={dataPlan} listado={handleSearch}/>
    <h1>Tintas</h1>
    <TinOtTableReal tinot={dataTin} listado={handleSearch}/>
    <h1>Barniz</h1>
    <BarOtTableReal barot={dataBar} listado={handleSearch} />
    <h1>Acabados Manuales Propias</h1>
    <AcaProOtTableReal acaProOt={dataAcaProp} listado={handleSearch}/>
    <h1>Acabados Manuales Externos</h1>
     <AcaOtTableReal acaot={dataAca} listado={handleSearch} />
     <h1>Servicios</h1>
     <OtRealSerTable otSer={dataSer} listado={handleSearch} />
    </div>
    </>
    )


}



export default Real;