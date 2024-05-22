import './tablestyle.css';



export interface BarOt {
    CODBAR: number,
    BARNIZ: string,
    Elemento:string,
    Tipo: string,
    TipoDet: string,
    CANTIDAD: number,
    COSTOUND : number

}


export interface OtDataBarOt {
    barot: BarOt[];
    onChangeCantidad:(id: number,newCantidad: number) => void;
    onChangeCOSTOUND:(id: number, newCOSTOUND: string) => void;
}


export const BarOtTable : React.FC<OtDataBarOt> = ({barot,onChangeCantidad,onChangeCOSTOUND}) => {


    return (
        <table className='table'>
            <thead style={{backgroundColor:'blue',color:"white"}}>
                <tr>
                <th style={{border: '1px solid black',textAlign: 'center'}}>
                    CODBAR
                </th>
                <th style={{border: '1px solid black',textAlign: 'center'}}>
                    BARNIZ
                </th>
                <th style={{border: '1px solid black',textAlign: 'center'}}>
                    ELEMENTO
                </th>
                <th style={{border: '1px solid black',textAlign: 'center'}}>
                    CANTIDAD
                </th>
                <th style={{border: '1px solid black',textAlign: 'center'}}>
                    COSTOUND
                </th>
                </tr>
            </thead>
            <tbody style={{border: '1px solid black'}} >
                {barot.map((bar,index) => (
                    <tr key={index}>
                        <td style={{width:'10%',textAlign: 'center'}}>{bar.CODBAR}</td>
                        <td style={{width:'25%',textAlign: 'center'}}>{bar.BARNIZ}</td>
                        <td style={{textAlign:'center'}}>{bar.Elemento}</td>
                        <td style={{textAlign: 'center'}}><input type="number" value={bar.CANTIDAD} onChange={(e) => onChangeCantidad(index,Number(e.target.value))} style={{textAlign: 'center'}}/></td>
                        <td style={{textAlign: 'center'}}><input type='number' value={bar.COSTOUND} step="0.0001" onChange={(e)=> onChangeCOSTOUND(index,e.target.value)} style={{textAlign: 'center'}}/></td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}


