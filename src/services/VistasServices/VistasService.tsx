import {supabase} from '../fetch';


export const VistaService =  {
    async getVistas() {

        const Vistas = await supabase.from('Vistas').select();

        return Vistas.data;

    }


}


