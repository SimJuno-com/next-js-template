import { oc } from "@orpc/contract";

export const base = oc.errors({
  UNAUTHORIZED: {
    message: "Please sign in to continue.",
  },
  BAD_REQUEST: {
    message: "The request is invalid.",
  },
  NOT_FOUND: {
    message: "The resource was not found",
  },
});
