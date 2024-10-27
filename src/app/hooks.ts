import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { TAppDispatch, TRootState } from "./store";

export const useAppDispatch = useDispatch<TAppDispatch>;
export const useAppSelector: TypedUseSelectorHook<TRootState> = useSelector;

import { useEffect, useState } from "react";
import { appServices } from "@/service/appService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { roundNumberDecimal } from "./common/number";

export function useDebounce<T>(value: T, delay?: number): any {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

const ONE_MB = 1024 * 1024;

export function useUploadFile<T = string, ReturnedUploadData = T>(
  uploadFunction: (
    form: FormData
  ) => Promise<[any, Error | null]> = appServices.uploadFile,
  // @ts-ignore
  transformResponse: (data: ReturnedUploadData) => T = (data) => data,
  fileSizeLimit = 2 * ONE_MB // 2MB
) {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const [successData, setSuccessData] = useState<ReturnType<
    typeof transformResponse
  > | null>(null);
  const [error, setError] = useState<Error | null>(null);

  async function uploadFile(file: File) {
    if (file.size > fileSizeLimit) {
      toast.error(
        t("profile.file size exceed", {
          size: roundNumberDecimal(fileSizeLimit / ONE_MB, 2),
        })
      );
      return;
    }

    setIsUploading(true);

    const form = new FormData();

    form.append("upload", file);

    const [data, error] = await uploadFunction(form);

    setIsUploading(false);
    if (error) {
      setError(error);
      return;
    }

    setSuccessData(transformResponse(data));

    return transformResponse(data);
  }

  return { isUploading, successData, error, uploadFile };
}
