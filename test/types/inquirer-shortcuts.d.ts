export interface IOptions {
    default: String;
    message: String;
}

export function input(message: String, options?: IOptions): Promise<String>;
export function password(message: String, options?: IOptions): Promise<String>;
