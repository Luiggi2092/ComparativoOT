import { supabase } from "../fetch";


export const PresupuestadoServices =  {

   async getServices(){
      
        const { data, error } = await supabase.from("Servicios").select("*");
        
        if (error) {
            console.log(error);
          }

          return data;
   }

}
