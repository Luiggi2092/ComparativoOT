import './tablestyle.css';

export interface OtData  {
    Orden: number,
    Concepto: string,
    Elemento: string,
    Tipo: string,
    TipoDet: string,
    Cantidad: number,
    PrecioUni : number
 }
 
 export interface otDataTable {
     matot : OtData[];
     onChangeCantidad:(id: number,newCantidad: number) => void;
     onChangeCOSTOUND:(id: number, newCOSTOUND: string) => void;
 }



export const MatOtTable : React.FC<otDataTable> = ({matot,onChangeCantidad,onChangeCOSTOUND}) => {


    return (
        <table className='table'>
            <thead style={{backgroundColor:'blue',color:"white"}}>
                <tr>
                <th style={{border: '1px solid black',textAlign:'center',width:'10%'}} >
                    CODMAT
                </th>
                <th style={{border: '1px solid black',textAlign:'center',width:'25%'}}>
                    Material
                </th>
                <th style={{border: '1px solid black',textAlign:'center'}}>
                    ELEMENTO
                </th>
                <th style={{border: '1px solid black',textAlign:'center'}}>
                    Cantidad
                </th>
                <th style={{border: '1px solid black',textAlign:'center'}}>
                    Costo Und
                </th>
                </tr>
            </thead>
            <tbody style={{border: '1px solid black'}}>
                {matot.map((mat,index) => (
                    <tr key={index} >
                        <td style={{width:'10%',textAlign:'center'}}>{mat.Orden}</td>
                        <td style={{width:'25%',textAlign:'center'}}>{mat.Concepto}</td>
                        <td style={{textAlign:'center'}}>{mat.Elemento}</td>
                        <td style={{textAlign:'center'}}><input type="number" value={mat.Cantidad} onChange={(e) => onChangeCantidad(index, Number(e.target.value))} style={{textAlign:'center'}}/></td>
                        <td style={{textAlign: 'center'}}>< input type="number" value={mat.PrecioUni} step="0.0001" onChange={(e) => onChangeCOSTOUND(index, e.target.value)} style={{textAlign : 'center'}}/></td>

                    </tr>
                ))}
            </tbody>
        </table> 
    )



}