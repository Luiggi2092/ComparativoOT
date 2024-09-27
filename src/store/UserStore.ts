import { create } from 'zustand';



interface Product {
    id:number;
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

interface UserState {
    count:number;
    User: Product[];
    getUser: (value: Product[]) => void,
    setUser: (value: Product[]) => void,
    
}


export const useUserStore = create<UserState>((set)=> {

    const localStorageData = localStorage.getItem('User');
    const parsedData = localStorageData ? JSON.parse(localStorageData) : [];
  
   return { 
    User:parsedData,
    count:10,
    getUser: (User: Product[]) => {
        set (state =>({
     ...state,   
     User
    })) 
    },
    setUser: (newProducts:any) => {
        localStorage.setItem('User', JSON.stringify(newProducts));
        set({ User: newProducts });
    },
   }
    
})