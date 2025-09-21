import { Alert } from "react-native";

export type AlertIcon = "success" | "error" | "warning" | "info";

interface AlertOptions {
  message: string;
  icon?: AlertIcon;
  title?: string;
  confirmButtonText?: string;
  confirmButtonColor?: string;
  allowOutsideClick?: boolean;
  allowEscapeKey?: boolean;
  timer?: number;
  timerProgressBar?: boolean;
}

interface ConfirmOptions {
  message: string;
  icon?: AlertIcon;
  title?: string;
  confirmButtonText?: string;
  confirmButtonColor?: string;
  denyButtonText?: string;
  allowOutsideClick?: boolean;
  allowEscapeKey?: boolean;
}

/**
 * 성공 알림
 */
export const showSuccess = async (
  message: string,
  options?: Partial<AlertOptions>
): Promise<void> => {
  const finalOptions = {
    title: options?.title || "성공",
    message: message,
    confirmButtonText: options?.confirmButtonText || "확인",
  };

  return new Promise((resolve) => {
    Alert.alert(
      finalOptions.title,
      finalOptions.message,
      [
        {
          text: finalOptions.confirmButtonText,
          onPress: () => resolve(),
          style: "default",
        },
      ],
      {
        cancelable: false,
      }
    );
  });
};

/**
 * 에러 알림
 */
export const showError = async (
  message: string,
  options?: Partial<AlertOptions>
): Promise<void> => {
  const finalOptions = {
    title: options?.title || "오류",
    message: message,
    confirmButtonText: options?.confirmButtonText || "확인",
  };

  return new Promise((resolve) => {
    Alert.alert(
      finalOptions.title,
      finalOptions.message,
      [
        {
          text: finalOptions.confirmButtonText,
          onPress: () => resolve(),
          style: "destructive",
        },
      ],
      {
        cancelable: false,
      }
    );
  });
};

/**
 * 정보 알림
 */
export const showInfo = async (
  message: string,
  options?: Partial<AlertOptions>
): Promise<void> => {
  const finalOptions = {
    title: options?.title || "정보",
    message: message,
    confirmButtonText: options?.confirmButtonText || "확인",
  };

  return new Promise((resolve) => {
    Alert.alert(
      finalOptions.title,
      finalOptions.message,
      [
        {
          text: finalOptions.confirmButtonText,
          onPress: () => resolve(),
          style: "default",
        },
      ],
      {
        cancelable: false,
      }
    );
  });
};

/**
 * 경고 알림
 */
export const showWarning = async (
  message: string,
  options?: Partial<AlertOptions>
): Promise<void> => {
  const finalOptions = {
    title: options?.title || "경고",
    message: message,
    confirmButtonText: options?.confirmButtonText || "확인",
  };

  return new Promise((resolve) => {
    Alert.alert(
      finalOptions.title,
      finalOptions.message,
      [
        {
          text: finalOptions.confirmButtonText,
          onPress: () => resolve(),
          style: "default",
        },
      ],
      {
        cancelable: false,
      }
    );
  });
};

/**
 * 확인 다이얼로그
 */
export const showConfirm = async (
  message: string,
  options?: Partial<ConfirmOptions>
): Promise<boolean> => {
  const finalOptions = {
    title: options?.title || "확인",
    message: message,
    confirmButtonText: options?.confirmButtonText || "확인",
    denyButtonText: options?.denyButtonText || "취소",
  };

  return new Promise((resolve) => {
    Alert.alert(
      finalOptions.title,
      finalOptions.message,
      [
        {
          text: finalOptions.denyButtonText,
          onPress: () => resolve(false),
          style: "cancel",
        },
        {
          text: finalOptions.confirmButtonText,
          onPress: () => resolve(true),
          style: "default",
        },
      ],
      {
        cancelable: false,
      }
    );
  });
};

/**
 * 커스텀 알림
 */
export const showCustomAlert = async (options: AlertOptions): Promise<void> => {
  const finalOptions = {
    title: options.title || "알림",
    message: options.message,
    confirmButtonText: options.confirmButtonText || "확인",
  };

  return new Promise((resolve) => {
    Alert.alert(
      finalOptions.title,
      finalOptions.message,
      [
        {
          text: finalOptions.confirmButtonText,
          onPress: () => resolve(),
          style: "default",
        },
      ],
      {
        cancelable: options.allowOutsideClick ?? true,
      }
    );
  });
};
