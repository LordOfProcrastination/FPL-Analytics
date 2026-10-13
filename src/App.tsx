import RoutingMain from "./routing/RoutingMain";
import MainNavigation from "./components/shared/MainNavigation";
import { EntryProvider } from "./contexts/EntryContext";

function App() {
  return (
    <EntryProvider>
      <MainNavigation />
      <RoutingMain />
    </EntryProvider>
  );
}

export default App;
