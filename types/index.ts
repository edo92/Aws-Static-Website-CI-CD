export interface IGithub {
   repo: string;
   owner: string;
   branch: string;
   secretToken: string;
}

export interface IEnv {
   [key: string]: {
      value: string;
   };
}
