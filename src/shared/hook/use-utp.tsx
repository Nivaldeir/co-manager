"use client";

import { useCallback } from "react";
import { useModal } from "@/src/shared/context/modal-context";
import { OtpModal } from "@/src/shared/components/modals/otp-modal";

interface OpenOtpModalOptions {
  title?: string;
  description?: string;
  validator: (code: string) => Promise<boolean>;
  onSuccess?: (code: string) => void | Promise<void>;
  onCancel?: () => void;
  modalId?: string;
}

export function useOtpModal() {
  const { openModal, closeModal } = useModal();

  const openOtpModal = useCallback(
    (options: OpenOtpModalOptions) => {
      const modalId = options.modalId || "otp-modal";

      openModal(
        modalId,
        OtpModal,
        {
          title: options.title,
          description: options.description,
          validator: options.validator,
          onSuccess: options.onSuccess,
          onCancel: options.onCancel,
        },
        {
          size: "md",
          closeOnOverlayClick: false,
          closeOnEscape: true,
        }
      );
    },
    [openModal]
  );

  const closeOtpModal = useCallback(
    (modalId?: string) => {
      closeModal(modalId || "otp-modal");
    },
    [closeModal]
  );

  return {
    openOtpModal,
    closeOtpModal,
  };
}

