import {supabase} from '../fetch';

export const UsersService = {
    async getProductsData() {

        const Users = await supabase.from('Usuarios').select();

        console.log(Users.data);
    
       return Users.data;


    },

    async deleteUser(id:number){

       const User = await supabase
       .from('Usuarios')
       .delete()
       .eq('id', id);

       console.log(User);

    }


        };

