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

const [todos, { refetch }] = createResource<Todo[]>(() =>
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

  const onAdd = async () => {
    await client
      .mutation(
        `
    mutation($text: String!) {
      addTodo(text: $text) {
        id
      }
    }
    `,
        {
          text: text(),
        }
      )
      .toPromise();
    refetch();

    setText('');
  };

  const toggle = async (id: string) => {
    await client
      .mutation(
        `
      mutation($id: ID!) {
        toggleTodo(id: $id) {
          id
        }
      }
      `,
        {
          id,
        }
      )
      .toPromise();
    refetch();
  };

  return (
    <div>
      <For each={todos()}>
        {({ id, done, text }) => (
          <div>
            <input type="checkbox" checked={done} onclick={() => toggle(id)} />
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
