"use client";

type AddressSectionProps = {
  shipping: {
    id: string;
    full_name: string;
    phone: string;
    country: string;
    province: string;
    district: string;
    ward: string;
    address_line: string;
  } | null;

  loading: boolean;

  onAdd: () => void;

  onEdit: () => void;

  onChange: () => void;

  t: Record<string, string>;
};

export default function AddressSection({
  shipping,
  loading,
  onAdd,
  onEdit,
  onChange,
  t,
}: AddressSectionProps) {
  if (loading) {
    return (
      <div className="rounded-xl border p-4">
        {t.loading ?? "Loading..."}
      </div>
    );
  }

  if (!shipping) {
    return (
      <div className="rounded-xl border p-4">
        <div className="mb-3 font-semibold">
          {t.shipping_address ?? "Shipping Address"}
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          {t.add_address ?? "Add address"}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border p-4">
      <div className="mb-2 font-semibold">
        {t.shipping_address ?? "Shipping Address"}
      </div>

      <div className="text-sm">
        <div>{shipping.full_name}</div>

        <div>{shipping.phone}</div>

        <div>
          {shipping.address_line}
        </div>

        <div>
          {shipping.ward},{" "}
          {shipping.district},{" "}
          {shipping.province}
        </div>

        <div>{shipping.country}</div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onEdit}
        >
          {t.edit ?? "Edit"}
        </button>

        <button
          type="button"
          onClick={onChange}
        >
          {t.change ?? "Change"}
        </button>
      </div>
    </div>
  );
}
