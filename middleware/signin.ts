import { isAuthorized, removeUser } from "@/utils/authentication";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const isAuth = await isAuthorized();
  if (isAuth) {
    return await navigateTo("/dashboard");
  } else {
    removeUser();
    return;
  }
});
