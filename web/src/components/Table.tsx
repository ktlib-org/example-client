import { observer } from "mobx-react-lite"
import Entity from "core/models/Entity"

type Column<T> = {
  name: string
  header: string | JSX.Element
  row: (v: T) => JSX.Element | JSX.Element[] | string | number
}

interface Props<T> {
  title?: string | JSX.Element
  columns: Column<T>[]
  data: T[]
}

const Table = <T extends Entity>({ title, columns, data }: Props<T>) => {
  return (
    <>
      {title && <div className="text-xl mt-2">{title}</div>}
      <div className="flex flex-col mt-2">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {columns.map((c) => (
                      <th
                        key={c.name}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
                      >
                        {c.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((d, i) => (
                    <tr key={d.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      {columns.map((c) => (
                        <td key={`${d.id}-${c.name}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {c.row(d)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default observer(Table)
