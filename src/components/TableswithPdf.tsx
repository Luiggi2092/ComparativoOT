import {OtReal} from '../types/OtReal'


 
  
export interface otDataRealTable {
    otreal : OtReal[]
}

export const TablesWithPDF: React.FC<otDataRealTable> = ({otreal}) => {

    return (
        <div>
          {otreal.map((table,index) => (
            <div key={index}>
               <h3>Tabla Materiales</h3> 
            <table>
                <thead>
                    <tr>
                        {Object.keys(table.Concepto).map((key) => (
                            <th key={key}>{key}</th>
                        ))}
                    </tr>

                </thead>
                <tbody>
                    {otreal.map((row,rowIndex) => (
                        <tr key={rowIndex}>
                           <td>{row.Orden}</td>
                           <td>{row.Concepto}</td>
                           <td>{row.Cantidad}</td>
                           <td>{row.PrecioUni}</td>
                           <td>{row.SubtotalPre}</td>
                           <td>{row.ImaCan}</td>
                           <td>{row.ImaPun}</td>
                           <td>{row.SubtotalReal}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
          ))}
        </div>
    )

} 