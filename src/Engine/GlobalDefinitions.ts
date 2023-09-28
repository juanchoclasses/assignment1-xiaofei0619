
export const ErrorMessages = {
  partial: "#ERR",
  divideByZero: "#DIV/0!",
  invalidCell: "#REF!",
  invalidFormula: "#ERRFormula",
  invalidNumber: "#ERRNumber",
  invalidOperator: "#ERROperator",
  missingParentheses: "#ERRParentheses",
  emptyFormula: "#EMPTY!", // this is not an error message but used to indicate that the cell is empty

}

export const ButtonNames = {
  edit_toggle: "edit-toggle",
  edit: "edit",
  done: "=",
  allClear: "AC",
  clear: "C",
}


export interface CellTransport {
  formula: string[];
  value: number;
  error: string;
}

export interface CellTransportMap {
  [key: string]: CellTransport;
}
export interface DocumentTransport {
  columns: number;
  rows: number;
  cells: Map<string, CellTransport>;
  formula: string;
  result: string;
  currentCell: string;
  isEditing: boolean;
}

