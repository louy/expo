import { NativeModulesProxy } from 'expo-modules-core';
import TestPkgView from './TestPkgView';
const { TestPkg } = NativeModulesProxy;
export async function helloAsync(options) {
    return await TestPkg.helloAsync(options);
}
export { TestPkgView };
//# sourceMappingURL=TestPkg.js.map