import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';
const NativeView = requireNativeViewManager('TestPkg');
export default class TestPkgView extends React.Component {
    render() {
        return React.createElement(NativeView, { name: this.props.name });
    }
}
//# sourceMappingURL=TestPkgView.js.map