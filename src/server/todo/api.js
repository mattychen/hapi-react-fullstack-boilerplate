// @flow

import Boom from 'boom';
import Joi from 'joi';
import logger from '../logger';
import { route, models } from '../core';

const { Todo } = models;
const nestedRoute = route.nested('/api/todos');

nestedRoute.get('/', async (request, reply) => {
  const todos = await Todo.findAll();
  logger.info('todo list %d', todos.length);
  reply({
    url: '/todo',
    todos,
  });
}, {
  tags: ['api'],
});

nestedRoute.post('/', async (request, reply) => {
  const todo = await Todo.create({
    title: request.payload.title,
    userId: 1,
  });
  logger.info('add todo: %d %s', todo.id, todo.title);
  reply({ result: true, id: todo.id });
}, {
  tags: ['api'],
  validate: {
    payload: {
      title: Joi.string(),
    },
  },
});

nestedRoute.put('/{id}', async (request, reply) => {
  const todo = await Todo.findOne({
    where: {
      id: request.params.id,
    },
  });
  if (todo === null) {
    return reply(Boom.notFound(`id ${request.params.id}`));
  }
  todo.title = request.payload.title;
  logger.info('put todo: %d %s', todo.id, todo.title);
  await todo.save();
  return reply({ result: true, id: todo.id });
}, {
  tags: ['api'],
});

nestedRoute.del('/{id}', async (request, reply) => {
  const todo = await Todo.findOne({ id: request.params.id });
  logger.info('delete todo: %d %s', todo.id, todo.title);
  await todo.destroy();
  reply({ result: true, id: todo.id });
}, {
  tags: ['api'],
  validate: {
    params: {
      id: Joi.number(),
    },
  },
});
