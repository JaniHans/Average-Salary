

export type requestState = {
    status : 'default' | 'loading' | 'success' | 'error'
    message : string
}

export const DEFAULT : requestState = {status : 'default', message : ""} as const;
export const LOADING : requestState = {status : 'loading', message : "Loading..."} as const;
export const SUCCESS = (message : string) : requestState => ({status : "success" , message : message }) as const;
export const ERROR = (message : string) : requestState => ({status : 'error', message : message}) as const;