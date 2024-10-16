import './tablestyle.css';


export interface TinOt {
    Orden: number;
    Concepto: string;
    Elemento: string;
    Tipo: string,
    TipoDet: string,
    Cantidad: number,
    PrecioUni : number


}

export interface OtDataTintable {
   tinot : TinOt[];
   onChangeCantidad:(id: number,newCantidad: number) => void;
   onChangeCOSTOUND:(id: number, newCOSTOUND: string) => void;
}



export const TinOtTable : React.FC<OtDataTintable> = ({tinot,onChangeCantidad,onChangeCOSTOUND}) => { 

    return (
        <table className='table'>
            <thead style={{backgroundColor:'blue',color:"white"}}>
                <tr>
                    <th style={{border: '1px solid black',textAlign: 'center',width:'10%'}}>
                        CODTIN
                    </th>
                    <th  style={{border: '1px solid black',textAlign: 'center',width:'25%'}}>
                        Tinta
                    </th>
                    <th style={{border: '1px solid black',textAlign: 'center'}}>
                        ELEMENTO
                    </th>
                    <th  style={{border: '1px solid black',textAlign: 'center'}}>
                        CANTIDAD
                    </th>
                    <th  style={{border: '1px solid black',textAlign: 'center'}}>
                        Costo Und
                    </th>
                </tr>
            </thead>
            <tbody  style={{border: '1px solid black'}}>
                {tinot.map((tin,index) => (
                    <tr key={index}>
                        <td  style={{width:'10%',textAlign: 'center'}}>{tin.Orden}</td>
                        <td  style={{width:'25%',textAlign: 'center'}}>{tin.Concepto}</td>
                        <td style={{textAlign: 'center',width:'10%'}}>{tin.Elemento}</td>
                        <td style={{textAlign: 'center'}}><input type="number" value={tin.Cantidad} onChange={(e) => onChangeCantidad(index, Number(e.target.value))} style={{textAlign: 'center'}}/></td>
                        <td style={{textAlign: 'center'}}><input type="number" value={tin.PrecioUni} step="0.0001" onChange={(e) => onChangeCOSTOUND(index, e.target.value)} style={{textAlign:'center'}}/></td>
                    </tr>
                )

                )}
                </tbody>
                
        </table>
    )

}

