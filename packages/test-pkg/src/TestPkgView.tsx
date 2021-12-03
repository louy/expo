import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

export type TestPkgViewProps = {
  name: number;
};

type TestPkgViewState = {}

const NativeView: React.ComponentType<TestPkgViewProps> =
  requireNativeViewManager('TestPkg');

export default class TestPkgView extends React.Component<TestPkgViewProps, TestPkgViewState> {
  render() {
    return <NativeView name={this.props.name} />;
  }
}
