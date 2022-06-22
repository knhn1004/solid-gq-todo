import { Component, createSignal } from 'solid-js';
import { createResource, For } from 'solid-js';
import { createClient } from '@urql/core';

const client = createClient({
  url: 'http://localhost:4000/graphql',
});

interface Todo {
  id: string;
  text: string;
  done: boolean;
}

const [todos] = createResource<Todo[]>(() =>
  client
    .query(
      `
      query {
        getTodos {
          id
          done
          text
        }
      }
`
    )
    .toPromise()
    .then(({ data }) => data.getTodos)
);

const App: Component = () => {
  const [text, setText] = createSignal('');
  const onAdd = () => {
    setText('');
  };

  return (
    <div>
      <For each={todos()}>
        {({ id, done, text }) => (
          <div>
            <input type="checkbox" checked={done} />
            <span>{text}</span>
          </div>
        )}
      </For>
      <div>
        <input
          type="text"
          value={text()}
          oninput={e => setText(e.currentTarget.value)}
        />
        <button onClick={onAdd}>Add</button>
      </div>
    </div>
  );
};

export default App;
