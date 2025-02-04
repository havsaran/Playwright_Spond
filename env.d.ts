// env.d.ts 
// this file is for reading env file in typescript..
declare global {
    namespace NodeJS {
      interface ProcessEnv {
        EMAIL: string;
        PASSWORD: string;        
        PADEL_USERID : string;
        BERGENVEST_USERID : string;
      }
    }
  }
  
  export {};