import { existsSync, unlinkSync } from 'fs';

export const removeFile = (filePath: string): void => {
    if (existsSync(filePath)) {
        unlinkSync(filePath);
    }
}
