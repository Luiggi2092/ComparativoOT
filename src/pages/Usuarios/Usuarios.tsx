import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { UsersService } from '../../services/UsuariosServices/UsuarioService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { Toolbar } from 'primereact/toolbar';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Tag } from 'primereact/tag';
import './Usuarios.css';
import { Checkbox } from 'primereact/checkbox';
import { FileUpload } from 'primereact/fileupload';
import axios from "axios"
const url = 'https://api.cloudinary.com/v1_1/dpq8kiocc/image/upload'
import {supabase} from '../../services/fetch';
import { useUserStore} from '../../store/UserStore'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';




const Usuarios: React.FC = () => {

    interface Product {
        id:number
        nombre:string;
        Login:string;
        Password:string;
        image: string | null;
        Estado: boolean;
        chkpreAcaEx: boolean;
        chkpreAcaPro: boolean;
        chkpreBar:boolean;
        chkpreMat:boolean;
        chkprePlan:boolean;
        chkpreTin:boolean;
        chkreMat:boolean;
        chkrePlan:boolean;
        chkreTin:boolean;
        chkreBar:boolean;
        chkreAcaEx:boolean;
        chkreAcaPro:boolean;
        VUsers:boolean;
        VVendedores:boolean;
    }

   

    let emptyProduct:Product = {
        id:0,
        nombre:'',
        Login:'',
        Password:'',
        image: '',
        Estado: true,
        chkpreAcaEx: false,
        chkpreAcaPro: false,
        chkpreBar:false,
        chkpreMat:false,
        chkprePlan:false,
        chkpreTin:false,
        chkreMat:false,
        chkrePlan:false,
        chkreTin:false,
        chkreBar:false,
        chkreAcaEx:false,
        chkreAcaPro:false,
        VUsers:false,
        VVendedores:false
    };


    const [products, setProducts] = useState<Product[]>([]);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState<Product>(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState<Product[] | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState<string | null>(null);
    const toast = useRef<Toast>(null);
    const dt = useRef<any>(null);
    const [Form,setForm]=useState(emptyProduct)
    const {setUser} = useUserStore();
     

    useEffect(() => {
       UsersService.getProductsData().then((data:any) => setProducts(data));
       
       
    }, []);


    
 
 

    useEffect(() => {
        setForm({ ...Form, ...product });
        
    }, [product]);

    function loadImage(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
          const img = new Image()
          img.crossOrigin = "anonymous"
          img.onload = () => resolve(img)
          img.onerror = () => reject(new Error("Failed to load image"))
          img.src = url
        })
      }


    const handleDownloadPDF = async () => {
        const doc = new jsPDF()

       // Añadir título y fecha
    doc.setFontSize(18);
    doc.text("Lista de Usuarios", 14, 22);
    doc.setFontSize(11);
    doc.text(new Date().toLocaleDateString(), 14, 30);

    // Cargar todas las imágenes antes de crear la tabla
    const loadedImages = await Promise.all(
        products.map(async (user) => {
            if (user.image) {
                try {
                    const img = await loadImage(user.image);
                    return { id: user.id, img };
                } catch (error) {
                    console.error(`Error loading image for user ${user.id}: ${error}`);
                    return { id: user.id, img: null };
                }
            }
            return { id: user.id, img: null };
        })
    );

    // Crear un mapa de imágenes para un acceso más fácil
    const imageMap = new Map(loadedImages.map((item) => [item.id, item.img]));

    // Preparar datos de la tabla, omitiendo el ID de la imagen
    const tableData = products.map((user, index) => [
        (index + 1).toString(),
        user.id, // Solo se usa para recuperar la imagen en didDrawCell, no se muestra en la tabla
        user.Login,
        user.nombre,
        user.Estado ? "Activo" : "Inactivo"
    ]);

    // Definir el tamaño de la imagen y el padding
    const imageDim = 20;
    const cellPadding = 5;

    // Dibujar tabla
    autoTable(doc, {
        head: [["#", "Imagen", "Login", "Nombre", "Estado"]],
        body: tableData,
        startY: 40,
        columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: imageDim + (2 * cellPadding) }, // Reservar espacio para la imagen
            2: { cellWidth: 40 },
            3: { cellWidth: 60 },
            4: { cellWidth: 30 }
        },
        headStyles: {
            cellPadding: 5,
            fillColor: [200, 220, 255],
            textColor: [0, 0, 0],
            fontStyle: 'bold'
        },
        bodyStyles: {
            cellPadding: cellPadding,
            minCellHeight: imageDim + (2 * cellPadding)
        },
        didDrawCell: (data) => {
            if (data.column.index === 1 && data.cell.section === 'body') {
                const userId = tableData[data.row.index][1]; // Obtener el ID de la imagen desde tableData
                const img = imageMap.get(Number(userId));
                if (img) {
                    const cellCenter = {
                        x: data.cell.x + (data.cell.width - imageDim) / 2,
                        y: data.cell.y + (data.cell.height - imageDim) / 2
                    };
                    // Solo dibujamos la imagen si está completamente dentro de la página actual
                    if (cellCenter.y + imageDim <= doc.internal.pageSize.height) {
                        doc.addImage(img, 'JPEG', cellCenter.x, cellCenter.y, imageDim, imageDim);
                    }
                } else {
                    doc.setFontSize(8);
                    doc.text('No image', data.cell.x + cellPadding, data.cell.y + cellPadding + 5);
                }
            }
        },
        didDrawPage: (data) => {
            // Añadir número de página
            doc.setFontSize(10);
            doc.text(`Página ${data.pageNumber}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
        }
    });
       
        // Guardar el PDF
        doc.save('ListaUsuarios.pdf');
      };

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

    const saveProduct = async() => {
        setSubmitted(true);

        if (Form.nombre.trim()) {
            let _products = [...(products || [])];
            let _product = { ...product };
            console.log("holitas")
            if (product.id > 0) {
                const index = findIndexById(product.id);
                
                console.log(index);

                const response = await supabase
                .from('Usuarios')
                .select()
                .lt('Login', product.Login)

                console.log(response);


                const {error} = await supabase.from('Usuarios').update(
                    {Login: Form.Login,
                     nombre: Form.nombre,
                     image:Form.image,
                     chkpreMat:Form.chkpreMat,
                     chkprePlan:Form.chkprePlan,
                     chkpreTin:Form.chkpreTin,
                     chkpreBar:Form.chkpreBar,
                     chkpreAcaEx:Form.chkpreAcaEx,
                     chkpreAcaPro:Form.chkpreAcaPro,
                     Password:Form.Password,
                     chkreMat:Form.chkreMat,
                     chkrePlan:Form.chkrePlan,
                     chkreTin:Form.chkreTin,
                     chkreBar:Form.chkreBar,
                     chkreAcaEx:Form.chkreAcaEx,
                     chkreAcaPro:Form.chkreAcaPro,
                     VUsers: Form.VUsers,
                     VVendedores:Form.VVendedores,
                     Estado:Form.Estado
                     }).eq('id',Form.id);



                if(!error){

                    _product = {
                        ..._product,
                        Login: Form.Login,
                        nombre: Form.nombre,
                        image: Form.image,
                        chkpreMat: Form.chkpreMat,
                        chkprePlan: Form.chkprePlan,
                        chkpreTin: Form.chkpreTin,
                        chkpreBar: Form.chkpreBar,
                        chkpreAcaEx: Form.chkpreAcaEx,
                        chkpreAcaPro: Form.chkpreAcaPro,
                        Password: Form.Password,
                        chkreMat: Form.chkreMat,
                        chkrePlan: Form.chkrePlan,
                        chkreTin: Form.chkreTin,
                        chkreBar: Form.chkreBar,
                        chkreAcaEx: Form.chkreAcaEx,
                        chkreAcaPro: Form.chkreAcaPro,
                        VUsers: Form.VUsers,
                        VVendedores: Form.VVendedores,
                        Estado: Form.Estado
                    };



                    _products[index] = _product;

                     
                   
                    setUser([_product]);





                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            }


            } else {
              
                const { id, ...formWithoutId } = Form;

                console.log(formWithoutId);
               
                const response =  await supabase.from("Usuarios").insert(formWithoutId);
               
                console.log(response.data)

                const response2 = await supabase
                .from('Usuarios')
                .select()
                .match({ Login : Form.Login})

                const result = response2.data || [];


                _product.Password = Form.Password;
                _product.image = Form.image;
                _product.Login = Form.Login;
                _product.nombre = Form.nombre;
                _product.id = result[0].id
                _product.Estado = Form.Estado;
                _product.VVendedores = Form.VVendedores;
                _product.VUsers = Form.VUsers;
                _product.chkpreMat = Form.chkpreMat;
                _product.chkprePlan = Form.chkprePlan;
                _product.chkpreTin = Form.chkpreTin;
                _product.chkpreBar = Form.chkpreBar;
                _product.chkpreAcaPro = Form.chkpreAcaPro;
                _product.chkpreAcaEx = Form.chkpreAcaEx;
                _product.chkreMat = Form.chkreMat;
                _product.chkrePlan = Form.chkrePlan;
                _product.chkreTin = Form.chkreTin;
                _product.chkreBar = Form.chkreBar;
                _product.chkreAcaPro = Form.chkreAcaPro;
                _product.chkreAcaEx = Form.chkpreAcaEx;

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

    const deleteProduct = async() => {
        
        let _products = [...(products || [])];
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        
        const response = await supabase
        .from('Usuarios')
        .delete()
        .eq('id', Form.id); 

        if(!response.error){
            const nuevosProductos = _products.filter(producto => producto.id !== Form.id);
            setProducts(nuevosProductos);

        }else{
            

        }

        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    };

    const findIndexById = (id: number): number => {
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
    
    // const exportCSV = () => {
    //     dt.current.exportCSV();
    // };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };


    const deleteSelectedProducts = async() => {
        if (selectedProducts) {
            let _products = products.filter((val) => !selectedProducts.includes(val));
             selectedProducts.map (item => {
        
                 UsersService.deleteUser(item.id);
                 
             }); 

            console.log(selectedProducts)
            console.log(_products);
            setProducts(_products);
            setDeleteProductsDialog(false);
            setSelectedProducts(null);
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        }
    };
    

        const onCategoryChange = (e:any) => {
        
        
            const  property = e.target.name;
            const  value = e.target.checked;
            console.log(property);
            console.log(value);
        
                setForm({
                    ...Form,
                    [property]: value
                })

        };

    const onInputChange = (e:any) => {
        const  property = e.target.name;
        const  value = e.target.value;
        console.log(e);       
        console.log(value);
        console.log(property);
    
        setForm({...Form,[property]:value});
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
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={handleDownloadPDF} />;
    };

    const imageBodyTemplate = (rowData:Product) => {
        return <img  src={rowData.image ? rowData.image : 'https://via.placeholder.com/64'}  alt={rowData.image || ''} className="shadow-2 border-round" style={{ width: '64px' }} />;
    };

    const statusBodyTemplate = (rowData:Product) => {
        return <Tag value={rowData.Estado ? 'Activo':'No Activo'} severity={getSeverity(rowData)}></Tag>;
    };

    const onImageUpload = async (e:any) => {
        
        // Lógica para manejar la imagen, como subirla a un servidor
        // Por ahora, asumimos que el nombre del archivo es suficiente
        const file = e.files[0];

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'Products');

        const res = await axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/formData'
            },
            
        });

        setForm({ ...Form,image: res.data.secure_url })
        toast.current?.show({ severity: 'success', summary: 'Image uploaded', detail: 'Image uploaded successfully', life: 3000 });

        // Limpia los archivos y cambia el estado a "complete"
        e.options.clear();

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

    const onCategoryChange1 = (e:any) => {
        let _product = { ...Form };
        _product['Estado'] = e.value === 'Activo';
        setForm(_product);
    };

    const onCategoryChange2 = (e:any) => {
        let _product = { ...Form };
        _product['VUsers'] = e.value === 'Activo';
        setForm(_product);
    };

    const onCategoryChange3 = (e:any) => {
        let _product = { ...Form };
        _product['VVendedores'] = e.value === 'Activo';
        setForm(_product);
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

            <Dialog visible={productDialog} style={{ width: '33rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Datos Usuario" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                {Form.image && <img src={Form.image} alt={Form.image} height={150} className="product-image block m-auto pb-3" />}
                <div className="field">
        <label htmlFor="image" className="font-bold">Carga Imagen</label>
        <FileUpload
            name="image"
            accept="image/*"
            maxFileSize={1000000}
            customUpload
            uploadHandler={(e) => onImageUpload(e)}
            emptyTemplate={
                <p className="m-0">Arrastre y suelte archivos aquí para cargarlos..</p>}
        /></div>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Usuario
                    </label>
                    <InputText name="nombre" value={Form.Login} onChange={(e) => setForm({...Form,Login:e.target.value})} required autoFocus className={classNames({ 'p-invalid': submitted && !Form.nombre })} />
                    {submitted && !Form.Login && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Password
                    </label>
                    <Password value={Form.Password} onChange={(e) => setForm({...Form,Password:e.target.value})} toggleMask />
                    {submitted && !Form.Password && <small className="p-error">Password is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Nombre
                    </label>
                    <InputText name="nombre" value={Form.nombre} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !Form.nombre })} />
                    {submitted && !Form.nombre && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label className="mb-3 font-bold">Estado</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="Estado" name="Estado" value="Activo" onChange={onCategoryChange1} checked={Form.Estado === true} />
                            <label htmlFor="category1">Activo</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="Estado" name="Estado" value="No Activo" onChange={onCategoryChange1} checked={Form.Estado === false} />
                            <label htmlFor="category2">No Activo</label>
                        </div>
                </div>
                </div>
                <div className="field">
                    <label className="mb-3 font-bold"> Vista Usuarios</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="VUsers" name="VUsers" value="Activo" onChange={onCategoryChange2} checked={Form.VUsers === true} />
                            <label htmlFor="category1">Activo</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="VUsers" name="VUsers" value="No Activo" onChange={onCategoryChange2} checked={Form.VUsers === false} />
                            <label htmlFor="category2">No Activo</label>
                        </div>
                </div>
                </div>
                <div className="field">
                    <label className="mb-3 font-bold"> Vista Vendedores</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="VVendedores" name="VVendedores" value="Activo" onChange={onCategoryChange3} checked={Form.VVendedores === true} />
                            <label htmlFor="category1">Activo</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="VVendedores" name="VVendedores" value="No Activo" onChange={onCategoryChange3} checked={Form.VVendedores === false} />
                            <label htmlFor="category2">No Activo</label>
                        </div>
                </div>
                </div>
                
               
                <div className="field">
                    <label className="mb-3 font-bold">Vista Detalle Presupuestado</label>
                    <div className="formgrid grid"> 
                        <div className="field-radiobutton col-6">
                                <Checkbox inputId="category1" name="chkpreMat"  onChange={onCategoryChange} checked={Form.chkpreMat} />
                            <label htmlFor="category1">Materiales</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <Checkbox inputId="category2" name="chkprePlan"  onChange={onCategoryChange} checked={Form.chkprePlan} />
                            <label htmlFor="category2">Planchas</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <Checkbox inputId="category3" name="chkpreTin" onChange={onCategoryChange} checked={Form.chkpreTin} />
                            <label htmlFor="category3">Tintas</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <Checkbox inputId="category4" name="chkpreBar"  onChange={onCategoryChange} checked={Form.chkpreBar} />
                            <label htmlFor="category4">Barniz</label>
                        </div>
                        <div className="field-radiobutton col-6">
                        <Checkbox inputId="category5" name="chkpreAcaPro"  onChange={onCategoryChange} checked={Form.chkpreAcaPro} />
                        <label htmlFor="category5">Acabados Propios</label>
                        </div>
                        <div className="field-radiobutton col-6">
                        <Checkbox inputId="category6" name="chkpreAcaEx"  onChange={onCategoryChange} checked={Form.chkpreAcaEx} />
                        <label htmlFor="category6">Acabados Externos</label>
                        </div>
                    </div>
                    <div className='field'>
                    <h3 className="text-lg font-medium mb-2">Vista Detalle Real</h3>
                    <div className="formgrid grid">
                    <div className="field-radiobutton col-6">
                                <Checkbox inputId="category1" name="chkreMat"  onChange={onCategoryChange} checked={Form.chkreMat} />
                            <label htmlFor="category1">Materiales</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <Checkbox inputId="category2" name="chkrePlan"  onChange={onCategoryChange} checked={Form.chkrePlan} />
                            <label htmlFor="category2">Planchas</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <Checkbox inputId="category3" name="chkreTin" onChange={onCategoryChange} checked={Form.chkreTin} />
                            <label htmlFor="category3">Tintas</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <Checkbox inputId="category4" name="chkreBar"  onChange={onCategoryChange} checked={Form.chkreBar} />
                            <label htmlFor="category4">Barniz</label>
                        </div>
                        <div className="field-radiobutton col-6">
                        <Checkbox inputId="category5" name="chkreAcaPro"  onChange={onCategoryChange} checked={Form.chkreAcaPro} />
                        <label htmlFor="category5">Acabados Propios</label>
                        </div>
                        <div className="field-radiobutton col-6">
                        <Checkbox inputId="category6" name="chkreAcaEx"  onChange={onCategoryChange} checked={Form.chkreAcaEx} />
                        <label htmlFor="category6">Acabados Externos</label>
                        </div>
          </div>
        </div> 
        </div>

                 

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



