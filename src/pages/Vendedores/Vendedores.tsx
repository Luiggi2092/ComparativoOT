import React, { useEffect, useState,useRef } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import {VendedorService} from '../../services/VendedoresServices/VendedorService'

const Vendedores: React.FC = () => {


    interface Vendedor {
        VenCod:string;
        VenDes:string;
        VenCel:string;
        VenMail:string;

    }

   


    const [Vendedores,setVendedores] = useState<Vendedor[]>([]);
    const dt = useRef<any>(null);
    const [globalFilter, setGlobalFilter] = useState<string | null>(null);
    


    useEffect(()=> {

        VendedorService.getVendedorData().then((data:any) => setVendedores(data));

    },[]);

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" />
                <Button label="Delete" icon="pi pi-trash" severity="danger"  />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help"  />;
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Listado Vendedores</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </IconField>
        </div>
    );
    

    return (
    <>
     <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={Vendedores}  /*selection={selectedProducts || []} selectionMode="multiple"*/   
                        dataKey="VenCod"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter || undefined} header={header}>
                    <Column field="VenCod" header="VenCod" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="VenDes" header="VenDes" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="VenMail" header="VenMail" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="VenCel" header="VenCel" sortable style={{ minWidth: '10rem' }}></Column>
                    
                </DataTable>
            </div>
    </>
    )
} 


export default Vendedores;