import './Dashboard.css';
import { Box, Grid, Paper, Typography, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import {useState,useEffect,useRef} from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import ApexCharts from 'apexcharts'
import { Tooltip } from 'primereact/tooltip';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { VentasServices } from '../../services/DashboardServices/DashboardServices';
import 'jspdf-autotable';
import jsPDF from 'jspdf';
//import {ProductService} from '../../services/ProductServices/ProductService';
import autoTable from 'jspdf-autotable';

const DashboardWithChart = () => {

  interface dataCars{
    VVCliente:number
  }

  // interface Product {
  //   code: string;
  //   name: string;
  //   category: string;
  //   quantity: number;
    
  // }


//  interface dataVentTotal { Vendes:string,total:string}

  const [dataCars, setDataCars] = useState<any[]>([]);
  const [dataCarsOffset, setDataCarsOffset] = useState<any[]>([]);
  const [dataCarsVisual, setDataCarsVisual] = useState<any[]>([]);
  const [dataCarsMerch, setDataCarsMerch] = useState<any[]>([]);
  const [dataCarsUtility, setDataCarsUtility] = useState<any[]>([]);
  const dt = useRef<any>(null);
  const [dataCarsCantOt, setDataCarsCantOt] = useState<any>(0);
  const [dataComisiones, setDataComisiones] = useState<any>(0);
  const [dataBonificacion, setDataBonificacion] = useState<any>(0);
  const [venTotalesCliente,setVenTotalesCliente] = useState<any[]>([]);
  let [tot,setTot] = useState<number[]>([]);
  let [ven,setVen] = useState<string[]>([]);

  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ApexCharts | null>(null);

  const cols = [
    { field: 'Cliruc', header: 'Ruc' },
    { field: 'Clides', header: 'Cliente' },
    { field: 'TotalVentas', header: 'Total Ventas' },
    { field: 'Total Utilidad', header: 'Total Utilidad' }
];
const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

useEffect(() => {
  // Cargar todos los datos en un solo useEffect
  const fetchData = async () => {
    try {
      const totalVentas: any[] = await VentasServices.getDataTotalVentasxVendedor() || [];
      const formattedTot: number[] = totalVentas?.map((item: any) => {
        const parsedValue = parseFloat(item.total);
        return isNaN(parsedValue) ? 0 : parsedValue;
      });
      const formattedVen : string[] = totalVentas?.map((item: any) => {
        const parsedValue = item.split_part;
       return  parsedValue;
      });
    
      


      setTot(formattedTot);
      setVen(formattedVen);
      console.log(ven);

      // Cargar los otros datos
      const ventasData:any[] = await VentasServices.getVentasData() || [];
      setDataCars(ventasData[0].VVCliente || []);
      
      const ventasDataOffset:any[] = await VentasServices.getVentasDataOffset() || [];
      setDataCarsOffset(ventasDataOffset[0].VVCliente);
      
      const ventasDataVisual:any[] = await VentasServices.getVentasDataVisual() || [];
      setDataCarsVisual(ventasDataVisual[0].VVCliente);
      
      const ventasDataMerch:any[] = await VentasServices.getVentasDataMerch() || [];
      setDataCarsMerch(ventasDataMerch[0].VVCliente);
      
      const utilidadTotal:any[] = await VentasServices.getUtilidadTotal() || [];
      setDataCarsUtility(utilidadTotal[0].VVUtilidad);
      
      const cantOt:any = await VentasServices.getCantOt();
      setDataCarsCantOt(cantOt[0].count);
      
      const dataComisiones : any = await VentasServices.getDataComisiones() || [];
      setDataComisiones(dataComisiones[0].COMISUM);
      
      const dataBonificacion: any = await VentasServices.getDataBonificacion() || [];
      setDataBonificacion(dataBonificacion[0].Bonificación);
      
      const venTotalesCliente :any = await VentasServices.getDataTotalVentasxCliente();
      setVenTotalesCliente(venTotalesCliente);
      
      // Aquí se deben construir las opciones del gráfico
      const colors = ['#FF5733', '#33FF57', '#3357FF', '#F39C12', '#9B59B6', '#1ABC9C', '#E74C3C', '#2C3E50'];

      const options:any = {
        series: [
          {
            name: 'Ventas',
            data: formattedTot,
          }
        ],
        chart: {
          height: 350,
          type: 'bar',
        },
        colors: colors,
        plotOptions: {
          bar: {
            columnWidth: '45%',
            distributed: true,
          }
        },
        dataLabels: {
          enabled: false
        },
        legend: {
          show: false,
        },
        title: {
          text: 'Ranking de Ventas', // Aquí defines el texto del título
          align: 'center', // Posición del título: puede ser 'left', 'center' o 'right'
          style: {
            fontSize: '16px', // Tamaño de la fuente
            fontWeight: 'bold', // Peso de la fuente
            color: '#263238' // Color del título
          }
        },
        xaxis: {
          categories: formattedVen,
          labels: {
            style: {
              colors: colors,
              fontSize: '12px'
            }
          }
        },
        yaxis: {
          labels: {
            formatter: function (value: any) {
              return `S/. ${value.toLocaleString('es-PE', {
                useGrouping: true, 
                minimumFractionDigits: 2, // Dos decimales
                maximumFractionDigits: 2
              })}`;// Formato para mostrar dos decimales
            }
          }
        }

      };

      if (formattedTot.length > 0) {

        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
        chartInstance.current = new ApexCharts(document.querySelector("#chart"), options);
        chartInstance.current.render();
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }

      
  
      // Cleanup function to destroy chart on component unmount
     
      
      
  };



  fetchData();

  return () => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }
  };

  
}, []);

      
    console.log("dato:", tot);

const exportPdf = () => {
  const doc: any = new jsPDF(); // Usar 'any' para desactivar la verificación de tipo
  
  const tableData = venTotalesCliente.map((user, index) => [
    (index + 1).toString(),
    user.Cliruc, // Solo se usa para recuperar la imagen en didDrawCell, no se muestra en la tabla
    user.Clides,
    user.TotalVentas,
    user['Total Utilidad']
]);

  autoTable(doc,{
    head: [exportColumns],
    body: tableData,
  });

  doc.save('products.pdf');
};


const exportExcel = () => {
  import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(venTotalesCliente);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, {
          bookType: 'xlsx',
          type: 'array'
      });

      saveAsExcelFile(excelBuffer, 'products');
  });
};

