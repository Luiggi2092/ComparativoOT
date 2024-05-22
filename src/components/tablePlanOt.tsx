import './tablestyle.css';

export interface PlanOt {
    CODPLAN: number,
    PLANCHA: string,
    Elemento: string,
    Tipo: string,
    TipoDet: string,
    CANTIDAD: number,
    COSTOUND : number

}


export interface otDataPlan {
    planot : PlanOt[];
    onChangeCantidad:(id: number,newCantidad: number) => void;
    onChangeCOSTOUND:(id: number, newCOSTOUND: string) => void;
}


export const PlanOtTable : React.FC<otDataPlan> = ({planot,onChangeCantidad,onChangeCOSTOUND}) => {


    return (
        <table className='table'>
            <thead style={{backgroundColor:'blue',color:"white"}}>
                <tr>
                    <th  style={{border: '1px solid black',textAlign: 'center',width:'10%'}}>
                      CODPLAN
                    </th>
                    <th  style={{border: '1px solid black',textAlign: 'center',width:'25%'}}>
                      PLANCHA
                    </th>
                    <th style={{border: '1px solid black',textAlign: 'center'}}>
                       ELEMENTO 
                    </th>
                    <th  style={{border: '1px solid black',textAlign: 'center'}}>
                      CANTIDAD 
                    </th>
                    <th  style={{border: '1px solid black',textAlign: 'center'}}>
                       COSTOUND
                    </th>
                </tr>
            </thead>
            <tbody  className='cuerpo'>
                {planot.map((pla,index) => (
                    <tr key={index}>
                         <td style={{width:'10%',textAlign: 'center'}}>{pla.CODPLAN}</td>
                          <td  style={{width:'25%',textAlign: 'center'}}>{pla.PLANCHA}</td>
                          <td style={{textAlign: 'center'}}>{pla.Elemento}</td>
                          <td style={{textAlign: 'center'}}><input type="number" value={pla.CANTIDAD} onChange={(e) => onChangeCantidad(index, Number(e.target.value))} style={{textAlign: 'center'}} /></td>
                          <td style={{textAlign: 'center'}}><input type="number" value={pla.COSTOUND} step="0.0001" onChange={(e) => onChangeCOSTOUND(index, e.target.value)} style={{textAlign: 'center'}}/></td>
                    </tr>
                       
                ))

                }
            </tbody>
        </table>
    )

}