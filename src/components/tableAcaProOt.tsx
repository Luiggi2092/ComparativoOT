import './tablestyle.css';

export interface AcaProPOt {
    CODACA: number,
    ACABADOMANUAL: string,
    Elemento:string,
    Tipo: string,
    TipoDet: string,
    CANTIDAD: number,
    COSTOUND : number
}


export interface OtDataAcaProOt {
    acaproot : AcaProPOt[];
    onChangeCantidad:(id: number,newCantidad: number) => void;
    onChangeCOSTOUND:(id: number, newCOSTOUND: string) => void;
}


export const AcaPropOtTable : React.FC<OtDataAcaProOt> = ({acaproot,onChangeCantidad,onChangeCOSTOUND}) => {


  return (
    <table className="table">
      <thead style={{backgroundColor:'blue',color:"white"}}>
        <tr>
           <th style={{border: '1px solid black',textAlign: 'center',width:'10%'}}>
                        CODACA
                    </th>
                    <th style={{border: '1px solid black',textAlign: 'center',width:'25%'}}>
                        Acabado Manual
                    </th>
                    <th style={{border: '1px solid black',textAlign: 'center',width:'25%'}}>
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
      <tbody style={{border: '1px solid black'}}>
                {acaproot.map((aca,index)=> (
                    <tr key={index}>
                        <td style={{width:'10%',textAlign: 'center'}}>{aca.CODACA}</td>
                        <td style={{width:'25%',textAlign: 'center'}}>{aca.ACABADOMANUAL}</td>
                        <td style={{textAlign: 'center'}}>{aca.Elemento}</td>
                        <td style={{textAlign: 'center'}}><input type="number" value={aca.CANTIDAD} onChange={(e) => onChangeCantidad(index, Number(e.target.value))} style={{textAlign: 'center'}}/></td>
                        <td style={{textAlign: 'center'}}><input type='number' value={aca.COSTOUND} step="0.0001" onChange={(e) => onChangeCOSTOUND(index, e.target.value)} style={{textAlign: 'center'}}/></td>
                    </tr>
                ))}
            </tbody>
    </table>
  )


}