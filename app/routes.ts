import {
  type RouteConfig,
  index,
  route,
  layout,
} from '@react-router/dev/routes';

export default [
  layout('./routes/layouts/home.tsx', [index('routes/home/index.tsx')]),
  layout('./routes/layouts/main.tsx', [
    route('rent', './routes/rent/index.tsx'),
    route('rent/edit', './routes/rent/edit.tsx'),
    route('groceries', './routes/groceries/index.tsx'),
    route('warranty', './routes/warranty/index.tsx'),
    route('subscription', './routes/subscription/index.tsx'),
    route('todo', './routes/todo/index.tsx'),
  ]),
] satisfies RouteConfig;
