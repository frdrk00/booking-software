import { SignJWT } from "jose";
import { z } from "zod";
import { nanoid } from "nanoid";
import cookie from 'cookie'

import { adminProcedure, createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getJwtSecretKey } from "~/lib/auth";
import { TRPCError } from "@trpc/server";

export const adminRouter = createTRPCRouter({
  login: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation( async ({ ctx, input }) => {
      const { res } = ctx
      const  {email, password} = input

      if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        // user is authenticated as admin

        const token = await new SignJWT({}).setProtectedHeader({alg: 'HS256'}).setJti(nanoid()).setIssuedAt().setExpirationTime('1h').sign(new TextEncoder().encode(getJwtSecretKey()))

        res.setHeader('Set-Cookie', cookie.serialize('user-token', token, {
          httpOnly: true,
          path: '/',
          secure: process.env.NODE_ENV === 'production'
        }))

        return { success: true}
      }

      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid email or password'
      })
    }),

    sensitive: adminProcedure.mutation(() => {
      return 'sensitive'
    })
});
