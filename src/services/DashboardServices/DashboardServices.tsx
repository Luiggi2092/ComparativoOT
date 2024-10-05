import { supabase } from "../fetch";


export const VentasServices =  {
    async getVentasData() {
  const { data, error } = await supabase.from("vw_vvcliente").select("*");
  if (error) {
    console.log(error);
  }
  return data;
},
   async getVentasDataOffset(){
    const { data, error } = await supabase.from("vw_vvclienteoffset").select("*");
  if (error) {
    console.log(error);
  }
   return data;
   },
   async getVentasDataVisual(){
    const { data, error } = await supabase.from("vw_vvclientevisual").select("*");
    if (error) {
      console.log(error);
    }
    return data;
   },
   async getVentasDataMerch(){
    const { data, error } = await supabase.from("vw_vvclientemerch").select("*");
    if (error) {
      console.log(error);
    }
    return data;
   },
   async getUtilidadTotal(){
    const { data, error } = await supabase.from("vw_vvutilidad").select("*");
    if (error) {
      console.log(error);
    }
    return data;
   },
   async getCantOt(){
    const { data, error } = await supabase.from("vw_vvcantot").select("*"); 
    if (error) {
      console.log(error);
    }
    return data;
   }


}