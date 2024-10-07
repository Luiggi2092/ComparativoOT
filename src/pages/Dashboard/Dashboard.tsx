import './Dashboard.css';
import { Box, Grid, Paper, Typography, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { Chart } from 'primereact/chart';
import {useState,useEffect,useRef} from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
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


  interface dataVentTotal { Vendes:string,total:string}

  const [chartDataBar, setChartDataBar] = useState({});
  const [chartOptionsBar, setChartOptions] = useState({});
  const [dataCars, setDataCars] = useState<dataCars[]>([]);
  const [dataCarsOffset, setDataCarsOffset] = useState<dataCars[]>([]);
  const [dataCarsVisual, setDataCarsVisual] = useState<dataCars[]>([]);
  const [dataCarsMerch, setDataCarsMerch] = useState<dataCars[]>([]);
  const [dataCarsUtility, setDataCarsUtility] = useState<dataCars[]>([]);
  //const [products, setProducts] = useState<Product[]>([]);
  const dt = useRef<any>(null);
  const [dataCarsCantOt, setDataCarsCantOt] = useState<dataCars[]>([]);
  const [dataComisiones, setDataComisiones] = useState<dataCars[]>([]);
  const [dataBonificacion, setDataBonificacion] = useState<dataCars[]>([]);
  const [venTotales,setVenTotales] = useState<dataVentTotal[]>([]);
  const [venTotalesCliente,setVenTotalesCliente] = useState<any[]>([]);

  const cols = [
    { field: 'Cliruc', header: 'Ruc' },
    { field: 'Clides', header: 'Cliente' },
    { field: 'TotalVentas', header: 'Total Ventas' },
    { field: 'Total Utilidad', header: 'Total Utilidad' }
];
const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));



  useEffect(()  => {
    VentasServices.getVentasData().then((data:any) => { setDataCars(data[0].VVCliente)});
    VentasServices.getVentasDataOffset().then((data:any) => { setDataCarsOffset(data[0].VVCliente)});
    VentasServices.getVentasDataVisual().then((data:any) => { setDataCarsVisual(data[0].VVCliente)});
    VentasServices.getVentasDataMerch().then((data:any) => { setDataCarsMerch(data[0].VVCliente)});
   // ProductService.getProductsMini().then((data:any) => setProducts(data));
    VentasServices.getUtilidadTotal().then((data:any) => { setDataCarsUtility(data[0].VVUtilidad)}); 
    VentasServices.getCantOt().then((data:any) => { setDataCarsCantOt(data[0].count)});
    VentasServices.getDataComisiones().then((data:any) => { setDataComisiones(data[0].COMISUM)});
    VentasServices.getDataBonificacion().then((data:any) => { setDataBonificacion(data[0].Bonificación)});
    VentasServices.getDataTotalVentasxVendedor().then((data:any) => {setVenTotales(data)});
    VentasServices.getDataTotalVentasxCliente().then((data:any) => {setVenTotalesCliente(data)});

    const dataBar = {
      labels: venTotales.map((ven:any) => (ven.split_part)),
      datasets: [
          {
              label: 'Ventas',
              data: venTotales.map((ven:dataVentTotal) =>  String(Number(ven.total) /100)),
              backgroundColor: [
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                  'rgb(255, 159, 64)',
                  'rgb(75, 192, 192)',
                  'rgb(54, 162, 235)',
                  'rgb(153, 102, 255)'
                ],
                borderWidth: 1
          }
      ]
  };
  const optionsBar = {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value:any) {
              return value.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}); // Formato con separadores de miles y dos decimales
            }
          }
        },
      }
  };

        setChartDataBar(dataBar);
        setChartOptions(optionsBar);
  },[])



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
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0px 50px 0px', height: '480px' }}>
  <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
    <Chart type="bar" data={chartDataBar} options={chartOptionsBar} style={{ width: '90%', height: '90%',fontSize:'1px' }} />
  </div>
  <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <div className="card" style={{height:'100%'}}>
            <Tooltip target=".export-buttons>button" position="bottom"  />

            <DataTable ref={dt} value={venTotalesCliente} header={header} tableStyle={{ minWidth: '50rem' }}>
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
