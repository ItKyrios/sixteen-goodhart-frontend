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
    route('rent/edit/:documentId', './routes/rent/edit.tsx'),
    route('groceries', './routes/groceries/index.tsx'),
    route('groceries/new', './routes/groceries/add.tsx'),
    route('groceries/edit/:documentId', './routes/groceries/edit.tsx'),
    route('warranty', './routes/warranty/index.tsx'),
    route('warranty/edit/:id', './routes/warranty/edit.tsx'),
    route('expiry', './routes/expiry/index.tsx'),
    route('expiry/edit/:id', './routes/expiry/edit.tsx'),
    route('subscription', './routes/subscription/index.tsx'),
    route('subscription/edit/:id', './routes/subscription/edit.tsx'),
    route('todo', './routes/todo/index.tsx'),
    route('todo/edit/:id', './routes/todo/edit.tsx'),
  ]),
] satisfies RouteConfig;
