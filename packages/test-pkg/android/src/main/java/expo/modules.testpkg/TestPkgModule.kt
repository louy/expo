package expo.modules.testpkg

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class TestPkgModule : Module() {
  override fun definition() = ModuleDefinition {
    name("TestPkg")

    function("helloAsync") { options: Map<String, String> ->
      println("Hello 👋")
    }

    viewManager {
      view { context -> 
        TestPkgView(context) 
      }

      prop("name") { view: TestPkgView, prop: Int ->
        println(prop)
      }
    }
  }
}
