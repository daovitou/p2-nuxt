import { isAuthorized,removeUser } from "@/utils/authentication";

export default defineNuxtRouteMiddleware(async (to, from) => {
   const isAuth = await isAuthorized();
    if (!isAuth) {
      removeUser()
      return await navigateTo("/signin");
    }else{
      return;
    }
});
