"use client";

import axios, { Method } from "axios";
import { toast } from "sonner";

interface UseRequestProps {
  url: string;
  method: Method;
  onSuccess?: (data: any) => void;
}

export function useRequest({ url, method, onSuccess }: UseRequestProps) {
  const doRequest = async (body?: any) => {
    try {
      const response = await axios({
        method,
        url,
        data: body,
      });

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errors = err.response?.data?.error ?? [];

        errors.forEach((error: { message: string; field?: string }) => {
          toast.error(error.message);
        });
      }
    }
  };

  return { doRequest };
}
