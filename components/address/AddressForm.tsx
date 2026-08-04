"use client";

import useSWR from "swr";
import { ChangeEvent } from "react";

import { countries } from "@/data/countries";
import { useTranslationClient as useTranslation } from "@/app/lib/i18n/client";

/* ======================================================
   TYPES
====================================================== */

export interface AddressFormData {
  full_name: string;

  phone: string;

  country: string;
  region: string;
  district: string;
  ward: string;
  address_line: string;
  postal_code: string;
}

interface Province {
  code: number;
  name: string;
}

interface Props {
  form: AddressFormData;

  setForm: (
    value: AddressFormData
  ) => void;

  onSubmit: () => void;

  saving: boolean;
}

/* ======================================================
   FETCHER
====================================================== */

const fetcher = async (
  url: string
): Promise<Province[]> => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(
      "FETCH_PROVINCES_FAILED"
    );
  }

  return res.json();
};

/* ======================================================
   COMPONENT
====================================================== */

export default function AddressForm({
  form,
  setForm,
  onSubmit,
  saving,
}: Props) {
  const { t } = useTranslation();

  /* ======================================================
     COUNTRY
  ====================================================== */

  const selectedCountry =
    countries.find(
      (c) => c.code === form.country
    );

  const isVN =
    form.country === "VN";

  /*
    Chỉ hiện ZIP với quốc gia ngoài VN.
    Sau này có thể đổi thành:

    selectedCountry?.requiresPostalCode
  */

  const showPostalCode =
    !isVN;

  /* ======================================================
     PROVINCES
  ====================================================== */

  const { data: provinces } =
    useSWR<Province[]>(
      isVN
        ? "/api/location/provinces"
        : null,
      fetcher,
      {
        revalidateOnFocus: false,
      }
    );

  /* ======================================================
     UPDATE FORM
  ====================================================== */

  const updateField = <
    K extends keyof AddressFormData
  >(
    key: K,
    value: AddressFormData[K]
  ) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  /* ======================================================
     INPUT HANDLER
  ====================================================== */

  const handleChange =
    (
      key: keyof AddressFormData
    ) =>
    (
      e:
        | ChangeEvent<HTMLInputElement>
        | ChangeEvent<HTMLTextAreaElement>
    ) => {
      updateField(
        key,
        e.target.value
      );
    };

  /* ======================================================
     COUNTRY CHANGE
  ====================================================== */

  const handleCountryChange = (
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    updateField(
      "country",
      e.target.value
    );

    setForm({
  ...form,
  country: e.target.value,
  region: "",
  postal_code: "",
  district: "",
  ward: "",
});
  };

  /* ======================================================
     REGION CHANGE
  ====================================================== */

  const handleRegionChange = (
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    updateField(
      "region",
      e.target.value
    );
  };

  /* ======================================================
     VALIDATION
  ====================================================== */

  const isValid =
    form.full_name.trim() !== "" &&
    form.phone.trim() !== "" &&
    form.country.trim() !== "" &&
    form.address_line.trim() !== "" &&
    form.region.trim() !== "" &&
    (
      !showPostalCode ||
      form.postal_code.trim() !== ""
    );

  /* ======================================================
     INPUT STYLE
  ====================================================== */

  const inputClassName = `
    w-full
    rounded-lg
    border
    border-[var(--border-color)]
    bg-[var(--card-bg)]
    px-3
    py-2.5
    text-sm
    text-[var(--foreground)]
    outline-none
    transition

    placeholder:text-[var(--text-muted)]

    focus:border-[var(--color-primary)]
    focus:ring-2
    focus:ring-[var(--color-primary)]/10
  `;

  /* ======================================================
     JSX (PHẦN 2)
  ====================================================== */

         return (
    <div className="flex h-full flex-col bg-[var(--background)]">

      {/* =========================================
          HEADER
      ========================================== */}

      <div
        className="
          sticky
          top-0
          z-20
          flex
          items-center
          justify-between
          border-b
          border-[var(--border-color)]
          bg-[var(--card-bg)]
          px-3
          py-2.5
        "
      >
        <h2 className="text-base font-semibold">
          {t.shipping_address ??
            "Shipping Address"}
        </h2>

        <button
          type="button"
          onClick={onSubmit}
          disabled={!isValid || saving}
          className="
            rounded-lg
            bg-[var(--color-primary)]
            px-3
            py-2
            text-sm
            font-semibold
            text-white

            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {saving
            ? t.saving ?? "Saving..."
            : t.save ?? "Save"}
        </button>
      </div>

      {/* =========================================
          FORM
      ========================================== */}

      <div
        className="
          flex-1
          space-y-4
          overflow-y-auto
          p-4
          pb-28
        "
      >

        {/* =====================================
            NAME + PHONE
        ====================================== */}

        <div className="grid grid-cols-2 gap-3">

          <div>
            <label className="mb-2 block text-sm font-medium">
              {t.full_name ??
                "Full name"}
            </label>

            <input
              value={form.full_name}
              onChange={handleChange(
                "full_name"
              )}
              placeholder={
                t.full_name ??
                "Full name"
              }
              className={inputClassName}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              {t.phone_number ??
                "Phone"}
            </label>

           <div className="flex">

  <div
    className="
      flex
      items-center
      rounded-l-lg
      border
      border-r-0
      border-[var(--border-color)]
      bg-[var(--card-bg)]
      px-3
      text-sm
      text-[var(--text-muted)]
    "
  >
    {selectedCountry?.dial ?? "+"}
  </div>

  <input
    value={form.phone}
    onChange={handleChange("phone")}
    placeholder={t.phone_number ?? "Phone"}
    className={`${inputClassName} rounded-l-none`}
  />

</div>
          </div>

        </div>

        {/* =====================================
            COUNTRY
        ====================================== */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            {t.select_country ??
              "Country"}
          </label>

          <select
            value={form.country}
            onChange={
              handleCountryChange
            }
            className={inputClassName}
          >
            <option value="">
              {t.select_country ??
                "Select Country"}
            </option>

            {countries.map(
              (country) => (
                <option
                  key={country.code}
                  value={country.code}
                >
                 {country.flag} {country.name} ({country.dial})
                </option>
              )
            )}
          </select>

        </div>

        {/* =====================================
            REGION
        ====================================== */}

        <div>

          <label className="mb-2 block text-sm font-medium">

            {isVN
              ? t.province_city ??
                "Province / City"
              : t.region ??
                "State / Region"}

          </label>

          {isVN ? (
            <select
              value={form.region}
              onChange={
                handleRegionChange
              }
              className={inputClassName}
            >
              <option value="">
                {t.province_city ??
                  "Province / City"}
              </option>

              {provinces?.map(
                (province) => (
                  <option
                    key={province.code}
                    value={province.name}
                  >
                    {province.name}
                  </option>
                )
              )}
            </select>
          ) : (
            <input
              value={form.region}
              onChange={handleChange(
                "region"
              )}
              placeholder={
                t.region ??
                "State / Region"
              }
              className={inputClassName}
            />
          )}

        </div>

        {/* =====================================
            ADDRESS
        ====================================== */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            {t.address ?? "Address"}
          </label>

          <textarea
            rows={3}
            value={form.address_line}
            onChange={handleChange(
              "address_line"
            )}
            placeholder={ t.address ?? "Address"}
            className={inputClassName}
          />

        </div>

        {/* =====================================
            POSTAL CODE
        ====================================== */}

        {showPostalCode && (

          <div>

            <label className="mb-2 block text-sm font-medium">
              {t.postal_code ??
                "Postal Code"}
            </label>

            <input
              value={form.postal_code}
              onChange={handleChange(
                "postal_code"
              )}
              placeholder="ZIP / Postal Code"
              className={inputClassName}
            />

          </div>

        )}

      </div>

    </div>
  );
}
