import { type CreateNextContextOptions } from "@trpc/server/adapters/next";

import { prisma } from "~/server/db";

type CreateContextOptions = Record<string, never>;

const createInnerTRPCContext = (_opts: CreateContextOptions) => {
  return {
    prisma,
  };
};

export const createTRPCContext = (_opts: CreateNextContextOptions) => {
  const { res, req } = _opts
  return {
    res,
    req,
    prisma,
  }
};

import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { verifyAuth } from "~/lib/auth";

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

const isAdmin = t.middleware(async ({ctx, next}) => {
  const {req} = ctx
  const token = req.cookies['user-token']

  if(!token) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Missing user token' })
  } 

  const verifiedToken = await verifyAuth(token)

  if(!verifiedToken) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid user token' })
  }

  // user is authenticated as admin
  return next()
})

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const adminProcedure = t.procedure.use(isAdmin)
