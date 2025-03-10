import Typography from "carbon-react/lib/components/typography";
import TodoList from "./components/TodoList";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header>
        <Typography variant="h1">Todo app</Typography>
        <TodoList />
      </header>
    </div>
  );
}

export default App;
