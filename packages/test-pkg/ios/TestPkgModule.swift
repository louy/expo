import ExpoModulesCore

public class TestPkgModule: Module {
  public func definition() -> ModuleDefinition {
    name("TestPkg")

    function("helloAsync") { (options: [String: String]) in
      print("Hello 👋")
    }

    viewManager {
      view {
        TestPkgView()
      }

      prop("name") { (view: TestPkgView, prop: Int) in
        print(prop)
      }
    }
  }
}
