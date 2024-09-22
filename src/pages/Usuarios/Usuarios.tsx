import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { UsersService } from '../../services/UsuariosServices/UsuarioService';
import { VistaService} from '../../services/VistasServices/VistasService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import './Usuarios.css';
import { Checkbox } from 'primereact/checkbox';


const Usuarios: React.FC = () => {

    interface Product {
        id: string | null;
        created_at: string; 
        nombre:string;
        Login:string;
        image?: string | null;
        rol: string | null;
        Estado: boolean;
        chkpreAcaEx: boolean;
        chkpreAcaPro: boolean;
        chkpreBar:boolean;
        chkpreMat:boolean;
        chkprePlan:boolean;
        chkpreTin:boolean;
    }

    interface Vista {
        id: number;
        created_at: string; 
        vista:string;

    }

    let emptyProduct:Product = {
        id: null,
        created_at: '',
        nombre:'',
        Login:'',
        image: null,
        rol: null,
        Estado: true,
        chkpreAcaEx: false,
        chkpreAcaPro: false,
        chkpreBar:false,
        chkpreMat:false,
        chkprePlan:false,
        chkpreTin:false,
    };
    const [products, setProducts] = useState<Product[]>([]);
    const [Vistas,setVistas] = useState<Vista[]>([]);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState<Product>(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState<Product[] | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState<string | null>(null);
    const toast = useRef<Toast>(null);
    const dt = useRef<any>(null);
    const [selectedCategories] = useState<Vista[]>(Vistas && Vistas.length > 1 ? [Vistas[1]] : []);
   
     

    useEffect(() => {
       UsersService.getProductsData().then((data:any) => setProducts(data));
       VistaService.getVistas().then((data:any) => setVistas(data));
       
    }, []);




    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (product.nombre.trim()) {
            let _products = [...(products || [])];
            let _product = { ...product };

            if (product.id) {
                const index = findIndexById(product.id);

                _products[index] = _product;
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            } else {
                _product.id = createId();
                _product.image = 'product-placeholder.svg';
                _products.push(_product);
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }

            setProducts(_products);
            setProductDialog(false);
            setProduct(emptyProduct);
        }
    };

    const editProduct = (product: Product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product:Product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = (products|| []).filter((val) => val.id !== product.id);
        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    };

    const findIndexById = (id: string | null): number => {
        let index = -1;
        if (id !== null && products) {
            for (let i = 0; i < products.length; i++) {
                if (products[i].id === id) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    };
    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return id;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };


    const deleteSelectedProducts = () => {
        if (selectedProducts) {
            let _products = products.filter((val) => !selectedProducts.includes(val));
            console.log(selectedProducts)
            console.log(_products);
            setProducts(_products);
            setDeleteProductsDialog(false);
            setSelectedProducts(null);
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        }
    };
    

    const onCategoryChange = (e:any) => {
        if(e.checked){
            console.log(true);
        }else{
            console.log(false);
        }
    };

    const onInputChange = <T extends keyof Product>(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: T) => {
        const val = e.target.value as Product[T]; // Aquí estamos haciendo coincidir el tipo de valor con el tipo del campo en Product
        let _product = { ...product };
    
        _product[name] = val;
    
        setProduct(_product);
    };

    
    

   const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const imageBodyTemplate = (rowData:Product) => {
        return <img  src={rowData.image ? rowData.image : 'https://via.placeholder.com/64'}  alt={rowData.image || ''} className="shadow-2 border-round" style={{ width: '64px' }} />;
    };

    /*const priceBodyTemplate = (rowData:Product) => {
        return formatCurrency(rowData.price);
    };

    const ratingBodyTemplate = (rowData:Product) => {
        return <Rating value={rowData.rating} readOnly cancel={false} />;
    };*/

    const statusBodyTemplate = (rowData:Product) => {
        return <Tag value={rowData.Estado ? 'Activo':'No Activo'} severity={getSeverity(rowData)}></Tag>;
    };

    const actionBodyTemplate = (rowData:Product) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    };

    const getSeverity = (product:Product) => {
        switch (product.Estado) {
            case true:
                return 'success';

            default:
                return 'danger';
        }


        
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Listado Usuarios</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </IconField>
        </div>
    );
    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
        </React.Fragment>
    );
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
        </React.Fragment>
    );
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedProducts} />
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={products}  selection={selectedProducts || []} selectionMode="multiple" onSelectionChange={(e) => setSelectedProducts(e.value as Product[])}   
                        dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="image" header="Image" body={imageBodyTemplate}></Column>
                    <Column field="Login" header="Login" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="nombre" header="Nombre" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="rol" header="Rol" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="Estado" header="Estado" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                {product.image && <img src={product.image} alt={product.image} className="product-image block m-auto pb-3" />}
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Name
                    </label>
                    <InputText id="name" value={product.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.nombre })} />
                    {submitted && !product.nombre && <small className="p-error">Name is required.</small>}
                </div>
               
                <div className="field">
                    <label className="mb-3 font-bold">Vista Presupuestado</label>
                    <div className="formgrid grid">
                    <div className="field-radiobutton col-6">
                            <Checkbox inputId="category1" name="category" value={product.chkpreMat} onChange={onCategoryChange} checked={product.chkpreMat} />
                            <label htmlFor="category1">Materiales</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <Checkbox inputId="category2" name="category" value={product.chkprePlan} onChange={onCategoryChange} checked={product.chkprePlan} />
                            <label htmlFor="category2">Planchas</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <Checkbox inputId="category3" name="category" value={product.chkpreTin} onChange={onCategoryChange} checked={product.chkpreTin} />
                            <label htmlFor="category3">Tintas</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <Checkbox inputId="category4" name="category" value={product.chkpreBar} onChange={onCategoryChange} checked={product.chkpreBar} />
                            <label htmlFor="category4">Barniz</label>
                        </div>
                        <div className="field-radiobutton col-6">
                        <Checkbox inputId="category5" name="category" value={product.chkpreAcaPro} onChange={onCategoryChange} checked={product.chkpreAcaPro} />
                        <label htmlFor="category5">Acabados Propios</label>
                        </div>
                        <div className="field-radiobutton col-6">
                        <Checkbox inputId="category6" name="category" value={product.chkpreAcaEx} onChange={onCategoryChange} checked={product.chkpreAcaEx} />
                        <label htmlFor="category6">Acabados Externos</label>
                        </div>
                    </div>
                    <div className='field'>
                    <h3 className="text-lg font-medium mb-2">Vista Real</h3>
                    <div className="formgrid grid">
                    {Vistas.map((vi) => (
                    <div key={vi.id} className="field-radiobutton col-6">
                    <Checkbox inputId={vi.vista} name="category" value={vi} onChange={onCategoryChange} checked={selectedCategories.some((item) => item.id === vi.id)} />
                            <label htmlFor={"category" + vi.id}>
                                {vi.vista}
                            </label>

                    </div>
            ))}
          </div>
        </div> 
        </div>
                {/* <div className="field">
                    <label className="mb-3 font-bold">Vista Presupuestado</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category1" name="category" value="Accessories" onChange={onCategoryChange} checked={product.rol === 'Accessories'} />
                            <label htmlFor="category1">Materiales</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category2" name="category" value="Clothing" onChange={onCategoryChange} checked={product.rol === 'Clothing'} />
                            <label htmlFor="category2">Planchas</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category3" name="category" value="Electronics" onChange={onCategoryChange} checked={product.rol === 'Electronics'} />
                            <label htmlFor="category3">Tintas</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category4" name="category" value="Fitness" onChange={onCategoryChange} checked={product.rol === 'Fitness'} />
                            <label htmlFor="category4">Barniz</label>
                        </div>
                        <div className="field-radiobutton col-6">
                        <RadioButton inputId="category5" name="category" value="Fitness" onChange={onCategoryChange} checked={product.rol === 'Fitness'} />
                        <label htmlFor="category5">Acabados Propios</label>
                        </div>
                        <div className="field-radiobutton col-6">
                        <RadioButton inputId="category6" name="category" value="Fitness" onChange={onCategoryChange} checked={product.rol === 'Fitness'} />
                        <label htmlFor="category6">Acabados Externos</label>
                        </div>
                    </div>
          <h3 className="text-lg font-medium mb-2">Vista Real</h3>
          <div className="grid grid-cols-2 gap-4">
            {Vistas.map((vi) => (
              <div key={vi.id} className="flex items-center space-x-2">
                  <Checkbox inputId={vi.vista} name="category" value={vi} onChange={onCategoryChange} checked={selectedCategories.some((item) => item.id === vi.id)} />
                            <label htmlFor={vi.vista} className="ml-2">
                                {vi.vista}
                            </label>

              </div>
            ))}
          </div>
        </div> */}
     

                   {/* /* <label className="mb-3 font-bold">Vista Real</label>
                    <div className='flex flex-wrap justify-content-space-evenly'>
                              
                {Vistas.map((vi,index) => {
                    console.log(vi);
                    return (
                        <div key={vi.id} className="flex align-items-center w-7 md:w-6">
                            <Checkbox inputId={vi.vista} name="category" value={vi} onChange={onCategoryChange} checked={selectedCategories.some((item) => item.id === vi.id)} />
                            <label htmlFor={vi.vista} className="ml-2">
                                {vi.vista}
                            </label>

                        </div>
                    );
                })}
            </div>
  
            </div>*/ }

                 

                <div className="formgrid grid">
                    
                </div>
            </Dialog>

            <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && (
                        <span>
                            Are you sure you want to delete <b>{product.nombre}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deleteProductsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && <span>Are you sure you want to delete the selected products?</span>}
                </div>
            </Dialog>
        </div>
    );
}



export default Usuarios;

