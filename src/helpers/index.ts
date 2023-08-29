import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const genSalt = 10;

export const createSalt = async (): Promise<string> => {
    const salt = await bcrypt.genSalt(genSalt);
    return salt;
};

export const hashPassword = async (
    salt: string,
    password: string
): Promise<string> => {
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

export const comparePassword = async (
    password: string,
    hash: string
): Promise<boolean> => {
    const result = await bcrypt.compare(password, hash);
    return result;
};

export const createToken = (id: object): string => {
    const token = jwt.sign({ id }, process.env.SECRET);
    return token;
};

export const verifyToken = (token: string): string | jwt.JwtPayload => {
    const verify = jwt.verify(token, process.env.SECRET);
    return verify;
};

export const messageError = (
    key: string,
    message: string,
    type: string,
    value: string,
    name: string = "ValidatorError"
): object => {
    return {
        [key]: {
            name,
            message,
            properties: { message, type, path: key, value },
            kind: type,
            path: key,
            value,
        },
    };
};