const saveAsExcelFile = (buffer:any, fileName:any) => {
  import('file-saver').then((module) => {
      if (module && module.default) {
          let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
          let EXCEL_EXTENSION = '.xlsx';
          const data = new Blob([buffer], {
              type: EXCEL_TYPE
          });

          module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
      }
  });
};

  const header = (
    <div className="flex align-items-center justify-content-between gap-2">
    <h2 className="mr-auto">Top 5 Clientes</h2>
    <div className="flex align-items- gap-2">
      <Button type="button" icon="pi pi-file-excel"  severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
      <Button type="button" icon="pi pi-file-pdf" severity="danger" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
    </div>
  </div>
);
    

    return (
      <div style={{marginTop:'40px'}}>
        <Box sx={{ flexGrow: 1, padding: '20px' }}>
        <Grid container spacing={3}>
  
          {/* Ventas Totales */}
          <Grid item xs={12} md={6} lg={3}>
            <Paper elevation={3} sx={{ padding: '20px', backgroundColor: '#2196f3', color: '#fff' }}>
              <Grid container alignItems="center">
                <Grid item xs={3}>
                  <IconButton sx={{ color: '#fff' }}>
                    <MonetizationOnIcon sx={{ fontSize: 40 }} />
                  </IconButton>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="h6">Ventas Totales Mensuales</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>S/.{dataCars.toString()}</Typography>	
                </Grid>
              </Grid>
            </Paper>
          </Grid>
  
          {/* Ventas Categoría A */}
          <Grid item xs={12} md={6} lg={3}>
            <Paper elevation={3} sx={{ padding: '20px', backgroundColor: '#4caf50', color: '#fff' }}>
              <Grid container alignItems="center">
                <Grid item xs={3}>
                  <IconButton sx={{ color: '#fff' }}>
                    <ShoppingCartIcon sx={{ fontSize: 40 }} />
                  </IconButton>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="h6">Ventas Offset</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>S/.{dataCarsOffset.toString()}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
  
          {/* Ventas Categoría B */}
          <Grid item xs={12} md={6} lg={3}>
            <Paper elevation={3} sx={{ padding: '20px', backgroundColor: '#ff9800', color: '#fff' }}>
              <Grid container alignItems="center">
                <Grid item xs={3}>
                  <IconButton sx={{ color: '#fff' }}>
                    <LocalMallIcon sx={{ fontSize: 40 }} />
                  </IconButton>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="h6">Ventas Visual</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>S/.{dataCarsVisual.toString()}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
  
          {/* Ventas Categoría C */}
          <Grid item xs={12} md={6} lg={3}>
            <Paper elevation={3} sx={{ padding: '20px', backgroundColor: '#f44336', color: '#fff' }}>
              <Grid container alignItems="center">
                <Grid item xs={3}>
                  <IconButton sx={{ color: '#fff' }}>
                    <CategoryIcon sx={{ fontSize: 40 }} />
                  </IconButton>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="h6">Ventas Merchandising</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>S/.{dataCarsMerch.toString()}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1, padding: '20px' }}>
        <Grid container spacing={3}>
  
          {/* Ventas Totales */}
          <Grid item xs={12} md={6} lg={3}>
            <Paper elevation={3} sx={{ padding: '20px', backgroundColor: '#C0C0C0', color: '#fff' }}>
              <Grid container alignItems="center">
                <Grid item xs={3}>
                  <IconButton sx={{ color: '#fff' }}>
                    <MonetizationOnIcon sx={{ fontSize: 40 }} />
                  </IconButton>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="h6">Utilidad Total</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>S/.{dataCarsUtility.toString()}</Typography>	
                </Grid>
              </Grid>
            </Paper>
          </Grid>
  
          {/* Ventas Categoría A */}
          <Grid item xs={12} md={6} lg={3}>
            <Paper elevation={3} sx={{ padding: '20px', backgroundColor: '#804000', color: '#fff' }}>
              <Grid container alignItems="center">
                <Grid item xs={3}>
                  <IconButton sx={{ color: '#fff' }}>
                    <ShoppingCartIcon sx={{ fontSize: 40 }} />
                  </IconButton>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="h6">Cantidad de Ordenes</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{dataCarsCantOt.toString()}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
  
          {/* Ventas Categoría B */}
          <Grid item xs={12} md={6} lg={3}>
            <Paper elevation={3} sx={{ padding: '20px', backgroundColor: '#800080', color: '#fff' }}>
              <Grid container alignItems="center">
                <Grid item xs={3}>
                  <IconButton sx={{ color: '#fff' }}>
                    <LocalMallIcon sx={{ fontSize: 40 }} />
                  </IconButton>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="h6">Total Comisiones</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>S/.{dataComisiones.toString()}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
  
          {/* Ventas Categoría C */}
          <Grid item xs={12} md={6} lg={3}>
            <Paper elevation={3} sx={{ padding: '20px', backgroundColor: '#fccd56', color: '#fff' }}>
              <Grid container alignItems="center">
                <Grid item xs={3}>
                  <IconButton sx={{ color: '#fff' }}>
                    <CategoryIcon sx={{ fontSize: 40 }} />
                  </IconButton>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="h6">Total Bonificacion</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>S/.{dataBonificacion.toString()}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '80px 0px 0px 0px',height:'100%' }}>
  <div  style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
  <div id="chart" ref={chartRef} style={{ width: '100%', height: '100%',fontSize:'1px' }} />
  </div>
  <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
   <div style={{height:'80%',width:'100%',top:'20px'}}>
            <Tooltip target=".export-buttons>button" position="bottom"  />

            <DataTable ref={dt} value={venTotalesCliente} header={header} tableStyle={{ minWidth: '50rem' }} style={{top:'-20px',margin:'20px'}}>
                {cols.map((col, index) => (
                    <Column key={index} field={col.field} header={col.header} />
                ))}
            </DataTable>
        </div> 
  </div>
</div>


  </div> 
      
    );
   
};

export default DashboardWithChart;
