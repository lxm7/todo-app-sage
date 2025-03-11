import Typography from "carbon-react/lib/components/typography";
import Box from "carbon-react/lib/components/box";

import TodoList from "./components/TodoList";

function App() {
  return (
    <Box margin="var(--spacing400)">
      <header>
        <Typography variant="h1">Todo app</Typography>
      </header>
      <main>
        <TodoList />
      </main>
    </Box>
  );
}

export default App;
