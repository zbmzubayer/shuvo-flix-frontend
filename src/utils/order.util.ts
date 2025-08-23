export const getOrderCode = (id: number) =>
  `SF-${id.toString().padStart(6, "0")}`;
