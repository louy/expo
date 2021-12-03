import { NativeModulesProxy } from 'expo-modules-core';

import TestPkgView, { TestPkgViewProps } from './TestPkgView'

const { TestPkg } = NativeModulesProxy;

export async function helloAsync(options: Record<string, string>) {
  return await TestPkg.helloAsync(options);
}

export {
  TestPkgView,
  TestPkgViewProps
};
