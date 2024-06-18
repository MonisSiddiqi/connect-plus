import * as bcrypt from 'bcrypt';

export const createPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
}
