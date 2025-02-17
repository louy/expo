package abi41_0_0.org.unimodules.core;

import android.content.Context;

import abi41_0_0.org.unimodules.core.interfaces.InternalModule;
import abi41_0_0.org.unimodules.core.interfaces.Package;
import expo.modules.core.interfaces.SingletonModule;

import java.util.Collections;
import java.util.List;

// This class should not be used. Implement abi41_0_0.org.unimodules.core.interfaces.Package instead of extending this class
// Remove once no one extends it.
public class BasePackage implements Package {
  @Override
  public List<InternalModule> createInternalModules(Context context) {
    return Collections.emptyList();
  }

  @Override
  public List<ExportedModule> createExportedModules(Context context) {
    return Collections.emptyList();
  }

  @Override
  public List<ViewManager> createViewManagers(Context context) {
    return Collections.emptyList();
  }

  @Override
  public List<SingletonModule> createSingletonModules(Context context) {
    return Collections.emptyList();
  }
}
