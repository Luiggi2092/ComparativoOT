import {supabase} from '../fetch';


export const VendedorService = {

    async getVendedorData(){

        const Vendedores = await supabase.from('Vendedor').select();

        console.log(Vendedores.data);

        return Vendedores.data;
    }
}