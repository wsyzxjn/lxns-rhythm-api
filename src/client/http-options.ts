import type { HTTPError, Options } from "ky";
import { LxnsApiError } from "../lxns-api-error.js";
import type { ApiResponse } from "./lxns-api-client-types.js";

function parseLxnsJson(text: string) {
  const payload = JSON.parse(text) as ApiResponse;

  if (payload.success === false) {
    throw new LxnsApiError(payload);
  }

  if (payload.success === true) {
    return payload.data;
  }

  return payload;
}

async function wrapKyError(error: HTTPError): Promise<HTTPError> {
  const status = error.response.status;

  try {
    const payload = (await error.response
      .clone()
      .json()) as Partial<ApiResponse>;
    if (typeof payload.success === "boolean") {
      throw new LxnsApiError(
        {
          success: payload.success,
          code: payload.code ?? status,
          message: payload.message ?? error.message,
          data: payload.data,
        },
        status,
      );
    }
  } catch {}

  throw new LxnsApiError(
    {
      success: false,
      code: status,
      message: error.message,
    },
    status,
  );
}

export const LXNS_HTTP_OPTIONS: Options = {
  parseJson: parseLxnsJson,
  throwHttpErrors: true,
  hooks: {
    beforeError: [wrapKyError],
  },
};
