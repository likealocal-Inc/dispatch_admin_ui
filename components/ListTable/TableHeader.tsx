import { TableHead, TableRow } from "@mui/material";
import { StyledTableCell } from "@libs/client/ui/table";

interface TableHeaderProps {
  headers: string[];
  headerWidth: number[];
}

export default function TableHeader({
  headers,
  headerWidth,
}: TableHeaderProps) {
  return (
    <TableHead>
      <TableRow>
        {headers.map((d, k) => (
          // <StyledTableCell key={k} className={`w-[${headerWidth[k]}rem]`}>
          <StyledTableCell key={k} width={`${headerWidth[k]}%`}>
            <div className='text-xs text-center'>{d}</div>
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
