import gql from "graphql-tag";

export default class TaskRepository {
  constructor(apollo) {
    this.apollo = apollo;
  }

  fetchTasks() {
    return this.apollo.query({
      query: gql`
        query {
          tasks {
            id
            task
            status
          }
        }
      `,
      fetchPolicy: "network-only",
    });
  }

  createTask(task) {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($task: String!) {
          createTask(task: $task) {
            id
            task
            status
          }
        }
      `,
      variables: {
        task,
      },
    });
  }

  updateTasks(ids) {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($ids: [ID!]!) {
          updateTasks(ids: $ids) {
            id
            task
            status
          }
        }
      `,
      variables: {
        ids,
      },
    });
  }

  deleteTasks(ids) {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($ids: [ID!]!) {
          deleteTasks(ids: $ids) {
            id
          }
        }
      `,
      variables: {
        ids,
      },
    });
  }
}
