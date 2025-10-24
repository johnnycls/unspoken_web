declare module "./registerSW" {
  import { RegisterSWOptions } from "virtual:pwa-register";
  const updateSW: (reloadPage?: boolean) => Promise<void>;
  export { updateSW };
}
