/** ===========================================
 * 📅 Xử lý ngày tháng an toàn cho toàn hệ thống
 * -------------------------------------------
 * - Chuẩn hóa yyyy-MM-dd → ISO
 * - Kiểm tra ngày hợp lệ
 * - Tự sửa ngày lỗi
 * ===========================================
 */

/** Kiểm tra 1 chuỗi ngày có hợp lệ không */
export function isValidDate(dateString: string): boolean {
  const d = new Date(dateString);
  return !isNaN(d.getTime());
}

/** Chuyển yyyy-MM-dd → ISO format */
export function toISO(dateString: string | null): string | null {
  if (!dateString) return null;

  // Nếu là định dạng yyyy-MM-dd → convert
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return new Date(dateString + "T00:00:00Z").toISOString();
  }

  // Nếu đã là ISO → giữ nguyên
  if (isValidDate(dateString)) {
    return new Date(dateString).toISOString();
  }

  // Nếu sai định dạng → bỏ qua
  return null;
}

/** Chuẩn hóa các trường ngày của sản phẩm */
type SaleDateProduct = {
  saleStart: string | null;
  saleEnd: string | null;
  [key: string]: unknown;
};

export function normalizeSaleDates(product: SaleDateProduct) {
  return {
    ...product,
    saleStart: toISO(product.saleStart),
    saleEnd: toISO(product.saleEnd),
  };
}
