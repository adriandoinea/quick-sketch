import Canvas from "./components/Canvas";
import { Provider } from "react-redux";
import { store } from "@/app/store";

function App() {
  return (
    <>
      <Provider store={store}>
        <Canvas />
      </Provider>
    </>
  );
}

export default App;
