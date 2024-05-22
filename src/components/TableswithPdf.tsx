import { OtDataReal } from "../components/tableRealOt";


 
  
export interface otDataRealTable {
    otreal : OtDataReal[]
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
                        {Object.keys(table.MAT).map((key) => (
                            <th key={key}>{key}</th>
                        ))}
                    </tr>

                </thead>
                <tbody>
                    {otreal.map((row,rowIndex) => (
                        <tr key={rowIndex}>
                           <td>{row.Orden}</td>
                           <td>{row.MAT}</td>
                           <td>{row.CANTPRE}</td>
                           <td>{row.COSTOUNDPRE}</td>
                           <td>{row.SubTotalPRE}</td>
                           <td>{row.CANTREAL}</td>
                           <td>{row.COSTOUNDREAL}</td>
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