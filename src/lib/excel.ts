import { saveAs } from "file-saver";
import { utils, write } from "xlsx";

// Function to convert an array of JSON objects to a SheetJS Workbook
function jsonToSheet<T>(data: T[]) {
  // 1. Create a worksheet from the JSON array
  const worksheet = utils.json_to_sheet(data);

  // 2. Create a new workbook
  const workbook = utils.book_new();

  // 3. Append the worksheet to the workbook
  utils.book_append_sheet(workbook, worksheet, "Sheet1");

  return workbook;
}

// Function to trigger the file download
export const exportToExcel = <T>(jsonData: T[], fileName: string) => {
  if (!jsonData || jsonData.length === 0) {
    return;
  }

  // Use the conversion function
  const workbook = jsonToSheet(jsonData);

  // Convert the workbook to a binary array buffer (required for FileSaver)
  const excelBuffer = write(workbook, { bookType: "xlsx", type: "array" });

  // Create a Blob object from the buffer
  const data = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  // Use FileSaver to save the file
  saveAs(data, `${fileName}.xlsx`);
};
