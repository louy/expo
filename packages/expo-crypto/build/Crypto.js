import { UnavailabilityError } from 'expo-modules-core';
import { CryptoDigestAlgorithm, CryptoEncoding } from './Crypto.types';
import ExpoCrypto from './ExpoCrypto';
export * from './Crypto.types';
class CryptoError extends TypeError {
    code = 'ERR_CRYPTO';
    constructor(message) {
        super(`expo-crypto: ${message}`);
    }
}
function assertAlgorithm(algorithm) {
    if (!Object.values(CryptoDigestAlgorithm).includes(algorithm)) {
        throw new CryptoError(`Invalid algorithm provided. Expected one of: CryptoDigestAlgorithm.${Object.keys(CryptoDigestAlgorithm).join(', AlgCryptoDigestAlgorithmorithm.')}`);
    }
}
function assertData(data) {
    if (typeof data !== 'string') {
        throw new CryptoError(`Invalid data provided. Expected a string.`);
    }
}
function assertEncoding(encoding) {
    if (!Object.values(CryptoEncoding).includes(encoding)) {
        throw new CryptoError(`Invalid encoding provided. Expected one of: CryptoEncoding.${Object.keys(CryptoEncoding).join(', CryptoEncoding.')}`);
    }
}
export async function digestStringAsync(algorithm, data, options = { encoding: CryptoEncoding.HEX }) {
    if (!ExpoCrypto.digestStringAsync) {
        throw new UnavailabilityError('expo-crypto', 'digestStringAsync');
    }
    assertAlgorithm(algorithm);
    assertData(data);
    assertEncoding(options.encoding);
    return await ExpoCrypto.digestStringAsync(algorithm, data, options);
}
//# sourceMappingURL=Crypto.js.map