import { router } from "../trpc";
import { cardTemplatesRouter } from "./card-templates";
import { quotationsRouter } from "./quotations";

export const appRouter = router({
  cardTemplates: cardTemplatesRouter,
  quotations: quotationsRouter,
});

export type AppRouter = typeof appRouter;