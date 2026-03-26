import Logger from "@/utils/logger";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: z.ZodError | unknown;
};

export function createApiHandler<T>(
  handler: (req: NextRequest) => Promise<NextResponse<ApiResponse<T>>>,
) {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error) {
      console.log(error);
      Logger.error(error as string);

      Logger.debug(error as string);

      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            success: false,
            message: "Validation failed",
            errors: error.errors,
          },
          { status: 400 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: "Internal server error",
          errors: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      );
    }
  };
}
